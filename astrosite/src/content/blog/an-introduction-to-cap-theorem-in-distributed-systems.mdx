---
title: "An Introduction to CAP Theorem in Distributed Systems"
date: "2023-11-09"
categories: "WebDev"
featured: "false"
overview: "In this article we will dive in to CAP Theorem in Distributed Systems, following proof of CAP theorem and how it is defines some of the databases in current market."
---

## Hello everyone,

Managing distributed computing systems across multiple nodes is a complex challenge. The CAP theorem highlights the intricate trade-offs involved in designing and managing such systems. This theorem centers around three essential attributes:

- Consistency
- Availability
- Partition Tolerance

Collectively referred to as the CAP triad.

This blog post aims to provide an overview of the CAP theorem, including its significance, implications, and real-world applications.

<br></br>

The three properties of the CAP theorem are:

### Consistency

Consistency, in the context of the CAP theorem, refers to the idea that all nodes within a distributed system should have access to the same data at the same time. In other words, regardless of the node you interact with, you should observe the most recent data update. To maintain the same date in all nodes upon an update that data should be replicated to all nodes before the write is considered successful. Maintaining consistency becomes crucial in scenarios where data integrity and correctness are paramount, such as financial systems or databases for critical applications.

### Availability

Availability ensures that every request made to the system should receive a response. However, the response might not always include the most recent data. Availability ensures that a system remains operational and responsive even when individual nodes experience failures or slowdowns. This attribute is crucial in systems where downtime or unresponsiveness is unacceptable, such as e-commerce platforms or real-time analytics systems.

### Partition Tolerance

Partition tolerance refers to the system's ability to continue functioning despite arbitrary network communication failures between nodes. A partition communication error occurs when there are temporary delays or loss of connections between nodes in the distributed system.

### CAP theorem proof

According to the CAP theorem, it is impossible for a distributed system to simultaneously achieve all three properties. As a result, system designers must make trade-offs and prioritize certain properties based on the specific requirements of their applications.

Let's assume that we have a 2-node system with consistent, available, and partition tolerance. which means this system can fulfill all three properties.

At the start, both servers s1 and s2 have the same variable with value v1.

![Figure 1](/assets/cap/capproof11.png)

now client will update v1 to v2 value on this variable connecting to s1 server.

now if the client reads the same variable value from s2 it will return v1 which was the previous value breaking consistency in the system.

This happens because the system cannot communicate between two nodes so s1 cannot replicate changes made to s2 node.

from this we can conclude that we cannot fulfill a consistent, available, partition tolerant system. In this example, we broke consistency over availability and partition tolerance.

<br></br>

#### CA Systems:

Some systems prioritize Consistency and Availability (CA) over Partition Tolerance. Traditional relational databases often fall into this category, where maintaining data integrity and guaranteeing real-time updates are key objectives. However, these systems might struggle during network failures between partitions, potentially leading to downtime.

Examples

- [postgresql](https://www.postgresql.org/)

#### CP Systems:

Other systems emphasize Consistency and Partition Tolerance (CP). Such systems ensure data integrity and are designed to function well even in the presence of network partitions. Distributed databases like MongoDB follow this model, delivering consistency at the expense of potential unavailability during connection failures between partitions.

Examples

- [mongodb](https://www.mongodb.com/)

<Alert type="info" >
MongoDB has tunable levels of consistency for reads and writes. [reference](https://www.mongodb.com/community/forums/t/q-about-mongodbs-cap/150499)
</Alert>

#### AP Systems:

Finally, some systems prioritize Availability and Partition Tolerance (AP). These systems are designed to remain operational even in the face of network disruptions, responding even if the data might be temporarily inconsistent across nodes. NoSQL databases like Apache Cassandra exemplify this approach.

Examples

- [cassandra](https://cassandra.apache.org/_/index.html)

<Alert type="info" >
 Cassandra makes some guarantees about its scalability, availability, and reliability. [reference](https://cassandra.apache.org/doc/4.1/cassandra/architecture/guarantees.html)
</Alert>

### PACELC Theorem: Extending the CAP Theorem

PACELC theorem extends the CAP theorem by introducing extra factors in to consideration, including latency and consistency, to offer a more comprehensive perspective on distributed systems.

> It states that in case of network partitioning (P) in a distributed computer system, one has to choose between availability (A) and consistency (C) (as per the CAP theorem), but else (E), even when the system is running normally in the absence of partitions, one has to choose between latency (L) and consistency (C). wikipedia

According to the PACELC theorem, when a network partition occurs, a trade-off must be made between availability and consistency. In the absence of a partition, another trade-off arises between latency and consistency. This extended framework acknowledges the importance of latency in real-world applications and highlights the need to consider trade-offs beyond the traditional CAP properties.

### Thank you for reading. Share if you loved it.
