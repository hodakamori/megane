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

variable "create_oidc_provider" {
  description = "Set to false if GitHub OIDC provider already exists in your AWS account"
  type        = bool
  default     = true
}

variable "container_port" {
  description = "Port the container listens on"
  type        = number
  default     = 8080
}

variable "cpu" {
  description = "App Runner CPU (1024 = 1 vCPU)"
  type        = number
  default     = 1024
}

variable "memory" {
  description = "App Runner memory in MB"
  type        = number
  default     = 2048
}
