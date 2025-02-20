output "application_gateway_public_ip" {
  value = azurerm_public_ip.appgw.ip_address
}

output "frontend_url" {
  value = "https://${var.domain_name}"
}


output "backend_api_url" {
  value = "https://${var.domain_name}/api"
}
