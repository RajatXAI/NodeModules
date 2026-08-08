# EventEmitter

> Learn what `EventEmitter` is, how it stores listeners, how events are emitted, and how listeners are executed in Node.js.

---

# Table of Contents

- Introduction
- What is EventEmitter?
- Importing EventEmitter
- Creating an EventEmitter
- Registering a Listener
- Emitting an Event
- Complete Flow
- Multiple Listeners
- Passing Data
- Event Names
- Listener Execution
- Is EventEmitter Asynchronous?
- Internal Concept
- EventEmitter in Node.js
- Streams and EventEmitter
- Production Example
- Common Mistakes
- Interview Questions
- Summary
- What's Next?

---

# Introduction

`EventEmitter` is a class provided by Node.js through the `events` module.

It allows an object to:

```text
Register Listeners

↓

Emit Events

↓

Execute Listeners

↓

Remove Listeners
```

The basic idea is:

```text
Something Happens

↓

emit()

↓

Listeners React
```

---

# What is EventEmitter?

Import it from Node.js:

```js
const EventEmitter = require("events");
```

`EventEmitter` is a class.

We can create an object from it:

```js
const emitter = new EventEmitter();
```

Now `emitter` can work with events.

---

# Creating an EventEmitter

```js
const EventEmitter = require("events");

const emitter = new EventEmitter();
```

We now have:

```text
EventEmitter Object

        ↓

Can Register Listeners

        ↓

Can Emit Events
```

---

# Registering a Listener

We use:

```js
emitter.on()
```

Example:

```js
emitter.on("login", () => {

    console.log("User logged in");

});
```

This means:

> When the `login` event is emitted, execute this function.

At this point, the event has **not happened yet**.

We have only registered a listener.

---

# Emitting an Event

We use:

```js
emitter.emit()
```

Example:

```js
emitter.emit("login");
```

Now the event happens.

Flow:

```text
emit("login")

↓

Find "login" Listeners

↓

Execute Listener

↓

"User logged in"
```

---

# Complete Example

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

# Complete Flow

The complete process is:

```text
1. Create EventEmitter

        ↓

2. Register Listener

        ↓

3. Event Occurs

        ↓

4. emit()

        ↓

5. EventEmitter Finds Listener

        ↓

6. Listener Function Executes
```

Code representation:

```js
const EventEmitter = require("events");

const emitter = new EventEmitter();

// Register
emitter.on("login", () => {

    console.log("Login Listener");

});

// Emit
emitter.emit("login");
```

---

# Important Point

This:

```js
emitter.on("login", listener);
```

does **not** execute `listener` immediately.

It registers the function.

The function executes when:

```js
emitter.emit("login");
```

runs.

---

# Multiple Listeners

One event can have multiple listeners.

Example:

```js
emitter.on("login", () => {

    console.log("Create Session");

});

emitter.on("login", () => {

    console.log("Send Notification");

});

emitter.on("login", () => {

    console.log("Update Analytics");

});
```

Now:

```js
emitter.emit("login");
```

will trigger all three listeners.

Flow:

```text
login

├── Create Session
│
├── Send Notification
│
└── Update Analytics
```

---

# Listener Execution Order

Listeners are normally executed in the order they were registered.

Example:

```js
emitter.on("test", () => {

    console.log("First");

});

emitter.on("test", () => {

    console.log("Second");

});

emitter.on("test", () => {

    console.log("Third");

});

emitter.emit("test");
```

Output:

```text
First
Second
Third
```

So the registration order matters.

---

# Passing Data

Events can carry data.

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
emit()

↓

"login"

+

"Amit"

↓

Listener

↓

username = "Amit"
```

---

# Passing Multiple Values

You can pass multiple arguments.

```js
emitter.on("orderCreated", (orderId, amount) => {

    console.log(orderId);

    console.log(amount);

});

emitter.emit(
    "orderCreated",
    101,
    5000
);
```

Output:

```text
101
5000
```

The arguments passed to `emit()` after the event name are received by the listener.

---

# Event Names

Event names are usually strings.

Examples:

```js
"login"

"logout"

"userCreated"

"orderCreated"

"paymentSuccess"
```

Example:

```js
emitter.on("userCreated", listener);

emitter.emit("userCreated");
```

The event name used by `on()` and `emit()` must match.

This:

```js
emitter.on("login", listener);

emitter.emit("logout");
```

will not execute the listener.

Why?

Because:

```text
Registered Event

↓

login
```

but:

```text
Emitted Event

↓

logout
```

They are different events.

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

The listener will not run.

---

# Listener Execution

One very important thing:

`EventEmitter` listeners are normally executed **synchronously**.

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

Why?

Because:

```text
emit()

↓

Listener Executes

↓

emit() Returns

↓

Next Line
```

---

# EventEmitter Is Not Automatically Asynchronous

This is an important concept.

Many people think:

```text
EventEmitter

=

