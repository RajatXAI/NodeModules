# `removeAllListeners()`

> Learn how to remove multiple EventEmitter listeners and why `removeAllListeners()` should be used carefully in production applications.

---

# Table of Contents

- Introduction
- What is `removeAllListeners()`?
- Syntax
- Remove All Listeners for One Event
- Remove All Listeners for All Events
- Basic Example
- `off()` vs `removeAllListeners()`
- Complete Flow
- Multiple Events
- Return Value
- Removing Listeners During Runtime
- Production Example
- Why It Can Be Dangerous
- Safer Alternative
- Common Mistakes
- Interview Questions
- Summary
- What's Next?

---

# Introduction

We already learned:

```js
emitter.off(
    "login",
    handleLogin
);
```

This removes a **specific listener**.

But sometimes we need to remove:

```text
All listeners for one event
```

or:

```text
All listeners registered on the EventEmitter
```

For this, Node.js provides:

```js
removeAllListeners()
```

---

# What is `removeAllListeners()`?

`removeAllListeners()` removes listeners from an EventEmitter.

It can be used in two ways:

### Remove listeners for one event

```js
emitter.removeAllListeners("login");
```

### Remove listeners for all events

```js
emitter.removeAllListeners();
```

---

# Syntax

## Specific Event

```js
emitter.removeAllListeners(eventName);
```

Example:

```js
emitter.removeAllListeners("login");
```

This removes all listeners registered for:

```text
login
```

---

## All Events

```js
emitter.removeAllListeners();
```

This removes all listeners from that EventEmitter.

---

# Basic Example

```js
const EventEmitter = require("events");

const emitter = new EventEmitter();

emitter.on("login", () => {

    console.log("Login Listener 1");

});

emitter.on("login", () => {

    console.log("Login Listener 2");

});

emitter.emit("login");
```

Output:

```text
Login Listener 1

Login Listener 2
```

Now remove all `login` listeners:

```js
emitter.removeAllListeners("login");
```

Then:

```js
emitter.emit("login");
```

Nothing happens.

---

# Complete Flow

Before removal:

```text
login

├── Listener 1
└── Listener 2
```

Run:

```js
emitter.removeAllListeners("login");
```

After removal:

```text
login

└── No Listeners
```

Then:

```js
emitter.emit("login");
```

No listener executes.

---

# Multiple Events

Suppose:

```js
emitter.on("login", loginHandler);

emitter.on("logout", logoutHandler);

emitter.on("orderCreated", orderHandler);
```

Conceptually:

```text
login
└── loginHandler

logout
└── logoutHandler

orderCreated
└── orderHandler
```

Now:

```js
emitter.removeAllListeners("login");
```

Result:

```text
login
└── No Listener

logout
└── logoutHandler

orderCreated
└── orderHandler
```

Only the `login` listeners were removed.

---

# Removing All Listeners for All Events

Now:

```js
emitter.removeAllListeners();
```

Result:

```text
login
└── No Listener

logout
└── No Listener

orderCreated
└── No Listener
```

Everything registered on that EventEmitter is removed.

---

# `off()` vs `removeAllListeners()`

This is very important.

## `off()`

```js
emitter.off(
    "login",
    handleLogin
);
```

Removes:

```text
One specific listener registration
```

---

## `removeAllListeners(event)`

```js
emitter.removeAllListeners(
    "login"
);
```

Removes:

```text
All listeners for "login"
```

---

## `removeAllListeners()`

```js
emitter.removeAllListeners();
```

Removes:

```text
All listeners for all events
```

---

# Comparison

| Method | What it removes |
|---|---|
| `off(event, listener)` | One specific listener |
| `removeAllListeners(event)` | All listeners for one event |
| `removeAllListeners()` | All listeners for all events |

---

# Example Comparison

Suppose:

```text
login

├── A
├── B
└── C
```

### Using `off()`

```js
emitter.off("login", handlerA);
```

Result:

```text
login

├── B
└── C
```

---

### Using `removeAllListeners("login")`

```js
emitter.removeAllListeners("login");
```

Result:

```text
login

└── Nothing
```

---

### Using `removeAllListeners()`

```js
emitter.removeAllListeners();
```

Result:

```text
All events

└── Nothing
```

---

# Return Value

`removeAllListeners()` returns the same EventEmitter instance.

Example:

```js
const result =
    emitter.removeAllListeners("login");

console.log(
    result === emitter
);
```

Output:

```text
true
```

This allows chaining.

```js
emitter
    .removeAllListeners("login")
    .removeAllListeners("logout");
```

---

# Removing Listeners During Runtime

Listeners can be removed while the application is running.

Example:

```js
const EventEmitter = require("events");

const emitter = new EventEmitter();

function listenerA() {

    console.log("A");

}

function listenerB() {

    console.log("B");

}

emitter.on("test", listenerA);

emitter.on("test", listenerB);

emitter.emit("test");

emitter.removeAllListeners("test");

emitter.emit("test");
```

Output:

```text
A

B
```

The second `emit()` produces no listener output.

---

# Production Example

Imagine a temporary feature.

```text
Feature Started

↓

Register Several Listeners

↓

Feature Running

↓

Feature Stopped

↓

Remove Its Listeners
```

For example:

```js
const featureEvents =
    new EventEmitter();

featureEvents.on(
    "data",
    handleData
);

featureEvents.on(
    "error",
    handleError
);
```

