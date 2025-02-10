---
title: "3 Linux network analyze commands you must know"
date: "2023-12-02"
categories: "Linux,Networking"
featured: "false"
overview: "This article lists 3 of the best Linux network tools used for network troubleshooting , including netstat for analyze network connections, ip for viewing and manipulating network objects and dig for query and analyze DNS with example code snippets."
---

# Hi everyone,

We will discuss the top 3 useful Linux network commands in this article.

These commands are quite useful in debugging network issues in systems and also

To get a better understanding of the networking systems you are working with.

Let's begin without further ado.

## `ip`

As first in the list `ip` command . [IP](https://man7.org/linux/man-pages/man8/ip.8.html) is a popular tool for viewing and manipulating network objects on your Linux system, such as IP addresses, routes, and ARP tables. This tool can be used to configure a network as well as to troubleshoot network problems.

### View network interface details

`ip address` command allows you to lis all network interfacern in your systsm.

![list interfaces](/assets/nettools/ipaddress_5beee3cb62.png)

### Show network statistics

Show network statistics like received / transmitted bytes by network interface.

```bash
ip -s -h l show dev <interface name>
```

Argument breakdown

1. `-s` display networking statistics

2. `-h` display in human readable format

3. `l show dev` show for speficied network interface

![show network stats](/assets/nettools/netusage_e508802e42.png)

## `netstat`

The [netstat](https://en.wikipedia.org/wiki/Netstat) command-line network utility displays network connections, routing tables, and a number of statistics related to network protocols and network interfaces.

Since I have a fresh Ubuntu installation it does not come with netstat so we need to install , and suggested by apt for our conveenicance.

![netstat pakcage not found error](/assets/nettools/netstatnotfound_7ff79bca2f.png)

Run the following commands to install `netstat`.

```bash
sudo apt update
sudo apt install net-tools
```

### List open ports

You can use netstat to check open ports in your system.

```bash
netstat -lnptu
```

Argument breakdown

1. `l` listning services

2. `p` process name

3. `t` tcp

4. `u` udp

5. `n` dont resolve port name

In the below output we can see open tcp and udp ports with their respective program name / pid.

Here you can see ssh port open in port `22` which we are using yo connect to this very instance.

![netstat list open ports](/assets/nettools/netsstatports_b9b4d00225.png)

###### ~note~ We need sudo permission to list program name / pid .

## `dig`

The [dig](<https://en.wikipedia.org/wiki/Dig_(command)>) command-line tool is an administrative tool that allows you to query the [Domain Name System](https://www.cloudflare.com/learning/dns/what-is-dns/) using the command line. The dig tool can be useful for both troubleshooting network problems and for debugging activities.

### Check dns record

We can use the below command to query DNS and get an answer for that domain name.

```bash
dig codehirise.com
```

![dig query](/assets/nettools/dig_0de24742c7.png)

Here we can get ip resolved for the domain name , and also query cache time as `300` seconds and also record type as `A` record.

## Thank you for reading.
