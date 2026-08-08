# stream.pipe()

> Learn how to connect Readable Streams and Writable Streams using `pipe()` in Node.js.

---

# Table of Contents

- Introduction
- Why pipe()?
- Manual Streaming vs pipe()
- Syntax
- Internal Working
- Stream Lifecycle
- Basic Example
- File Copy Example
- HTTP Example
- How pipe() Handles Backpressure
- Events
- Error Handling
- Production Use Cases
- Best Practices
- Common Mistakes
- Interview Questions
- Summary
- Related APIs
- Next Chapter

---

# Introduction

`pipe()` connects a **Readable Stream** to a **Writable Stream**.

Instead of manually reading chunks and writing them,

Node.js automatically transfers data.

Flow

```
Readable Stream

↓

pipe()

↓

Writable Stream
```

---

# Why pipe()?

Without `pipe()`,

you have to

- Read every chunk
- Write every chunk
- End the writable stream
- Handle flow manually

With `pipe()`,

Node.js does everything automatically.

---

# Manual Streaming vs pipe()

## Without pipe()

```
Readable Stream

↓

data Event

↓

write()

↓

data Event

↓

write()

↓

end()

↓

finish()
```

Code

```js
readStream.on("data", (chunk) => {

    writeStream.write(chunk);

});

readStream.on("end", () => {

    writeStream.end();

});
```

Lots of manual work.

---

## With pipe()

```
Readable Stream

↓

pipe()

↓

Writable Stream
```

Code

```js
readStream.pipe(writeStream);
```

Done.

---

# Syntax

```js
readableStream.pipe(

    writableStream

);
```

Returns

```js
Writable Stream
```

This allows multiple `pipe()` calls (stream chaining).

---

# Internal Working

```
Disk

↓

Readable Stream

↓

Chunk

↓

pipe()

↓

Writable Stream

↓

Disk
```

Each chunk automatically moves from the source to the destination.

---

# Stream Lifecycle

```
Create Read Stream

↓

Create Write Stream

↓

pipe()

↓

Read Chunk

↓

Write Chunk

↓

Read Chunk

↓

Write Chunk

↓

Read Ends

↓

Write Ends

↓

finish

↓

close
```

---

# Basic Example

```js
const fs = require("fs");

const readStream = fs.createReadStream(

    "input.txt"

);

const writeStream = fs.createWriteStream(

    "output.txt"

);

readStream.pipe(writeStream);

writeStream.on(

    "finish",

    () => {

        console.log("Copy Completed");

    }

);
```

---

# File Copy Example

Project

```
project/

├── movie.mp4

└── movie-copy.mp4
```

Code

```js
const fs = require("fs");

const source = fs.createReadStream(

    "movie.mp4"

);

const destination = fs.createWriteStream(

    "movie-copy.mp4"

);

source.pipe(destination);
```

Flow

```
movie.mp4

↓

Readable Stream

↓

pipe()

↓

Writable Stream

↓

movie-copy.mp4
```

No manual chunk handling required.

---

# HTTP Example

Suppose an Express server needs to send a large video.

```js
app.get("/video", (req, res) => {

    const stream = fs.createReadStream(

        "movie.mp4"

    );

    stream.pipe(res);

});
```

Flow

```
Movie

↓

Readable Stream

↓

pipe()

↓

HTTP Response

↓

Browser
```

The browser starts receiving data immediately.

---

# How pipe() Handles Backpressure

Suppose

```
Reader

↓

Fast
```

```
Writer

↓

Slow
```

Without `pipe()`

```
Reader

↓

Reader Keeps Sending

↓

Writer Buffer Full

↓

Memory Increases
```

With `pipe()`

```
Reader

↓

Writer Buffer Full

↓

Reader Pauses

↓

Writer Continues

↓

Reader Resumes
```

This automatic coordination is called **Backpressure Handling**.

You don't have to write this logic yourself.

---

# Events

Readable Stream

```
data

↓

end

↓

close
```

Writable Stream

```
finish

↓

close
```

Error

```
error
```

can occur on either stream.

---

# Error Handling

```js
readStream.on(

    "error",

    console.error

);

writeStream.on(

    "error",

    console.error

);
```

**Important:**

`pipe()` does **not** automatically forward all errors between streams.

You should listen for errors on both streams, or use `pipeline()` for safer error handling.

---

# Production Use Cases

### Copy Large Files

```
Source File

↓

pipe()

↓

Destination File
```

---

### Video Streaming

```
Movie

↓

pipe()

↓

Browser
```

---

### Image Upload

```
Client

↓

pipe()

↓

Storage
```

---

### AWS S3 Upload

```
Local File

↓

pipe()

↓

Cloud
```

---

### Log Processing

```
Log

↓

pipe()

↓

Compressor
```

---

# Best Practices

✅ Prefer `pipe()` over manual chunk handling.

✅ Handle errors on both streams.

✅ Use `pipeline()` when multiple streams are involved.

---

# Common Mistakes

### Manual write() with pipe()

Incorrect

```js
readStream.pipe(writeStream);

readStream.on("data", (chunk) => {

    writeStream.write(chunk);

});
```

Choose **either**

- manual streaming

or

- `pipe()`

Not both.

---

### Ignoring Errors

Always listen for

```
error
```

events.

---

### Assuming pipe() Copies Entire File Into Memory

Incorrect.

It transfers one chunk at a time.

---

### Thinking pipe() Is Only for Files

`pipe()` works with any compatible streams.

Examples

- HTTP
- TCP
- Compression
- Crypto
- File Streams

---

# Interview Questions

### Q1

What does `pipe()` do?

---

### Q2

Why is `pipe()` preferred over manual chunk handling?

---

### Q3

Does `pipe()` automatically handle backpressure?

---

### Q4

Does `pipe()` load the whole file into memory?

---

### Q5

Why is `pipeline()` considered safer than `pipe()`?

---

# Summary

| Feature | Description |
|----------|-------------|
| Connects Streams | ✅ |
| Automatic Chunk Transfer | ✅ |
| Handles Backpressure | ✅ |
| Manual write() Needed | ❌ |
| Supports Chaining | ✅ |

---

# Related APIs

- `fs.createReadStream()`
- `fs.createWriteStream()`
- `stream.pipeline()`

---

# Key Takeaways

- `pipe()` connects a Readable Stream to a Writable Stream.
- It automatically transfers data chunk by chunk.
- It automatically manages flow control and backpressure.
- It does **not** automatically handle every error scenario.
- It is widely used for file copying, downloads, uploads, and streaming responses.

---

# Next Chapter

➡️ **stream.pipeline()**