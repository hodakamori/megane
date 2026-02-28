variable "aws_region" {
  description = "AWS region"
  type        = string
  default     = "ap-northeast-1"
}

variable "app_name" {
  description = "Application name used for resource naming"
  type        = string
  default     = "megane"
}

variable "github_repo" {
  description = "GitHub repository in 'owner/repo' format"
  type        = string
  default     = "hodakamori/megane"
}

variable "lightsail_bundle" {
  description = "Lightsail instance bundle (nano_3_0=$3.50/mo, micro_3_0=$5/mo, small_3_0=$10/mo)"
  type        = string
  default     = "small_3_0"
}

variable "ssh_public_key" {
  description = "SSH public key for Lightsail instance access"
  type        = string
}

variable "domain" {
  description = "Domain name for TLS certificate (leave empty to skip DNS setup)"
  type        = string
  default     = ""
}

variable "certbot_email" {
  description = "Email for Let's Encrypt certificate registration"
  type        = string
}
