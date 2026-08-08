# Synchronous vs Asynchronous File Operations

> Understand how Node.js executes file operations and when to use synchronous or asynchronous APIs.

---

# Table of Contents

- Introduction
- Why Does Node.js Provide Two APIs?
- Synchronous File Operations
- Asynchronous File Operations
- Difference Between Sync and Async
- Internal Working
- When to Use Sync APIs
- When to Use Async APIs
- Performance Comparison
- Best Practices
- Common Mistakes
- Summary
- Next Chapter

---

# Introduction

Almost every file operation in the FS module has two versions.

Example

```js
fs.readFileSync()
```

and

```js
fs.readFile()
```

Both perform the same task.

They both read a file.

The only difference is **how they execute**.

Understanding this difference is one of the most important concepts in Node.js.

---

# Why Does Node.js Provide Two APIs?

Different applications have different requirements.

Some applications can wait until a file operation completes.

Some applications should continue doing other work while the file is being processed.

To support both situations, Node.js provides:

- Synchronous APIs
- Asynchronous APIs

---

# Synchronous File Operations

A synchronous operation executes one step at a time.

The next line of code does **not** execute until the current file operation finishes.

Example

```js
const data = fs.readFileSync("data.txt", "utf8");

console.log(data);

console.log("Completed");
```

Execution Flow

```
Start

↓

Read File

↓

Wait

↓

File Read Complete

↓

Print Data

↓

Completed
```

The JavaScript thread remains busy until the operation finishes.

---

# Asynchronous File Operations

An asynchronous operation starts the file operation and immediately continues executing the remaining code.

Example

```js
fs.readFile("data.txt", "utf8", (err, data) => {
    console.log(data);
});

console.log("Completed");
```

Execution Flow

```
Start

↓

Request File Read

↓

Continue Execution

↓

Completed

↓

File Read Finished

↓

Callback Executes
```

JavaScript does not wait for the file operation to complete.

---

# Difference Between Sync and Async

| Synchronous | Asynchronous |
|--------------|--------------|
| Blocks execution | Does not block execution |
| Waits for completion | Continues immediately |
| Simpler to understand | Better for scalable applications |
| Suitable for startup scripts | Suitable for servers and APIs |

---

# Internal Working

### Synchronous

```
Application

↓

FS Module

↓

Operating System

↓

Read File

↓

Return Data

↓

Continue Execution
```

The JavaScript thread waits until the operating system finishes reading the file.

---

### Asynchronous

```
Application

↓

FS Module

↓

libuv

↓

Operating System

↓

Read File

↓

Callback Queue

↓

Event Loop

↓

Execute Callback
```

The JavaScript thread remains free while the operating system performs the file operation.

---

# When to Use Sync APIs

Synchronous APIs are useful when blocking is acceptable.

Examples

- Reading configuration files during application startup
- Small automation scripts
- CLI tools
- Build scripts

Example

```js
const config = fs.readFileSync("config.json", "utf8");
```

The application should not continue until the configuration has been loaded.

---

# When to Use Async APIs

Asynchronous APIs should be used when the application needs to handle multiple tasks efficiently.

Examples

- Express applications
- REST APIs
- Upload services
- Chat applications
- Real-time systems

These applications should never stop processing other requests while waiting for a file operation.

---

# Performance Comparison

Suppose reading one file takes **2 seconds**.

### Synchronous

```
Read File

↓

Wait 2 Seconds

↓

Continue
```

Total execution remains blocked for 2 seconds.

---

### Asynchronous

```
Start Reading

↓

Continue Other Work

↓

File Completes

↓

Execute Callback
```

The application remains responsive while waiting for the file operation.

---

# Best Practices

✅ Use synchronous APIs during application startup.

✅ Use asynchronous APIs inside web servers.

✅ Avoid synchronous APIs inside request handlers.

✅ Always handle file operation errors.

---

# Common Mistakes

### Using readFileSync() inside Express routes

```js
app.get("/", (req, res) => {
    const data = fs.readFileSync("users.json", "utf8");

    res.send(data);
});
```

This blocks the server for every request.

---

### Assuming Async APIs Execute Immediately

Calling an asynchronous API does not mean the operation finishes immediately.

It only means JavaScript continues executing while the operation is being processed.

---

### Thinking Async Means Multi-threaded JavaScript

JavaScript still runs on a single main thread.

Node.js uses **libuv** and the operating system to perform asynchronous file operations.

---

# Summary

| Feature | Sync | Async |
|----------|------|-------|
| Blocks JavaScript | ✅ | ❌ |
| Uses Callback | ❌ | ✅ |
| Suitable for Servers | ❌ | ✅ |
| Suitable for Startup | ✅ | ✅ |

---

# Key Takeaways

- The FS module provides synchronous and asynchronous APIs.
- Synchronous APIs block JavaScript execution until the operation finishes.
- Asynchronous APIs allow JavaScript to continue executing while the file operation runs in the background.
- Production backend applications should generally prefer asynchronous APIs.

---

# Next Chapter

➡️ **03 - fs.readFileSync()**