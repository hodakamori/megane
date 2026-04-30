# ---------------------------------------------------------------------------
# GitHub Actions OIDC provider + CI deploy role
#
# Lets the workflow assume a least-privilege role via OIDC instead of using
# long-lived static AWS access keys.
# ---------------------------------------------------------------------------

resource "aws_iam_openid_connect_provider" "github_actions" {
  url             = "https://token.actions.githubusercontent.com"
  client_id_list  = ["sts.amazonaws.com"]
  thumbprint_list = [
    "6938fd4d98bab03faadb97b34396831e3780aea1",
    "1c58a3a8518e8759bf075b76b750d4f2df264fcd",
  ]

  tags = local.common_tags
}

data "aws_iam_policy_document" "ci_deploy_assume_role" {
  statement {
    effect  = "Allow"
    actions = ["sts:AssumeRoleWithWebIdentity"]

    principals {
      type        = "Federated"
      identifiers = [aws_iam_openid_connect_provider.github_actions.arn]
    }

    condition {
      test     = "StringEquals"
      variable = "token.actions.githubusercontent.com:aud"
      values   = ["sts.amazonaws.com"]
    }

    # Scope assumption to this repo. Loosen / tighten as needed:
    #   "repo:owner/name:ref:refs/heads/main"   -> only main
    #   "repo:owner/name:pull_request"          -> only PR runs
    #   "repo:owner/name:*"                     -> any ref / event
    condition {
      test     = "StringLike"
      variable = "token.actions.githubusercontent.com:sub"
      values   = ["repo:${var.github_repo}:*"]
    }
  }
}

resource "aws_iam_role" "ci_deploy" {
  name               = "${var.app_name}-ci-deploy"
  assume_role_policy = data.aws_iam_policy_document.ci_deploy_assume_role.json

  tags = local.common_tags
}

data "aws_iam_policy_document" "ci_deploy" {
  # --- Terraform S3 backend (read/write tfstate) ---
  statement {
    sid     = "TfStateBucketRead"
    effect  = "Allow"
    actions = ["s3:ListBucket", "s3:GetBucketLocation"]
    resources = [
      "arn:aws:s3:::${var.app_name}-terraform-state",
    ]
  }

  statement {
    sid    = "TfStateObjectRW"
    effect = "Allow"
    actions = [
      "s3:GetObject",
      "s3:PutObject",
      "s3:DeleteObject",
    ]
    resources = [
      "arn:aws:s3:::${var.app_name}-terraform-state/*",
    ]
  }

  # --- Demo S3 bucket (full lifecycle: terraform create + workflow sync) ---
  statement {
    sid    = "DemoBucketManage"
    effect = "Allow"
    actions = [
      "s3:CreateBucket",
      "s3:DeleteBucket",
      "s3:ListBucket",
      "s3:GetBucket*",
      "s3:PutBucket*",
      "s3:DeleteBucketPolicy",
      "s3:GetEncryptionConfiguration",
      "s3:PutEncryptionConfiguration",
    ]
    resources = [
      "arn:aws:s3:::${local.bucket_name}",
    ]
  }

  statement {
    sid    = "DemoBucketObjects"
    effect = "Allow"
    actions = [
      "s3:GetObject",
      "s3:PutObject",
      "s3:DeleteObject",
      "s3:GetObjectTagging",
      "s3:PutObjectTagging",
    ]
    resources = [
      "arn:aws:s3:::${local.bucket_name}/*",
    ]
  }

  # --- CloudFront (resource-level ARNs not supported on most actions) ---
  statement {
    sid    = "CloudFrontManage"
    effect = "Allow"
    actions = [
      "cloudfront:CreateDistribution",
      "cloudfront:GetDistribution",
      "cloudfront:GetDistributionConfig",
      "cloudfront:UpdateDistribution",
      "cloudfront:DeleteDistribution",
      "cloudfront:TagResource",
      "cloudfront:UntagResource",
      "cloudfront:ListTagsForResource",
      "cloudfront:CreateOriginAccessControl",
      "cloudfront:GetOriginAccessControl",
      "cloudfront:GetOriginAccessControlConfig",
      "cloudfront:UpdateOriginAccessControl",
      "cloudfront:DeleteOriginAccessControl",
      "cloudfront:ListOriginAccessControls",
      "cloudfront:CreateInvalidation",
      "cloudfront:GetInvalidation",
      "cloudfront:ListInvalidations",
      "cloudfront:ListDistributions",
    ]
    resources = ["*"]
  }

  # --- ACM (us-east-1 cert for CloudFront) ---
  statement {
    sid    = "AcmManage"
    effect = "Allow"
    actions = [
      "acm:RequestCertificate",
      "acm:DescribeCertificate",
      "acm:GetCertificate",
      "acm:ListCertificates",
      "acm:DeleteCertificate",
      "acm:AddTagsToCertificate",
      "acm:RemoveTagsFromCertificate",
      "acm:ListTagsForCertificate",
    ]
    resources = ["*"]
  }

  # --- Route53 (DNS records in the existing zone) ---
  statement {
    sid    = "Route53Read"
    effect = "Allow"
    actions = [
      "route53:GetHostedZone",
      "route53:ListHostedZones",
      "route53:ListHostedZonesByName",
      "route53:ListResourceRecordSets",
      "route53:GetChange",
    ]
    resources = ["*"]
  }

  statement {
    sid    = "Route53Write"
    effect = "Allow"
    actions = [
      "route53:ChangeResourceRecordSets",
    ]
    resources = [
      "arn:aws:route53:::hostedzone/${data.aws_route53_zone.main.zone_id}",
    ]
  }

  # --- IAM read-only on the role + OIDC provider (terraform refresh) ---
  statement {
    sid    = "IamSelfRead"
    effect = "Allow"
    actions = [
      "iam:GetRole",
      "iam:GetRolePolicy",
      "iam:ListRolePolicies",
      "iam:ListAttachedRolePolicies",
      "iam:GetOpenIDConnectProvider",
    ]
    resources = [
      aws_iam_role.ci_deploy.arn,
      aws_iam_openid_connect_provider.github_actions.arn,
    ]
  }

  # --- Caller identity ---
  statement {
    sid       = "StsCallerIdentity"
    effect    = "Allow"
    actions   = ["sts:GetCallerIdentity"]
    resources = ["*"]
  }
}

resource "aws_iam_role_policy" "ci_deploy" {
  name   = "${var.app_name}-ci-deploy"
  role   = aws_iam_role.ci_deploy.id
  policy = data.aws_iam_policy_document.ci_deploy.json
}
