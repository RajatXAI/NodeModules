# EventEmitter + Streams

> Understand how Node.js Streams use the EventEmitter pattern to communicate data, completion, errors, and backpressure.

---

# Table of Contents

- Introduction
- Why Streams Need Events
- Streams and EventEmitter
- Readable Stream Events
- `data`
- `end`
- `error`
- `close`
- Writable Stream Events
- `finish`
- `drain`
- `error`
- `close`
- Complete Readable Flow
- Complete Writable Flow
- `pipe()` and Events
- Error Flow
- Backpressure and Events
- Important Difference: Data vs Event
- Production Example
- Common Mistakes
- Interview Questions
- Summary
- What's Next?

---

# Introduction

Tumne FS module me Streams already padhi hain.

Example:

```js
const fs = require("fs");

const stream =
    fs.createReadStream("file.txt");
```

Phir humne:

```js
stream.on(
    "data",
    (chunk) => {

        console.log(chunk);

    }
);
```

Yahan ek important question hai:

> `stream.on("data", ...)` kaise possible hai?

Because Node.js Streams expose EventEmitter-style behavior.

Conceptually:

```text
Readable Stream

↓

EventEmitter behavior

↓

.on()

↓

.emit()
```

---

# Why Streams Need Events?

Stream ka data ek hi baar available nahi hota.

Suppose file:

```text
50 GB
```

Agar Node.js ko pura file memory me load karna pade:

```text
50 GB file

↓

RAM

↓

50 GB memory
```

Ye inefficient ho sakta hai.

Instead:

```text
File

↓

Chunk 1

↓

Chunk 2

↓

Chunk 3

↓

...

↓

Chunk N
```

Application ko har chunk ke available hone ki information chahiye.

Isi communication ke liye events useful hain.

---

# Streams and EventEmitter

Conceptually:

```text
Readable Stream

├── data
├── end
├── error
└── close
```

Aur:

```text
Writable Stream

├── drain
├── finish
├── error
└── close
```

Isliye hum likh sakte hain:

```js
stream.on(
    "data",
    handler
);
```

and:

```js
stream.on(
    "error",
    handler
);
```

---

# Readable Stream Events

Readable streams commonly expose events such as:

```text
data
end
error
close
readable
```

Sabka purpose alag hai.

---

# `data`

`data` event tab useful hota hai jab readable stream flowing mode me data provide kar rahi hoti hai.

Example:

```js
const fs = require("fs");

const stream =
    fs.createReadStream(
        "file.txt"
    );

stream.on(
    "data",
    (chunk) => {

        console.log(
            "Received chunk"
        );

    }
);
```

Conceptually:

```text
File

↓

Chunk available

↓

"data"

↓

Listener

↓

Next chunk
```

---

# `data` Event Data Carry Karta Hai

Ye important hai.

```js
stream.on(
    "data",
    (chunk) => {

        console.log(chunk);

    }
);
```

`chunk` event ke saath pass hota hai.

So:

```text
Event

+

Data
```

Example:

```text
"data"

↓

chunk
```

---

# `end`

Readable stream jab successfully apna data consume karne ke liye provide kar chuki hoti hai, to:

```text
end
```

event signal deta hai ki stream ke readable side par aur data nahi hai.

Example:

```js
stream.on(
    "end",
    () => {

        console.log(
            "Reading completed"
        );

    }
);
```

Flow:

```text
data

↓

data

↓

data

↓

end
```

---

# Important

`end` ka matlab:

```text
Readable side has no more data
```

It does not simply mean:

```text
"Everything in the entire application is finished."
```

It's specifically about the readable stream's end-of-data condition.

---

# `error`

Readable stream me error ho sakta hai.

Example:

```js
const stream =
    fs.createReadStream(
        "missing.txt"
    );

stream.on(
    "error",
    (error) => {

        console.error(
            error.message
        );

    }
);
```

Flow:

```text
Open File

↓

Failure

↓

error event

↓

Error Listener
```

---

# Why Is This Important?

Remember:

```text
"error"
```

is special for EventEmitter.

So stream errors need proper handling.

---

# `close`

Readable streams can also emit:

```text
close
```

This indicates that the underlying resource has been closed.

Example:

```js
stream.on(
    "close",
    () => {

        console.log(
            "Stream closed"
        );

    }
);
```

Important:

```text
close
```

and:

```text
end
```

are not the same concept.

---

# `end` vs `close`

## `end`

Means:

```text
Readable stream has no more data.
```

---

## `close`

Means:

```text
Underlying resource has been closed.
```

A stream may close after ending, but the exact sequence depends on the stream implementation and options.

---

# Writable Stream Events

Writable streams have their own lifecycle.

Example:

```js
const fs = require("fs");

const stream =
    fs.createWriteStream(
        "output.txt"
    );
```

Common events include:

```text
drain
finish
error
close
```

---

# `finish`

When data has been successfully flushed to the underlying system for a writable stream and the writable side has completed, the stream emits:

```text
finish
```

Example:

```js
const stream =
    fs.createWriteStream(
        "output.txt"
    );

stream.write(
    "Hello World"
);

stream.end();

stream.on(
    "finish",
    () => {

        console.log(
            "Writing completed"
        );

    }
);
```

Better practice is generally to register listeners before starting/ending the operation:

```js
const stream =
    fs.createWriteStream(
        "output.txt"
    );

stream.on(
    "finish",
    () => {

        console.log(
            "Writing completed"
        );

    }
);

stream.write(
    "Hello World"
);

stream.end();
```

---

# `finish` Does Not Mean `close`

This distinction is important.

```text
finish

↓

Writable side completed
```

while:

```text
close

↓

Underlying resource closed
```

They represent different lifecycle events.

---

# `drain`

`drain` is related to **backpressure**.

Suppose:

```js
stream.write(data);
```

returns:

```js
false
```

That means:

```text
Writable buffer is full/high-water threshold reached

↓

Don't keep writing blindly

↓

Wait for "drain"
```

Example:

```js
if (!stream.write(data)) {

    stream.once(
        "drain",
        () => {

            console.log(
                "Can continue writing"
            );

        }
    );

}
```

---

# `drain` Flow

```text
write()

↓

Buffer gets full

↓

write() returns false

↓

Pause / stop writing

↓

Data gets consumed

↓

drain

↓

Resume writing
```

This is one of the most important Stream + EventEmitter connections.

---

# `error` on Writable Stream

Writable streams can also emit:

```js
stream.on(
    "error",
    (error) => {

        console.error(error);

    }
);
```

For example:

```text
Disk Error

↓

Writable Stream

↓

error

↓

Error Listener
```

---

# `close` on Writable Stream

A writable stream can also emit:

```js
stream.on(
    "close",
    () => {

        console.log(
            "Resource closed"
        );

    }
);
```

Again:

```text
finish

≠

close
```

---

# Complete Readable Flow

A simplified successful flow:

```text
createReadStream()

↓

Open resource

↓

data

↓

data

↓

data

↓

...

↓

end

↓

close
```

The exact lifecycle can vary by stream type and options, so treat this as a conceptual flow rather than a universal event sequence.

---

# Complete Writable Flow

Conceptually:

```text
createWriteStream()

↓

write()

↓

write()

↓

write()

↓

end()

↓

finish

↓

close
```

Again, exact `close` behavior depends on the underlying stream/resource.

---

# `pipe()` and Events

Now connect this with one of the most useful Stream APIs:

```js
readable.pipe(writable);
```

Example:

```js
const fs = require("fs");

const readable =
    fs.createReadStream(
        "input.txt"
    );

const writable =
    fs.createWriteStream(
        "output.txt"
    );

readable.pipe(
    writable
);
```

