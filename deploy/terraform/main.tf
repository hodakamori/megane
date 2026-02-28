terraform {
  required_version = ">= 1.5"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = var.aws_region
}

# ---------------------------------------------------------------------------
# SSH Key Pair
# ---------------------------------------------------------------------------
resource "aws_lightsail_key_pair" "deploy" {
  name       = "${var.app_name}-deploy"
  public_key = var.ssh_public_key
}

# ---------------------------------------------------------------------------
# Lightsail Instance
# ---------------------------------------------------------------------------
resource "aws_lightsail_instance" "app" {
  name              = "${var.app_name}-demo"
  availability_zone = "${var.aws_region}a"
  blueprint_id      = "ubuntu_22_04"
  bundle_id         = var.lightsail_bundle
  key_pair_name     = aws_lightsail_key_pair.deploy.name

  user_data = templatefile("${path.module}/user_data.sh.tftpl", {
    github_repo = var.github_repo
    domain      = var.domain
    email       = var.certbot_email
  })

  tags = {
    App = var.app_name
  }
}

# ---------------------------------------------------------------------------
# Static IP
# ---------------------------------------------------------------------------
resource "aws_lightsail_static_ip" "app" {
  name = "${var.app_name}-ip"
}

resource "aws_lightsail_static_ip_attachment" "app" {
  static_ip_name = aws_lightsail_static_ip.app.name
  instance_name  = aws_lightsail_instance.app.name
}

# ---------------------------------------------------------------------------
# Firewall (Lightsail instance public ports)
# ---------------------------------------------------------------------------
resource "aws_lightsail_instance_public_ports" "app" {
  instance_name = aws_lightsail_instance.app.name

  port_info {
    protocol  = "tcp"
    from_port = 22
    to_port   = 22
  }

  port_info {
    protocol  = "tcp"
    from_port = 80
    to_port   = 80
  }

  port_info {
    protocol  = "tcp"
    from_port = 443
    to_port   = 443
  }
}

# ---------------------------------------------------------------------------
# DNS (optional – only if domain is provided)
# ---------------------------------------------------------------------------
resource "aws_lightsail_domain" "app" {
  count       = var.domain != "" ? 1 : 0
  domain_name = var.domain
}

resource "aws_lightsail_domain_entry" "a_record" {
  count       = var.domain != "" ? 1 : 0
  domain_name = aws_lightsail_domain.app[0].domain_name
  name        = ""
  type        = "A"
  target      = aws_lightsail_static_ip.app.ip_address
}
