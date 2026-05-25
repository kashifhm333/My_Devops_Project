resource "azurerm_resource_group" "rg" {
  name     = var.resource_group_name
  location = var.location
  tags     = var.project_tags
}

resource "azurerm_virtual_network" "vnet" {
  name                = "devops-vnet"
  address_space       = ["10.0.0.0/16"]
  location            = azurerm_resource_group.rg.location
  resource_group_name = azurerm_resource_group.rg.name
  tags                 = var.project_tags
}

resource "azurerm_subnet" "subnets" {
  count                = length(var.subnet_prefixes)
  name                 = "subnet-${count.index}"
  resource_group_name  = azurerm_resource_group.rg.name
  virtual_network_name = azurerm_virtual_network.vnet.name
  address_prefixes     = [var.subnet_prefixes[count.index]]
}

resource "azurerm_network_security_group" "nsg" {
  for_each            = toset(["web-sec", "db-sec"])
  name                = "${each.key}-nsg"
  location            = azurerm_resource_group.rg.location
  resource_group_name = azurerm_resource_group.rg.name
  tags                 = var.project_tags

  security_rule {
    name                       = "allow-ssh"
    priority                   = 100
    direction                  = "Inbound"
    access                     = "Allow"
    protocol                   = "Tcp"
    source_port_range          = "*"
    destination_port_range     = "22"
    source_address_prefix      = "*"
    destination_address_prefix = "*"
  }
}

resource "azurerm_public_ip" "public_ip" {
  count               = var.vm_count
  name                = "vm-public-ip-${count.index}"
  location            = azurerm_resource_group.rg.location
  resource_group_name = azurerm_resource_group.rg.name
  allocation_method   = "Static"
  tags                = var.project_tags
}

resource "azurerm_network_interface" "nic" {
  count               = var.vm_count
  name                = "vm-nic-${count.index}"
  location            = azurerm_resource_group.rg.location
  resource_group_name = azurerm_resource_group.rg.name
  tags                = var.project_tags

  ip_configuration {
    name                          = "internal"
    subnet_id                     = azurerm_subnet.subnets[0].id
    private_ip_address_allocation = "Dynamic"
    public_ip_address_id          = azurerm_public_ip.public_ip[count.index].id
  }
}

resource "azurerm_storage_account" "storage" {
  name                     = var.storage_account_name
  resource_group_name      = azurerm_resource_group.rg.name
  location                 = azurerm_resource_group.rg.location
  account_tier             = "Standard"
  account_replication_type = "LRS"
  tags                     = var.project_tags
}

resource "azurerm_storage_share" "fileshare" {
  name                 = "app-data-share"
  storage_account_name = azurerm_storage_account.storage.name
  quota                = 50
}

resource "azurerm_linux_virtual_machine" "vm" {
  count               = var.vm_count
  name                = "app-server-${count.index}"
  resource_group_name = azurerm_resource_group.rg.name
  location            = azurerm_resource_group.rg.location
  size                = var.vm_spec.size
  admin_username      = var.vm_spec.username
  network_interface_ids = [
    azurerm_network_interface.nic[count.index].id,
  ]

  admin_ssh_key {
    username   = var.vm_spec.username
    public_key = var.ssh_public_key != "" ? var.ssh_public_key : (fileexists(var.ssh_public_key_path) ? file(var.ssh_public_key_path) : "")
  }

  os_disk {
    caching              = "ReadWrite"
    storage_account_type = var.vm_spec.os_disk_type
  }

  source_image_reference {
    publisher = "Canonical"
    offer     = "0001-com-ubuntu-server-jammy"
    sku       = "22_04-lts"
    version   = "latest"
  }

  custom_data = base64encode(<<-EOF
              #!/bin/bash
              sudo apt-get update -y
              sudo apt-get install -y cifs-utils apt-transport-https ca-certificates curl software-properties-common
              
              # Install Docker
              curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg
              echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu \$(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
              sudo apt-get update -y
              sudo apt-get install -y docker-ce docker-ce-cli containerd.io
              sudo systemctl enable docker
              sudo systemctl start docker
              sudo usermod -aG docker ${var.vm_spec.username}

              # Create the folder and mount the Azure Storage File Share
              sudo mkdir -p /mnt/azure-storage
              sudo echo "username=${azurerm_storage_account.storage.name}" > /etc/smbcredentials
              sudo echo "password=${azurerm_storage_account.storage.primary_access_key}" >> /etc/smbcredentials
              sudo chmod 600 /etc/smbcredentials
              sudo echo "//${azurerm_storage_account.storage.name}.file.core.windows.net/${azurerm_storage_share.fileshare.name} /mnt/azure-storage cifs nofail,credentials=/etc/smbcredentials,dir_mode=0777,file_mode=0777,serverino" >> /etc/fstab
              sudo mount -a

              # Build your React container application locally on the VM and run it on port 80
              # This commands targets the Dockerfile we created in Step 1
              cd /home/${var.vm_spec.username}
              sudo docker build -t mobile-spec-app .
              sudo docker run -d -p 80:80 -v /mnt/azure-storage:/usr/share/nginx/html/assets/phone-images --name mobile-app-container mobile-spec-app:latest
              EOF
  )

  depends_on = [
    azurerm_network_security_group.nsg,
    azurerm_network_interface.nic,
    azurerm_storage_share.fileshare
  ]

  lifecycle {
    create_before_destroy = true
  }
}