# Buffer

> Learn what a Buffer is, why Node.js uses it, and how it works with the File System module.

---

# Table of Contents

- Introduction
- Why Does Node.js Need Buffer?
- What is a Buffer?
- Why Not Use String?
- Internal Working
- Creating a Buffer
- Buffer Methods
- Buffer with readFileSync()
- Production Use Cases
- Best Practices
- Common Mistakes
- Interview Questions
- Summary
- Next Chapter

---

# Introduction

Whenever Node.js reads data from a file, network, or stream, it first receives the data in binary format.

Instead of converting everything into a string immediately, Node.js stores the data inside a **Buffer**.

A Buffer is a temporary memory area used to store raw binary data.

---

# Why Does Node.js Need Buffer?

Computers understand only binary data.

```
01001000

01100101

01101100

01101100

01101111
```

Hum humans binary nahi padh sakte.

Hum padhte hain

```
Hello
```

Node.js pehle binary data ko Buffer me store karta hai.

Agar tum encoding (`utf8`) doge to Buffer ko String me convert kar dega.

---

# What is a Buffer?

A Buffer is an object that stores raw binary data.

Example

```js
const fs = require("fs");

const data = fs.readFileSync("data.txt");

console.log(data);
```

Output

```text
<Buffer 48 65 6c 6c 6f>
```

Ye String nahi hai.

Ye Buffer object hai.

---

# Why Not Use String?

Suppose tum ek image read kar rahe ho.

```
photo.jpg
```

Kya image ko String me convert kar sakte ho?

❌ No.

Image binary data hoti hai.

Isi liye Node.js pehle Buffer use karta hai.

Ye same logic apply hota hai

- Images
- Videos
- PDFs
- Audio
- ZIP Files

---

# Internal Working

Without Encoding

```js
fs.readFileSync("data.txt");
```

Flow

```
Disk

↓

Binary Data

↓

Buffer

↓

Application
```

---

With Encoding

```js
fs.readFileSync(
    "data.txt",
    "utf8"
);
```

Flow

```
Disk

↓

Binary Data

↓

Buffer

↓

UTF-8 Conversion

↓

String

↓

Application
```

---

# Creating a Buffer

```js
const buffer = Buffer.from("Hello");

console.log(buffer);
```

Output

```text
<Buffer 48 65 6c 6c 6f>
```

---

# Converting Buffer to String

```js
const buffer = Buffer.from("Hello");

console.log(buffer.toString());
```

Output

```text
Hello
```

---

# Buffer Methods

### Create Buffer

```js
Buffer.from("Hello");
```

---

### Convert to String

```js
buffer.toString();
```

---

### Length

```js
buffer.length;
```

---

### Access Byte

```js
buffer[0];
```

Output

```text
72
```

---

# Buffer with readFileSync()

Without Encoding

```js
const fs = require("fs");

const data = fs.readFileSync("data.txt");

console.log(data);
```

Output

```text
<Buffer 48 65 6c 6c 6f>
```

---

With Encoding

```js
const data = fs.readFileSync(
    "data.txt",
    "utf8"
);

console.log(data);
```

Output

```text
Hello
```

---

# Production Use Cases

Buffer is commonly used while working with

- Images
- Videos
- PDFs
- Audio Files
- Network Packets
- Streams
- File Uploads
- Encryption

---

# Best Practices

✅ Use encoding when reading text files.

✅ Use Buffer for binary data.

✅ Convert Buffer to String only when required.

---

# Common Mistakes

### Forgetting Encoding

```js
fs.readFileSync("data.txt");
```

Returns a Buffer, not a String.

---

### Treating Every File as Text

Images and videos should not be converted to strings.

---

# Interview Questions

### Q1

What is a Buffer?

---

### Q2

Why does `readFileSync()` return a Buffer?

---

### Q3

How do you convert a Buffer to a String?

---

### Q4

When should you use a Buffer?

---

### Q5

Can Buffer store images?

---

# Summary

| Feature | Description |
|----------|-------------|
| Stores | Binary Data |
| Type | Global Class |
| Used For | Files, Streams, Network |
| Convert to String | `toString()` |
| Created Using | `Buffer.from()` |

---

# Key Takeaways

- A Buffer stores raw binary data.
- Node.js uses Buffers while reading files without an encoding.
- Text files can be converted into strings using an encoding or `toString()`.
- Buffers are essential when working with binary files such as images, videos, PDFs, and streams.

---

# Next Chapter

➡️ **05 - fs.readFile()**