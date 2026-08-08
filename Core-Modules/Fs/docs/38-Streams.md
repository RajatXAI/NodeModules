# Streams in Node.js - Introduction

> Learn what Streams are, why they exist, and why they are one of the most important concepts in Node.js.

---

# Table of Contents

- What is a Stream?
- Why Streams Exist?
- The Problem with readFile()
- Stream vs readFile()
- Real Life Analogy
- Types of Streams
- Stream Lifecycle
- Why Streams Are Faster
- Production Use Cases
- Summary
- What's Next?

---

# What is a Stream?

A Stream is a way to process data **piece by piece (chunk by chunk)** instead of loading the entire data into memory.

Instead of saying

> "Give me the whole file."

Streams say

> "Give me a small part."

↓

Process it.

↓

Give me the next part.

↓

Process it.

This continues until the entire file is processed.

---

# Why Streams Exist?

Imagine a file

```
movie.mp4

Size

5 GB
```

If you use

```js
fs.readFile()
```

Node.js first loads the entire

```
5 GB
```

into RAM.

Only after loading everything,

your program starts processing.

Problems

- Huge memory usage
- Slow startup
- Memory crashes
- Poor scalability

Streams solve this problem.

---

# The Problem with readFile()

Suppose

```
movie.mp4

5 GB
```

Using

```js
fs.readFile()
```

Flow

```
Disk

↓

Load 5 GB into RAM

↓

Process

↓

Send Response
```

Memory Usage

```
██████████████████████████

5 GB
```

---

# Stream Solution

Using Streams

```
Disk

↓

64 KB

↓

Process

↓

Send

↓

Next 64 KB

↓

Process

↓

Send
```

Memory Usage

```
██

Only one chunk
```

This is why streams are memory efficient.

---

# Stream vs readFile()

## readFile()

```
Entire File

↓

Memory

↓

Process

↓

Finish
```

---

## Stream

```
Chunk

↓

Process

↓

Chunk

↓

Process

↓

Chunk

↓

Process
```

---

# Real Life Analogy

Imagine you want to drink

```
20 Liters

of water.
```

Would you

```
Drink

20 Liters

At Once?
```

Impossible.

Instead

```
Glass

↓

Drink

↓

Next Glass

↓

Drink
```

Streams work exactly like this.

---

# Another Analogy

Imagine watching a movie on YouTube.

Does YouTube download

```
2 GB
```

before playing?

No.

It downloads

```
Small Parts

↓

Play

↓

Download More

↓

Play
```

Video Streaming is built on this concept.

---

# Types of Streams

Node.js provides four stream types.

```
Readable Stream

↓

Read Data
```

Examples

- File Reading
- HTTP Request
- Process.stdin

---

```
Writable Stream

↓

Write Data
```

Examples

- File Writing
- HTTP Response
- Process.stdout

---

```
Duplex Stream

↓

Read + Write
```

Examples

- TCP Socket
- WebSocket

---

```
Transform Stream

↓

Read

↓

Modify

↓

Write
```

Examples

- Compression
- Encryption
- Image Processing

---

# Stream Lifecycle

```
Create Stream

↓

Receive Chunk

↓

Process Chunk

↓

Receive Next Chunk

↓

Process

↓

End

↓

Close
```

---

# Why Streams Are Faster

Streams start working immediately.

Example

```
10 GB File

↓

First Chunk Arrives

↓

Immediately Process

↓

Immediately Send

↓

No Waiting
```

With

```
readFile()
```

Node.js waits for

```
Entire 10 GB
```

before starting.

---

# Production Use Cases

### Video Streaming

```
Netflix

↓

Video Chunks

↓

Browser
```

---

### File Downloads

```
Server

↓

Chunks

↓

Browser
```

---

### Image Uploads

```
Client

↓

Chunks

↓

Server
```

---

### AWS S3 Upload

```
Local File

↓

Stream

↓

Cloud Storage
```

---

### Database Export

```
Database

↓

Rows

↓

CSV

↓

Browser
```

---

# Summary

| readFile() | Stream |
|------------|---------|
| Reads Entire File | Reads Chunk by Chunk |
| High Memory Usage | Low Memory Usage |
| Waits Before Processing | Starts Immediately |
| Slow for Large Files | Fast for Large Files |

---

# Key Takeaways

- Streams process data chunk by chunk.
- They are memory efficient.
- They are ideal for large files.
- They start processing immediately.
- Most production Node.js applications use Streams for large data.

---

# What's Next?

Next we will learn

➡️ **Buffer vs Stream**

After that

```
Readable Streams

↓

createReadStream()

↓

Writable Streams

↓

createWriteStream()

↓

pipe()

↓

pipeline()

↓

Backpressure

↓

HighWaterMark
```