output "ecr_repository_url" {
  description = "ECR repository URL for Docker push"
  value       = aws_ecr_repository.app.repository_url
}

output "github_actions_role_arn" {
  description = "IAM Role ARN to set as GitHub secret AWS_ROLE_ARN"
  value       = aws_iam_role.github_actions.arn
}

output "apprunner_service_url" {
  description = "Public URL of the App Runner demo site"
  value       = "https://${aws_apprunner_service.app.service_url}"
}

output "github_secrets_summary" {
  description = "Values to set in GitHub repository secrets"
  value = {
    AWS_ROLE_ARN = aws_iam_role.github_actions.arn
    AWS_REGION   = var.aws_region
  }
}
