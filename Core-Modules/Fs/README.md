# Node.js File System (FS) Module

The Node.js `fs` module provides APIs for working with files and directories.

Using the `fs` module, we can:

- Create files
- Read files
- Write files
- Append data
- Rename files
- Copy files
- Delete files
- Create directories
- Read directories
- Remove directories
- Read file information
- Check permissions
- Watch file system changes
- Work with Streams
- Process large files efficiently

---

## Table of Contents

- [Introduction](#introduction)
- [Why FS Module?](#why-fs-module)
- [FS API Styles](#fs-api-styles)
- [File Operations](#file-operations)
- [Directory Operations](#directory-operations)
- [File Information](#file-information)
- [File System Checks](#file-system-checks)
- [File Watching](#file-watching)
- [Streams](#streams)
- [Backpressure](#backpressure)
- [HighWaterMark](#highwatermark)
- [API Selection Guide](#api-selection-guide)
- [Production Use Cases](#production-use-cases)
- [Project](#project)
- [Best Practices](#best-practices)
- [What We Learned](#what-we-learned)
- [Next Module](#next-module)

---

## Introduction

The `fs` module is a built-in Node.js module used to interact with the file system.

It allows a Node.js application to communicate with files and directories stored on the operating system.

```js
const fs = require("node:fs");
```

No external package is required.

---

## Why FS Module?

Backend applications frequently need to work with files.

For example:

- Reading configuration files
- Creating logs
- Saving uploaded files
- Generating reports
- Processing CSV files
- Creating backups
- Serving downloads
- Processing videos
- Reading large datasets

The `fs` module provides the APIs required for these operations.

---

## FS API Styles

Node.js provides three common styles of filesystem APIs.

### 1. Synchronous

```js
fs.readFileSync();
```

The operation blocks JavaScript execution until it completes.

---

### 2. Callback-Based Asynchronous

```js
fs.readFile("file.txt", (error, data) => {

});
```

The operation is asynchronous and uses a callback.

---

### 3. Promise-Based Asynchronous

```js
await fs.readFile("file.txt");
```

For modern application code, Promise-based APIs are generally preferred.

---

# File Operations

## Reading Files

### readFile()

Used to asynchronously read the contents of a file.

```js
fs.readFile("notes.txt", "utf8", (error, data) => {

    if (error) {
        console.log(error);
        return;
    }

    console.log(data);

});
```

### readFileSync()

Synchronous version.

```js
const data = fs.readFileSync(
    "notes.txt",
    "utf8"
);
```

Avoid synchronous file operations in request-handling code because they block the event loop.

---

## Writing Files

### writeFile()

Creates or replaces a file.

```js
fs.writeFile(
    "notes.txt",
    "Hello Node.js",
    (error) => {

        if (error) {
            console.log(error);
            return;
        }

        console.log("File Written");

    }
);
```

### writeFileSync()

```js
fs.writeFileSync(
    "notes.txt",
    "Hello Node.js"
);
```

---

## Appending Files

### appendFile()

Adds data to the end of a file.

```js
fs.appendFile(
    "notes.txt",
    "\nNew Line",
    (error) => {

        if (error) {
            console.log(error);
            return;
        }

        console.log("Data Appended");

    }
);
```

### appendFileSync()

```js
fs.appendFileSync(
    "notes.txt",
    "\nNew Line"
);
```

---

## Rename / Move

### rename()

Renames a file or moves it to another location.

```js
fs.rename(
    "old.txt",
    "new.txt",
    (error) => {

        if (error) {
            console.log(error);
            return;
        }

        console.log("Renamed");

    }
);
```

---

## Copying Files

### copyFile()

Copies a file.

```js
fs.copyFile(
    "source.txt",
    "backup.txt",
    (error) => {

        if (error) {
            console.log(error);
            return;
        }

        console.log("Copied");

    }
);
```

---

## Deleting Files

### unlink()

Deletes a file.

```js
fs.unlink(
    "notes.txt",
    (error) => {

        if (error) {
            console.log(error);
            return;
        }

        console.log("Deleted");

    }
);
```

### rm()

Can remove files and directories.

```js
fs.rm(
    "uploads",
    {
        recursive: true
    },
    (error) => {

        if (error) {
            console.log(error);
            return;
        }

        console.log("Removed");

    }
);
```

---

# Directory Operations

## mkdir()

Creates a directory.

```js
fs.mkdir(
    "uploads",
    (error) => {

        if (error) {
            console.log(error);
            return;
        }

        console.log("Directory Created");

    }
);
```

Recursive directory creation:

```js
fs.mkdir(
    "uploads/images/profile",
    {
        recursive: true
    },
    (error) => {

        if (error) {
            console.log(error);
            return;
        }

        console.log("Directories Created");

    }
);
```

---

## readdir()

Reads the contents of a directory.

```js
fs.readdir(
    ".",
    (error, files) => {

        if (error) {
            console.log(error);
            return;
        }

        console.log(files);

    }
);
```

---

# File Information

## stat()

Returns information about a file or directory.

```js
fs.stat(
    "notes.txt",
    (error, stats) => {

        if (error) {
            console.log(error);
            return;
        }

        console.log(stats.size);
        console.log(stats.isFile());
        console.log(stats.isDirectory());

    }
);
```

Useful information includes:

- File size
- File type
- Creation information
- Modification information
- Access information

---

# File System Checks

## access()

Checks whether a file or directory can be accessed.

```js
fs.access(
    "notes.txt",
    fs.constants.R_OK,
    (error) => {

        if (error) {
            console.log("Cannot Read");
            return;
        }

        console.log("Readable");

    }
);
```

Common modes:

```text
F_OK
R_OK
W_OK
X_OK
```

---

## existsSync()

Checks whether a path exists.

```js
const exists = fs.existsSync("uploads");

console.log(exists);
```

It returns `true` or `false`.

`existsSync()` is synchronous and checks existence only. It does not check permissions.

---

## Race Condition Note

Avoid unnecessarily doing this:

```js
if (fs.existsSync("file.txt")) {

    fs.readFile("file.txt");

}
```

The file can change or disappear between the existence check and the actual operation.

Prefer performing the actual operation and handling its error.

```js
fs.readFile(
    "file.txt",
    (error, data) => {

        if (error) {
            return;
        }

        // Use data

    }
);
```

---

# File Watching

## watch()

Monitors files and directories for changes.

```js
const watcher = fs.watch(
    "notes.txt",
    (eventType, filename) => {

        console.log(eventType);
        console.log(filename);

    }
);
```

Common events include:

```text
change
rename
```

The exact behavior can vary across operating systems.

Stop watching:

```js
watcher.close();
```

---

# Streams

Streams are one of the most important parts of the FS module.

Instead of loading an entire file into memory, Streams process data in chunks.

---

## Buffer vs Stream

A Buffer is a temporary memory area used to hold binary data.

A Stream processes data progressively.

Conceptually:

```text
Stream

↓

Small Buffers

↓

Process

↓

Next Small Buffer
```

Streams commonly use Buffers internally.

---

# Types of Streams

Node.js has four major stream types.

```text
Readable
Writable
Duplex
Transform
```

### Readable

Used to read data.

```text
Source
  ↓
Readable Stream
  ↓
Application
```

### Writable

Used to write data.

```text
Application
  ↓
Writable Stream
  ↓
Destination
```

### Duplex

Can read and write.

Example: TCP socket.

### Transform

Can read, transform, and write data.

Examples:

- Compression
- Encryption
- Parsing

---

# Stream Events

Important events include:

```text
data
end
error
finish
close
drain
```

### data

A new chunk is available.

```js
stream.on("data", (chunk) => {

    console.log(chunk);

});
```

### end

A Readable Stream has no more data.

```js
stream.on("end", () => {

    console.log("Reading Complete");

});
```

### finish

A Writable Stream has finished writing.

```js
stream.on("finish", () => {

    console.log("Writing Complete");

});
```

### error

Something went wrong.

```js
stream.on("error", (error) => {

    console.log(error);

});
```

Always handle stream errors.

---

# Stream Modes

Readable Streams have two important modes:

```text
Flowing Mode
Paused Mode
```

### Flowing Mode

Data flows automatically and `data` events are emitted.

```js
stream.on("data", (chunk) => {

});
```

### Paused Mode

Data can be consumed manually.

```js
stream.read();
```

---

# createReadStream()

Creates a Readable Stream for a file.

```js
const stream = fs.createReadStream(
    "movie.mp4"
);
```

Data is read chunk by chunk.

Important events:

```text
data
end
error
close
```

---

# createWriteStream()

Creates a Writable Stream.

```js
const stream = fs.createWriteStream(
    "output.txt"
);
```

Write data:

```js
stream.write("Hello");
```

Finish writing:

```js
stream.end();
```

---

# pipe()

Connects a Readable Stream to a Writable Stream.

```js
readStream.pipe(
    writeStream
);
```

Flow:

```text
Readable
  ↓
pipe()
  ↓
Writable
```

`pipe()` automatically manages data flow and backpressure.

---

# pipeline()

`pipeline()` connects multiple streams while providing better error handling and cleanup.

```js
const { pipeline } = require("node:stream");

pipeline(
    source,
    destination,
    (error) => {

        if (error) {
            console.log(error);
            return;
        }

        console.log("Completed");

    }
);
```

For complex production stream chains, `pipeline()` is generally preferred.

---

# Backpressure

Backpressure occurs when:

```text
Producer

is faster than

Consumer
```

Example:

```text
Fast Disk
   ↓
Readable
   ↓
Slow Network
   ↓
Writable
```

The producer must slow down so the consumer can catch up.

---

# HighWaterMark

`highWaterMark` controls an internal buffering threshold.

It is **not an exact chunk size**.

Example:

```js
const stream = fs.createReadStream(
    "movie.mp4",
    {
        highWaterMark: 1024
    }
);
```

The value influences how much data the stream tries to buffer before applying flow control.

---

# Writable Backpressure

`write()` returns a Boolean.

```js
const canContinue =
    writeStream.write(chunk);
```

If it returns:

```text
true
```

the stream can continue accepting data.

If it returns:

```text
false
```

the producer should wait for:

```text
drain
```

Example:

```js
if (!writeStream.write(chunk)) {

    readStream.pause();

}

writeStream.on("drain", () => {

    readStream.resume();

});
```

`pipe()` and `pipeline()` handle this flow-control mechanism for you.

---

# API Selection Guide

| Requirement | Recommended API |
|-------------|-----------------|
| Read small file | `readFile()` |
| Write small file | `writeFile()` |
| Append data | `appendFile()` |
| Rename / Move | `rename()` |
| Copy file | `copyFile()` |
| Delete file | `unlink()` / `rm()` |
| Delete directory recursively | `rm()` |
| Create directory | `mkdir()` |
| Read directory | `readdir()` |
| File metadata | `stat()` |
| Check permissions | `access()` |
| Simple existence check | `existsSync()` |
| Monitor changes | `watch()` |
| Read large file | `createReadStream()` |
| Write large data | `createWriteStream()` |
| Connect streams | `pipe()` |
| Production stream chain | `pipeline()` |

---

# Production Use Cases

The FS module can be used to build:

- File managers
- Backup systems
- Log processors
- CSV processors
- File upload systems
- File download systems
- Video streaming systems
- Report generators
- Temporary-file cleanup systems
- Large-file processing systems

---

# Project

## Large File Copier

The project demonstrates:

```text
createReadStream()
       ↓
pipeline()
       ↓
createWriteStream()
```

It copies a large file without loading the entire file into memory.

Example:

```text
movie.mp4
   ↓
Readable Stream
   ↓
pipeline()
   ↓
Writable Stream
   ↓
movie-copy.mp4
```

---

# Best Practices

### 1. Prefer Async APIs

Use asynchronous APIs in normal server request handling.

### 2. Use Streams for Large Data

Do not load huge files completely into memory when streaming is more appropriate.

### 3. Handle Errors

Always handle filesystem and stream errors.

### 4. Avoid Unnecessary existsSync()

Do not use existence checks as a replacement for handling errors from the actual operation.

### 5. Use pipeline() for Complex Streams

For multi-stage stream processing:

```js
pipeline(
    source,
    transform,
    destination
);
```

---

# What We Learned

The FS module taught us how Node.js communicates with the file system.

We can now:

```text
Create Files
Read Files
Write Files
Append Files
Rename Files
Copy Files
Delete Files

Create Directories
Read Directories
Remove Directories

Read File Metadata
Check Permissions
Check Existence
Watch Changes

↓

Work With Streams

↓

Handle Backpressure

↓

Use HighWaterMark

↓

Build Large-File Processing Systems
```

---

# FS Module Completion

```text
FS Module

████████████████████████████████ 100%
```

The FS module is complete for our current Node.js roadmap.

Rare or highly specialized filesystem APIs can be learned later when a project requires them.

---

# Important APIs Covered

```text
readFile()
readFileSync()

writeFile()
writeFileSync()

appendFile()
appendFileSync()

rename()
renameSync()

copyFile()
copyFileSync()

unlink()
unlinkSync()

rm()
rmSync()

mkdir()
mkdirSync()

readdir()
readdirSync()

stat()

access()

existsSync()

watch()

createReadStream()

createWriteStream()

pipe()

pipeline()
```

---

# Next Module

## Events Module

The Events module will explain the mechanism behind APIs such as:

```js
stream.on("data", ...);

stream.on("error", ...);

stream.on("end", ...);
```

We will learn:

```text
Event
Event-Driven Programming
EventEmitter
on()
emit()
once()
off()
removeListener()
removeAllListeners()
error Event
Custom EventEmitter
Event-Based Architecture
```

After that, we will build real projects using events.

---

# Final Note

The goal of this module was not to memorize every `fs` method.

The goal was to understand:

```text
How Node.js communicates with the File System
```

and how to choose the correct API based on the problem.

For example:

```text
Small File
   ↓
readFile()
```

while:

```text
Large File
   ↓
createReadStream()
```

and:

```text
Read
   ↓
Transform
   ↓
Write
   ↓
pipeline()
```

This decision-making ability is more important in production than memorizing API names.
