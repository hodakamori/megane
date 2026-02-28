output "instance_name" {
  description = "Lightsail instance name"
  value       = aws_lightsail_instance.app.name
}

output "static_ip" {
  description = "Static IP address of the Lightsail instance"
  value       = aws_lightsail_static_ip.app.ip_address
}

output "ssh_command" {
  description = "SSH command to connect to the instance"
  value       = "ssh ubuntu@${aws_lightsail_static_ip.app.ip_address}"
}

output "service_url" {
  description = "Public URL of the megane demo"
  value       = var.domain != "" ? "https://${var.domain}" : "http://${aws_lightsail_static_ip.app.ip_address}"
}

output "deploy_command" {
  description = "Command to redeploy after code changes"
  value       = "./deploy/lightsail/deploy-lightsail.sh ubuntu@${aws_lightsail_static_ip.app.ip_address}"
}

output "setup_log" {
  description = "Check cloud-init setup progress"
  value       = "ssh ubuntu@${aws_lightsail_static_ip.app.ip_address} 'tail -f /var/log/megane-setup.log'"
}