Async
```

❌ Not necessarily.

EventEmitter itself does not automatically put listeners into the Event Loop queue.

If you call:

```js
emitter.emit("test");
```

the listeners are normally called immediately during that `emit()` call.

---

# Async Listener Example

You can still make a listener asynchronous.

```js
emitter.on("test", async () => {

    await someAsyncOperation();

    console.log("Done");

});
```

But the listener being `async` is your choice.

EventEmitter itself is not what makes it asynchronous.

---

# Internal Concept

Conceptually, you can think of an EventEmitter as maintaining a mapping between:

```text
Event Name

↓

Listeners
```

For example:

```text
"login"

↓

[
    listener1,
    listener2
]

"logout"

↓

[
    listener3
]

"orderCreated"

↓

[
    listener4,
    listener5
]
```

When:

```js
emitter.emit("login");
```

happens,

EventEmitter conceptually does:

```text
Find "login"

↓

Get registered listeners

↓

Call listener1

↓

Call listener2
```

This is a conceptual model of the internal behavior; the actual implementation details can vary by Node.js version.

---

# EventEmitter and Streams

You have already used EventEmitter through Streams.

Example:

```js
const fs = require("fs");

const stream = fs.createReadStream("file.txt");

stream.on("data", (chunk) => {

    console.log(chunk);

});
```

The stream exposes EventEmitter-style methods.

Conceptually:

```text
Readable Stream

is an EventEmitter-based object

        ↓

.on()

        ↓

Listen for "data"

        ↓

Stream emits "data"

        ↓

Callback executes
```

That is why this works:

```js
stream.on("data", callback);
```

---

# EventEmitter and HTTP

Later, when we study Node.js HTTP, you will see event-driven behavior there too.

For example, request and response objects expose stream/event APIs.

Conceptually:

```text
HTTP Request

↓

Events

↓

Application
```

This is one reason EventEmitter is such an important Node.js concept.

---

# Production Example

Suppose we have a user registration system.

```js
const EventEmitter = require("events");

const eventBus = new EventEmitter();

eventBus.on("userRegistered", (user) => {

    console.log(
        `Send welcome email to ${user.email}`
    );

});

eventBus.on("userRegistered", (user) => {

    console.log(
        `Create notification for ${user.name}`
    );

});

const user = {

    name: "Amit",

    email: "amit@example.com"

};

eventBus.emit("userRegistered", user);
```

Flow:

```text
User Registered

↓

userRegistered Event

        ↓
        ├── Email Listener
        │
        └── Notification Listener
```

This is a simple example of event-driven application design.

---

# Common Mistakes

## 1. Calling the Listener Instead of Passing It

Incorrect:

```js
emitter.on("login", login());
```

This executes `login()` immediately.

Correct:

```js
emitter.on("login", login);
```

Now the function is registered as a listener.

---

## 2. Wrong Event Name

```js
emitter.on("userCreated", listener);

emitter.emit("usercreated");
```

These are different because event names are case-sensitive.

---

## 3. Assuming emit() Is Asynchronous

Incorrect understanding:

```text
emit()

↓

Event Loop

↓

Listener Later
```

Normal behavior is:

```text
emit()

↓

Listener Executes Immediately

↓

emit() Returns
```

---

## 4. Forgetting That Multiple Listeners Can Exist

One event can have many listeners.

```text
orderCreated

├── Inventory
├── Payment
├── Email
└── Notification
```

---

# Interview Questions

### Q1

What is `EventEmitter`?

### Q2

How do you create an EventEmitter?

### Q3

What does `.on()` do?

### Q4

What does `.emit()` do?

### Q5

Can one event have multiple listeners?

### Q6

In what order are listeners normally executed?

### Q7

Are EventEmitter listeners automatically asynchronous?

### Q8

How can you pass data to an EventEmitter listener?

### Q9

Why are Streams able to use `.on("data")`?

### Q10

What happens if the event name passed to `emit()` doesn't match the registered event name?

---

# Summary

The basic EventEmitter pattern is:

```text
Create

↓

Register

↓

Emit

↓

Listener Executes
```

Example:

```js
const EventEmitter = require("events");

const emitter = new EventEmitter();

emitter.on("hello", (name) => {

    console.log(`Hello ${name}`);

});

emitter.emit("hello", "Amit");
```

---

# Key Takeaways

- `EventEmitter` is provided by Node.js's `events` module.
- It allows objects to emit events and register listeners.
- `.on()` registers a listener.
- `.emit()` triggers an event.
- One event can have multiple listeners.
- Listeners are normally executed in registration order.
- Arguments can be passed through `emit()`.
- Event names are case-sensitive.
- EventEmitter itself does not automatically make code asynchronous.
- Streams use the EventEmitter mechanism for events such as `data`, `end`, and `error`.

---

# Next Chapter

➡️ **03 — `on()`**

Now we will focus completely on:

```js
emitter.on(eventName, listener);
```

We will understand:

```text
What exactly gets registered?

↓

Can we register multiple listeners?

↓

What arguments does on() accept?

↓

How does listener removal work later?

↓

What happens when the same function is registered multiple times?
```

These details will make `on()` completely clear before we move to `emit()`.