Conceptually:

```text
Readable

↓

data

↓

Writable

↓

write()
```

The stream machinery handles the flow between them.

---

# `pipe()` Is More Than Just `data → write()`

Conceptually, `pipe()` connects the lifecycle and flow-control behavior of the streams.

```text
Readable

↓

Data

↓

Writable

↓

Backpressure

↓

Pause / Resume
```

This is why manually doing:

```js
readable.on(
    "data",
    (chunk) => {

        writable.write(chunk);

    }
);
```

is not always equivalent to using:

```js
readable.pipe(
    writable
);
```

`pipe()` manages important flow-control behavior for you.

---

# Error Flow

Suppose:

```text
Readable Stream

↓

Error
```

Then:

```text
Readable

↓

error event
```

Similarly:

```text
Writable

↓

Error

↓

error event
```

Each stream can emit its own errors.

---

# Important `pipe()` Error Point

Don't assume that:

```js
readable.pipe(writable);
```

automatically gives you the complete error-handling strategy you need for every production scenario.

You should understand the lifecycle and use appropriate error handling.

For complex pipelines, prefer:

```js
const { pipeline } =
    require("stream");
```

Example:

```js
pipeline(
    readable,
    writable,
    (error) => {

        if (error) {

            console.error(
                "Pipeline failed:",
                error
            );

            return;
        }

        console.log(
            "Pipeline completed"
        );

    }
);
```

---

# Why `pipeline()` Is Useful

For multiple streams:

```text
Readable

↓

Transform

↓

Transform

↓

Writable
```

manually managing:

```text
error

close

cleanup

```

can become complicated.

`pipeline()` provides a more structured way to connect the streams and handle completion/failure.

---

# Backpressure and Events

This is where EventEmitter becomes practically important.

Suppose:

```text
Readable

↓

FAST

↓

Writable

↓

SLOW
```

If the readable keeps producing data faster than the writable can consume it:

```text
Readable

↓

↓

↓

Writable Buffer

↓

FULL
```

Eventually:

```js
writable.write(chunk)
```

can return:

```text
false
```

Then the producer should respect backpressure.

Later:

```text
drain
```

signals that writing can continue.

---

# Backpressure Flow

```text
Readable
   │
   │ data
   ▼
Writable
   │
   │ write()
   ▼
Buffer
   │
   │ full
   ▼
write() → false
   │
   ▼
Stop / wait
   │
   ▼
drain
   │
   ▼
Continue
```

So:

```text
EventEmitter

+

Streams

+

Backpressure
```

work together.

---

# Important Difference: Data vs Event

A stream's:

```text
data
```

is an event.

But the:

```text
chunk
```

is the payload delivered with that event.

Example:

```js
stream.on(
    "data",
    (chunk) => {

        // "data" = event name
        // chunk = event payload

    }
);
```

Conceptually:

```text
emit(
    "data",
    chunk
)
```

The exact internal implementation of every stream event should not be assumed to literally be a direct call to `EventEmitter.emit()` at every point, but the EventEmitter-style model is the right abstraction.

---

# Production Example

Suppose you're processing a huge file.

```text
10 GB File

↓

Readable Stream

↓

Chunks

↓

Transform

↓

Writable Stream

↓

Output File
```

Events can communicate:

```text
Readable

├── data
├── end
└── error
```

Transform:

```text
├── data
├── end
└── error
```

Writable:

```text
├── drain
├── finish
└── error
```

---

# Complete Conceptual Flow

```text
              10 GB File
                   │
                   ▼
           Readable Stream
                   │
                data
                   │
                   ▼
           Transform Stream
                   │
                data
                   │
                   ▼
           Writable Stream
                   │
             write(chunk)
                   │
                   ▼
              Output File
```

If writable becomes slow:

```text
write() → false

↓

Backpressure

↓

drain

↓

Continue
```

If something fails:

```text
error

↓

Error Handling
```

