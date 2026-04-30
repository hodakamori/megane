output "bucket_name" {
  description = "S3 bucket hosting the static demo"
  value       = aws_s3_bucket.site.id
}

output "cloudfront_distribution_id" {
  description = "CloudFront distribution ID (for cache invalidation)"
  value       = aws_cloudfront_distribution.site.id
}

output "cloudfront_domain_name" {
  description = "CloudFront-assigned domain name"
  value       = aws_cloudfront_distribution.site.domain_name
}

output "service_url" {
  description = "Public URL of the application"
  value       = "https://${var.domain_name}"
}

output "ci_deploy_role_arn" {
  description = "ARN of the IAM role assumed by GitHub Actions via OIDC"
  value       = aws_iam_role.ci_deploy.arn
}

output "github_oidc_provider_arn" {
  description = "ARN of the GitHub Actions OIDC provider"
  value       = aws_iam_openid_connect_provider.github_actions.arn
}
