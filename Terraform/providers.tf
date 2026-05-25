terraform {
  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "~> 4.8.0"
    }
  }

    required_version = ">=1.9.0"
}
provider "azurerm" {
  subscription_id = var.azure_subscription_id
  features {}

}


