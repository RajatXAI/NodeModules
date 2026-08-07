# process.cwd()

> Learn how Node.js determines the current working directory and why it is one of the most important APIs for CLI applications, build tools, deployment, and project configuration.

---

# Table of Contents

- Introduction
- What is process.cwd()?
- Why Does It Exist?
- Current Working Directory
- Internal Working
- Relationship with the Operating System
- process.chdir()
- CLI Applications
- Build Tools
- Docker
- PM2
- Monorepos
- process.cwd() vs __dirname
- Common Mistakes
- Best Practices
- Performance
- FAQ
- Interview Questions
- Exercises
- Summary

---

# Introduction

Every running program has something called a **Current Working Directory (CWD).**

Think of it as:

> "The folder from which the program is currently running."

Node.js exposes this information through

```js
process.cwd()
```

Unlike `__dirname`, this value is **not attached to a JavaScript file.**

Instead, it belongs to the **running process**.

---

# What is process.cwd()?

`process.cwd()` returns the absolute path of the **Current Working Directory**.

Example

```js
console.log(process.cwd());
```

Output

```
D:\Project
```

---

# What is the Current Working Directory?

Suppose your project looks like this

```
Project/

│

├── app.js

└── src/

      user.js
```

Terminal

```bash
cd D:\Project

node app.js
```

Current Working Directory

```
D:\Project
```

Both

```js
app.js
```

and

```js
user.js
```

see exactly the same value.

```
process.cwd()

↓

D:\Project
```

---

# Key Observation

Unlike

```
__dirname
```

there is only **one**

```
process.cwd()
```

for the entire Node.js process.

Every module receives the same value.

---

# Internal Working

Internally,

```js
process.cwd()
```

doesn't inspect JavaScript files.

Instead,

Node.js asks **libuv** for the current working directory.

Simplified flow

```
JavaScript

      │

      ▼

process.cwd()

      │

      ▼

Node.js C++

      │

      ▼

libuv

      │

      ▼

Operating System

      │

      ▼

Current Working Directory
```

Internally, libuv calls platform-specific operating system APIs to retrieve the current working directory.

This is why the result reflects **where the process started**, not where the source file is located.

---

# Relationship with process.chdir()

Node.js also provides

```js
process.chdir()
```

which changes the current working directory during runtime.

Example

```js
console.log(process.cwd());

process.chdir("../");

console.log(process.cwd());
```

Output

```
D:\Project

D:\
```

Notice

The process changed its location.

Every future call to

```js
process.cwd()
```

returns the new directory.

---

# Why Doesn't __dirname Change?

Because

```
__dirname

↓

Current File
```

It is fixed.

But

```
process.cwd()

↓

Current Process
```

can change using

```js
process.chdir()
```

---

# CLI Applications

Most CLI tools depend heavily on

```js
process.cwd()
```

Example

```
npm

git

eslint

prettier

vite

webpack

prisma
```

When you run

```bash
npm install
```

npm starts from

```
process.cwd()
```

to locate

```
package.json
```

---

# Build Tools

Example

```bash
vite build
```

Vite searches for

```
vite.config.js
```

relative to

```
process.cwd()
```

not

```
__dirname
```

---

# Docker Example

Container

```
/usr/src/app
```

Dockerfile

```dockerfile
WORKDIR /usr/src/app
```

Node application

```js
console.log(process.cwd());
```

Output

```
/usr/src/app
```

The working directory comes from Docker's

```
WORKDIR
```

instruction.

---

# PM2 Example

PM2 starts your application from a configured directory.

That directory becomes

```
process.cwd()
```

Understanding this prevents many deployment bugs.

---

# Monorepo Example

```
workspace/

│

├── apps/

│     backend/

│

└── packages/
```

Suppose terminal

```
cd workspace
```

then

```bash
node apps/backend/index.js
```

Output

```
workspace
```

because

```
process.cwd()
```

depends on the terminal,

not the file location.

---

# Production Example

CLI Tool

```js
const fs = require("fs");

const path = require("path");

const config = path.join(

    process.cwd(),

    "config.json"

);
```

The tool searches for

```
config.json
```

inside the user's project,

not inside the CLI package itself.

This is exactly how many real-world CLI tools work.

---

# process.cwd() vs __dirname

| process.cwd() | __dirname |
|---------------|-----------|
| Current Process | Current File |
| Same everywhere | Different for each module |
| Can change | Never changes |
| CLI tools | Local resources |

---

# Common Mistakes

## ❌ Using process.cwd() for Upload Folder

Wrong

```js
path.join(

    process.cwd(),

    "uploads"

);
```

If someone starts the application from another directory,

uploads may be stored in the wrong place.

Use

```js
__dirname
```

instead.

---

## ❌ Assuming cwd Never Changes

Calling

```js
process.chdir()
```

changes it immediately.

---

# Best Practices

Use

```
process.cwd()
```

for

- CLI tools
- Build systems
- Project root detection
- User project configuration

Use

```
__dirname
```

for

- uploads
- templates
- images
- local files

---

# Performance

`process.cwd()`

is extremely fast.

It only asks the operating system for the current working directory.

No files are read.

No directories are scanned.

---

# FAQ

## Is process.cwd() global?

Yes.

There is one current working directory for the entire Node.js process.

---

## Can it change?

Yes.

Using

```js
process.chdir()
```

---

## Does every file have its own cwd?

No.

Every module shares the same current working directory.

---

# Interview Questions

Q1

What is

```js
process.cwd()
```

?

---

Q2

Difference between

```js
process.cwd()
```

and

```js
__dirname
```

?

---

Q3

Which one should a CLI tool use?

---

Q4

Can process.cwd() change during runtime?

---

Q5

Which Node.js API changes it?

---

Q6

Why does npm rely on process.cwd()?

---

# Exercises

Assume

```
Project/

│

├── app.js

└── src/

      user.js
```

Command

```bash
cd D:\Project

node app.js
```

Predict

```js
process.cwd();
```

---

Now

```bash
cd D:\

node Project\app.js
```

Predict again.

---

# Summary

| Feature | process.cwd() |
|----------|---------------|
| Returns Absolute Path | ✅ |
| Process Based | ✅ |
| Same For All Files | ✅ |
| Can Change | ✅ |
| CLI Friendly | ✅ |
| File Based | ❌ |

---

# Key Takeaways

- `process.cwd()` belongs to the running process, not to individual files.
- It returns the directory from which the Node.js process started.
- It is heavily used by CLI tools, build systems, package managers, and deployment tools.
- It can change at runtime using `process.chdir()`.
- Do not confuse it with `__dirname`; they solve different problems.