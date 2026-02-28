output "instance_name" {
  description = "Lightsail instance name"
  value       = aws_lightsail_instance.app.name
}

output "static_ip" {
  description = "Static IP address of the Lightsail instance"
  value       = aws_lightsail_static_ip.app.ip_address
}

output "ssh_private_key" {
  description = "SSH private key for instance access (auto-generated)"
  value       = tls_private_key.deploy.private_key_pem
  sensitive   = true
}

output "service_url" {
  description = "Public URL of the megane demo"
  value       = var.domain != "" ? "https://${var.domain}" : "http://${aws_lightsail_static_ip.app.ip_address}"
}
