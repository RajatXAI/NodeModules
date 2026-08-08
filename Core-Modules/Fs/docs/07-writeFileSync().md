# fs.writeFileSync()

> Learn how to synchronously create and write files using the Node.js File System (FS) module.

---

# Table of Contents

- Introduction
- Why writeFileSync()?
- Syntax
- Parameters
- Return Value
- How writeFileSync() Works
- Creating a New File
- Overwriting an Existing File
- Writing JSON Data
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

So far, we have learned how to **read files**.

Now it's time to learn how to **create** and **write** files.

Node.js provides multiple APIs for writing files.

The simplest one is

```js
fs.writeFileSync()
```

This API writes data to a file synchronously.

If the file does not exist, Node.js creates it.

If the file already exists, Node.js replaces its contents by default.

---

# Why writeFileSync()?

Many applications need to generate files before continuing execution.

Examples

- Creating log files
- Generating reports
- Creating configuration files
- Exporting JSON
- Saving temporary data

For these situations, `writeFileSync()` is a simple and reliable option.

---

# Syntax

```js
fs.writeFileSync(file, data[, options]);
```

---

# Parameters

| Parameter | Description |
|-----------|-------------|
| file | File path |
| data | Data to write |
| options | Encoding or configuration |

---

# Return Value

`writeFileSync()` does **not** return the written data.

If the operation succeeds,

it returns

```js
undefined
```

If something goes wrong,

Node.js throws an error.

---

# How writeFileSync() Works

Suppose

```js
fs.writeFileSync(
    "notes.txt",
    "Hello Node.js"
);
```

Execution Flow

```
Application

↓

FS Module

↓

Operating System

↓

Create / Open File

↓

Write Data

↓

Close File

↓

Continue Execution
```

JavaScript waits until the write operation completes.

---

# Creating a New File

```js
const fs = require("fs");

fs.writeFileSync(
    "notes.txt",
    "Hello Node.js"
);

console.log("File Created");
```

Output

```
File Created
```

A new file

```
notes.txt
```

will be created.

Contents

```text
Hello Node.js
```

---

# Overwriting an Existing File

Suppose

```
notes.txt
```

contains

```text
Hello
```

Now

```js
fs.writeFileSync(
    "notes.txt",
    "Welcome"
);
```

Final Content

```text
Welcome
```

The old content is completely replaced.

---

# Writing JSON Data

```js
const fs = require("fs");

const user = {

    name: "Rahul",

    age: 22

};

fs.writeFileSync(

    "user.json",

    JSON.stringify(user, null, 2)

);
```

Created File

```json
{
  "name": "Rahul",
  "age": 22
}
```

---

# Error Handling

Always use

```js
try...catch
```

```js
const fs = require("fs");

try {

    fs.writeFileSync(

        "notes.txt",

        "Learning FS"

    );

    console.log("Success");

} catch (error) {

    console.log(error.message);

}
```

---

# Production Use Cases

### Generate Reports

```
Database

↓

Generate Report

↓

report.txt
```

---

### Export JSON

```
Application

↓

Generate Data

↓

users.json
```

---

### Save Logs

```
Server

↓

Create Log

↓

server.log
```

---

### Build Scripts

```
Generate Files

↓

Save Output
```

---

# Practical Lab

Folder Structure

```
fs-learning/

└── app.js
```

app.js

```js
const fs = require("fs");

fs.writeFileSync(

    "message.txt",

    "Welcome to Node.js"

);

console.log("Done");
```

Expected Output

```
Done
```

Created File

```
message.txt
```

Contents

```text
Welcome to Node.js
```

---

# Best Practices

✅ Use `try...catch`.

✅ Use UTF-8 for text files.

✅ Store JSON using `JSON.stringify()`.

✅ Prefer async APIs in production servers.

---

# Common Mistakes

### Forgetting Existing Data Will Be Replaced

```js
fs.writeFileSync(

    "notes.txt",

    "New Data"

);
```

The previous content is lost.

---

### Writing Objects Directly

Incorrect

```js
fs.writeFileSync(

    "user.json",

    user

);
```

Correct

```js
JSON.stringify(user)
```

---

### Using writeFileSync() Inside Express Routes

Avoid blocking the event loop.

---

# Interview Questions

### Q1

What happens if the file does not exist?

---

### Q2

What happens if the file already exists?

---

### Q3

What does `writeFileSync()` return?

---

### Q4

Why should `JSON.stringify()` be used before writing objects?

---

### Q5

Why is `writeFileSync()` generally avoided inside API routes?

---

# Summary

| Feature | Description |
|----------|-------------|
| Type | Synchronous |
| Creates File | ✅ |
| Overwrites Existing File | ✅ |
| Returns | `undefined` |
| Best For | Startup Scripts, CLI Tools |

---

# Key Takeaways

- `writeFileSync()` creates a new file if it does not exist.
- If the file already exists, its contents are replaced.
- JavaScript waits until the write operation is complete.
- It is suitable for scripts, CLI tools, and startup tasks.
- Avoid using it inside production request handlers.

---

# API Comparison

| API | Type | Recommended For |
|------|------|-----------------|
| `writeFileSync()` | Synchronous | Startup Scripts |
| `writeFile()` | Callback | Existing Projects |
| `fs.promises.writeFile()` | Promise | ✅ Modern Applications |

---

# Next Chapter

➡️ **writeFile()**