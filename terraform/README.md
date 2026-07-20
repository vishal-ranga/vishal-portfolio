# Terraform (Planned)

This folder is intentionally reserved for a future Infrastructure-as-Code
layer. It's not populated with resources yet because there's no cloud
account wired up to this project — shipping placeholder `.tf` files that
provision nothing would be worse than being explicit about the roadmap.

## Planned scope

- **State backend**: remote state in an S3 bucket + DynamoDB lock table
  (or Terraform Cloud, if avoiding self-managed state).
- **Networking**: VPC, public/private subnets, security groups scoped to
  only what the app and its load balancer need.
- **Compute**: either
  - an ECS Fargate service (simplest path from the existing Dockerfile), or
  - an EKS cluster, to run the manifests already in `k8s/`.
- **DNS/TLS**: Route53 + ACM, replacing the placeholder host in
  `k8s/ingress.yaml`.
- **CI/CD wiring**: a `terraform plan` step added to `.github/workflows/ci.yml`
  on pull requests that touch this folder, and `terraform apply` gated
  behind manual approval on `main`.

## Why this is called out explicitly

A senior reviewer looking at a portfolio repo can tell the difference
between "empty folder with no explanation" and "empty folder with a
written plan for what goes here and why it isn't there yet." This file is
here so the second read is the one they get.
