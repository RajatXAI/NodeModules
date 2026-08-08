# HighWaterMark

> Learn what `highWaterMark` is, how it controls buffering, and how it works with Backpressure in Node.js Streams.

---

# Table of Contents

- Introduction
- Why HighWaterMark Exists?
- What is HighWaterMark?
- Is HighWaterMark Equal to Chunk Size?
- Internal Buffer
- Internal Working
- Backpressure Relationship
- Readable Stream Example
- Writable Stream Example
- Memory Flow
- Default Values
- Production Use Cases
- Best Practices
- Common Mistakes
- Interview Questions
- Summary
- What's Next?

---

# Introduction

Every Stream has an internal buffer.

Node.js does **not**

```
Read

↓

Immediately

↓

Application
```

Instead,

it temporarily stores data inside an internal buffer.

The size of that buffer is controlled by

```
highWaterMark
```

---

# Why HighWaterMark Exists?

Suppose

```
Disk

↓

Very Fast
```

Application

```
↓

Slow
```

Without any limit,

the internal buffer would keep growing.

```
Chunk

↓

Chunk

↓

Chunk

↓

Chunk

↓

Chunk

↓

...
```

Eventually,

memory usage would become too high.

To avoid this,

Node.js uses

```
highWaterMark
```

---

# What is HighWaterMark?

HighWaterMark defines

> **the maximum amount of data Node.js tries to keep in the stream's internal buffer before applying backpressure.**

When the internal buffer reaches approximately this limit,

Node.js starts slowing or pausing the producer until the consumer catches up.

---

# Is HighWaterMark Equal to Chunk Size?

**No.**

This is the biggest misconception.

Incorrect

```
HighWaterMark

=

Exact Chunk Size
```

Correct

```
HighWaterMark

=

Maximum Buffer Size
```

A chunk may be

```
64 KB
```

or

```
20 KB
```

or

```
5 KB
```

depending on the operating system,

the stream implementation,

and how data becomes available.

HighWaterMark is a **buffer threshold**, not a guarantee.

---

# Internal Buffer

```
Disk

↓

Chunk

↓

Internal Buffer

↓

Application
```

The application reads data

from the internal buffer,

not directly from the disk.

---

# Internal Working

```
Disk

↓

Read Data

↓

Internal Buffer

↓

Application

↓

Buffer Becomes Empty

↓

Read Again
```

This cycle repeats until the stream ends.

---

# Backpressure Relationship

Suppose

```
highWaterMark

64 KB
```

Flow

```
Disk

↓

Buffer

64 KB

↓

Application Busy

↓

Pause Reading

↓

Application Consumes Data

↓

Resume Reading
```

Backpressure starts when the buffer reaches the configured threshold.

---

# Readable Stream Example

```js
const fs = require("fs");

const stream = fs.createReadStream(

    "movie.mp4",

    {

        highWaterMark: 1024

    }

);
```

Here

```
1024 Bytes

↓

1 KB
```

Node.js will try to keep about **1 KB** of unread data in the internal buffer before reading more.

It does **not** guarantee that every emitted chunk will be exactly 1 KB.

---

# Writable Stream Example

```js
const fs = require("fs");

const stream = fs.createWriteStream(

    "output.txt",

    {

        highWaterMark: 2048

    }

);
```

Here

```
2 KB
```

is the approximate buffer limit.

If writes become faster than the operating system can flush them,

Node.js applies backpressure.

---

# Memory Flow

Without HighWaterMark

```
Producer

↓

██████████████████████

Unlimited Buffer

↓

Consumer
```

Memory keeps growing.

---

With HighWaterMark

```
Producer

↓

████

Buffer Limit

↓

Consumer

↓

Pause Producer

↓

Resume Later
```

Memory remains controlled.

---

# Default Values

For file streams

| Stream | Typical Default |
|----------|-----------------:|
| `createReadStream()` | 64 KB |
| `createWriteStream()` | 16 KB |

Different stream implementations may use different defaults.

---

# Production Use Cases

### Video Streaming

```
Movie

↓

Buffer

↓

Browser
```

---

### Large CSV Import

```
CSV

↓

Buffer

↓

Parser
```

---

### AWS Upload

```
Local File

↓

Buffer

↓

Internet
```

---

### Log Processing

```
Large Log

↓

Buffer

↓

Application
```

---

# Best Practices

✅ Leave the default value unless you have measured a real performance issue.

✅ Benchmark before changing `highWaterMark`.

✅ Understand your workload before increasing the buffer size.

---

# Common Mistakes

### Thinking HighWaterMark Is Exact Chunk Size

Incorrect.

It is a **buffer threshold**.

---

### Setting Extremely Large Values

```js
highWaterMark:

100 * 1024 * 1024
```

(100 MB)

This increases memory usage.

Bigger is not always better.

---

### Setting Extremely Small Values

```js
highWaterMark:

1
```

This causes many more read/write operations and usually reduces performance.

---

### Changing HighWaterMark Without Benchmarking

The default values are chosen to work well for most applications.

Only change them when you have evidence that another value is beneficial.

---

# Interview Questions

### Q1

What is `highWaterMark`?

---

### Q2

Is `highWaterMark` the same as chunk size?

---

### Q3

Why does Node.js use `highWaterMark`?

---

### Q4

What happens when the internal buffer reaches the highWaterMark?

---

### Q5

Should you always increase `highWaterMark` for better performance?

---

# Summary

| Feature | Description |
|----------|-------------|
| Controls Internal Buffer | ✅ |
| Exact Chunk Size | ❌ |
| Helps Backpressure | ✅ |
| Prevents Unlimited Memory Growth | ✅ |

---

# Key Takeaways

- Every stream has an internal buffer.
- `highWaterMark` controls the approximate maximum amount of buffered data before backpressure is applied.
- It is **not** the exact size of every emitted chunk.
- Larger values increase memory usage.
- The default values are suitable for most applications.

---

# What's Next?

Now you understand

✅ Streams

✅ Backpressure

✅ HighWaterMark

The final missing concept is

➡️ **Backpressure Handling (`write()` Return Value & `drain` Event)**

This is where you'll learn how Node.js actually pauses and resumes data flow internally.