data "azurerm_client_config" "current" {}

resource "azurerm_virtual_network" "main" {
  name                = "vnet-main"
  address_space       = ["10.0.0.0/16"]
  location            = data.azurerm_resource_group.existing.location
  resource_group_name = data.azurerm_resource_group.existing.name
}

resource "azurerm_subnet" "appgw" {
  name                 = "snet-appgw"
  resource_group_name  = data.azurerm_resource_group.existing.name
  virtual_network_name = azurerm_virtual_network.main.name
  address_prefixes     = ["10.0.1.0/24"]

  lifecycle {
    prevent_destroy = false # Allow deletion
  }
}

resource "azurerm_public_ip" "appgw" {
  name                = "pip-appgw"
  location            = data.azurerm_resource_group.existing.location
  resource_group_name = data.azurerm_resource_group.existing.name
  allocation_method   = "Static"
  sku                 = "Standard"

  lifecycle {
    prevent_destroy = false # Allow deletion
  }
}

resource "azurerm_web_application_firewall_policy" "appgw_waf" {
  name                = "wafpolicy-${var.domain_name}"
  resource_group_name = data.azurerm_resource_group.existing.name
  location            = data.azurerm_resource_group.existing.location

  policy_settings {
    enabled                     = true
    mode                        = var.waf_mode
    request_body_check          = true
    max_request_body_size_in_kb = 128
    file_upload_limit_in_mb     = 100
  }

  managed_rules {
    managed_rule_set {
      type    = "OWASP"
      version = "3.2"
    }
  }
}


resource "azurerm_application_gateway" "main" {
  name                = "prod-appgw-${var.domain_name}"
  resource_group_name = data.azurerm_resource_group.existing.name
  location            = data.azurerm_resource_group.existing.location

  sku {
    name     = "WAF_v2"
    tier     = "WAF_v2"
    capacity = 1
  }

  waf_configuration {
    enabled          = true
    firewall_mode    = "Prevention"
    rule_set_type    = "OWASP"
    rule_set_version = "3.2"
  }


  gateway_ip_configuration {
    name      = "appgw-ip-config"
    subnet_id = azurerm_subnet.appgw.id
  }

  frontend_port {
    name = "http"
    port = 80
  }

  frontend_port {
    name = "https"
    port = 443
  }

  frontend_ip_configuration {
    name                 = "appgw-frontend-ip"
    public_ip_address_id = azurerm_public_ip.appgw.id
  }

  ssl_certificate {
    name                = "ssl-cert"
    key_vault_secret_id = data.azurerm_key_vault_certificate.ssl.secret_id
  }
  # HTTP Listener (Redirect to HTTPS)
  http_listener {
    name                           = "http-listener"
    frontend_ip_configuration_name = "appgw-frontend-ip"
    frontend_port_name             = "http"
    protocol                       = "Http"
  }

  # HTTPS Listener
  http_listener {
    name                           = "https-listener"
    frontend_ip_configuration_name = "appgw-frontend-ip"
    frontend_port_name             = "https"
    protocol                       = "Https"
    ssl_certificate_name           = "ssl-cert"
  }

  # Backend Pools
  backend_address_pool {
    name  = "frontend-pool"
    fqdns = [azurerm_linux_web_app.frontend.default_hostname]
  }

  backend_address_pool {
    name  = "backend-pool"
    fqdns = [azurerm_linux_web_app.backend.default_hostname]
  }

  # Health Probes
  probe {
    name                = "frontend-probe"
    host                = azurerm_linux_web_app.frontend.default_hostname
    path                = "/"
    protocol            = "Https"
    interval            = 30
    timeout             = 30
    unhealthy_threshold = 3
  }

  probe {
    name                = "backend-probe"
    host                = azurerm_linux_web_app.backend.default_hostname
    path                = "/"
    protocol            = "Https"
    interval            = 30
    timeout             = 30
    unhealthy_threshold = 3
  }

  # HTTP Settings
  backend_http_settings {
    name                                = "frontend-settings"
    cookie_based_affinity               = "Disabled"
    port                                = 443
    protocol                            = "Https"
    request_timeout                     = 60
    probe_name                          = "frontend-probe"
    pick_host_name_from_backend_address = true
  }

  backend_http_settings {
    name                                = "backend-settings"
    cookie_based_affinity               = "Disabled"
    port                                = 443
    protocol                            = "Https"
    request_timeout                     = 60
    probe_name                          = "backend-probe"
    pick_host_name_from_backend_address = true
  }

  # Routing Rules
  request_routing_rule {
    name               = "https-rule"
    rule_type          = "PathBasedRouting"
    http_listener_name = "https-listener"
    priority           = 100

    url_path_map_name = "url-path-map"
  }

  request_routing_rule {
    name               = "http-rule"
    rule_type          = "PathBasedRouting"
    http_listener_name = "http-listener"
    priority           = 1
    url_path_map_name  = "url-path-map"
  }


  url_path_map {
    name                               = "url-path-map"
    default_backend_address_pool_name  = "frontend-pool"
    default_backend_http_settings_name = "frontend-settings"

    path_rule {
      name                       = "api-rule"
      paths                      = ["/api/*"]
      backend_address_pool_name  = "backend-pool"
      backend_http_settings_name = "backend-settings"
    }
  }

  identity {
    type = "UserAssigned"
    identity_ids = [
      azurerm_user_assigned_identity.appgw.id
    ]
  }

  depends_on = [
    azurerm_linux_web_app.frontend,
    azurerm_linux_web_app.backend,
    azurerm_public_ip.appgw,
    azurerm_subnet.appgw
  ]

  lifecycle {
    prevent_destroy = false # Allow deletion
  }
}

