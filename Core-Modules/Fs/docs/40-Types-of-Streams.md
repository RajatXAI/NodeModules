# Types of Streams

> Learn the four types of Streams in Node.js and understand where each one is used in real-world backend applications.

---

# Table of Contents

- Why Different Types of Streams?
- Overview
- Readable Stream
- Writable Stream
- Duplex Stream
- Transform Stream
- Data Flow Diagram
- Real World Examples
- Production Examples
- Comparison Table
- Interview Questions
- Summary
- What's Next?

---

# Why Different Types of Streams?

Imagine you are working with water pipes.

Some pipes

```
Only Supply Water
```

Some pipes

```
Only Collect Water
```

Some pipes

```
Can Do Both
```

Streams work in the same way.

Some streams only read.

Some only write.

Some do both.

Some even modify data while it flows.

---

# Overview

Node.js has four stream types.

```
Readable Stream

↓

Receive Data
```

---

```
Writable Stream

↓

Send Data
```

---

```
Duplex Stream

↓

Receive Data

+

Send Data
```

---

```
Transform Stream

↓

Receive Data

↓

Modify Data

↓

Send Data
```

---

# Readable Stream

A Readable Stream is used to read data.

Data always flows

```
Source

↓

Application
```

Examples

```
File

↓

Application
```

```
HTTP Request

↓

Express Server
```

```
Keyboard

↓

Node.js
```

Common Examples

- createReadStream()
- process.stdin
- Incoming HTTP Request
- TCP Socket (Readable Side)

---

# Writable Stream

A Writable Stream is used to write data.

Flow

```
Application

↓

Destination
```

Examples

```
Application

↓

File
```

```
Application

↓

Browser
```

```
Application

↓

Console
```

Common Examples

- createWriteStream()
- process.stdout
- HTTP Response
- File Writer

---

# Duplex Stream

A Duplex Stream can both

- Read
- Write

at the same time.

Flow

```
Receive

↓

Application

↓

Send
```

Examples

```
TCP Socket

↓

Application

↓

TCP Socket
```

Common Examples

- TCP Socket
- WebSocket
- SSH Connection

Think of a phone call.

Both people

Speak

and

Listen

simultaneously.

---

# Transform Stream

A Transform Stream is a special type of Duplex Stream.

It can

```
Read

↓

Modify

↓

Write
```

The output is different from the input.

Example

```
hello

↓

UPPERCASE

↓

HELLO
```

Examples

- Compression (gzip)
- Encryption
- Decryption
- Image Resize
- CSV Parser

---

# Data Flow Diagram

## Readable

```
Disk

↓

Application
```

---

## Writable

```
Application

↓

Disk
```

---

## Duplex

```
Client

↓

Server

↓

Client
```

---

## Transform

```
Input

↓

Modify

↓

Output
```

---

# Real World Examples

### Reading a Movie

```
Movie File

↓

createReadStream()

↓

Application
```

Readable Stream

---

### Saving Logs

```
Application

↓

createWriteStream()

↓

logs.txt
```

Writable Stream

---

### Chat Application

```
User A

↓

Server

↓

User B

↑

↓

Both Directions
```

Duplex Stream

---

### Compressing Files

```
movie.mp4

↓

gzip

↓

movie.mp4.gz
```

Transform Stream

---

# Production Examples

## Readable

```
AWS S3 Download

↓

Application
```

---

## Writable

```
Application

↓

S3 Upload
```

---

## Duplex

```
WebSocket Chat

↓

Send + Receive
```

---

## Transform

```
Image Upload

↓

Resize

↓

Store
```

---

# Comparison Table

| Stream | Read | Write | Modify Data |
|----------|------|-------|-------------|
| Readable | ✅ | ❌ | ❌ |
| Writable | ❌ | ✅ | ❌ |
| Duplex | ✅ | ✅ | ❌ |
| Transform | ✅ | ✅ | ✅ |

---

# Interview Questions

### Q1

How many types of Streams exist in Node.js?

---

### Q2

What is the difference between Duplex and Transform Streams?

---

### Q3

Can a Writable Stream read data?

---

### Q4

Can a Readable Stream write data?

---

### Q5

Why is Transform a special type of Duplex Stream?

---

# Summary

| Stream | Purpose |
|----------|----------|
| Readable | Read data |
| Writable | Write data |
| Duplex | Read and write |
| Transform | Read, modify, write |

---

# Key Takeaways

- Node.js provides four stream types.
- Readable streams receive data.
- Writable streams send data.
- Duplex streams support two-way communication.
- Transform streams modify data while it is flowing.
- Transform streams inherit the capabilities of Duplex streams.

---

# What's Next?

Now that you understand the different stream types,

we are ready to learn the first and most commonly used Stream API.

➡️ **Next Chapter: `fs.createReadStream()`**