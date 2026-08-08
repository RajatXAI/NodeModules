# fs.readFileSync()

> Learn how to synchronously read files using the Node.js File System (FS) module.

---

# Table of Contents

- Introduction
- Why readFileSync()?
- Syntax
- Parameters
- Return Value
- Internal Working
- Reading a Text File
- Reading a JSON File
- Buffer vs String
- Error Handling
- Production Use Cases
- Practical Lab
- Best Practices
- Common Mistakes
- Interview Questions
- Summary
- Next Chapter

---

# Introduction

Reading files is one of the most common operations in backend development.

Examples

- Reading configuration files
- Reading templates
- Reading JSON files
- Reading SQL scripts
- Reading text files

Node.js provides multiple APIs to read files.

The simplest one is

```js
fs.readFileSync()
```

---

# Why readFileSync()?

Sometimes an application **must wait** until a file is completely read.

Example

```
Server Starts

↓

Read .env

↓

Read config.json

↓

Connect Database

↓

Start Server
```

The application cannot continue until the configuration is available.

In these situations, a synchronous API is useful.

---

# Syntax

```js
fs.readFileSync(path[, options])
```

---

# Parameters

| Parameter | Description |
|------------|-------------|
| path | Path of the file to read |
| options | Encoding or configuration object |

Example

```js
fs.readFileSync("data.txt", "utf8");
```

---

# Return Value

The return value depends on whether an encoding is provided.

### With Encoding

```js
const data = fs.readFileSync("data.txt", "utf8");
```

Returns

```text
String
```

---

### Without Encoding

```js
const data = fs.readFileSync("data.txt");
```

Returns

```text
Buffer
```

This is because Node.js reads raw binary data by default.

---

# Internal Working

Suppose

```js
fs.readFileSync("data.txt", "utf8");
```

Execution Flow

```
Application

↓

FS Module

↓

Operating System

↓

Read File From Disk

↓

Return File Data

↓

Continue Execution
```

Notice

JavaScript waits until the file is completely read.

---

# Reading a Text File

Folder Structure

```
project/

├── app.js

└── data.txt
```

data.txt

```text
Hello Node.js
```

app.js

```js
const fs = require("fs");

const data = fs.readFileSync(
    "data.txt",
    "utf8"
);

console.log(data);
```

Output

```text
Hello Node.js
```

---

# Reading a JSON File

config.json

```json
{
    "appName": "Learning FS",
    "port": 3000
}
```

Code

```js
const fs = require("fs");

const file = fs.readFileSync(
    "config.json",
    "utf8"
);

const config = JSON.parse(file);

console.log(config);
```

Output

```js
{
  appName: "Learning FS",
  port: 3000
}
```

---

# Buffer vs String

### Without Encoding

```js
const data = fs.readFileSync("data.txt");

console.log(data);
```

Output

```text
<Buffer 48 65 6c 6c 6f ...>
```

---

### With Encoding

```js
const data = fs.readFileSync(
    "data.txt",
    "utf8"
);

console.log(data);
```

Output

```text
Hello Node.js
```

Always provide an encoding when reading text files.

---

# Error Handling

If the file does not exist,

Node.js throws an error.

```js
const fs = require("fs");

try {

    const data = fs.readFileSync(
        "missing.txt",
        "utf8"
    );

    console.log(data);

} catch (error) {

    console.error(error.message);

}
```

Example Output

```text
ENOENT: no such file or directory
```

---

# Production Use Cases

### Reading Configuration

```text
config.json

↓

Read

↓

Start Server
```

---

### Reading Templates

```
email.html

↓

Read

↓

Replace Variables

↓

Send Email
```

---

### CLI Applications

```
package.json

↓

Read

↓

Display Project Information
```

---

### Build Scripts

```
Read Files

↓

Generate Output

↓

Build Project
```

---

# Practical Lab

Project Structure

```
fs-learning/

├── app.js

├── data.txt

└── config.json
```

data.txt

```text
Welcome to Node.js
```

config.json

```json
{
    "name": "FS Module",
    "version": "1.0.0"
}
```

app.js

```js
const fs = require("fs");

const text = fs.readFileSync(
    "data.txt",
    "utf8"
);

console.log(text);

const config = JSON.parse(
    fs.readFileSync(
        "config.json",
        "utf8"
    )
);

console.log(config);
```

Expected Output

```text
Welcome to Node.js

{ name: 'FS Module', version: '1.0.0' }
```

---

# Best Practices

✅ Use `readFileSync()` only when blocking is acceptable.

✅ Always use `try...catch`.

✅ Provide an encoding for text files.

✅ Use it during application startup or in CLI tools.

---

# Common Mistakes

### Reading a Missing File

Always handle errors.

---

### Forgetting Encoding

Without encoding,

Node.js returns a Buffer instead of a String.

---

### Using readFileSync() Inside Express Routes

Avoid this.

It blocks the event loop and reduces server performance.

---

# Interview Questions

### Q1

What is the difference between

```js
fs.readFileSync("file.txt")
```

and

```js
fs.readFileSync("file.txt", "utf8")
```

---

### Q2

What does `readFileSync()` return?

---

### Q3

When should `readFileSync()` be used?

---

### Q4

Why is `readFileSync()` considered blocking?

---

### Q5

How should errors be handled while reading files?

---

# Summary

| Feature | Description |
|----------|-------------|
| Type | Synchronous |
| Blocks Execution | Yes |
| Returns | Buffer or String |
| Uses Callback | No |
| Best For | Startup scripts, CLI tools |

---

# Key Takeaways

- `fs.readFileSync()` reads an entire file before continuing execution.
- It blocks JavaScript until the operation is complete.
- It returns a Buffer by default and a String when an encoding is provided.
- It is useful during application startup and in scripts where blocking is acceptable.
- It should generally be avoided inside request handlers of production servers.

---

# Next Chapter

➡️ **04 - Buffer**