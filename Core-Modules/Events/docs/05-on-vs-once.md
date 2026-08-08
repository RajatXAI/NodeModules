# `.on()` vs `.once()`

> Understand the difference between persistent and one-time event listeners in Node.js.

---

# Table of Contents

- Introduction
- `.on()` Recap
- `.once()`
- Syntax
- Basic Example
- `.on()` Behavior
- `.once()` Behavior
- Side-by-Side Comparison
- Multiple Emits
- Internal Concept
- Passing Data
- Multiple `.once()` Listeners
- Removing `.once()` Listeners
- Production Use Cases
- Common Mistakes
- Interview Questions
- Summary
- What's Next?

---

# Introduction

Node.js EventEmitter provides two common ways to register listeners:

```js
.on()
```

and

```js
.once()
```

The main difference is:

```text
.on()

↓

Listener remains registered
↓

Runs every time the event is emitted
```

while:

```text
.once()

↓

Listener runs once
↓

Listener is removed
```

---

# `.on()` Recap

We already learned:

```js
emitter.on("login", handler);
```

The listener stays registered.

Example:

```js
const EventEmitter = require("events");

const emitter = new EventEmitter();

emitter.on("login", () => {

    console.log("Login event");

});

emitter.emit("login");

emitter.emit("login");

emitter.emit("login");
```

Output:

```text
Login event
Login event
Login event
```

Every emission triggers the listener.

---

# `.once()`

`.once()` registers a listener that should execute only once.

Example:

```js
const EventEmitter = require("events");

const emitter = new EventEmitter();

emitter.once("login", () => {

    console.log("Login event");

});

emitter.emit("login");

emitter.emit("login");

emitter.emit("login");
```

Output:

```text
Login event
```

The first emission executes the listener.

After that, the listener is no longer registered for that `.once()` registration.

---

# Syntax

```js
emitter.once(eventName, listener);
```

Example:

```js
emitter.once("connection", () => {

    console.log("First connection");

});
```

---

# Basic Example

```js
const EventEmitter = require("events");

const emitter = new EventEmitter();

emitter.once("start", () => {

    console.log("Application Started");

});

emitter.emit("start");

emitter.emit("start");
```

Output:

```text
Application Started
```

Only the first `emit()` triggers the listener.

---

# `.on()` Behavior

Suppose:

```js
emitter.on("test", handler);
```

Then:

```text
emit #1

↓

handler

emit #2

↓

handler

emit #3

↓

handler

emit #4

↓

handler
```

The registration stays active.

---

# `.once()` Behavior

Suppose:

```js
emitter.once("test", handler);
```

Then:

```text
emit #1

↓

handler

↓

Listener Removed

emit #2

↓

Nothing

emit #3

↓

Nothing
```

---

# Side-by-Side Comparison

| Feature | `.on()` | `.once()` |
|---|---|---|
| Registers listener | ✅ | ✅ |
| Runs on first emit | ✅ | ✅ |
| Runs on second emit | ✅ | ❌ |
| Runs on future emits | ✅ | ❌ |
| Listener remains registered | ✅ | ❌ after first execution |
| Useful for repeated events | ✅ | ❌ |
| Useful for one-time events | ❌ | ✅ |

---

# Multiple Emits

## Using `.on()`

```js
emitter.on("message", () => {

    console.log("Message received");

});

emitter.emit("message");

emitter.emit("message");

emitter.emit("message");
```

Output:

```text
Message received
Message received
Message received
```

---

## Using `.once()`

```js
emitter.once("message", () => {

    console.log("Message received");

});

emitter.emit("message");

emitter.emit("message");

emitter.emit("message");
```

Output:

```text
Message received
```

---

# Internal Concept

Conceptually, when you write:

```js
emitter.once("ready", handler);
```

you can think of Node.js as creating a one-time listener registration.

Conceptually:

```text
"ready"

↓

Wrapper Listener

↓

handler()
```

When the event occurs:

```text
emit("ready")

↓

Wrapper Runs

↓

handler()

↓

Remove This Registration

↓

Done
```

So after the first matching emission:

```text
"ready"

↓

No longer has that once-registration
```

This is the important behavior to understand.

---

# Why Does `.once()` Need a Wrapper?

Suppose you write:

```js
emitter.once("login", handler);
```

Node.js needs some mechanism that knows:

```text
"This listener must be removed after its first execution."
```

Conceptually, it can use an internal wrapper around your listener:

```text
EventEmitter

↓

once wrapper

↓

your handler
```

The wrapper handles the one-time behavior.

You don't need to manually implement this when using `.once()`.

---

# Passing Data

`.once()` can receive event data just like `.on()`.

Example:

```js
emitter.once("payment", (amount) => {

    console.log(
        "Payment received:",
        amount
    );

});

emitter.emit("payment", 5000);
```

Output:

```text
Payment received: 5000
```

If you emit again:

```js
emitter.emit("payment", 7000);
```

nothing happens for that `.once()` registration.

---

# Multiple `.once()` Listeners

You can register multiple one-time listeners for the same event.

```js
emitter.once("ready", () => {

    console.log("Listener A");

});

emitter.once("ready", () => {

    console.log("Listener B");

});
```

Then:

```js
emitter.emit("ready");
```

Output:

```text
Listener A

Listener B
```

Both listeners execute once.

After that:

```js
emitter.emit("ready");
```

will not execute either of those registrations again.

---

# `.on()` and `.once()` Together

You can use both for the same event.

Example:

```js
emitter.on("ready", () => {

    console.log("Persistent Listener");

});

emitter.once("ready", () => {

    console.log("One-Time Listener");

});
```

First emission:

```js
emitter.emit("ready");
```

Output:

