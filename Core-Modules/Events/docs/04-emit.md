# EventEmitter `.emit()`

> Learn how `.emit()` triggers events, passes data to listeners, executes listeners, and returns a value in Node.js.

---

# Table of Contents

- Introduction
- What is `.emit()`?
- Syntax
- Basic Example
- What Happens When emit() Runs?
- Complete Flow
- Event Name Matching
- Passing Data
- Passing Multiple Arguments
- Listener Execution
- Multiple Listeners
- No Listener
- Return Value
- Event Order
- Synchronous Execution
- Calling emit() Multiple Times
- Practical Example
- Production Example
- Common Mistakes
- Interview Questions
- Summary
- What's Next?

---

# Introduction

`.emit()` is used to trigger an event.

If `.on()` means:

```text
"Listen for this event"
```

then `.emit()` means:

```text
"This event has happened."
```

Basic relationship:

```text
.on()

↓

Register Listener
```

and

```text
.emit()

↓

Trigger Event
```

---

# What is `.emit()`?

`.emit()` is a method provided by `EventEmitter`.

It triggers an event and calls the listeners registered for that event.

Example:

```js
emitter.on("login", () => {

    console.log("User logged in");

});

emitter.emit("login");
```

Flow:

```text
on("login")

↓

Listener Registered

        ↓

emit("login")

↓

Listener Executes
```

---

# Syntax

```js
emitter.emit(eventName[, ...args]);
```

The first argument is:

```text
eventName
```

After that, you can pass data to the listeners.

Example:

```js
emitter.emit(
    "login",
    "Rahul"
);
```

Here:

```text
"login"

↓

Event Name

"Rahul"

↓

Event Data
```

---

# Basic Example

```js
const EventEmitter = require("events");

const emitter = new EventEmitter();

emitter.on("login", () => {

    console.log("User logged in");

});

emitter.emit("login");
```

Output:

```text
User logged in
```

---

# What Happens When `emit()` Runs?

Suppose we have:

```js
emitter.on("login", handler);
```

Then:

```js
emitter.emit("login");
```

Conceptually:

```text
emit("login")

↓

Look for listeners registered for "login"

↓

Find handler

↓

Call handler()

↓

handler finishes

↓

emit() returns
```

---

# Complete Flow

```text
1. Create EventEmitter

        ↓

2. Register Listener

        ↓

3. emit("login")

        ↓

4. EventEmitter finds "login" listeners

        ↓

5. Listener executes

        ↓

6. emit() finishes
```

Code:

```js
const EventEmitter = require("events");

const emitter = new EventEmitter();

emitter.on("login", () => {

    console.log("Login Listener");

});

emitter.emit("login");
```

---

# Event Name Matching

The event name passed to `.emit()` must match the event name registered with `.on()`.

Correct:

```js
emitter.on("login", handler);

emitter.emit("login");
```

Flow:

```text
login

=

login

↓

Listener Executes
```

---

Incorrect:

```js
emitter.on("login", handler);

emitter.emit("logout");
```

Flow:

```text
Registered:

login

Emitted:

logout

↓

No matching listener
```

The `login` listener does not execute.

---

# Event Names Are Case-Sensitive

These are different:

```text
login

Login

LOGIN
```

Example:

```js
emitter.on("login", () => {

    console.log("Login");

});

emitter.emit("Login");
```

The listener does not run.

---

# Passing Data

One of the most useful features of `.emit()` is passing data to listeners.

Example:

```js
emitter.on("login", (username) => {

    console.log(`${username} logged in`);

});

emitter.emit("login", "Amit");
```

Output:

```text
Amit logged in
```

Flow:

```text
emit(
    "login",
    "Amit"
)

↓

Event Name

+

Data

↓

Listener

↓

username = "Amit"
```

---

# Passing Multiple Arguments

You can pass multiple values.

Example:

```js
emitter.on(
    "orderCreated",
    (orderId, amount, username) => {

        console.log(orderId);

        console.log(amount);

        console.log(username);

    }
);

emitter.emit(
    "orderCreated",
    101,
    5000,
    "Rahul"
);
```

The listener receives:

```text
orderId

↓

101

amount

↓

5000

username

↓

Rahul
```

---

# Passing an Object

