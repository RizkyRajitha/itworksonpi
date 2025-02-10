---
title: "Provision AWS EC2 Instance With Ubuntu OS And Configure Nginx"
date: "2023-12-02"
categories: "AWS,Cloud"
featured: "false"
overview: "The article provides a step-by-step guide on how to provision an AWS EC2 instance with an Ubuntu OS and configure Nginx on the server. It explains how to connect to the instance using SSH, install Nginx, and view Nginx in action."
---

# Hi everyone,

In this article, we will walk you through the steps of provisioning an Amazon Web Services ([AWS](https://aws.amazon.com/)) Elastic Compute Cloud (EC2) instance with [ubuntu](https://ubuntu.com/) as the operating system and configuring [nginx](https://www.nginx.com/) on it. To get started, you will need an AWS account. AWS offers a [free tier](https://aws.amazon.com/free/) for newly created accounts, so you can try out the cloud services without any cost.

### Intro to Nginx

> [Nginx](https://www.nginx.com/) is open source software for web serving, reverse proxying, caching, load balancing, media streaming, and more. It started out as a web server designed for maximum performance and stability.

It was designed for maximum performance and stability, making it one of the most popular and widely used software of its kind. If you're in the IT field, there's a high chance you'll encounter Nginx at some point in your career.

### Lets get started

To begin, log in to your AWS account and click on "EC2".

![aws dashbaord](https://cdn.hashnode.com/res/hashnode/image/upload/v1665043979152/fEnwsEbrh.png?auto=compress,format&format=webp)

Then, click the "Launch Instance" button to open the instance launch wizard.

![launch instance](https://cdn.hashnode.com/res/hashnode/image/upload/v1665044038428/Yw9cg0xkS.png)

### Select server OS

Then in the launch instance give a name and an os image for your server to continue. Here I am naming this as `codehirise server` and choosing `ubuntu 22.04` os.

![alt](/assets/awsec2/aws_server_name_45f161b7d5.png)

Next, you'll need to select an instance type. For this tutorial, we'll choose t2.micro as it falls under the free tier, but you can choose any type you prefer. Keep in mind that the cost will vary based on the instance type you choose. To learn more about AWS instance types, visit the [aws instance types](https://aws.amazon.com/ec2/instance-types/) doc .

![instance](/assets/awsec2/instancetype_233a042a78.png)

### Select ssh Key pair

In order to connect to the instance we are about to create, we need a SSH key pair.

We can create a new key pair or select a previously created key pair.

I will create a new key pair with default values for this tutorial.

![ssh key](/assets/awsec2/keypairselect_8af5dd8810.png)

Provide a name for your key and click "create key pair" the private key will be automatically downloaded.

![key](/assets/awsec2/sshkeydownload_74c202a9d8.png)

### Configure networking

Following the network settings, we need to enable `Allow HTTP traffic from the internet` which will be used to connect to NGINX after it has been deployed.

We also need to Allow SSH traffic from Anywhere which is needed to connect to the instance via SSH.

By default, a provisioned instance has a public IP address which we use to connect to the server. and also when an AWS account creates it will create a default VPC (Virtual private cloud) to simplify the experience for new uses, here that VPC is used as default. And also this instance will be provisioned on AWS us-east-1 region .

![network](https://cdn.hashnode.com/res/hashnode/image/upload/v1665044593482/2kGbiZY6N.png)

### Configure storage

Finally, for storage, I will leave it as the default setting which is suitable for this tutorial, then click the launch instance button to provision your AWS EC2 instance.

![storage](https://cdn.hashnode.com/res/hashnode/image/upload/v1665044674303/_7_xjleLJ.png)

If everything goes well, you'll see this screen with launch success.

After that click on instance id to view your newly created instance.

![provision ec2 success screen](/assets/awsec2/provision_ec2_76c044c031.png)

You will see your newly created instance in a `running` status. Note that it takes some time to get from the `pending` to `running` state.

![instance running state](/assets/awsec2/running_fda9b28256.png)

### Connecting to the instance

Once we have successfully installed the server, we can connect to it using SSH.

Navigate to the directory where you have the SSH private key which we downloaded earlier.

Before we can actually ssh in to the server we need to reduce permissions in our ssh key.

So to do that run

```bash
chmod 400 <your key >
```

![change key permission](/assets/awsec2/chmod_764b5f2526.png)

Then run to connect to the instance using SSH.

```bash
ssh -i "your key name .pem" ubuntu@instance_public_ip
```

Here we specify `ubuntu` as username since that is the default username for Ubuntu OS which we selected in earlier steps.

we can also specify `Public DNS` for ssh isted of public ip os the server.

After connecting to the instance for the first time you will get a prompt to continue. Type `yes` to continue

![ssh to server](/assets/awsec2/ssh_in_server_080d6f57a9.png)

Voila, you are now on the server.

### Install Nginx on an Ubuntu server

Installing Nginx is pretty straight forward.

First, we need to update the 'apt' repositories since this is a fresh Ubuntu server. There might be new updates in the repositories.

Here `apt` is ubuntu default pachage manager.

Run

```bash
sudo apt update
```

![apt update](/assets/awsec2/aptupdate_fe3154adbb.png)

After that run

And press `y` in the confirmation propmt

```bash
sudo apt install nginx
```

![install nginx](/assets/awsec2/aptanginx_d1c7e70f0b.png)

After installation run

```bash
sudo systemctl status nginx
```

![systemctl status](/assets/awsec2/systemctlnginx_6d53f3296d.png)

Now we will visit the public IP address of our instance to see Nginx in action.

![Nginx in browser](/assets/awsec2/nginxweb_5d0ff7c289.png)

Nginx will bind by default to port 80 in the server , and since we opened that port when provisioning instance we are able to see this nginx welcome page by visiting public ip from web browser.

###### ~note~ there can be aditional configurations in os level like firewalls to open ports , but in this ubuntu image it is not nessasary and port 80 is opend by default in os level.

As the final step we need to remove created resources to avoid getting billed.

Here by terminating instace it will also remove ebs root volume as default action which will incur cost if not deleted.

![Terminate instance](/assets/awsec2/terminate_93c5fb3a7c.png)

### Thank you for reading.