resource "azurerm_user_assigned_identity" "appgw" {
  name                = "id-appgw"
  resource_group_name = data.azurerm_resource_group.existing.name
  location            = data.azurerm_resource_group.existing.location
}


data "azurerm_key_vault" "main" {
  name                = "certptKeyVault"
  resource_group_name = "myResourceGroup123"
}

data "azurerm_key_vault_certificate" "ssl" {
  name         = "mySslCert"
  key_vault_id = data.azurerm_key_vault.main.id
}


# Key Vault Access Policy for App Gateway
resource "azurerm_key_vault_access_policy" "appgw" {
  key_vault_id = data.azurerm_key_vault.main.id
  tenant_id    = data.azurerm_client_config.current.tenant_id
  object_id    = azurerm_user_assigned_identity.appgw.principal_id

  secret_permissions = [
    "Get"
  ]
  certificate_permissions = ["Get"]
}

# resource "azurerm_key_vault" "main" {
#   name                        = "kv-azure"
#   location                    = data.azurerm_resource_group.existing.location
#   resource_group_name         = data.azurerm_resource_group.existing.name
#   enabled_for_disk_encryption = true
#   tenant_id                   = data.azurerm_client_config.current.tenant_id
#   sku_name                    = "standard"

#   access_policy {
#     tenant_id = data.azurerm_client_config.current.tenant_id
#     object_id = data.azurerm_client_config.current.object_id

#     certificate_permissions = [
#       "Create", "Delete", "DeleteIssuers", "Get", "GetIssuers", "Import", "List", "ListIssuers",
#       "ManageContacts", "ManageIssuers", "SetIssuers", "Update"
#     ]
#   }

#   network_acls {
#     default_action = "Allow"
#     bypass         = "AzureServices"
#   }

#   lifecycle {
#     prevent_destroy = false # Allow deletion
#   }
# }

# resource "azurerm_key_vault_certificate" "ssl" {
#   name         = "ssl-certificate1"
#   key_vault_id = azurerm_key_vault.main.id

#   certificate {
#     contents = filebase64(var.pfx_path)
#     password = var.certificate_password
#   }
# }
