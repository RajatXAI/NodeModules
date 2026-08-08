# Stream Modes (Flowing Mode vs Paused Mode)

> Learn how Readable Streams work internally and understand the difference between Flowing Mode and Paused Mode.

---

# Table of Contents

- Introduction
- Why Stream Modes Exist?
- Flowing Mode
- Paused Mode
- How a Stream Changes Mode
- Flowing vs Paused
- Internal Working
- Real World Examples
- Production Use Cases
- Best Practices
- Common Mistakes
- Interview Questions
- Summary
- What's Next?

---

# Introduction

A Readable Stream works in two modes.

```
Paused Mode

↓

Flowing Mode
```

Every Readable Stream is always in one of these two states.

Understanding these modes explains

- Why `data` events start automatically.
- Why `.read()` sometimes returns data.
- How `pipe()` works internally.

---

# Why Stream Modes Exist?

Imagine a water tap.

Sometimes

You want water to flow automatically.

```
Tap Open

↓

Water Keeps Flowing
```

Sometimes

You want to collect water only when needed.

```
Open Tap

↓

Fill Glass

↓

Close Tap
```

Streams work exactly like this.

---

# Flowing Mode

In Flowing Mode,

the stream automatically pushes data to your application.

As soon as a chunk is available,

Node.js emits

```
data
```

events.

Example

```js
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

data Event

↓

Chunk

↓

data Event

↓

Chunk

↓

data Event
```

You don't need to ask for data.

The stream sends it automatically.

---

# Paused Mode

In Paused Mode,

the stream waits.

It does **not** automatically emit `data` events.

Your application must request data manually.

Example

```js
const chunk = stream.read();
```

Flow

```
Disk

↓

Wait

↓

Application Calls read()

↓

Return Chunk
```

The stream stays idle until you ask for more data.

---

# How a Stream Changes Mode

When a Readable Stream is created,

it starts in **Paused Mode**.

```
Create Stream

↓

Paused Mode
```

If you attach a `data` event listener,

the stream automatically switches to **Flowing Mode**.

```js
stream.on("data", ...);
```

Flow

```
Paused

↓

Add data Listener

↓

Flowing
```

---

# Flowing vs Paused

| Flowing Mode | Paused Mode |
|--------------|-------------|
| Data arrives automatically | Application requests data |
| Uses `data` event | Uses `.read()` |
| Continuous flow | Manual control |
| Easier to use | More control |

---

# Internal Working

## Flowing Mode

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
```

---

## Paused Mode

```
Create Stream

↓

Wait

↓

read()

↓

Chunk

↓

read()

↓

Chunk

↓

end
```

---

# Real World Examples

## Flowing Mode

Watching Netflix

```
Download

↓

Play

↓

Download

↓

Play
```

The video keeps arriving automatically.

---

## Paused Mode

Reading a book.

```
Read One Page

↓

Think

↓

Read Next Page
```

You decide when to continue.

---

# Production Use Cases

### Flowing Mode

- Video streaming
- File downloads
- HTTP responses
- Audio streaming

---

### Paused Mode

- CSV parser
- Custom file parser
- Binary protocol parser
- Data validation

---

# Best Practices

✅ Use Flowing Mode for simple streaming.

✅ Use Paused Mode when you need complete control.

✅ Prefer `pipe()` whenever possible.

---

# Common Mistakes

### Expecting data Without a Listener

```js
const stream = fs.createReadStream("file.txt");
```

No data is emitted until you

- attach a `data` listener,
- call `.read()`, or
- pipe the stream somewhere.

---

### Mixing Both Modes

Avoid mixing

```js
stream.on("data");
```

and

```js
stream.read();
```

unless you understand exactly how the stream state changes.

---

# Interview Questions

### Q1

How many modes does a Readable Stream have?

---

### Q2

Which mode emits `data` events automatically?

---

### Q3

Which mode uses `.read()`?

---

### Q4

What happens when you attach a `data` listener?

---

### Q5

Does every Readable Stream start in Flowing Mode?

---

# Summary

| Flowing Mode | Paused Mode |
|--------------|-------------|
| Automatic | Manual |
| Uses `data` | Uses `.read()` |
| Easier | More Control |

---

# Key Takeaways

- Readable Streams have two modes: Flowing and Paused.
- Streams start in Paused Mode.
- Adding a `data` listener switches the stream to Flowing Mode.
- `.read()` is used in Paused Mode.
- `pipe()` also switches a Readable Stream into Flowing Mode because it starts consuming data.

---

# What's Next?

Now you understand

✅ Streams

✅ Buffer vs Stream

✅ Types of Streams

✅ Stream Events

✅ Stream Modes

You are now fully prepared for the first real Stream API.

➡️ **Next Chapter: `fs.createReadStream()`**