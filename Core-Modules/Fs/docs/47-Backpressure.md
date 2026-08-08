# Backpressure - Introduction

> Learn what Backpressure is, why it happens, and how Node.js Streams solve it automatically.

---

# Table of Contents

- Introduction
- What is Backpressure?
- Why Backpressure Happens?
- Understanding Producer and Consumer
- Normal Data Flow
- Backpressure Situation
- Real Life Analogy
- Internal Working
- Without Backpressure
- With Backpressure
- Why Node.js Needs Backpressure
- Production Examples
- Summary
- What's Next?

---

# Introduction

Backpressure is one of the most important concepts in Streams.

It happens when

```
Data is produced

↓

Faster

↓

Than it can be consumed.
```

Simply,

the producer is too fast,

and the consumer is too slow.

---

# What is Backpressure?

Imagine two people.

Person A

writes

```
100 pages

per minute
```

Person B

can read only

```
10 pages

per minute
```

Flow

```
Write

↓

Write

↓

Write

↓

Read
```

Pages start piling up.

This is

```
Backpressure
```

---

# Why Backpressure Happens?

Every stream has two sides.

```
Producer

↓

Consumer
```

Examples

Producer

- Hard Disk
- Network
- Camera
- Database

Consumer

- File
- Browser
- Application
- Cloud Storage

If

```
Producer Speed

>

Consumer Speed
```

Backpressure occurs.

---

# Understanding Producer and Consumer

Suppose

```
SSD

↓

500 MB/sec
```

But

```
Network

↓

50 MB/sec
```

Flow

```
SSD

↓

500 MB

↓

Network

↓

50 MB
```

The network cannot keep up.

---

# Normal Data Flow

When both are equally fast

```
Producer

↓

Chunk

↓

Consumer

↓

Chunk

↓

Consumer
```

Everything works smoothly.

---

# Backpressure Situation

Suppose

```
Producer

↓

100 Chunks/sec
```

Consumer

```
↓

20 Chunks/sec
```

Flow

```
Producer

↓

Chunk

↓

Chunk

↓

Chunk

↓

Chunk

↓

Consumer
```

Chunks keep waiting.

Memory usage increases.

---

# Real Life Analogy

Imagine a water tank.

```
Pipe

↓

Water

↓

Bucket
```

If

```
Pipe

↓

100 Liters/sec
```

Bucket

```
↓

10 Liters/sec
```

Water overflows.

Backpressure prevents this overflow.

---

# Internal Working

Without control

```
Disk

↓

Chunk

↓

Chunk

↓

Chunk

↓

Chunk

↓

Memory

↓

Memory

↓

Memory

↓

Application
```

Memory keeps growing.

---

With Backpressure

```
Disk

↓

Chunk

↓

Application

↓

Pause Reading

↓

Application Ready

↓

Resume Reading
```

Memory stays stable.

---

# Without Backpressure

```
Fast Producer

↓

Send

↓

Send

↓

Send

↓

Send

↓

Consumer

↓

Still Busy
```

Result

- High RAM usage
- Buffer overflow
- Slow application
- Possible crash

---

# With Backpressure

```
Producer

↓

Chunk

↓

Consumer Busy

↓

Pause

↓

Consumer Ready

↓

Resume
```

No memory overflow.

---

# Why Node.js Needs Backpressure

Imagine

```
Movie

20 GB
```

↓

Browser

```
Slow Internet
```

Without Backpressure

```
Server

↓

20 GB

↓

RAM

↓

Crash
```

With Backpressure

```
Server

↓

64 KB

↓

Browser

↓

Wait

↓

Next 64 KB
```

The server remains stable.

---

# Production Examples

### Video Streaming

```
Netflix

↓

Movie

↓

Browser

↓

Pause / Resume
```

---

### File Copy

```
SSD

↓

Stream

↓

USB Drive
```

USB is slower.

Backpressure controls the flow.

---

### AWS Upload

```
File

↓

Internet

↓

S3
```

Internet speed changes.

Backpressure adjusts automatically.

---

### Database Export

```
Database

↓

Rows

↓

CSV

↓

Disk
```

Writing speed controls reading speed.

---

# Summary

```
Producer Too Fast

↓

Consumer Too Slow

↓

Backpressure
```

Solution

```
Pause Producer

↓

Consumer Catches Up

↓

Resume Producer
```

---

# Key Takeaways

- Backpressure occurs when data is produced faster than it can be consumed.
- Without Backpressure, memory usage can grow rapidly.
- Node.js Streams automatically manage Backpressure.
- This makes Streams suitable for handling large files and high-throughput applications.
- Understanding Backpressure is essential before learning `highWaterMark`.

---

# What's Next?

Now that you understand

**why Backpressure happens**,

the next step is learning

➡️ **HighWaterMark**

because HighWaterMark decides

**when Node.js should pause and resume the producer.**