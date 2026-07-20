import { Project } from "@/types";

export const projects: Project[] = [
  {
    slug: "infrastructure-deployment-pipeline",
    name: "Automated Infrastructure Deployment Pipeline",
    tagline: "A Jenkins + Ansible pipeline that took server provisioning from a 20-minute manual chore to a 2-minute automated run.",
    role: "Designer & Implementer",
    timeframe: "Personal infrastructure project",
    GitHubUrl: "https://GitHub.com/vishal-ranga/Automated-Web-Deployment-Pipeline-Jenkins-Ansible",
    stack: ["Jenkins", "Ansible", "Bash", "Git", "Linux"],
    metrics: [
      { label: "Deployment time", value: "20 min → <2 min" },
      { label: "Config drift", value: "Eliminated" },
      { label: "Provisioning", value: "Fully idempotent" },
    ],
    overview:
      "A self-contained CI/CD pipeline for provisioning and deploying to virtualised Linux servers without a human running commands by hand. Jenkins owns the pipeline logic; Ansible owns the machine state.",
    problem:
      "Standing up a new environment meant SSHing into a box and running the same sequence of installs and config edits from memory or from a stale notes file. Every run drifted slightly from the last one, and a failed step halfway through left the server in an unknown state with no clean way to recover.",
    solution:
      "I split the problem in two. Jenkins handles orchestration: it watches the repository, triggers on change, and sequences the pipeline stages with clear pass/fail gates. Ansible handles the actual machine state through idempotent playbooks, so running the same playbook twice produces the same result instead of compounding on top of itself. Bash scripts sit underneath both for the small, sharp jobs — health checks, log aggregation, backup verification — that don't need a full playbook.",
    architecture:
      "Jenkins runs as the control plane on a dedicated Linux host. On trigger, it checks out the target playbooks and inventory, then hands execution to Ansible against the virtualised node group. Each playbook is scoped to one concern (base packages, service config, firewall rules) so a failure in one stage doesn't cascade into unrelated ones.",
    architectureSteps: [
      "Change pushed to the infrastructure repo",
      "Jenkins job triggers and pulls the latest playbooks + inventory",
      "Ansible runs role-scoped playbooks against target hosts",
      "Bash health-check scripts verify service state post-run",
      "Results and logs are aggregated for the run history",
    ],
    deploymentFlow: [
      "Commit lands on the tracked branch",
      "Jenkins pulls source and validates syntax (ansible-lint / bash -n)",
      "Playbooks apply in dependency order across the node group",
      "Post-run health checks confirm services are up before marking the build green",
      "Failure at any stage halts the pipeline and surfaces logs instead of silently continuing",
    ],
    decisions: [
      {
        title: "Idempotency over speed of writing",
        detail:
          "Every playbook was written so re-running it changes nothing if the target state already matches. That upfront discipline is what removed drift across hosts — it costs more time writing the playbook, and pays that back every single run after.",
      },
      {
        title: "Bash for the small stuff, Ansible for the state",
        detail:
          "Not everything needs a playbook. Health checks and log aggregation are quick, linear tasks — Bash keeps them simple and fast rather than routing them through Ansible's abstraction for no benefit.",
      },
    ],
    challenges: [
      {
        title: "Partial failures leaving hosts inconsistent",
        detail:
          "Early runs that failed midway left some hosts patched and others not, with no clear record of which. The fix was making every playbook task individually idempotent and re-runnable, so recovery was just \"run it again\" instead of manual diagnosis.",
      },
      {
        title: "Silent failures in downstream steps",
        detail:
          "A failed health check was initially just a log line, easy to miss. I moved health verification into the pipeline's pass/fail gate so a broken deploy fails the build loudly instead of reporting green.",
      },
    ],
    lessons: [
      "Idempotency isn't a nice-to-have for infra scripts — it's the difference between a pipeline you trust and one you double-check by hand.",
      "A runbook is only useful if it's written while the incident is fresh, not reconstructed afterward from memory.",
      "Splitting orchestration (Jenkins) from state management (Ansible) keeps each piece small enough to reason about.",
    ],
    futureImprovements: [
      "Move inventory management to a dynamic source (e.g. Terraform state) instead of a static file",
      "Add Slack/webhook notifications on pipeline failure",
      "Wrap the pipeline in a rollback stage that reverts to the last known-good playbook run",
    ],
  },
  {
    slug: "java-cicd-pipeline",
    name: "Java CI/CD Pipeline on Linux",
    tagline: "Jenkins-driven build automation for a Java/Maven application — from source pull to tested artifact, hands-off.",
    role: "Designer & Implementer",
    timeframe: "Personal infrastructure project",
    GitHubUrl: "https://GitHub.com/vishal-ranga/maven-jenkins",
    stack: ["Jenkins", "Maven", "Git", "Linux", "Bash"],
    metrics: [
      { label: "Build trigger", value: "Automatic on push" },
      { label: "Artifact output", value: "Maven-tested build" },
      { label: "Manual steps", value: "Zero" },
    ],
    overview:
      "A Jenkins CI pipeline for a Java application running on Linux, covering source retrieval, unit testing, and Maven artifact generation without manual intervention at any stage.",
    problem:
      "Building and testing the application before every release was a manual, repeatable-in-theory-only process: pull latest source, run Maven by hand, eyeball the test output, and hope nothing was skipped under time pressure.",
    solution:
      "Jenkins was configured to own the full build lifecycle — pulling source on trigger, invoking Maven for compilation and unit tests, and producing a versioned artifact only when every stage passes. The pipeline is the single source of truth for what \"a good build\" means, instead of that judgment living in someone's head.",
    architecture:
      "A Jenkins freestyle/pipeline job on a Linux build agent polls the Git repository, checks out source on change, and runs the Maven lifecycle (compile → test → package) inside the same job. Build artifacts and test reports are archived per run for traceability.",
    architectureSteps: [
      "Git push to the tracked branch",
      "Jenkins detects the change and checks out source",
      "Maven compiles the project and runs the unit test suite",
      "Passing builds are packaged into a versioned artifact",
      "Build + test reports are archived against the Jenkins run",
    ],
    deploymentFlow: [
      "Developer pushes to Git",
      "Jenkins polls/receives the trigger and checks out the commit",
      "`mvn test` runs the unit suite; a failing test fails the build immediately",
      "`mvn package` produces the artifact only on a green test stage",
      "Artifact and logs are archived and linked to the build number",
    ],
    decisions: [
      {
        title: "Fail fast on test failure",
        detail:
          "The pipeline is ordered so unit tests run before packaging, and a single failing test stops the build. This keeps a broken artifact from ever being produced in the first place, rather than catching it after the fact.",
      },
      {
        title: "Everything documented as a runbook, not tribal knowledge",
        detail:
          "Troubleshooting steps and build procedures were written down as they were discovered, so a failed build has a documented first response instead of relying on remembering what worked last time.",
      },
    ],
    challenges: [
      {
        title: "Flaky first-time Maven dependency resolution",
        detail:
          "Cold builds on a fresh agent occasionally timed out resolving dependencies. Pre-warming the local Maven repository cache on the build agent removed the inconsistency.",
      },
      {
        title: "Distinguishing test failures from environment failures",
        detail:
          "Early on, a misconfigured agent could produce the same red build as a genuine failing test, which wasted time investigating the wrong thing. Separating environment/setup checks into their own pipeline stage made the failure category obvious at a glance.",
      },
    ],
    lessons: [
      "A CI pipeline's value isn't the automation itself — it's that a green build now means something specific and trustworthy.",
      "Archiving test reports per build turns \"it worked on my machine\" into something you can actually check.",
      "Separating concerns into distinct pipeline stages makes failures self-diagnosing instead of a single opaque red X.",
    ],
    futureImprovements: [
      "Add static analysis (e.g. SpotBugs / Checkstyle) as a pipeline gate",
      "Publish build artifacts to a proper artifact repository instead of local archiving",
      "Parameterize the pipeline for multi-branch builds",
    ],
  },
  {
    slug: "kubernetes-voting-app",
    name: "Kubernetes Voting Application Deployment",
    tagline: "A containerised, cloud-native voting app deployed on a Kind Kubernetes cluster running on AWS EC2.",
    role: "Designer & Implementer",
    timeframe: "Personal infrastructure project",
    GitHubUrl: "https://GitHub.com/vishal-ranga/k8s-kind-voting-app",
    stack: ["Kubernetes", "Kind", "Docker", "AWS EC2", "Linux", "NGINX"],
    metrics: [
      { label: "Architecture", value: "Multi-service microservices" },
      { label: "Orchestration", value: "Deployments, Services, ReplicaSets" },
      { label: "Hosting", value: "AWS EC2 (Linux)" },
    ],
    overview:
      "A microservices-based voting application deployed on a Kubernetes cluster (via Kind) hosted on AWS EC2, exercising the full lifecycle of container orchestration — from image build to scaled, self-healing service.",
    problem:
      "A single monolithic deployment doesn't demonstrate how a system behaves under failure, scaling, or rolling updates. The goal was a realistic multi-service application where orchestration concerns — service discovery, scaling, recovery — are actually exercised, not simulated.",
    solution:
      "Each component of the voting app (vote intake, result processing, storage-backed persistence) runs as its own containerised service, deployed independently through Kubernetes Deployments and exposed via Services for internal discovery. ReplicaSets keep each component at its desired replica count, and ConfigMaps externalise configuration so images stay environment-agnostic.",
    architecture:
      "The Kind cluster runs on an AWS EC2 Linux instance, giving a real cloud host under a local-style Kubernetes control plane. NGINX handles ingress/reverse-proxy duties in front of the cluster's services. Each microservice is built as its own Docker image and deployed as an independent Kubernetes Deployment, so a failure or update in one service doesn't require touching the others.",
    architectureSteps: [
      "Docker images built per microservice and pushed to a registry",
      "Kind cluster provisioned on an AWS EC2 Linux host",
      "Kubernetes Deployments roll out each service with defined replica counts",
      "Services provide stable internal networking and discovery between components",
      "NGINX sits at the edge, routing external traffic into the cluster",
    ],
    deploymentFlow: [
      "Build and tag Docker images for each service",
      "Apply Kubernetes manifests (Deployments, Services, ConfigMaps) via kubectl",
      "Kind schedules pods across the cluster and Kubernetes brings them to Running state",
      "ReplicaSets monitor pod health and replace failed pods automatically",
      "NGINX routes incoming traffic to the appropriate service",
    ],
    decisions: [
      {
        title: "Kind over a managed cluster for this exercise",
        detail:
          "Kind (Kubernetes-in-Docker) gave a real, spec-compliant Kubernetes API to work against without the cost or setup overhead of a managed offering — appropriate for a project meant to build orchestration fundamentals rather than cloud-vendor tooling.",
      },
      {
        title: "ConfigMaps instead of baked-in configuration",
        detail:
          "Keeping configuration out of the container image means the same image can move between environments unchanged — a small decision that pays off the moment you need a staging vs. production distinction.",
      },
    ],
    challenges: [
      {
        title: "Service discovery between components",
        detail:
          "Hardcoding IPs between services breaks the moment a pod is rescheduled. Moving all inter-service calls to Kubernetes Service DNS names made discovery survive pod restarts and rescheduling without any application-level change.",
      },
      {
        title: "Pod scheduling and resource visibility on a constrained EC2 instance",
        detail:
          "Running Kind on a modestly-sized EC2 instance meant resource pressure was visible quickly, which was actually useful — it surfaced how Kubernetes handles scheduling under constraints rather than hiding the problem behind unlimited headroom.",
      },
    ],
    lessons: [
      "Kubernetes' value shows up under failure, not under normal operation — killing a pod and watching the ReplicaSet replace it is the real lesson, not the initial deploy.",
      "Service discovery through DNS names rather than static IPs is a small habit that avoids a whole category of fragile config.",
      "Running orchestration tools on constrained infrastructure teaches scheduling behavior that unlimited cloud resources would mask.",
    ],
    futureImprovements: [
      "Move from Kind to a managed EKS cluster for closer-to-production behavior",
      "Add horizontal pod autoscaling based on CPU/memory metrics",
      "Introduce a service mesh (or at minimum, centralized logging) for cross-service observability",
    ],
  },
];

export function getProjectBySlug(slug: string) {
  return projects.find((p) => p.slug === slug);
}
