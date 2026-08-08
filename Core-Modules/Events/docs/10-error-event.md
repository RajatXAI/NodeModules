# The `error` Event

> Understand why the `error` event is special in Node.js EventEmitter and how to handle it safely.

---

# Table of Contents

- Introduction
- What is the `error` Event?
- Why is `error` Special?
- Basic Example
- What Happens Without an Error Listener?
- Handling the Error Event
- Error Object
- Multiple Error Listeners
- Error Listener Execution
- `try/catch` vs `error` Event
- Streams and Error Events
- Production Example
- Error Event and Process Crash
- Common Mistakes
- Production Best Practices
- Interview Questions
- Summary
- What's Next?

---

# Introduction

So far we have worked with events such as:

```text
login
logout
order.created
data
end
finish
```

These are normal events.

Node.js also has a special event name:

```text
error
```

The `error` event needs special attention.

---

# What is the `error` Event?

An EventEmitter can emit an error:

```js
emitter.emit(
    "error",
    new Error("Something went wrong")
);
```

A listener can handle it:

```js
emitter.on(
    "error",
    (error) => {

        console.log(error.message);

    }
);
```

---

# Why is `error` Special?

For most normal events:

```js
emitter.emit("login");
```

If nobody is listening:

```text
Nothing happens
```

But for:

```js
emitter.emit(
    "error",
    error
);
```

if there is no appropriate `error` listener, Node.js treats this as an **uncaught error condition** and the process can terminate.

This is the major difference.

---

# Basic Example

```js
const EventEmitter = require("events");

const emitter = new EventEmitter();

emitter.on(
    "error",
    (error) => {

        console.log(
            "Error:",
            error.message
        );

    }
);

emitter.emit(
    "error",
    new Error("Database failed")
);
```

Output:

```text
Error: Database failed
```

Because an `error` listener was registered.

---

# What Happens Without an Error Listener?

Consider:

```js
const EventEmitter = require("events");

const emitter = new EventEmitter();

emitter.emit(
    "error",
    new Error("Something went wrong")
);
```

There is no:

```js
emitter.on("error", ...)
```

listener.

Node.js treats this as an unhandled `'error'` event.

The process will throw the error and can terminate.

You may see an error similar to:

```text
Error: Something went wrong
```

followed by a stack trace.

---

# Important Rule

Whenever an EventEmitter can emit an `error` event, make sure the error is handled appropriately.

For example:

```js
emitter.on(
    "error",
    (error) => {

        console.error(error);

    }
);
```

---

# Handling the Error Event

Basic pattern:

```js
const EventEmitter = require("events");

const emitter = new EventEmitter();

emitter.on(
    "error",
    (error) => {

        console.error(
            "Something went wrong:",
            error.message
        );

    }
);

emitter.emit(
    "error",
    new Error("Payment failed")
);
```

Flow:

```text
error emitted

↓

error listener

↓

Error object

↓

Handle / Log / React
```

---

# Error Object

Usually the emitted value is an `Error` object.

Example:

```js
const error =
    new Error("Database connection failed");
```

Then:

```js
emitter.emit(
    "error",
    error
);
```

Listener:

```js
emitter.on(
    "error",
    (error) => {

        console.log(
            error.message
        );

    }
);
```

Output:

```text
Database connection failed
```

---

# Useful Error Properties

An `Error` object commonly provides:

```js
error.message
```

and:

```js
error.stack
```

Example:

```js
emitter.on(
    "error",
    (error) => {

        console.log(
            error.message
        );

        console.log(
            error.stack
        );

    }
);
```

---

# Multiple Error Listeners

You can have multiple listeners for `"error"`.

Example:

```js
emitter.on(
    "error",
    (error) => {

        console.log(
            "Logger:",
            error.message
        );

    }
);

emitter.on(
    "error",
    (error) => {

        console.log(
            "Monitoring:",
            error.message
        );

    }
);
```

Then:

```js
emitter.emit(
    "error",
    new Error("Server failed")
);
```

Both listeners can run.

Output:

```text
Logger: Server failed

Monitoring: Server failed
```

---

# Error Listener Execution

