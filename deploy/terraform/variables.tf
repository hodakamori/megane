variable "aws_region" {
  description = "AWS region for the S3 bucket and Route53 zone"
  type        = string
  default     = "ap-northeast-1"
}

variable "app_name" {
  description = "Application name used for resource naming"
  type        = string
  default     = "megane"
}

variable "domain_name" {
  description = "FQDN for the application"
  type        = string
  default     = "megane.tech-office-mori.com"
}
