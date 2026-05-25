variable "azure_subscription_id" {
  type        = string
  description = "The Azure Subscription ID used for authentication"
  sensitive   = true # This hides the value from printing on your screen during plans
}

variable "resource_group_name" {
  type        = string
  description = "The name of the Azure Resource Group."
  default     = "devops-project-rg"
}

variable "location" {
  type        = string
  description = "The Azure region to deploy resources."
  default     = "centralindia"
}

variable "project_tags" {
  type        = map(string)
  description = "Common tags to apply to all resources."
  default = {
    Environment = "Dev"
    Project     = "Automation-Pipeline"
    ManagedBy   = "Terraform"
  }
}

variable "subnet_prefixes" {
  type        = list(string)
  description = "Address prefixes for the subnets."
  default     = ["10.0.1.0/24", "10.0.2.0/24"]
}

variable "vm_count" {
  type        = number
  description = "Number of virtual machines to deploy."
  default     = 1
}

variable "vm_spec" {
  type = object({
    size         = string
    username     = string
    os_disk_type = string
  })
  description = "Hardware specifications for the application server."
  default = {
    size         = "Standard_D2s_v3"
    username     = "azureuser"
    os_disk_type = "Standard_LRS"
  }
}

variable "storage_account_name" {
  type        = string
  description = "Globally unique name for the Azure Storage Account."
  default     = "devopsprojectstorage"
}

variable "ssh_public_key_path" {
  type        = string
  description = "Absolute path to the SSH public key file to provision on the VM(s)."
  default     = "/home/youruser/.ssh/id_rsa.pub"
}

variable "ssh_public_key" {
  type        = string
  description = "The SSH public key contents to provision on the VM(s). Provide the public key string (e.g. contents of id_rsa.pub)."
  default     = ""
}