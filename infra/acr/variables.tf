variable "resource_group_name" {
  description = "Name of the Resource Group."
  type        = string
  default     = "myResourceGroup12"
}

variable "location" {
  description = "Azure location."
  type        = string
  default     = "Central India"
}

variable "acr_name" {
  description = "Name for the Azure Container Registry (must be globally unique & lowercase)."
  type        = string
  default     = "myacrregistry"
}

variable "sku" {
  description = "The SKU of the Azure Container Registry. Options are Basic, Standard, or Premium."
  type        = string
  default     = "Basic"
}

variable "admin_enabled" {
  description = "Whether to enable the admin user for the registry."
  type        = bool
  default     = true
}

variable "tags" {
  description = "A map of tags to assign to the resources."
  type        = map(string)
  default     = {}
}