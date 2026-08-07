# __dirname

> Learn how Node.js identifies the directory of the currently executing file.

---

# Table of Contents

- Introduction
- What is __dirname?
- Why Does It Exist?
- How __dirname Works
- Internal Working
- __dirname vs Relative Paths
- Practical Examples
- Production Use Cases
- Common Mistakes
- Best Practices
- Interview Questions
- Exercises
- Summary

---

# Introduction

Whenever a Node.js application interacts with files, one common question appears.

> "Where is my current JavaScript file located?"

Node.js answers this question using

```
__dirname
```

It is one of the most frequently used variables in backend development.

You will find it in almost every production application.

Examples include

- Express
- NestJS
- Fastify
- Next.js API Routes
- Multer
- Winston Logger
- Static File Servers

---

# What is __dirname?

`__dirname` is a special variable provided by the CommonJS module system.

It returns the **absolute directory path of the current JavaScript file**.

Example

Project

```
Project

│

├── app.js

│

└── uploads
```

app.js

```js
console.log(__dirname);
```

Output

```
D:\Project
```

---

Another example

Project

```
Project

│

└── src

       user.js
```

user.js

```js
console.log(__dirname);
```

Output

```
D:\Project\src
```

Notice

Each file has its own

```
__dirname
```

---

# Why Does __dirname Exist?

Suppose you need to read

```
config.json
```

Bad

```js
fs.readFileSync("config.json");
```

Will it always work?

No.

It depends on

```
process.cwd()
```

Instead

```js
const file = path.join(

    __dirname,

    "config.json"

);
```

Now the location is fixed.

---

# Internal Working

When Node.js loads a CommonJS module,

it internally wraps your code.

Simplified version

```js
(function (

    exports,

    require,

    module,

    __filename,

    __dirname

){

    // Your Code

});
```

Notice

```
__dirname
```

is injected by Node.js.

It is **not**

- global JavaScript
- browser feature
- V8 feature

It comes from Node's CommonJS module loader.

---

# Internal Flow

```
Node.js

      │

      ▼

Load File

      │

      ▼

Wrap Module

      │

      ▼

Inject

__filename

__dirname

exports

require

module

      │

      ▼

Execute File
```

---

# Absolute Path

Suppose

```
Project

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
D:\Project\src\routes
```

No matter where the application starts,

the output never changes.

---

# Real Backend Example

Reading Configuration

```js
const config =

path.join(

    __dirname,

    "config.json"

);
```

---

Express Static

```js
app.use(

express.static(

path.join(

__dirname,

"public"

)

)

);
```

---

Image Upload

```js
const uploadDir =

path.join(

__dirname,

"uploads"

);
```

---

Logger

```js
const logFile =

path.join(

__dirname,

"logs",

"server.log"

);
```

---

# Why Production Apps Prefer __dirname

Imagine

```
Project

│

├── app.js

└── uploads
```

Someone runs

```bash
cd D:\

node Project\app.js
```

Current Working Directory

```
D:\
```

Current File

```
D:\Project
```

If you use

```
process.cwd()
```

the upload folder becomes wrong.

If you use

```
__dirname
```

it remains correct.

---

# Common Mistakes

## ❌ Thinking __dirname Is Global JavaScript

It isn't.

Browser JavaScript doesn't have

```
__dirname
```

---

## ❌ Thinking __dirname Changes

It never changes.

It is fixed for the lifetime of the module.

---

## ❌ Confusing It With process.cwd()

They are different.

```
__dirname

↓

Current File

process.cwd()

↓

Terminal
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
- logs
- images
- configuration
- local resources

---

# Performance

```
__dirname
```

is simply a string.

Accessing it has virtually zero runtime cost.

---

# Interview Questions

Q1

What is

```
__dirname
```

?

---

Q2

Does every file have its own

```
__dirname
```

?

---

Q3

Is

```
__dirname

```

available in browsers?

---

Q4

Who provides

```
__dirname
```

?

---

Q5

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

# Exercises

Project

```
Project

│

├── app.js

│

└── src

      user.js
```

Inside

```
user.js
```

Predict

```js
console.log(__dirname);
```

---

# Summary

| Feature | Supported |
|----------|-----------|
| Absolute Directory | ✅ |
| File Based | ✅ |
| Changes Per File | ✅ |
| Browser Support | ❌ |
| CommonJS Only | ✅ |

---

# Key Takeaways

- `__dirname` belongs to the current module.
- It always returns the absolute directory of the current file.
- It is injected by Node.js during CommonJS module loading.
- It is preferred for file-system operations relative to the source file.