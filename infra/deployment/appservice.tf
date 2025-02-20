data "azurerm_resource_group" "existing" {
  name = var.resource_group_name
}

data "azurerm_container_registry" "acr" {
  name                = var.acr_name
  resource_group_name = var.resource_group_name
}



resource "azurerm_postgresql_flexible_server" "postgres" {
  name                   = var.postgres_name
  resource_group_name    = data.azurerm_resource_group.existing.name
  location               = data.azurerm_resource_group.existing.location
  version                = "13"
  administrator_login    = var.admin_username
  administrator_password = var.admin_password
  sku_name               = "B_Standard_B1ms"
  storage_mb             = 32768

  # Optional: High Availability (uncomment if needed)
  # high_availability {
  #   mode                      = "ZoneRedundant"
  #   standby_availability_zone = "2"
  # }

  lifecycle {
    ignore_changes = [
      zone,
      high_availability[0].standby_availability_zone,
    ]
  }
}

resource "azurerm_postgresql_flexible_server_firewall_rule" "app_service_region" {
  name             = "allow_app_service_region"
  server_id        = azurerm_postgresql_flexible_server.postgres.id
  start_ip_address = "0.0.0.0"
  end_ip_address   = "0.0.0.0"
}


resource "azurerm_service_plan" "app_service_plan" {
  name                = var.app_service_plan_name
  location            = data.azurerm_resource_group.existing.location
  resource_group_name = data.azurerm_resource_group.existing.name
  os_type             = "Linux"
  sku_name            = "B1"
}

resource "azurerm_linux_web_app" "backend" {
  name                = var.backend_app_name
  location            = data.azurerm_resource_group.existing.location
  resource_group_name = data.azurerm_resource_group.existing.name
  service_plan_id     = azurerm_service_plan.app_service_plan.id

  site_config {
    application_stack {
      docker_image_name   = "${var.backend_image}:${var.backend_image_tag}"
      docker_registry_url = "https://${data.azurerm_container_registry.acr.login_server}"
    }

    app_command_line = "python main.py"
  }

  app_settings = {
    "DATABASE_URL"  = "postgresql://${var.admin_username}:${var.admin_password}@${azurerm_postgresql_flexible_server.postgres.fqdn}:5432/${var.postgres_db_name}?sslmode=require"
    "WEBSITES_PORT" = "8000"

  }

  identity {
    type = "SystemAssigned"
  }
}

resource "azurerm_role_assignment" "acr_pull_backend" {
  scope                = data.azurerm_container_registry.acr.id
  role_definition_name = "AcrPull"
  principal_id         = azurerm_linux_web_app.backend.identity[0].principal_id
}

resource "azurerm_linux_web_app" "frontend" {
  name                = var.frontend_app_name
  location            = data.azurerm_resource_group.existing.location
  resource_group_name = data.azurerm_resource_group.existing.name
  service_plan_id     = azurerm_service_plan.app_service_plan.id

  site_config {
    application_stack {
      docker_image_name   = "${var.frontend_image}:${var.frontend_image_tag}"
      docker_registry_url = "https://${data.azurerm_container_registry.acr.login_server}"
    }

    app_command_line = "npm run start"
  }

  app_settings = {
    "VITE_API_BASE_URL" = "https://${var.domain_name}"
    "WEBSITES_PORT"     = "80"

  }

  identity {
    type = "SystemAssigned"
  }

  depends_on = [azurerm_linux_web_app.backend]
}


resource "azurerm_role_assignment" "acr_pull_frontend" {
  scope                = data.azurerm_container_registry.acr.id
  role_definition_name = "AcrPull"
  principal_id         = azurerm_linux_web_app.frontend.identity[0].principal_id
}
