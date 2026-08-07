# __dirname vs process.cwd()

> Understand one of the most commonly misunderstood concepts in Node.js.

---

# Table of Contents

- Introduction
- Quick Overview
- What __dirname Represents
- What process.cwd() Represents
- Visual Difference
- Internal Working
- Execution Scenarios
- Real Backend Examples
- Docker
- PM2
- CLI Applications
- Common Mistakes
- Best Practices
- Interview Questions
- Summary

---

# Introduction

Every Node.js developer eventually asks this question:

> "What's the difference between `__dirname` and `process.cwd()`?"

At first, they often appear to return the same value.

Example

```js
console.log(__dirname);

console.log(process.cwd());
```

Output

```
D:\Project

D:\Project
```

So developers conclude

```
Both are identical.
```

This conclusion is **wrong**.

They only appear identical in one specific situation.

---

# Quick Overview

| __dirname | process.cwd() |
|------------|---------------|
| Current JavaScript file | Current running process |
| File based | Terminal based |
| Fixed | Can change |
| Different in every module | Same everywhere |

---

# What Does __dirname Represent?

`__dirname`

answers

> "Where does this JavaScript file live?"

Suppose

```
Project

│

├── app.js

│

└── src

      routes

            user.js
```

Inside

```
user.js
```

```js
console.log(__dirname);
```

Output

```
Project/src/routes
```

No matter where the application starts,

this value never changes.

---

# What Does process.cwd() Represent?

`process.cwd()`

answers

> "From which directory was Node.js started?"

Suppose terminal

```bash
cd Project

node app.js
```

Output

```
Project
```

Suppose

```bash
cd D:\

node Project\app.js
```

Output

```
D:\
```

Notice

The current working directory changed.

---

# Visual Comparison

```
Project

│

├── app.js

│

└── src

      routes

            user.js
```

Running

```bash
cd Project

node app.js
```

Inside

```
user.js
```

```
__dirname

↓

Project/src/routes

---------------------

process.cwd()

↓

Project
```

---

# Why Do They Sometimes Look Identical?

Suppose

```
Project

│

└── app.js
```

Command

```bash
cd Project

node app.js
```

Result

```
__dirname

↓

Project

----------------

process.cwd()

↓

Project
```

Same.

Why?

Because

- current file

AND

- terminal

point to the same directory.

---

# Internal Working

```
__dirname

↓

Node Module Loader

↓

Current File

----------------------

process.cwd()

↓

libuv

↓

Operating System

↓

Current Working Directory
```

Notice

They are produced by completely different systems.

---

# Scenario 1

```
Project

│

├── app.js

│

└── src

      user.js
```

app.js

```js
require("./src/user");
```

user.js

```js
console.log(__dirname);

console.log(process.cwd());
```

Terminal

```bash
cd Project

node app.js
```

Output

```
Project/src

Project
```

---

# Scenario 2

Terminal

```bash
cd src

node user.js
```

Output

```
Project/src

Project/src
```

Now both are equal.

---

# Scenario 3

```js
process.chdir("../");
```

Now

```
process.cwd()

↓

Changes
```

But

```
__dirname

↓

Never changes
```

---

# Real Backend Example

## Upload Folder

Correct

```js
const uploadDir =

path.join(

    __dirname,

    "uploads"

);
```

Wrong

```js
const uploadDir =

path.join(

    process.cwd(),

    "uploads"

);
```

If another developer starts the application from a different directory,

files may be uploaded to the wrong location.

---

# CLI Example

Suppose you're building

```
my-cli
```

User runs

```bash
my-cli init
```

Your CLI should create

```
package.json
```

inside

```
User's Project
```

not inside

```
CLI Package
```

Therefore

```js
process.cwd()
```

is correct.

Using

```js
__dirname
```

would write files inside the installed CLI package.

---

# Docker Example

Container

```
/usr/src/app
```

```
WORKDIR

↓

/usr/src/app
```

```
process.cwd()

↓

/usr/src/app
```

Meanwhile

```
__dirname

↓

Depends on file location
```

---

# PM2 Example

PM2 starts the process.

```
process.cwd()

↓

PM2 Working Directory
```

```
__dirname

↓

Application File
```

---

# Common Mistakes

## ❌ Thinking They Are Always Equal

False.

They are equal only when

- current file

and

- current working directory

are the same.

---

## ❌ Using cwd for Local Resources

Wrong

```js
path.join(

process.cwd(),

"templates"

);
```

Correct

```js
path.join(

__dirname,

"templates"

);
```

---

## ❌ Using __dirname for CLI

Wrong.

CLI tools should normally use

```js
process.cwd()
```

---

# Best Practices

Use

```
__dirname
```

for

- uploads
- templates
- images
- configuration
- local resources

Use

```
process.cwd()
```

for

- CLI
- npm
- build tools
- generators
- project root

---

# Memory Trick

Think of

```
__dirname
```

as

```
📄 File Address
```

Think of

```
process.cwd()
```

as

```
💻 Terminal Address
```

One belongs to

```
The File
```

The other belongs to

```
The Process
```

---

# Interview Questions

### Q1

Difference between

```
__dirname

```

and

```
process.cwd()
```

?

---

### Q2

Which one changes after

```js
process.chdir()
```

?

---

### Q3

Which one should Express uploads use?

---

### Q4

Which one should a CLI tool use?

---

### Q5

Why are they sometimes identical?

---

# Summary

| Feature | __dirname | process.cwd() |
|----------|-----------|---------------|
| Based On | Current File | Current Process |
| Changes Per File | ✅ | ❌ |
| Same For Whole App | ❌ | ✅ |
| Can Change | ❌ | ✅ |
| CLI Friendly | ❌ | ✅ |
| File Operations | ✅ | ⚠ Depends |

---

# Key Takeaways

- `__dirname` and `process.cwd()` solve different problems.
- `__dirname` identifies where the current file lives.
- `process.cwd()` identifies where the Node.js process started.
- They are only equal in specific execution scenarios.
- Choosing the wrong one can cause bugs in uploads, templates, configuration loading, and CLI tools.