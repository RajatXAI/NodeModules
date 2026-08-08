# Stream Events

> Learn the most important events emitted by Node.js Streams and understand the complete lifecycle of a stream.

---

# Table of Contents

- Introduction
- Why Stream Events?
- Stream Lifecycle
- data Event
- end Event
- error Event
- finish Event
- close Event
- drain Event
- Complete Event Flow
- Production Use Cases
- Best Practices
- Interview Questions
- Summary
- What's Next?

---

# Introduction

Streams are **Event Emitters**.

Whenever something important happens,

a stream emits an event.

Your application can listen to these events.

Example

```
Data Arrived

↓

Emit

↓

data Event
```

---

# Why Stream Events?

Imagine downloading a file.

Questions

```
When did data arrive?

↓

When did download finish?

↓

Did an error occur?

↓

Was the stream closed?
```

All these are answered using stream events.

---

# Stream Lifecycle

A typical Readable Stream follows this lifecycle.

```
Create Stream

↓

Open File

↓

Read Chunk

↓

data

↓

Read Chunk

↓

data

↓

Read Chunk

↓

data

↓

end

↓

close
```

If something goes wrong

```
error

↓

close
```

---

# data Event

The

```text
data
```

event is emitted whenever a new chunk of data becomes available.

Example

```js
const fs = require("fs");

const stream = fs.createReadStream("notes.txt");

stream.on("data", (chunk) => {

    console.log(chunk);

});
```

Flow

```
Disk

↓

Chunk

↓

data

↓

Chunk

↓

data

↓

Chunk

↓

data
```

This is the most frequently used stream event.

---

# end Event

The

```text
end
```

event is emitted when there is no more data to read.

Example

```js
stream.on("end", () => {

    console.log("Reading Completed");

});
```

Flow

```
Chunk

↓

Chunk

↓

Chunk

↓

No More Data

↓

end
```

Only Readable Streams emit `end`.

---

# error Event

The

```text
error
```

event is emitted when something goes wrong.

Examples

- File missing
- Permission denied
- Disk error

Example

```js
stream.on("error", (error) => {

    console.log(error.message);

});
```

Always listen for the `error` event.

Ignoring it can crash your application.

---

# finish Event

The

```text
finish
```

event belongs to Writable Streams.

It is emitted after all data has been written successfully.

Example

```js
writeStream.on("finish", () => {

    console.log("Writing Finished");

});
```

Flow

```
Write Chunk

↓

Write Chunk

↓

Write Chunk

↓

finish
```

Only Writable Streams emit `finish`.

---

# close Event

The

```text
close
```

event is emitted when the stream's underlying resource is closed.

Example

```js
stream.on("close", () => {

    console.log("Stream Closed");

});
```

The stream cannot be used after this event.

---

# drain Event

The

```text
drain
```

event belongs to Writable Streams.

It indicates that the stream is ready to receive more data after its internal buffer was full.

Flow

```
Write

↓

Buffer Full

↓

Pause

↓

drain

↓

Continue Writing
```

This event is very important for understanding **Backpressure**.

---

# Complete Event Flow

## Readable Stream

```
Create Stream

↓

data

↓

data

↓

data

↓

end

↓

close
```

---

If an error occurs

```
Create Stream

↓

error

↓

close
```

---

## Writable Stream

```
Create Stream

↓

Write

↓

Write

↓

finish

↓

close
```

---

If an error occurs

```
Create Stream

↓

error

↓

close
```

---

# Production Use Cases

### File Download

```
data

↓

Send To Browser

↓

end

↓

Download Complete
```

---

### Video Streaming

```
data

↓

Play Video

↓

end
```

---

### File Upload

```
Write

↓

finish

↓

Upload Complete
```

---

### Error Monitoring

```
error

↓

Log

↓

Retry
```

---

# Best Practices

✅ Always handle the `error` event.

✅ Use `end` only with Readable Streams.

✅ Use `finish` only with Writable Streams.

✅ Close resources properly.

---

# Common Mistakes

### Using end on Writable Streams

Incorrect

```js
writeStream.on("end", ...);
```

Use

```js
writeStream.on("finish", ...);
```

---

### Ignoring error

```js
stream.on("data", ...);
```

Without

```js
stream.on("error", ...);
```

your application may terminate unexpectedly.

---

### Confusing close and end

`end`

↓

No more data.

`close`

↓

Underlying resource has been closed.

These are different events.

---

# Interview Questions

### Q1

Why are Streams called Event Emitters?

---

### Q2

Which event is emitted when new data arrives?

---

### Q3

What is the difference between `end` and `finish`?

---

### Q4

When is the `drain` event emitted?

---

### Q5

Why should every stream listen for the `error` event?

---

# Summary

| Event | Stream Type | Purpose |
|--------|-------------|---------|
| data | Readable | New chunk received |
| end | Readable | Reading completed |
| finish | Writable | Writing completed |
| error | Both | Error occurred |
| close | Both | Resource closed |
| drain | Writable | Buffer available again |

---

# Key Takeaways

- Streams are Event Emitters.
- Readable streams mainly emit `data` and `end`.
- Writable streams mainly emit `finish` and `drain`.
- Both stream types can emit `error` and `close`.
- Proper event handling is essential for building reliable applications.

---

# What's Next?

Now you know

- ✅ What Streams are
- ✅ Buffer vs Stream
- ✅ Stream Types
- ✅ Stream Events

You are now ready to learn the first Stream API.

➡️ **Next Chapter: `fs.createReadStream()`**