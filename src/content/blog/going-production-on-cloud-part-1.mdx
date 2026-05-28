---
title: "Going Production on Cloud: Infrastructure Best Practices Every Engineer Should Know (Part 1)"
date: "2026-05-07"
categories: "Cloud,DevOps,AWS"
featured: "true"
overview: "Shipping your first cloud workload to production? This first part of a two-part series walks through the infrastructure foundations every developer and DevOps engineer should establish before going live: environment parity, network segregation and more."
---
 
## **Hi everyone,**
 
So you have been tinkering on a new project for a while, the demos look great, and now it is time to ship to real customers. It is an exciting moment, but also one where small oversights can turn into expensive incidents at 2 AM.
 
This two-part series covers the practical checklist I wish every team went through before flipping the switch to production. Most recommendations are cloud-agnostic, although a few are AWS-specific. The underlying principles apply equally to GCP, Azure, or any other cloud provider.
 
In this first part we focus on the **infrastructure foundations**: environments, networking, compute, configuration, and deployment strategy. The second part will cover security, monitoring, logging, and operational work.
 
<br></br>

Let's get started.
 
## 1. Always Maintain a Production-Like Non-Production Environment
 
This sounds obvious, but it is one of the most commonly skipped fundamentals. Always maintain at least one non-production environment (usually `staging` or `qa`) where releases are tested before they reach production.
 
The catch is that this environment should genuinely **mirror** production. That means:
 
1. The same services and dependencies.
2. The same versions of every runtime, library, and managed service.
3. The same network topology (VPCs, subnets, security groups).
4. The same authentication and IAM patterns.

If your staging uses PostgreSQL 15 but production runs PostgreSQL 14, or staging talks to a different message broker version, your "tested" release can still fail in production. Smaller instance sizes are perfectly fine for cost reasons; mismatched versions are not.
 
<Alert type="info">
A scaled-down staging environment is usually enough. You don't need the same number of replicas, just the same configurations.
</Alert>
 
## 2. Segregate Your Network with Public and Private Subnets
 
A common mistake on new cloud projects is putting everything in a single public subnet because it "just works." It works, until it doesn't.
 
The standard pattern is straightforward.
 
A **public subnet** holds resources that must be reachable from the internet, such as load balancers, NAT gateways, and bastion hosts. A **private subnet** holds everything else: application servers, databases, internal services.
 
Resources in the private subnet have no direct route from the internet, which dramatically reduces the attack surface. If an attacker cannot reach your database, it gets much harder them to exploit it.

You might argue that exposing a database publicly is still safe when access is tightly controlled through security groups. While that is technically true, security often fails at the edges of human error. A single misconfigured security group rule can unintentionally expose the database to the internet.

Keeping the database in a private subnet adds an additional layer of protection. Even if a security group is accidentally misconfigured, the database still remains unreachable from the outside world. This design reduces the likelihood of accidental exposure and makes costly mistakes much harder to make.

```
Internet
   │
   ▼
[Load Balancer]   ── public subnet
   │
   ▼
[Application]     ── private subnet
   │
   ▼
[Database]        ── private subnet (often a separate one)
```

For outbound access from private subnets (calling third-party APIs, pulling container images, downloading OS updates), use a **NAT gateway** placed in the public subnet.
 
<Alert type="info">
For high availability, deploy a NAT gateway in each Availability Zone you use. A single NAT in one AZ becomes a cross-AZ single point of failure.
</Alert>

## 3. Control Your Ingress and Egress IP Addresses
 
Once your application is in production, you will inevitably need to integrate with third parties. Many of them, particularly payment providers, require you to provide a fixed list of IP addresses to whitelist on their firewall. If your egress IPs change unpredictably, those integrations break.
 
This is where a **NAT gateway with a static Elastic IP** comes in. All outbound traffic from your private subnet exits through that single, predictable address (or a small set of addresses for high availability).
 
The same logic applies to ingress. If a partner organization controls your DNS but does not control your infrastructure, they will need stable IPs for the records they manage.
Also, if your users are behind a corporate firewall and ask for a list of IPs to whitelist, the same situation can arise.

Auto-provisioned load balancer IPs that change on recreation are a frequent source of friction. Wherever possible, allocate static public IPs (Elastic IPs in AWS, reserved IPs in GCP) and assign them deliberately.
 
<Alert type="info">
 Always allocate static IPs early. Retrofitting them after a third-party integration is already pointing at a dynamic address is painful.
</Alert>
 
## 4. Choose the Right Compute Type for Each Workload
 
[Spot instances](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/using-spot-instances.html) and preemptible VMs are tempting because the discount can reach 70 to 90 percent. However, the cloud provider can reclaim them at any time, often with only a couple of minutes of warning.
 
A simple rule of thumb:
 
