---
title: "How to Grant Temporary Read-Only Access to a Kubernetes Cluster"
date: "2026-04-14"
categories: "Kubernetes,DevOps,Security"
featured: "true"
overview: "Learn how to safely give temporary read-only access to Kubernetes pods, deployments, and pod logs using RBAC, ServiceAccounts, and a custom kubeconfig file. This beginner-friendly guide follows the principle of least privilege and includes step-by-step commands, YAML examples, and cleanup instructions."
---

# Hi Everyone,

In production Kubernetes environments, giving full cluster admin access to all actor is a major security risk. Instead, you should follow the **principle of least privilege** and provide only the exact permissions they need.

<br/>

This tutorial shows you exactly how an admin can create a limited-access ServiceAccount, attach a Role with the required permissions, generate a short-lived token, and hand over a ready-to-use `kubeconfig` file to developers, who would not need full admin access to the cluster but only limited access. In this tutorial we will demonstrate temporary **read-only** access to pods, deployments, and pod logs.

By the end of this guide, developers will be able to run commands like:

```bash
kubectl get pods
kubectl get deployments
kubectl logs <pod-name>
```
while being unable to delete resources, create new ones, or access other namespaces.

> Why this approach? ServiceAccounts + short-lived tokens are the recommended way in modern Kubernetes for temporary access. They are easy to revoke, don’t require managing client certificates, and expire automatically.

Let’s get started

## Prerequisites
Before you begin, make sure you have:
1. Admin access to your Kubernetes cluster (kubeconfig with cluster-admin rights).
2. kubectl installed and configured.
3. A target **namespace** where developers will work (we’ll use dev-team in this example  change it to your actual namespace).
4. Basic familiarity with Kubernetes objects (Pods, Deployments, YAML).

If you are new to Kubernetes RBAC, don’t worry  we’ll explain every step.

## Step 1: Create a Dedicated Namespace (Optional but Recommended)
It’s best practice to isolate developer access to a specific namespace.

```bash
kubectl create namespace dev-team
```

This ensures developers can only see resources inside dev-team and cannot accidentally affect production namespaces.

## Step 2: Create a ServiceAccount for the Developer
[ServiceAccounts](https://kubernetes.io/docs/concepts/security/service-accounts/) are Kubernetes built-in identities for workloads and users.

```bash
kubectl create serviceaccount dev-reader -n dev-team
```

Using a ServiceAccount instead of a real user certificate makes the setup simpler and easier to manage/revoke.

## Step 3: Create a Role with Read-Only Permissions
Create a file named dev-reader-role.yaml:

```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: Role
metadata:
  namespace: dev-team
  name: dev-reader-role
rules:
  # Read-only access to Pods and Deployments
  - apiGroups: [""]
    resources: ["pods"]
    verbs: ["get", "list", "watch"]
  - apiGroups: ["apps"]
    resources: ["deployments"]
    verbs: ["get", "list", "watch"]
  # Allow reading pod logs (very common developer need)
  - apiGroups: [""]
    resources: ["pods/log"]
    verbs: ["get"]
```

Apply it:

```bash
kubectl apply -f dev-reader-role.yaml
```

**Rationale for each verb:**

*   get, list, watch -> Allows viewing resources without modification.
*   pods/log -> Specifically enables kubectl logs command.
*   No create, update, delete, or patch -> Completely read-only.

## Step 4: Bind the Role to the ServiceAccount
Create a file named dev-reader-rolebinding.yaml:

```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: RoleBinding
metadata:
  namespace: dev-team
  name: dev-reader-rolebinding
subjects:
  - kind: ServiceAccount
    name: dev-reader
    namespace: dev-team
roleRef:
  kind: Role
  name: dev-reader-role
  apiGroup: rbac.authorization.k8s.io
```

Apply it:

```bash
kubectl apply -f dev-reader-rolebinding.yaml
```

The RoleBinding connects the permissions (Role) to the identity (ServiceAccount). Without it, the ServiceAccount has zero permissions.

## Step 5: Generate a Temporary Token
Kubernetes now supports short-lived tokens out of the box.

```bash
kubectl create token dev-reader --namespace dev-team --duration=24h > dev-reader.token
```


*  `--duration=24h` makes the token automatically expire after 24 hours (you can use 1h, 12h, 7d, etc.).

*   This is much safer than long-lived tokens or certificates.

Copy the token (it will be a long JWT string):

```bash
cat dev-reader.token
```

## Step 6: Create the Custom kubeconfig File for the Developer

### How to get the CA and API server URL

Run these commands on your admin machine to get required values for kube config.

```bash
# Get API server URL
kubectl config view --minify -o jsonpath='{.clusters[0].cluster.server}'
```

```bash
# Get CA certificate (base64)
kubectl config view --minify --raw -o jsonpath='{.clusters[0].cluster.certificate-authority-data}'
```
Create a file named dev-reader.kubeconfig with the following content and replace the placeholders with correct values from above commands

```yaml
apiVersion: v1
kind: Config
clusters:
- cluster:
    certificate-authority-data: <YOUR_CLUSTER_CA_BASE64>   # e.g. LS......................
    server: https://<YOUR_API_SERVER_URL>                  # e.g. https://api.yourcluster.com:6443
  name: kubernetes
contexts:
- context:
    cluster: kubernetes
    namespace: dev-team
    user: dev-reader
  name: dev-reader-context
current-context: dev-reader-context
users:
- name: dev-reader
  user:
    token: <PREVIOUSLY_GENERATED_TOKEN>
```

## Step 7: Hand Over the kubeconfig to the Developer
Send the dev-reader.kubeconfig file to the developer securely. The developer can now use it with any kubectl command:


```bash
# Test access
kubectl --kubeconfig=dev-reader.kubeconfig get pods
kubectl --kubeconfig=dev-reader.kubeconfig get deployments
kubectl --kubeconfig=dev-reader.kubeconfig logs <pod-name>
```

![get pods screenshot](/assets/kube-temp-access/get-pods.png)

![get deployments screenshot](/assets/kube-temp-access/get-deployments.png)

![permission check screenshot](/assets/kube-temp-access/permission-check.png)

![pod logs screenshot](/assets/kube-temp-access/logs.png)

They will **not** be able to run kubectl delete, kubectl apply, or access other namespaces.

![delete pods error screenshot](/assets/kube-temp-access/delete-pods.png)

## Cleanup 

```bash
kubectl delete rolebinding dev-reader-rolebinding -n dev-team
kubectl delete serviceaccount dev-reader -n dev-team
```

## Security Best Practices Summary
*   Always use **namespace-scoped** Roles instead of ClusterRoles when possible.
*   Use **short-lived tokens** (--duration flag).
*   Never share the cluster-admin kubeconfig.
*   Rotate or delete ServiceAccounts regularly.

## Conclusion
You have now successfully given a developer **temporary, read-only access** to pods, deployments, and logs in your Kubernetes cluster  with zero risk of destructive actions.
This pattern scales well, you can create different ServiceAccounts for different teams, different namespaces, or even different permission levels (e.g., one for “view only”, another for “view + logs”).

### Thank you for reading. Share if it helped your team!