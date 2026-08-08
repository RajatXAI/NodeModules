# fs.appendFile()

> Learn how to append data to an existing file without replacing its contents.

---

# Table of Contents

- Introduction
- Why appendFile()?
- Syntax
- Parameters
- Callback Function
- Return Value
- How appendFile() Works
- Creating a File
- Appending Data
- Writing Logs
- Error Handling
- Production Use Cases
- Practical Lab
- Best Practices
- Common Mistakes
- Interview Questions
- Summary
- API Comparison
- Next Chapter

---

# Introduction

So far we have learned

```js
fs.writeFile()
```

The problem with `writeFile()` is that it replaces the existing content of the file.

Example

Current File

```text
Hello
```

Code

```js
fs.writeFile(
    "notes.txt",
    "Welcome",
    callback
);
```

Final File

```text
Welcome
```

The previous content is lost.

Sometimes this is not what we want.

For example,

- Server Logs
- Chat Messages
- Audit History
- Error Logs

In these cases, we want to **keep the existing data** and add new data at the end.

For this purpose, Node.js provides

```js
fs.appendFile()
```

---

# Why appendFile()?

Suppose your server writes logs.

Every request should be added to

```
server.log
```

Current File

```text
Server Started
```

New Log

```text
User Logged In
```

Final File

```text
Server Started
User Logged In
```

Notice

The previous data remains unchanged.

---

# Syntax

```js
fs.appendFile(file, data[, options], callback);
```

---

# Parameters

| Parameter | Description |
|-----------|-------------|
| file | File path |
| data | Data to append |
| options | Encoding or configuration |
| callback | Function executed after appending |

---

# Callback Function

The callback receives one argument.

```js
(error) => {

}
```

If the operation succeeds,

```js
error
```

is

```js
null
```

Otherwise,

it contains an Error object.

---

# Return Value

`appendFile()` returns

```js
undefined
```

The result is available through the callback.

---

# How appendFile() Works

Suppose

```js
fs.appendFile(
    "log.txt",
    "User Logged In\n",
    callback
);
```

Execution Flow

```
Application

↓

FS Module

↓

libuv

↓

Operating System

↓

Open File

↓

Move Cursor To End

↓

Write Data

↓

Close File

↓

Callback Executes
```

---

# Creating a File

If the file does not exist,

Node.js automatically creates it.

```js
const fs = require("fs");

fs.appendFile(

    "notes.txt",

    "Hello\n",

    (error) => {

        if (error) {

            console.log(error);

            return;

        }

        console.log("Done");

    }

);
```

Created File

```text
Hello
```

---

# Appending Data

Current File

```text
Hello
```

Code

```js
fs.appendFile(

    "notes.txt",

    "Welcome\n",

    callback

);
```

Final File

```text
Hello
Welcome
```

Notice

Nothing is replaced.

New data is added to the end.

---

# Writing Logs

```js
const fs = require("fs");

fs.appendFile(

    "server.log",

    "Server Started\n",

    (error) => {

        if (error) {

            console.log(error);

            return;

        }

        console.log("Log Saved");

    }

);
```

After multiple executions

```
Server Started
Server Started
Server Started
Server Started
```

This is exactly how many logging systems work.

---

# Error Handling

Always handle errors.

```js
fs.appendFile(

    "logs.txt",

    "Hello\n",

    (error) => {

        if (error) {

            console.error(error.message);

            return;

        }

        console.log("Success");

    }

);
```

---

# Production Use Cases

### Server Logs

```
Application

↓

New Request

↓

Append Log

↓

server.log
```

---

### Chat Messages

```
New Message

↓

Append

↓

chat.txt
```

---

### Audit History

```
Payment Success

↓

Append

↓

audit.log
```

---

### Error Logs

```
Exception

↓

Append

↓

error.log
```

---

# Practical Lab

Project Structure

```
fs-learning/

└── app.js
```

app.js

```js
const fs = require("fs");

fs.appendFile(

    "notes.txt",

    "Learning appendFile()\n",

    (error) => {

        if (error) {

            console.log(error);

            return;

        }

        console.log("Data Added");

    }

);
```

Run the program three times.

Final File

```text
Learning appendFile()
Learning appendFile()
Learning appendFile()
```

---

# Best Practices

✅ Use `appendFile()` for logs.

✅ Add `\n` when writing multiple lines.

✅ Always handle errors.

✅ Prefer Promise APIs in modern applications.

---

# Common Mistakes

### Using writeFile() Instead of appendFile()

`writeFile()` replaces data.

`appendFile()` keeps existing data.

---

### Forgetting New Line

```js
fs.appendFile(

    "notes.txt",

    "Hello"

);
```

Result

```text
HelloHelloHello
```

Better

```js
"Hello\n"
```

---

### Ignoring Errors

Always check the callback error.

---

# Interview Questions

### Q1

What is the difference between

```js
writeFile()
```

and

```js
appendFile()
```

?

---

### Q2

What happens if the file does not exist?

---

### Q3

Does `appendFile()` overwrite existing data?

---

### Q4

Why is `appendFile()` useful for logging?

---

### Q5

Does `appendFile()` block JavaScript execution?

---

# Summary

| Feature | Description |
|----------|-------------|
| Type | Asynchronous |
| Creates File | ✅ |
| Overwrites Data | ❌ |
| Appends Data | ✅ |
| Uses Callback | ✅ |

---

# API Comparison

| API | Behavior |
|------|----------|
| `writeFile()` | Replace existing data |
| `appendFile()` | Add data to the end |

---

# Key Takeaways

- `appendFile()` adds new data to the end of a file.
- Existing content is preserved.
- If the file does not exist, Node.js creates it automatically.
- It is commonly used for logs, audit history, and chat applications.
- Always handle errors before assuming the operation succeeded.

---

# Next Chapter

➡️ **fs.promises.appendFile()**