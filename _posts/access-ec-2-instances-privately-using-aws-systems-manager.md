---
title: "Access EC2 Instances privately using AWS Systems Manager"
date: "2023-12-30"
categories: "Cloud,AWS"
featured: "true"
overview: "This article provides a tutorial on accessing AWS EC2 instances using AWS Systems Manager (SSM) and outlines the benefits and prerequisites associated with this approach. The key advantages include avoiding exposure of instances to the public internet, managing multiple instances without sharing SSH keys, and executing commands on instances without direct login."
---

## Hi Everyone,

In this article, we will learn how to access AWS EC2 instances using AWS Systems Manager. This is quite useful,

1. when you don't want to expose your instance to public internet via a public ip.
2. when you want to manage a large number of instances without sharing ssh keys.
3. run commands in many instances without logging in to them.

but this does come with a few prerequisites.

1. SSM agent should be up and running to connect to this instance (SSM agent comes with Amazon Linux and Ubuntu amis by default).
2. The instance should have access to the public internet (or access to SSM endpoints via AWS private endpoints).
3. The instance should have a role with the required permissions.

to continue with this post I will assume that you have access to an AWS account and have a basic idea of AWS.

<Alert type="warning" >
keep in mind that if you are not in the AWS free tier this will incure you a cost.
</Alert >

With the above in mind let's get started.

First, we will create an aws instance role which is required to grant permissions to the aws instance so that the ssm agent in the ec2 instance can connect with the aws systems manager.

navigate into aws iam roles and click create a role as below.

![create aws role](/assets/ssm/1createrole1_074bb023bc.png)

in next page add trusted entity EC2 and select **EC2 Role for AWS Systems Manager**

![add trusted entity](/assets/ssm/2createrole2_3ebe7d2bcc.png)

next in permissions since we chose **EC2 Role for AWS Systems Manager** it will automatically set **AmazonSSMManagedInstanceCore** policy which is the required permission for this use case.

![add permissions](/assets/ssm/3createrole3_d174241e53.png)

after hitting next add a name for your role and a description.

![add name for role](/assets/ssm/4createrole4_336d782f90.png)

and review whether all settings are mentioned below and click Create role.

![review and create](/assets/ssm/5createrole5_5baf60dc63.png)

and we are done with iam role for our instance. now let's create an ec2 instance.

navigate to the ec2 menu and click launch instance

![launch instance](/assets/ssm/6createinstance_802cbc6d3b.png)

I will add an instance name as shown below but this is optional.

![add instance name](/assets/ssm/7createinstance2_01a5803e4f.png)

next select ami for this instance I will choose the default Amazon Linux 2023 image for this purpose.

![select ami](/assets/ssm/8createinstance3_da0c00ddf2.png)

next, specify the instance type and key pair for login. for this example, I will add a keypair since it will be useful if there is an issue with agent connectivity although we are not using it in this tutorial.

![instance type and key pair](/assets/ssm/9createinstance4_c5c347f3cf.png)

next under the network setting, I will remove all inbound access to this instance to demonstrate we can connect without public access. but keep in mind that outbound access is required for ssm agent connectivity, which is added by default when creating a security group.

![network settings](/assets/ssm/10createinstance5_9a0598ad98.png)

I will keep storage as default as below.

![storage](/assets/ssm/11createinstance6_bf9856d6c5.png)

in the advanced setting we need to add iam role(IAM instance profile) we created in the previous steps.

![add iam role](/assets/ssm/12createinstance7_417ea112c2.png)

next hit the launch instance button.

![create instance](/assets/ssm/13createinstance8_2107baaedb.png)

and you will get a similar output as below.

![instance created ](/assets/ssm/14createinstance9_48eef04f63.png)

click on the instance id to navigate to the instance page. Here we can recognize the newly created instance. click on the instance id to view the instance details page.

![instanc page](/assets/ssm/15createinstance10_a2880a2c37.png)

click on Connect to navigate to the Connect page.

![connect](/assets/ssm/16createinstance11_0ae7c74806.png)

in the connect page navigate to the session manager tab and press connect

![ec2 connect ssm](/assets/ssm/17createinstance12_eb49451409.png)

if you receive an error as below, check the [troubleshooting](/post/access-ec-2-instances-privately-using-aws-systems-manager/#troubleshooting) guide.

![error ssm](/assets/ssm/23errorssm_095bbf45eb.png)

if everything goes well new tab will be created with a terminal displayed as below. now you are connected to the instance with a terminal.

<Alert type="info" >
Note the user is ssm-user in current session.
</Alert >

![ssm terminal](/assets/ssm/18createinstance13_0607d571ff.png)

### Troubleshooting.

check if the instance has outbound internet access in security group rules.

![check sg](/assets/ssm/20sg2_a2bf39d37f.png)

make sure the instance has iam instance role attached.

![check iam role](/assets/ssm/21instancerole_2f21f121f0.png)

check iam instance role permissions.
only require permissons is **AmazonSSMManagedInstanceCore** policy.

![permissions](/assets/ssm/22iamrolepermissions_557e3457b2.png)

check if the instance ssm agent is reporting to the aws ssm fleet manager.
it should be listed as online.

![fleet manager](/assets/ssm/21fleetmanager_78811b813f.png)

If everything above is in place and you still cannot get ssm connectivity you will need to further troubleshoot issues in ssm agent.
a good place to start troubleshooting is by checking logs.

check ssm agent logs under `/var/log/amazon/ssm`

![error logs](/assets/ssm/ssm_err_log_aa15d39632.png)

here we can see there is an access denied error in `errors.log`

![agent logs](/assets/ssm/ssm_agentlog_a8f665d89d.png)

here we can see there is an access denied error in `amazon-ssm-agent.log` and it is sleeping for 30 minutes.
this could happen if we attach the role after the instance starts,
so ssm agent checked to authenticate and failed then the next retry will be in 30 minutes.

![restart ssm agent service](/assets/ssm/restartssm_8de376a7ff.png)

we can restart ssm agent so it will try to reauthenticate and succeed this time.

This is just one scenario of debugging and your specific scenario might change but going through logs will give an insight into what the problem.

### Thank you for reading. Share if you loved it.