In real applications, passing one object is often easier to manage.

Example:

```js
emitter.on("orderCreated", (order) => {

    console.log(order.id);

    console.log(order.amount);

    console.log(order.userId);

});

emitter.emit(
    "orderCreated",
    {
        id: 101,
        amount: 5000,
        userId: 20
    }
);
```

Flow:

```text
orderCreated

↓

Order Object

↓

Listener
```

This is common in application-level event systems.

---

# Multiple Listeners

One event can have multiple listeners.

Example:

```js
emitter.on("orderCreated", () => {

    console.log("Update Inventory");

});

emitter.on("orderCreated", () => {

    console.log("Send Email");

});

emitter.on("orderCreated", () => {

    console.log("Create Notification");

});
```

Then:

```js
emitter.emit("orderCreated");
```

Output:

```text
Update Inventory

Send Email

Create Notification
```

---

# Listener Execution Order

Listeners normally execute in registration order.

Example:

```js
emitter.on("test", () => {

    console.log("A");

});

emitter.on("test", () => {

    console.log("B");

});

emitter.on("test", () => {

    console.log("C");

});

emitter.emit("test");
```

Output:

```text
A
B
C
```

Flow:

```text
emit("test")

↓

A

↓

B

↓

C

↓

emit() returns
```

---

# No Listener

What happens if we emit an event for which no listener exists?

Example:

```js
const EventEmitter = require("events");

const emitter = new EventEmitter();

emitter.emit("login");

console.log("Done");
```

Output:

```text
Done
```

Nothing happens for the `login` event because no listener was registered.

---

# Return Value

This is an important point.

`.emit()` returns a boolean.

```js
const result = emitter.emit("login");
```

The return value tells you whether the event had **at least one registered listener**.

```text
true

↓

At least one listener existed
```

```text
false

↓

No listener existed
```

Example:

```js
const EventEmitter = require("events");

const emitter = new EventEmitter();

emitter.on("login", () => {

    console.log("Login");

});

const result = emitter.emit("login");

console.log(result);
```

Output:

```text
Login
true
```

---

# Emit Without Listener

```js
const EventEmitter = require("events");

const emitter = new EventEmitter();

const result = emitter.emit("login");

console.log(result);
```

Output:

```text
false
```

Because:

```text
No login listener

↓

false
```

---

# Important: `emit()` Does Not Return Listener Result

Suppose:

```js
emitter.on("test", () => {

    return 100;

});
```

Then:

```js
const result = emitter.emit("test");
```

`result` is **not**:

```text
100
```

It is:

```text
true
```

because `.emit()` returns whether the event had listeners.

This is an important distinction.

---

# Synchronous Execution

EventEmitter listeners are normally executed synchronously.

Example:

```js
const EventEmitter = require("events");

const emitter = new EventEmitter();

emitter.on("test", () => {

    console.log("Listener");

});

console.log("Before");

emitter.emit("test");

console.log("After");
```

Output:

```text
Before

Listener

After
```

Flow:

```text
Before

↓

emit()

↓

Listener Executes

↓

After
```

---

# `emit()` Does Not Automatically Create Async Work

This is a very important concept.

Don't think:

```text
emit()

↓

Event Loop

↓

Listener Later
```

Normal EventEmitter behavior is:

```text
emit()

↓

Call Listener

↓

Listener Finishes

↓

emit() Returns
```

If the listener contains asynchronous work:

```js
emitter.on("test", async () => {

    await someAsyncOperation();

});
```

then the asynchronous behavior comes from that `async` operation.

It is not because `.emit()` itself is asynchronous.

---

# Calling `emit()` Multiple Times

If a listener is registered using `.on()`:

```js
emitter.on("login", () => {

    console.log("Login");

});
```

Then every emission triggers it.

```js
emitter.emit("login");

emitter.emit("login");

emitter.emit("login");
```

Output:

```text
Login

Login

Login
```

Flow:

```text
emit

↓

Listener

emit

↓

Listener

emit

↓

Listener
```

Later, when we study `.once()`, you will see how to make a listener execute only once.

---

# Practical Example

```js
const EventEmitter = require("events");

const emitter = new EventEmitter();

emitter.on("message", (message) => {

    console.log("Received:", message);

});

emitter.emit(
    "message",
    "Hello Node.js"
);
```