Like other EventEmitter listeners, registered error listeners are normally invoked synchronously by `emit()`.

Example:

```js
console.log("Before");

emitter.emit(
    "error",
    new Error("Failed")
);

console.log("After");
```

If an error listener exists:

```text
Before

↓

Error Listener

↓

After
```

---

# `try/catch` vs `error` Event

These are different mechanisms.

## `try/catch`

Used for exceptions thrown in synchronous code or errors that propagate through an async operation such as a rejected Promise when you `await` it.

Example:

```js
try {

    throw new Error("Failed");

} catch (error) {

    console.log(
        error.message
    );

}
```

---

## EventEmitter `error`

Used when an EventEmitter emits an `"error"` event:

```js
emitter.emit(
    "error",
    error
);
```

Handle it with:

```js
emitter.on(
    "error",
    handler
);
```

---

# Important Difference

These are not automatically interchangeable.

This:

```js
emitter.emit(
    "error",
    new Error("Failed")
);
```

is an EventEmitter event.

This:

```js
throw new Error("Failed");
```

is a JavaScript exception.

They follow different error propagation mechanisms.

---

# Streams and Error Events

This concept is directly connected to the FS Streams module you already completed.

You have written:

```js
const fs = require("fs");

const stream =
    fs.createReadStream(
        "missing.txt"
    );

stream.on(
    "error",
    (error) => {

        console.log(
            error.message
        );

    }
);
```

Why did we do this?

Because streams can emit:

```text
error
```

when something goes wrong.

For example:

```text
File does not exist

↓

Readable Stream

↓

error event

↓

Error Listener
```

---

# Without Stream Error Handling

If a stream emits an unhandled `error` event, the process can terminate.

That's why this is important:

```js
stream.on(
    "error",
    handleError
);
```

---

# `pipeline()` and Error Handling

When using:

```js
const { pipeline } =
    require("stream");
```

you can provide a callback:

```js
pipeline(
    source,
    destination,
    (error) => {

        if (error) {

            console.error(
                error.message
            );

            return;
        }

        console.log(
            "Completed"
        );

    }
);
```

`pipeline()` provides a structured way to receive errors from the pipeline.

This is one reason it is preferred over manually managing complex stream chains.

---

# Production Example

Suppose an application has an internal EventEmitter.

```js
const EventEmitter = require("events");

const eventBus =
    new EventEmitter();

eventBus.on(
    "error",
    (error) => {

        console.error(
            "Event Bus Error:",
            error
        );

    }
);
```

Now another part of the application can report an error:

```js
eventBus.emit(
    "error",
    new Error(
        "Order processing failed"
    )
);
```

The registered error listener receives it.

---

# Error Event and Process Crash

This is the key behavior to remember:

```text
Normal Event

↓

No Listener

↓

Usually Nothing Happens
```

But:

```text
"error" Event

↓

No Error Listener

↓

Unhandled Error

↓

Process Can Terminate
```

This is why `"error"` is special.

---

# Important Production Understanding

Handling an `error` event does **not** automatically mean:

> "The application is now safe."

You still need to decide what to do with the error.

Possible actions:

```text
Log

↓

Monitor

↓

Retry

↓

Cleanup

↓

Return Error

↓

Close Resource

↓

Gracefully Shut Down
```

The correct action depends on the type of failure.

---

# Example: File Processing

Suppose:

```text
File Upload

↓

Processing

↓

Error
```

You might:

```text
Stop Processing

↓

Delete Partial File

↓

Log Error

↓

Notify Client
```

---

# Example: Database Connection

Suppose:

```text
Database Connection

↓

Error
```

You may need:

```text
Log Error

↓

Retry Connection

or

↓

Gracefully Shut Down
```

Simply logging:

```js
console.log(error);
```

may not be enough.

---

# Common Mistakes

## Mistake 1 — Treating `error` Like a Normal Event

This is dangerous:

```js
emitter.emit(
    "error",
    error
);
```

without an appropriate error listener.

---

## Mistake 2 — Assuming `try/catch` Always Catches It

This:

