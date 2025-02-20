terraform {
  backend "azurerm" {
    resource_group_name  = "myResourceGroup123"
    storage_account_name = "remotetf01"
    container_name       = "tfstate"
    key                  = "terraform.tfstate"
  }
}