Output:

```text
Received: Hello Node.js
```

---

# Production Example

Suppose a user places an order.

We emit:

```js
eventBus.emit(
    "order.created",
    {
        id: 101,
        amount: 5000,
        userId: 20
    }
);
```

Different parts of the application can listen:

```js
eventBus.on(
    "order.created",
    (order) => {

        console.log(
            "Update Inventory:",
            order.id
        );

    }
);
```

Another:

```js
eventBus.on(
    "order.created",
    (order) => {

        console.log(
            "Send Email:",
            order.userId
        );

    }
);
```

Another:

```js
eventBus.on(
    "order.created",
    (order) => {

        console.log(
            "Create Notification:",
            order.id
        );

    }
);
```

When:

```js
eventBus.emit(
    "order.created",
    order
);
```

runs:

```text
order.created

├── Inventory Listener
│
├── Email Listener
│
└── Notification Listener
```

---

# `on()` + `emit()` Together

These two methods form the basic EventEmitter pattern.

```text
              EventEmitter

       ┌─────────────────────┐
       │                     │
       │   on()              │
       │   Register          │
       │   Listener          │
       │                     │
       │        ↓            │
       │                     │
       │   emit()            │
       │   Trigger           │
       │   Event             │
       │                     │
       └─────────────────────┘
```

Simple mental model:

```text
on()

↓

"Tell me when it happens."

emit()

↓

"It happened."
```

---

# Common Mistakes

## Mistake 1 — Thinking `emit()` Registers a Listener

Wrong:

```js
emitter.emit("login", handler);
```

`emit()` triggers an event.

Listener registration is done with:

```js
emitter.on("login", handler);
```

---

## Mistake 2 — Wrong Event Name

```js
emitter.on("user.created", handler);

emitter.emit("userCreated");
```

These are different event names.

---

## Mistake 3 — Thinking `emit()` Returns Listener Result

Wrong:

```text
Listener returns 100

↓

emit() returns 100
```

Correct:

```text
Listener executes

↓

emit() returns true/false
```

---

## Mistake 4 — Thinking `emit()` Is Automatically Asynchronous

Normal behavior:

```text
emit()

↓

Listeners execute synchronously
```

---

## Mistake 5 — Forgetting Multiple Listeners

One event can trigger many listeners.

```text
order.created

↓

Inventory

↓

Email

↓

Notification
```

---

# Interview Questions

### Q1

What does `.emit()` do?

### Q2

What is the syntax of `.emit()`?

### Q3

Can `.emit()` pass data to listeners?

### Q4

Can you pass multiple arguments?

### Q5

What does `.emit()` return?

### Q6

What does `true` from `.emit()` mean?

### Q7

What does `false` from `.emit()` mean?

### Q8

Does `.emit()` return the value returned by a listener?

### Q9

Are listeners executed synchronously?

### Q10

What happens when `.emit()` is called and no listener exists?

### Q11

What happens when the same event is emitted multiple times?

### Q12

What is the relationship between `.on()` and `.emit()`?

---

# Summary

The basic EventEmitter flow is:

```text
Register

↓

.on("event", listener)

↓

Trigger

↓

.emit("event")

↓

Listener Executes
```

Data can be passed:

```js
emitter.emit(
    "login",
    username
);
```

and received:

```js
emitter.on(
    "login",
    (username) => {}
);
```

---

# Key Takeaways

- `.emit()` triggers an event.
- The first argument is the event name.
- Additional arguments are passed to listeners.
- Multiple listeners can react to the same event.
- Listeners normally execute synchronously.
- Listeners normally execute in registration order.
- `.emit()` returns `true` if at least one listener was registered for that event.
- `.emit()` returns `false` if there were no listeners.
- `.emit()` does not return values produced by listeners.
- `.on()` and `.emit()` together form the basic EventEmitter pattern.

---

# Next Chapter

➡️ **05 — `.on()` vs `.once()`**

Ab hum dekhenge:

```text
.on()

↓

Every time event occurs
```

versus

```text
.once()

↓

Only first time
```

Aur ye bhi dekhenge ki `.once()` internally listener ko **automatically remove** kaise karta hai.