When the feature is completely shutting down:

```js
featureEvents.removeAllListeners();
```

This can make sense if:

> **the EventEmitter belongs exclusively to that feature.**

That last point is extremely important.

---

# Why Can It Be Dangerous?

Imagine one shared EventEmitter:

```js
const eventBus =
    new EventEmitter();
```

Different parts of your application use it.

```text
Application Event Bus

├── Authentication
├── Orders
├── Payments
├── Notifications
└── Analytics
```

Suppose Authentication does:

```js
eventBus.removeAllListeners();
```

Now:

```text
Authentication Listeners
↓

Removed

Orders Listeners
↓

Removed

Payments Listeners
↓

Removed

Notifications Listeners
↓

Removed

Analytics Listeners
↓

Removed
```

This can break unrelated parts of your application.

---

# Production Rule

Avoid doing this on a shared EventEmitter:

```js
sharedEventBus.removeAllListeners();
```

unless you intentionally own and control the entire EventEmitter.

---

# Safer Alternative

If you only need to remove your listener:

```js
eventBus.off(
    "user.created",
    handleUserCreated
);
```

This is much safer.

You only remove what you registered.

---

# Better Architecture

Instead of one global EventEmitter being controlled by everything:

```text
Global EventEmitter

↓

Everyone Adds Listeners

↓

Everyone Removes Listeners
```

prefer clear ownership.

For example:

```text
Order Module

↓

Order EventEmitter
```

```text
Notification Module

↓

Notification EventEmitter
```

or use carefully designed application-level event APIs.

---

# `removeAllListeners(event)` Is Safer, But Still Needs Care

This:

```js
emitter.removeAllListeners(
    "login"
);
```

is narrower than:

```js
emitter.removeAllListeners();
```

But it can still remove listeners registered by other components.

Suppose:

```text
login

├── Authentication Listener
├── Analytics Listener
└── Audit Listener
```

Then:

```js
emitter.removeAllListeners("login");
```

removes all three.

So even event-specific removal can be dangerous on a shared EventEmitter.

---

# When Should You Use It?

Good use case:

```text
Private EventEmitter

↓

Owned by One Component

↓

Component Shuts Down

↓

Remove All Listeners
```

Example:

```js
class Worker {

    constructor() {

        this.events =
            new EventEmitter();

    }

    destroy() {

        this.events.removeAllListeners();

    }

}
```

Here the Worker owns its EventEmitter.

So removing all listeners is reasonable.

---

# When Should You Avoid It?

Be careful when:

```text
Shared EventEmitter

+

Multiple Modules

+

Multiple Teams

```

because:

```js
removeAllListeners()
```

can affect unrelated listeners.

---

# Common Mistakes

## Mistake 1 — Using `removeAllListeners()` Instead of `off()`

If you only want to remove one listener:

```js
emitter.off(
    "login",
    handleLogin
);
```

is better.

Don't do:

```js
emitter.removeAllListeners(
    "login"
);
```

unless you really want every `login` listener removed.

---

## Mistake 2 — Clearing a Shared Event Bus

Avoid:

```js
sharedBus.removeAllListeners();
```

unless the entire bus is intentionally being shut down/reset.

---

## Mistake 3 — Thinking It Removes the Event Name

It doesn't.

The event name can still be emitted:

```js
emitter.emit("login");
```

There are simply no listeners registered for it after removal.

---

## Mistake 4 — Thinking It Removes the EventEmitter Object

It doesn't.

The EventEmitter object still exists.

Only listener registrations are removed.

---

# Interview Questions

### Q1

What does `removeAllListeners()` do?

### Q2

How do you remove all listeners for one event?

### Q3

How do you remove all listeners for all events?

### Q4

What is the difference between `off()` and `removeAllListeners()`?

### Q5

Why can `removeAllListeners()` be dangerous?

### Q6

When is `removeAllListeners()` appropriate?

### Q7

Does `removeAllListeners()` remove the EventEmitter object?

### Q8

What does `removeAllListeners()` return?

### Q9

If an EventEmitter has listeners for `login` and `logout`, what happens when you call:

```js
emitter.removeAllListeners("login");
```

### Q10

Why is `off()` generally safer when working with a shared EventEmitter?

---

# Summary

There are three important listener-removal patterns:

```text
off(event, listener)

↓

Remove One Specific Listener
```

```text
removeAllListeners(event)

↓

Remove All Listeners For One Event
```

```text
removeAllListeners()

↓

Remove All Listeners For All Events
```

---

# Key Takeaways

- `removeAllListeners()` removes multiple listener registrations.
- Passing an event name removes all listeners for that event.
- Passing no event name removes all listeners from the EventEmitter.
- It returns the EventEmitter instance.
- It does not remove the EventEmitter object.
- It does not remove the event name itself.
- On shared EventEmitters, it can accidentally remove listeners belonging to other modules.
- `off()` is safer when you only need to remove your own listener.
- `removeAllListeners()` is most appropriate when you own the EventEmitter and are cleaning up its complete lifecycle.

---

# Next Chapter

➡️ **08 — `listenerCount()`**

Ab hum listener ko remove karna nahi, balki **check karna** seekhenge:

```js
emitter.listenerCount("login");
```

Isse pata chalega:

```text
"login" event ke kitne listeners currently registered hain?
```

Ye debugging, monitoring aur EventEmitter lifecycle samajhne ke liye useful hai.