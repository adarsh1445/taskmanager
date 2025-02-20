variable "resource_group_name" {
  description = "Name of the Resource Group."
  type        = string
  default     = "myResourceGroup123"
}

variable "location" {
  description = "Azure location."
  type        = string
  default     = "Central Canada"
}

variable "acr_name" {
  description = "Name for the Azure Container Registry (must be globally unique & lowercase)."
  type        = string
  default     = "myacrregistry"
}

variable "postgres_name" {
  description = "Name for the PostgreSQL Flexible Server."
  type        = string
  default     = "mypostgresdb"
}

variable "admin_username" {
  description = "PostgreSQL admin username."
  type        = string
  default     = "myadmin"
}

variable "admin_password" {
  description = "PostgreSQL admin password."
  type        = string
  default     = "MyStrongPassword123"
}

variable "postgres_db_name" {
  description = "Name of the PostgreSQL database."
  type        = string
  default     = "mydatabase"
}

variable "app_service_plan_name" {
  description = "Name for the App Service Plan."
  type        = string
  default     = "myAppServicePlan"
}

variable "backend_app_name" {
  description = "Name for the backend App Service."
  type        = string
  default     = "mybackendapp"
}

variable "frontend_app_name" {
  description = "Name for the frontend App Service."
  type        = string
  default     = "myfrontendapp"
}

variable "backend_image" {
  description = "Docker image name for the backend."
  type        = string
  default     = "backend"
}

variable "backend_image_tag" {
  description = "Docker image tag for the backend."
  type        = string
  default     = "v1"
}

variable "frontend_image" {
  description = "Docker image name for the frontend."
  type        = string
  default     = "frontend"
}

variable "frontend_image_tag" {
  description = "Docker image tag for the frontend."
  type        = string
  default     = "v1"
}

variable "acr_login_server" {
  description = "The login server of your Azure Container Registry (e.g., myacr.azurecr.io)."
  type        = string
}


variable "domain_name" {
   type    = string
  default = "processitytaskmanagerdemo.info"
}

variable "certificate_password" {
  sensitive = true
}

variable "pfx_path" {
   type    = string
  default = "certificate.pfx"
}

variable "waf_mode" {
  default = "Prevention" # Can be "Detection" or "Prevention"
}