When reading completes:

```text
end
```

When writing completes:

```text
finish
```

---

# Common Mistakes

## Mistake 1 — Thinking `data` Event Means Event Loop

Wrong.

```text
data event

≠

Event Loop
```

The stream may be driven by asynchronous I/O, but the event itself is an EventEmitter-style notification.

---

## Mistake 2 — Ignoring `error`

Bad:

```js
stream.on(
    "data",
    handler
);
```

when the stream can fail and you haven't provided appropriate error handling.

Better:

```js
stream.on(
    "error",
    handleError
);
```

---

## Mistake 3 — Confusing `end` and `finish`

Remember:

```text
Readable → end

Writable → finish
```

---

## Mistake 4 — Confusing `finish` and `close`

They represent different lifecycle states.

```text
finish

↓

Writable side completed
```

```text
close

↓

Underlying resource closed
```

---

## Mistake 5 — Ignoring Backpressure

Bad pattern:

```js
readable.on(
    "data",
    (chunk) => {

        writable.write(chunk);

    }
);
```

This can ignore the return value of `write()` and cause excessive buffering.

For straightforward readable → writable transfer, prefer:

```js
readable.pipe(
    writable
);
```

or:

```js
pipeline(
    readable,
    writable,
    callback
);
```

---

# Interview Questions

### Q1

Why do Node.js Streams use EventEmitter-style events?

### Q2

What does the `data` event provide?

### Q3

What does `end` mean on a Readable stream?

### Q4

What does `finish` mean on a Writable stream?

### Q5

What is the difference between `end` and `finish`?

### Q6

What is the purpose of the `drain` event?

### Q7

How is backpressure related to `drain`?

### Q8

Why should stream errors be handled?

### Q9

Why is `pipeline()` often preferable for complex stream pipelines?

### Q10

Does EventEmitter itself make Streams asynchronous?

---

# Summary

Streams use EventEmitter-style events to communicate lifecycle and data-flow information.

Readable:

```text
data
end
error
close
```

Writable:

```text
drain
finish
error
close
```

The important connection is:

```text
Stream

↓

Events

↓

Listeners
```

---

# Key Takeaways

- Node.js Streams expose EventEmitter-style APIs.
- `data` delivers chunks from a readable stream.
- `end` signals that a readable stream has no more data.
- `finish` signals completion of the writable side.
- `drain` is related to writable backpressure.
- `error` signals stream failure and needs appropriate handling.
- `close` indicates resource closure.
- `pipe()` connects readable and writable streams while managing flow control.
- `pipeline()` provides structured pipeline completion and error handling.
- EventEmitter itself is not what makes the stream I/O asynchronous.
- Streams + events + backpressure form an important part of Node.js's high-performance I/O model.

---

# EventEmitter Module Progress

We have now covered:

```text
01  Introduction
02  EventEmitter
03  on()
04  emit()
05  on() vs once()
06  off() / removeListener()
07  removeAllListeners()
08  listenerCount()
09  eventNames()
10  error Event
11  Custom EventEmitter
12  Event Bus
13  EventEmitter Internals
14  EventEmitter + Event Loop
15  EventEmitter + Streams
```

---

# Next Chapter

➡️ **16 — EventEmitter Project: Real-Time Application Logger**

Ab theory ko ek real mini-project me use karenge.

Hum banayenge:

```text
Application
     │
     ▼
Event Bus
     │
     ├── Request Logger
     ├── Error Logger
     ├── Audit Logger
     └── Statistics
```

Example:

```text
User Login
     │
     ▼
"user.login"
     │
     ├── Console Logger
     ├── File Logger
     └── Audit Logger
```

Is project me tum practically use karoge:

```text
EventEmitter
on()
emit()
off()
error
custom events
Event Bus
listener lifecycle
```

Yani ab EventEmitter ke concepts ko ek **real backend-style use case** me combine karenge.