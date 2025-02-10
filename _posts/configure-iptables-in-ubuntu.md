---
title: "Setup and configure iptables in Ubuntu"
date: "2023-03-27"
categories: "Linux,Networking"
featured: "false"
overview: "A practical guide to understanding and using iptables in Linux. In this blog post, we explore what a firewall is and how iptables can be used to set up, maintain, and inspect the tables of IP packet filter rules within the Linux kernel, and setup iptables-persistent to persist ephemeral firewall rules. It also provides a step-by-step guide on how to block incoming http connections to a webserver and then unblock it using iptables commands."
---

# Hi everyone,

while you are working on Linux systems, you might have come across
firewalls. but what is a firewall anyway?

> Firewall is a computer program that monitors and controls the incoming and outgoing network traffic based on predetermined security rules. A firewall typically establishes a barrier between a trusted network and an untrusted network, such as the Internet.

Iptables is one such popular and powerful tool in the Linux operating system, designed to enable users to configure, maintain, and examine the tables of IP packet filter rules within the Linux kernel.

By configuring iptables we can allow or deny network traffic based on a set of configurable rules like

1. source ip
2. destination port
3. network interface

so without further ado let's dig in.

for this post, I have already created an instance in AWS with ubuntu os.

I provisioned an ec2 instance with ubuntu latest image which has iptables pre-installed

![iptables version](/assets/iptables/iptables_v_f80ecbc6bf.png)

we can use `iptables -L` to list all rules setup

![list rules](/assets/iptables/iptables_L_3af72af723.png)

for this example, I will install nginx webserver and then add http (port 80) block rule for demonstration.

for that, I installed nginx using the below commands

```bash
sudo apt update
sudo apt install nginx
```

![Nginx status](/assets/iptables/nginxstatus_4017c08a3a.png)

after the above step, we can see nginx default page when we visit the instance public ip

![Nginx default page](/assets/iptables/nginxallow_d46ea9f0ce.png)

now let's add an iptables firewall rule to block all incoming http (port 80) connections.

`sudo iptables -A INPUT -p tcp --dport 80 -j DROP`

above command will `DROP` all incoming requests to port `80`.

![iptables block list](/assets/iptables/iptabledrophttp_3f75cb6450.png)

now if we try to access nginx it will not load.

![Nginx blocked](/assets/iptables/nginxblock_cddf49578c.png)

now to unblock port `80` we can remove the previously added rule.

for that first, we need to list all rules with line numbers

`sudo iptables -L --line-numbers`

![iptables list with line numbers](/assets/iptables/iptables_L_with_line_numbers_56591293ef.png)

then run `sudo iptables -D INPUT 1` which indicates that remove rule 1 in input rules which corresponds to what we created earlier.

![](/assets/iptables/iptables_remove_rule_610637ab5e.png)

after removing iptables block rule we can access nginx default webpage.

###### ~note~ iptables rules are ephemeral, they will not persist after a reboot. we need to use iptables-persistent package to make rules persist.

![install iptables-persistent](/assets/iptables/install_iptables_persits_1ba4dd33b8.png)

![install iptables-persistent](/assets/iptables/iptable_persist_9ee5c4beae.png)

![run iptables-persistent](/assets/iptables/iptablesave_f110119f6b.png)

And there you have it.

### Thank you for reading.

### Share if you loved it
