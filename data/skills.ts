import { SkillGroup } from "@/types";

export const skillGroups: SkillGroup[] = [
  {
    category: "Cloud",
    items: ["AWS EC2", "AWS S3", "AWS IAM", "AWS VPC", "CloudWatch", "AWS Lambda", "DynamoDB"],
  },
  {
    category: "Infrastructure as Code & Automation",
    items: ["Terraform", "Ansible", "Jenkins", "CI/CD Pipelines"],
  },
  {
    category: "Containers & Orchestration",
    items: ["Docker", "Kubernetes", "Kind", "Microservices"],
  },
  {
    category: "OS & Scripting",
    items: ["Linux (Ubuntu / CentOS / RHEL)", "Bash", "Python"],
  },
  {
    category: "Networking & Security",
    items: ["TCP/IP", "DNS", "HTTP/HTTPS", "NGINX", "Load Balancing", "IAM Policies", "Security Groups"],
  },
  {
    category: "Monitoring & Observability",
    items: ["Amazon CloudWatch", "PM2", "Log Monitoring", "Alerting"],
  },
  {
    category: "Version Control & Tools",
    items: ["Git", "GitHub", "Jira", "Confluence"],
  },
];
