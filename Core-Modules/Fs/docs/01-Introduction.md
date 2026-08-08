# FS (File System) Module

> Learn how Node.js interacts with files and directories using the built-in File System (FS) module.

---

# Table of Contents

- Introduction
- Why Does the FS Module Exist?
- What is a File System?
- Browser JavaScript vs Node.js
- Features of the FS Module
- How the FS Module Works
- Real World Use Cases
- Importing the Module
- Common Misconceptions
- Learning Roadmap
- Summary

---

# Introduction

The **File System (FS)** module is one of the most important built-in modules in Node.js.

It provides APIs to interact with files and directories on the operating system.

Using the FS module, a Node.js application can:

- Read files
- Create files
- Write data to files
- Append data
- Delete files
- Rename files
- Copy files
- Move files
- Create directories
- Read directory contents
- Delete directories
- Watch files for changes

The FS module is included with Node.js, so no installation is required.

---

# Why Does the FS Module Exist?

JavaScript was originally designed to run inside web browsers.

Browsers intentionally restrict access to the user's file system for security reasons.

For example, a website should never be able to read files like:

```text
C:\Users\John\Documents

/home/john/Documents
```

Node.js runs outside the browser in a trusted environment.

Because of this, it can safely communicate with the operating system and work with files and directories.

The FS module provides this capability.

---

# What is a File System?

A File System is the way an operating system stores and manages files on storage devices.

Every operating system has its own file system implementation.

| Operating System | File System |
|------------------|------------|
| Windows | NTFS |
| Linux | EXT4 |
| macOS | APFS |

Node.js does not implement a file system.

Instead, it communicates with the operating system's existing file system.

---

# Browser JavaScript vs Node.js

| Browser JavaScript | Node.js |
|--------------------|---------|
| Cannot read local files directly | Can read files |
| Cannot create folders | Can create folders |
| Cannot delete files | Can delete files |
| Cannot rename files | Can rename files |
| Runs inside a browser sandbox | Runs directly on the operating system |

This is one of the biggest differences between Browser JavaScript and Node.js.

---

# Features of the FS Module

The FS module supports almost every common file operation.

```
Read File

↓

Write File

↓

Append File

↓

Rename File

↓

Delete File

↓

Copy File

↓

Move File

↓

Create Directory

↓

Read Directory

↓

Delete Directory

↓

Watch File Changes
```

These operations are used in almost every backend application.

---

# How the FS Module Works

Suppose the application reads a file.

```js
fs.readFileSync("data.txt", "utf8");
```

Internally, the flow looks like this.

```
Application

↓

FS Module

↓

Node.js Native Layer

↓

Operating System

↓

File System

↓

Storage Device

↓

Data Returned
```

The FS module does not access the disk directly.

It asks the operating system to perform the file operation and returns the result to the application.

---

# Real World Use Cases

## Image Upload

```
User Uploads Image

↓

Server

↓

uploads/profile.jpg
```

---

## Application Logs

```
Server

↓

logs/server.log
```

---

## Configuration Files

```
config.json

↓

Read Configuration

↓

Start Application
```

---

## Static Files

```
public/

    index.html

    style.css

    logo.png
```

---

## Report Generation

```
Generate PDF

↓

Save Report

↓

Send to User
```

---

# Importing the FS Module

CommonJS

```js
const fs = require("fs");
```

ES Modules

```js
import fs from "node:fs";
```

The FS module is built into Node.js.

No installation is required.

---

# Common Misconceptions

### FS Module is a Database

Incorrect.

The FS module only works with files and directories.

---

### FS Module Only Works with Text Files

Incorrect.

It supports all file types, including:

- Images
- Videos
- PDFs
- Audio
- JSON
- CSV
- Binary Files

---

### Every File Operation is Instant

Incorrect.

Reading or writing files depends on the storage device and operating system.

File operations are generally much slower than accessing data already stored in memory.

---

# Learning Roadmap

In this module, we will cover:

- Synchronous vs Asynchronous File Operations
- readFile()
- readFileSync()
- writeFile()
- writeFileSync()
- appendFile()
- mkdir()
- readdir()
- stat()
- rename()
- copyFile()
- unlink()
- rm()
- watch()

Each topic will include:

- Internal Working
- Production Examples
- Best Practices
- Common Mistakes
- Interview Questions
- Mini Project Integration

---

# Summary

- The FS module is a built-in Node.js core module.
- It provides APIs to work with files and directories.
- It communicates with the operating system to perform file operations.
- The module is widely used in uploads, logging, configuration management, static file serving, and report generation.
- Understanding the FS module is essential for building production-ready Node.js applications.

---

# Next Chapter

➡️ **02 - Synchronous vs Asynchronous File Operations**