1. **Stateful workloads** (databases, primary application servers holding session state, anything you cannot kill mid-task) should never run on spot.
2. **Stateless but critical workloads** such as your main API serving customer traffic should stick to on-demand or reserved instances.
3. **Batch jobs, build runners, ML training, queue workers, and ephemeral dev environments** are excellent candidates for spot, because the workload can be interrupted and resumed safely.
I have personally seen a team get burned by this. They moved their main production fleet to spot to save money, hit a regional capacity shortage, and lost a chunk of their fleet within minutes. The cost savings did not come close to covering the downtime.
 
<Alert type="warning">
Use spot for what spot is good at: interruptible, idempotent work. Treat your customer-facing serving capacity as reserved infrastructure.
</Alert>

## 5. Never Hardcode Environment-Specific Values
 
This one shows up most often with cloud resource identifiers. The classic example is the S3 bucket name (or GCS bucket, or Azure blob container).
 
A bad pattern looks like this: storing the **full** path including the bucket name in your database alongside every object reference. Six months later you need to migrate to a different region, or split workloads into a separate account, and now you have to backfill millions of database rows.
 
The better pattern:
 
1. Store only the **object key (path)** in the database.
2. Store the **bucket name** as an environment variable read by the application.
When you migrate, you change one environment variable and redeploy. The database stays untouched.
 
```javascript
// bad - bucket name baked into stored data
const objectUrl = "s3://my-prod-bucket-2026/uploads/user-123/avatar.png";
 
// good - bucket comes from config, only the key is persisted
const bucket = process.env.UPLOADS_BUCKET;       // e.g. "my-prod-bucket-2026"
const objectKey = "uploads/user-123/avatar.png"; // stored in DB
const objectUrl = `s3://${bucket}/${objectKey}`; // construct the full object URL dynamically
```
 
The same principle applies to API endpoints, region names, queue URLs, and any other value that is environment-dependent. Configuration belongs in environment variables or a configuration service, not in code or in your database.
 
## 6. Manage Infrastructure as Code
 
Clicking through a cloud console to provision resources is fine for experimenting. It is not fine for production. Every manual change is a snowflake a configuration that exists only in that environment, undocumented, unrepeatable, and invisible until it causes a problem.

Use an IaC tool like [Terraform](https://developer.hashicorp.com/terraform) to define every resource declaratively, and a configuration management tool like Ansible for anything that runs on the instance itself.

In practice, this means your all your cloud resources are checked into version control alongside your application code. Every change goes through a pull request, gets reviewed, and is applied via a pipeline not by someone running commands in a terminal. Your staging environment is defined by the same Terraform modules as production, with different variable values.

The payoff is consistency and confidence: a new environment is a terraform apply away, rollbacks are a git revert away, and the answer to "what changed?" is always in the commit history rather than in someone's memory.
 
## 7. Tag Every Resource From Day One
 
Tags are easy to skip on day one and almost impossible to backfill cleanly on day three hundred. Adopt a tagging convention before you start provisioning real resources. A reasonable starter set:
 
1. `Environment`: production, staging, dev.
2. `Service` or `Application`: which component does this belong to.
3. `Owner` or `Team`: who is responsible.
4. `CostCenter`: for billing attribution.
5. `ManagedBy`: terraform, cloudformation, manual.

Tagging pays off when you start asking questions like "what is our staging environment costing us?", "who owns this orphaned EBS volume?", or "which resources need patching this quarter?".
Without tags, those questions become much harder to answer, leading to wasted time and effort.

## 8. Use Safer Deployment Strategies
 
A direct in-place deployment to production, where the new version replaces the old one for everyone at once, is the simplest pattern and also the riskiest. If the new version has a bug, every customer hits it instantly and your only path forward is rolling back.
 
Two patterns are worth investing in early.
 
**Blue-Green deployment** runs two identical environments (blue and green). You deploy the new version to the idle one, run smoke tests, and then switch traffic over. If something goes wrong, switch back. This works very well with load balancers and managed container services.
 
**Canary deployment** rolls the new version out to a small percentage of traffic first (1 to 10 percent). Monitor error rates, latency, and business metrics. If everything looks healthy, gradually increase the percentage. If not, roll back having only affected a small portion of users.
 
Both strategies dramatically reduce blast radius. Pick whichever fits your tooling, but pick something other than "replace everything at once and hope for the best."
 
## Wrapping up Part 1
 
We have covered the infrastructure groundwork: environments that match, networks that protect you, predictable IPs, the right compute for each workload, externalized configuration, consistent tagging, and safer deployments.
 
In Part 2 we move into the operational layer: keyless authentication, secrets management and  monitoring. These are the practices that keep you sleeping through the night once you are live on production.

### Thank you for reading. Share if it helped you, and stay tuned for Part 2.