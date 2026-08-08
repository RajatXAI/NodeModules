# stream.pipeline()

> Learn how to safely connect multiple streams with automatic error handling and cleanup in Node.js.

---

# Table of Contents

- Introduction
- Why pipeline()?
- pipe() vs pipeline()
- Syntax
- Parameters
- Return Value
- Internal Working
- Stream Lifecycle
- Basic Example
- File Copy Example
- Multiple Streams Example
- Automatic Error Handling
- Automatic Cleanup
- Production Use Cases
- Best Practices
- Common Mistakes
- Interview Questions
- Summary
- Related APIs
- Next Chapter

---

# Introduction

`stream.pipeline()` safely connects multiple streams.

Like `pipe()`,

it transfers data automatically.

In addition,

it

- Handles stream errors
- Cleans up resources
- Closes streams automatically when failures occur

It is the recommended API for production applications.

---

# Why pipeline()?

Imagine a file passes through several stages.

```
Read File

↓

Compress

↓

Encrypt

↓

Write File
```

If the compression stream fails,

every other stream should stop.

With

```
pipe()
```

you must manage this yourself.

With

```
pipeline()
```

Node.js performs the cleanup automatically.

---

# pipe() vs pipeline()

| pipe() | pipeline() |
|----------|------------|
| Connects Streams | ✅ |
| Automatic Data Flow | ✅ |
| Automatic Backpressure | ✅ |
| Automatic Error Handling | ❌ |
| Automatic Cleanup | ❌ |
| Production Recommended | ⚠️ Small Cases | ✅ |

---

# Syntax

Callback Version

```js
pipeline(

    source,

    destination,

    callback

);
```

---

Promise Version

```js
await pipeline(

    source,

    destination

);
```

(using `stream/promises`)

---

# Parameters

| Parameter | Description |
|-----------|-------------|
| source | Readable Stream |
| transform | Optional Transform Stream(s) |
| destination | Writable Stream |
| callback | Called when pipeline completes |

---

# Return Value

Callback API

```
undefined
```

Promise API

```
Promise
```

---

# Internal Working

```
Disk

↓

Readable Stream

↓

pipeline()

↓

Writable Stream

↓

Disk
```

If an error occurs

```
Readable

↓

Error

↓

pipeline()

↓

Destroy Streams

↓

Callback / Reject Promise
```

---

# Stream Lifecycle

```
Create Streams

↓

pipeline()

↓

Read Chunk

↓

Write Chunk

↓

Read Chunk

↓

Write Chunk

↓

finish

↓

close
```

If any stream fails

```
Error

↓

Destroy All Streams

↓

Cleanup

↓

Callback
```

---

# Basic Example

```js
const fs = require("fs");
const { pipeline } = require("stream");

const source = fs.createReadStream("input.txt");

const destination = fs.createWriteStream("output.txt");

pipeline(

    source,

    destination,

    (error) => {

        if (error) {

            console.log(error);

            return;

        }

        console.log("Completed");

    }

);
```

---

# File Copy Example

```
movie.mp4

↓

Readable Stream

↓

pipeline()

↓

Writable Stream

↓

movie-copy.mp4
```

Code

```js
const fs = require("fs");
const { pipeline } = require("stream");

pipeline(

    fs.createReadStream("movie.mp4"),

    fs.createWriteStream("movie-copy.mp4"),

    (error) => {

        if (error) {

            console.log(error);

            return;

        }

        console.log("Copy Completed");

    }

);
```

---

# Multiple Streams Example

Suppose a file is compressed before saving.

```
File

↓

Readable Stream

↓

gzip

↓

Writable Stream
```

Code

```js
const fs = require("fs");
const zlib = require("zlib");
const { pipeline } = require("stream");

pipeline(

    fs.createReadStream("movie.mp4"),

    zlib.createGzip(),

    fs.createWriteStream("movie.mp4.gz"),

    (error) => {

        if (error) {

            console.log(error);

            return;

        }

        console.log("Compression Completed");

    }

);
```

---

# Automatic Error Handling

Suppose

```
Compression

↓

Fails
```

`pipeline()`

automatically

```
Destroy Read Stream

↓

Destroy Gzip Stream

↓

Destroy Write Stream

↓

Return Error
```

No manual cleanup required.

---

# Automatic Cleanup

Without

```
pipeline()
```

you may accidentally leave

- Open file descriptors
- Half-written files
- Active streams

With

```
pipeline()
```

Node.js closes everything safely.

---

# Production Use Cases

### File Copy

```
Readable

↓

pipeline()

↓

Writable
```

---

### Compression

```
File

↓

gzip

↓

Destination
```

---

### Encryption

```
Readable

↓

Encrypt

↓

Writable
```

---

### HTTP Download

```
Network

↓

pipeline()

↓

Disk
```

---

### AWS S3 Upload

```
Local File

↓

Transform

↓

Cloud
```

---

# Best Practices

✅ Prefer `pipeline()` over `pipe()` for production applications.

✅ Always handle the callback error or Promise rejection.

✅ Use Transform Streams inside the pipeline instead of manually processing chunks.

---

# Common Mistakes

### Assuming pipeline() Is Faster

Incorrect.

Both APIs transfer data efficiently.

`pipeline()` is safer,

not necessarily faster.

---

### Ignoring Errors

Always handle

```js
error
```

or

```js
catch`.
```

---

### Using pipe() for Long Stream Chains

Instead of

```js
read

.pipe(gzip)

.pipe(encrypt)

.pipe(write)
```

prefer

```js
pipeline(

    read,

    gzip,

    encrypt,

    write,

    callback

);
```

It is easier to manage and safer.

---

# Interview Questions

### Q1

What is the difference between `pipe()` and `pipeline()`?

---

### Q2

Why is `pipeline()` recommended for production?

---

### Q3

Can `pipeline()` connect Transform Streams?

---

### Q4

What happens if one stream inside the pipeline fails?

---

### Q5

Does `pipeline()` automatically clean up resources?

---

# Summary

| Feature | Description |
|----------|-------------|
| Connects Multiple Streams | ✅ |
| Automatic Backpressure | ✅ |
| Automatic Error Handling | ✅ |
| Automatic Cleanup | ✅ |
| Production Ready | ✅ |

---

# Related APIs

- `stream.pipe()`
- `fs.createReadStream()`
- `fs.createWriteStream()`
- `stream/promises`

---

# Key Takeaways

- `pipeline()` is the recommended way to connect streams in production.
- It automatically handles errors and resource cleanup.
- It works with Readable, Writable, and Transform Streams.
- It simplifies complex stream chains.
- It helps prevent resource leaks and incomplete output files.

---

# Next Chapter

➡️ **HighWaterMark**