```text
Persistent Listener

One-Time Listener
```

Second emission:

```js
emitter.emit("ready");
```

Output:

```text
Persistent Listener
```

Why?

```text
.on()

↓

Still registered
```

while:

```text
.once()

↓

Already removed
```

---

# Listener Order

If listeners are registered like this:

```js
emitter.on("test", () => {

    console.log("A");

});

emitter.once("test", () => {

    console.log("B");

});

emitter.on("test", () => {

    console.log("C");

});
```

Then the first emission normally executes them in registration order:

```text
A

B

C
```

After the first emission, the `.once()` registration is gone.

Second emission:

```text
A

C
```

---

# Removing a `.once()` Listener Before It Runs

This is an important advanced point.

Suppose:

```js
function handleReady() {

    console.log("Ready");

}

emitter.once("ready", handleReady);
```

If you remove it before the event occurs:

```js
emitter.off("ready", handleReady);
```

then:

```js
emitter.emit("ready");
```

will not execute that listener.

The important idea is that Node.js tracks the original listener relationship even though `.once()` uses internal machinery to implement one-time behavior.

---

# Production Use Cases

`.once()` is useful when something should happen only once.

---

## 1. Application Initialization

```text
Application Started

↓

"ready"

↓

Initialize Component

↓

Only Once
```

Example:

```js
emitter.once("ready", () => {

    console.log("Initialize application");

});
```

---

## 2. Database Connection Ready

```text
Database Connected

↓

"db.ready"

↓

Initial Setup

↓

Only Once
```

---

## 3. First Connection

```text
Server

↓

First Connection

↓

Initialize Resource

↓

Only Once
```

---

## 4. One-Time Initialization

Suppose an expensive resource should be initialized only once.

```js
emitter.once("initialize", () => {

    console.log("Initialize expensive resource");

});
```

Even if:

```js
emitter.emit("initialize");
```

is called multiple times,

the initialization listener runs only once.

---

## 5. Test Setup

A test environment might need one-time initialization:

```text
Test Suite Started

↓

Setup

↓

Tests
```

`.once()` can be useful for one-time setup events.

---

# Production Example

Imagine a server.

We want to perform some setup the first time the application becomes ready.

```js
const EventEmitter = require("events");

const appEvents = new EventEmitter();

appEvents.once("ready", () => {

    console.log("Initialize application resources");

});

appEvents.emit("ready");

appEvents.emit("ready");

appEvents.emit("ready");
```

Output:

```text
Initialize application resources
```

Only once.

---

# Important Production Warning

`.once()` does **not** mean:

> "Run this operation only once across the entire application lifetime."

It means:

> "For this particular listener registration, execute it at most once for matching emissions."

For example:

```js
emitter.once("ready", handler);
```

If you later register it again:

```js
emitter.once("ready", handler);
```

you have created another registration.

So `.once()` is about the **listener registration**, not some global guarantee.

---

# Common Mistakes

## Mistake 1 — Using `.on()` for One-Time Events

If something should only happen once:

```js
emitter.on("ready", initialize);
```

may run repeatedly.

Use:

```js
emitter.once("ready", initialize);
```

when that behavior matches your requirement.

---

## Mistake 2 — Thinking `.once()` Means Async

It does not.

`.once()` controls:

```text
How many times the listener executes
```

It does not control:

```text
Sync vs Async
```

A `.once()` listener is normally invoked synchronously as part of `emit()`.

---

## Mistake 3 — Thinking `.once()` Removes the Event

It does not remove the event name.

It removes the **one-time listener registration after it runs**.

Other listeners for the same event can still exist.

Example:

```text
"ready"

├── .on() listener
│
└── .once() listener
```

After the first emission:

```text
"ready"

└── .on() listener
```

The event itself still exists.

---

## Mistake 4 — Registering `.once()` Too Late

Suppose the event has already happened:

```js
emitter.emit("ready");

emitter.once("ready", handler);
```

The listener will not execute retroactively.

Events are not stored for future listeners by default.

---

# Interview Questions

### Q1

What is the difference between `.on()` and `.once()`?

### Q2

How many times can a `.once()` listener execute?

### Q3

What happens to a `.once()` listener after its first execution?

### Q4

Can multiple `.once()` listeners exist for the same event?

### Q5

Can `.on()` and `.once()` be used for the same event?

### Q6

Does `.once()` make the listener asynchronous?

### Q7

Does `.once()` remove the event itself?

### Q8

Can a `.once()` listener be removed before it executes?

### Q9

What happens if you register the same function with `.once()` twice?

### Q10

What is the main production use case for `.once()`?

---

# Summary

## `.on()`

```text
Register

↓

Event

↓

Execute

↓

Remain Registered
```

---

## `.once()`

```text
Register

↓

First Event

↓

Execute

↓

Remove Registration
```

---

# Key Takeaways

- `.on()` creates a persistent listener registration.
- `.once()` creates a one-time listener registration.
- `.once()` runs at most once for that registration.
- After execution, the `.once()` listener registration is removed.
- `.once()` does not make code asynchronous.
- Multiple `.once()` listeners can exist for the same event.
- `.on()` and `.once()` can be used together.
- `.once()` is useful for initialization and other one-time events.
- `.once()` does not remove the event itself.
- Events that happened before a listener was registered are not replayed automatically.

---

# Next Chapter

➡️ **06 — `off()` / `removeListener()`**

Ab hum dekhenge ki registered listener ko manually kaise remove karte hain:

```js
emitter.off("login", handler);
```

Aur sabse important:

```text
Listener ko remove karne ke liye

↓

same function reference

kyu chahiye?
```

Ye concept EventEmitter ke memory management aur long-running Node.js applications ke liye important hai.