```js
try {

    emitter.emit(
        "error",
        new Error("Failed")
    );

} catch (error) {

    console.log(error);

}
```

can catch the thrown exception that results from an unhandled `'error'` event in that synchronous call, but this is **not a replacement for registering an `error` listener** on an EventEmitter whose lifecycle can emit errors.

For EventEmitter-based APIs, the proper pattern is generally:

```js
emitter.on(
    "error",
    handleError
);
```

---

## Mistake 3 — Ignoring Errors

Bad:

```js
emitter.on(
    "error",
    () => {}
);
```

This technically handles the event but throws away useful information.

Better:

```js
emitter.on(
    "error",
    (error) => {

        console.error(
            error
        );

    }
);
```

And in production, decide the correct recovery or shutdown strategy.

---

## Mistake 4 — Assuming Every Error Can Be Recovered From

Some errors are recoverable:

```text
Temporary Network Failure
```

Some may require shutting down a component or process:

```text
Unrecoverable State
```

Error handling should be based on the actual failure.

---

# Production Best Practices

### 1. Handle `error` events for EventEmitters that can emit them

```js
emitter.on(
    "error",
    handleError
);
```

---

### 2. Log useful information

Prefer:

```js
console.error(
    error
);
```

rather than hiding the error.

---

### 3. Cleanup Resources

Depending on the failure:

```text
Close File

Close Socket

Release Connection

Delete Partial Data
```

---

### 4. Don't blindly continue

After a serious failure, continuing with corrupted or incomplete state can create larger problems.

---

### 5. Use `pipeline()` for Stream Pipelines

For stream processing:

```js
pipeline(
    source,
    transform,
    destination,
    callback
);
```

provides centralized error handling and cleanup.

---

# Interview Questions

### Q1

Why is the `"error"` event special?

### Q2

What happens when an EventEmitter emits `"error"` without an error listener?

### Q3

How do you handle an EventEmitter error?

### Q4

Does `try/catch` and the `error` event use the same mechanism?

### Q5

Why do Node.js Streams commonly have an `"error"` event?

### Q6

What is the difference between:

```js
throw new Error()
```

and:

```js
emitter.emit("error", error)
```

### Q7

Can multiple `"error"` listeners exist?

### Q8

Are error listeners automatically asynchronous?

### Q9

Is logging an error always enough for production?

### Q10

Why is error handling important in long-running Node.js applications?

---

# Summary

Normal event:

```text
emit("login")

↓

No listener

↓

Usually nothing happens
```

Error event:

```text
emit("error", error)

↓

No error listener

↓

Unhandled error

↓

Process can terminate
```

With an error listener:

```text
emit("error", error)

↓

error listener

↓

Handle Error
```

---

# Key Takeaways

- `"error"` is a special EventEmitter event.
- An unhandled `"error"` event can cause the Node.js process to terminate.
- Register an appropriate error listener when an EventEmitter can emit errors.
- Error listeners receive the error object.
- Multiple error listeners can exist.
- Error listeners are normally called synchronously by `emit()`.
- `try/catch` and EventEmitter error handling are different mechanisms.
- Streams commonly emit `"error"` events.
- `pipeline()` provides structured stream error handling.
- Production error handling may require logging, cleanup, retrying, or graceful shutdown depending on the failure.

---

# EventEmitter API Covered So Far

```text
✅ on()

   Register listener

✅ emit()

   Trigger event

✅ once()

   Register one-time listener

✅ off()

   Remove specific listener

✅ removeListener()

   Remove specific listener

✅ removeAllListeners()

   Remove multiple/all listeners

✅ listenerCount()

   Count listeners

✅ eventNames()

   Inspect event names

✅ error

   Handle EventEmitter errors
```

---

# Next Chapter

➡️ **11 — Custom EventEmitter**

Ab tak humne existing `EventEmitter` object use kiya hai.

Ab hum apna khud ka event-based class/system banayenge:

```text
Custom Class

↓

extends EventEmitter

↓

Custom Methods

↓

emit()

↓

Custom Events

↓

Listeners
```

Yahi concept baad me **application-level Event Bus** aur production event-driven architecture samajhne ki foundation banega.