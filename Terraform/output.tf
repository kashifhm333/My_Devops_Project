output "resource_group_name" {
  value       = azurerm_resource_group.rg.name
  description = "The name of the deployed resource group."
}

output "vm_public_ip" {
  value       = azurerm_public_ip.public_ip[*].ip_address
  description = "The dynamic public IP assignment pointing to the application server hosting cluster."
}

output "storage_endpoint" {
  value       = azurerm_storage_account.storage.primary_file_endpoint
  description = "The primary cloud network endpoint pointing to your mapped file storage shared system layer."
}