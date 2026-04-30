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
