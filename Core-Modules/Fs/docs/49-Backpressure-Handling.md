# Backpressure Handling

> Learn how Node.js Streams automatically pause and resume data flow using the `write()` return value and the `drain` event.

---

# Table of Contents

- Introduction
- Why Backpressure Handling?
- How write() Works
- write() Return Value
- What Happens When write() Returns true?
- What Happens When write() Returns false?
- The drain Event
- Complete Flow
- Internal Working
- Manual Backpressure Handling
- How pipe() Handles Backpressure
- Production Example
- Best Practices
- Common Mistakes
- Interview Questions
- Summary
- What's Next?

---

# Introduction

Backpressure is not magic.

Node.js controls it using only two things.

```
write()

↓

Return Value

↓

drain Event
```

Everything else

- pipe()
- pipeline()

is built on top of these two concepts.

---

# Why Backpressure Handling?

Suppose

```
Readable Stream

↓

100 MB/sec
```

Writable Stream

```
↓

10 MB/sec
```

Without control,

the writable stream's internal buffer would keep growing.

Node.js prevents this automatically.

---

# How write() Works

Whenever you write data,

you call

```js
stream.write(chunk);
```

Example

```js
const canContinue = stream.write(chunk);
```

Notice

```
write()

↓

returns

↓

true

or

false
```

This return value is extremely important.

---

# write() Return Value

`write()` returns

```js
true
```

when the writable stream's internal buffer still has capacity.

It returns

```js
false
```

when the internal buffer has reached or exceeded the configured `highWaterMark`.

---

# When write() Returns true

Flow

```
Readable

↓

Chunk

↓

write()

↓

true

↓

Continue Reading
```

Everything continues normally.

---

# When write() Returns false

Flow

```
Readable

↓

Chunk

↓

write()

↓

false

↓

Pause Reading
```

This means

```
Writable Buffer

↓

Full
```

The producer should stop sending more data.

---

# The drain Event

Eventually,

the writable stream writes buffered data to the destination.

Its internal buffer becomes available again.

Node.js emits

```
drain
```

Flow

```
Buffer Full

↓

Write To Disk

↓

Buffer Empty

↓

drain

↓

Resume Reading
```

---

# Complete Flow

```
Readable Stream

↓

Read Chunk

↓

write()

↓

true ?

──────────────

Yes

↓

Read Next Chunk

──────────────

No

↓

Pause Readable Stream

↓

Wait

↓

drain Event

↓

Resume Readable Stream
```

This cycle repeats until all data is transferred.

---

# Internal Working

```
Disk

↓

Readable Stream

↓

Chunk

↓

Writable Buffer

↓

Disk
```

If

```
Writable Buffer

↓

Full
```

Node.js pauses the Readable Stream.

When

```
Buffer

↓

Available
```

Node.js resumes it.

---

# Manual Backpressure Handling

Example

```js
const fs = require("fs");

const readStream = fs.createReadStream("input.txt");

const writeStream = fs.createWriteStream("output.txt");

readStream.on("data", (chunk) => {

    const canContinue = writeStream.write(chunk);

    if (!canContinue) {

        readStream.pause();

    }

});

writeStream.on("drain", () => {

    readStream.resume();

});

readStream.on("end", () => {

    writeStream.end();

});
```

Flow

```
Read

↓

Write

↓

Buffer Full

↓

Pause

↓

drain

↓

Resume
```

This is how manual backpressure handling works.

---

# How pipe() Handles Backpressure

When using

```js
readStream.pipe(writeStream);
```

Node.js automatically performs

```
write()

↓

Check Return Value

↓

Pause()

↓

drain

↓

Resume()
```

You never have to write this logic yourself.

---

# Production Example

Suppose

```
20 GB

Video
```

↓

USB Drive

The USB drive is much slower than the SSD.

Flow

```
SSD

↓

Readable Stream

↓

Writable Stream

↓

USB
```

When the USB becomes busy,

Node.js pauses reading automatically.

When the USB catches up,

reading resumes.

Memory usage stays stable.

---

# Best Practices

✅ Let `pipe()` or `pipeline()` handle backpressure whenever possible.

✅ If you manually call `write()`, always check its return value.

✅ Listen for the `drain` event before resuming writes.

---

# Common Mistakes

### Ignoring write() Return Value

Incorrect

```js
stream.write(chunk);

stream.write(chunk);

stream.write(chunk);

stream.write(chunk);
```

This can overload the writable stream's internal buffer.

---

### Forgetting drain

If you pause the producer,

you must resume it after

```
drain
```

Otherwise,

the stream remains paused forever.

---

### Replacing pipe() Without Handling Backpressure

If you manually copy data between streams,

you are responsible for pausing and resuming correctly.

---

# Interview Questions

### Q1

Why does `write()` return `true` or `false`?

---

### Q2

What does `false` indicate?

---

### Q3

When is the `drain` event emitted?

---

### Q4

How does `pipe()` handle backpressure?

---

### Q5

What happens if you ignore the return value of `write()`?

---

# Summary

```
write()

↓

true

↓

Continue

--------------------

write()

↓

false

↓

Pause

↓

drain

↓

Resume
```

---

# Key Takeaways

- `write()` returns `true` when the writable stream can accept more data.
- `write()` returns `false` when its internal buffer reaches the highWaterMark threshold.
- The `drain` event tells you it is safe to continue writing.
- `pipe()` automatically handles pause and resume logic.
- Proper backpressure handling keeps memory usage stable and prevents overwhelming slower destinations.

---

# What's Next?

Congratulations! 🎉

You have now completed the **complete Streams module foundation**.

The next step is applying these concepts in real projects.

➡️ **Mini Projects**
- Large File Copier
- Log File Analyzer
- CSV Processor
- Video Streaming Server
- File Upload Service