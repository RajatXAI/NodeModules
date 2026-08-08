# `eventNames()`

> Learn how to get the event names that currently have listeners registered on an EventEmitter.

---

# Table of Contents

- Introduction
- What is `eventNames()`?
- Syntax
- Basic Example
- Multiple Events
- No Events
- Return Value
- String Event Names
- Symbol Event Names
- `eventNames()` vs `listenerCount()`
- `eventNames()` vs `emit()`
- After Removing Listeners
- Production Use Cases
- Debugging Example
- Common Mistakes
- Interview Questions
- Summary
- What's Next?

---

# Introduction

We already learned:

```js
emitter.listenerCount("login");
```

This tells us:

> How many listeners are registered for `login`?

But suppose we don't even know which events are registered.

For that, we can use:

```js
emitter.eventNames();
```

It returns the event names that currently have listeners registered.

---

# What is `eventNames()`?

`eventNames()` returns an array containing the event names for which the EventEmitter currently has listeners.

Example:

```js
const events = emitter.eventNames();
```

Possible result:

```js
[
    "login",
    "logout",
    "order.created"
]
```

---

# Syntax

```js
emitter.eventNames();
```

No arguments are required.

It returns:

```text
Array
```

containing the registered event names.

---

# Basic Example

```js
const EventEmitter = require("events");

const emitter = new EventEmitter();

emitter.on("login", () => {});

emitter.on("logout", () => {});

console.log(
    emitter.eventNames()
);
```

Output:

```text
[
    "login",
    "logout"
]
```

---

# Multiple Events

Suppose:

```js
emitter.on("login", loginHandler);

emitter.on("logout", logoutHandler);

emitter.on("order.created", orderHandler);
```

Conceptually:

```text
EventEmitter

├── login
├── logout
└── order.created
```

Now:

```js
console.log(
    emitter.eventNames()
);
```

Output:

```js
[
    "login",
    "logout",
    "order.created"
]
```

---

# Important Point

`eventNames()` returns **event names**, not listener functions.

For example:

```js
function handleLogin() {}

emitter.on(
    "login",
    handleLogin
);
```

Then:

```js
emitter.eventNames();
```

returns:

```js
[
    "login"
]
```

It does not return:

```js
[
    handleLogin
]
```

---

# No Events

If there are no registered listeners:

```js
const EventEmitter = require("events");

const emitter = new EventEmitter();

console.log(
    emitter.eventNames()
);
```

Output:

```js
[]
```

Because:

```text
No Listener Registrations

↓

No Event Names
```

---

# Return Value

`eventNames()` returns an array.

Example:

```js
const names =
    emitter.eventNames();

console.log(
    Array.isArray(names)
);
```

Output:

```text
true
```

---

# String Event Names

Most event names are strings.

Example:

```js
emitter.on("login", handler);

emitter.on("logout", handler);
```

Then:

```js
emitter.eventNames();
```

returns:

```js
[
    "login",
    "logout"
]
```

---

# Symbol Event Names

Node.js EventEmitter also supports `Symbol` values as event names.

Example:

```js
const EventEmitter = require("events");

const emitter = new EventEmitter();

const loginEvent =
    Symbol("login");

emitter.on(
    loginEvent,
    () => {

        console.log("Login");

    }
);
```

Now:

```js
console.log(
    emitter.eventNames()
);
```

will include the Symbol:

```text
[
    Symbol(login)
]
```

So event names returned by `eventNames()` can be:

```text
String

or

Symbol
```

---

# Why Use Symbol Event Names?

Symbols can help avoid accidental event-name collisions.

Suppose different modules use:

```text
"data"
```

as an event name.

A Symbol creates a unique event identity.

Example:

```js
const EVENT_A =
    Symbol("data");

const EVENT_B =
    Symbol("data");
```

Even though both have the description:

```text
"data"
```

they are different Symbols.

```js
EVENT_A === EVENT_B
```

returns:

```text
false
```

This is an advanced feature and is not needed for most normal application events.

---

# `eventNames()` vs `listenerCount()`

These two methods are both inspection methods, but they answer different questions.

## `eventNames()`

```js
emitter.eventNames();
```

asks:

> Which event names currently have listeners?

Example:

```js
[
    "login",
    "logout",
    "order.created"
]
```

---

## `listenerCount()`

```js
emitter.listenerCount("login");
```

asks:

> How many listeners does this particular event have?

Example:

```text
2
```

---

# Example

Suppose:

```js
emitter.on("login", listenerA);

emitter.on("login", listenerB);

emitter.on("logout", listenerC);
```

Then:

```js
emitter.eventNames();
```

returns:

```js
[
    "login",
    "logout"
]
```

while:

```js
emitter.listenerCount("login");
```

returns:

```text
2
```

and:

```js
emitter.listenerCount("logout");
```

returns:

```text
1
```

---

# `eventNames()` vs `emit()`

These methods have completely different purposes.

### `eventNames()`

```js
emitter.eventNames();
```

means:

```text
"Tell me which event names have listeners."
```

It only inspects the EventEmitter.

---

### `emit()`

```js
emitter.emit("login");
```

means:

```text
"Trigger the login event."
```

It executes the matching listeners.

---

# After Removing Listeners

This is useful to understand.

Suppose:

```js
function loginHandler() {}

emitter.on(
    "login",
    loginHandler
);

console.log(
    emitter.eventNames()
);
```

Output:

```text
[
    "login"
]
```

Now:

```js
emitter.off(
    "login",
    loginHandler
);
```

Check again:

```js
console.log(
    emitter.eventNames()
);
```

The `login` event will no longer appear if there are no remaining listeners for it.

Output:

```text
[]
```

---

# Multiple Listeners and Removal

Suppose:

```js
function handlerA() {}

function handlerB() {}

emitter.on(
    "login",
    handlerA
);

emitter.on(
    "login",
    handlerB
);
```

Current state:

```text
login

├── handlerA
└── handlerB
```

So:

```js
emitter.eventNames();
```

returns:

```text
[
    "login"
]
```

Now remove one:

```js
emitter.off(
    "login",
    handlerA
);
```

There is still:

```text
login

└── handlerB
```

So:

```js
emitter.eventNames();
```

still returns:

```text
[
    "login"
]
```

Remove the second:

```js
emitter.off(
    "login",
    handlerB
);
```

Now:

```text
login

└── No Listeners
```

So:

```js
emitter.eventNames();
```

returns:

```text
[]
```

---

# `removeAllListeners()` and `eventNames()`

Suppose:

```js
emitter.on("login", handlerA);

emitter.on("logout", handlerB);

emitter.on("order.created", handlerC);
```

Then:

```js
emitter.eventNames();
```

returns:

```js
[
    "login",
    "logout",
    "order.created"
]
```

Now:

```js
emitter.removeAllListeners();
```

All listener registrations are removed.

Then:

```js
emitter.eventNames();
```

returns:

```js
[]
```

---

# Production Use Case — Debugging

Suppose your application uses an EventEmitter as an internal event bus.

You can inspect it:

```js
console.log(
    eventBus.eventNames()
);
```

Possible output:

```text
[
    "user.created",
    "order.created",
    "payment.success",
    "notification.send"
]
```

This gives you a quick view of which event types currently have listeners.

---

# Production Use Case — Debugging Event Registration

Suppose you expect:

```text
user.created
order.created
```

but get:

```text
[
    "user.created",
    "order.created",
    "order.created.retry",
    "debug.test"
]
```

This can indicate that some component registered additional events.

`eventNames()` can help during debugging.

---

# Production Use Case — Lifecycle Inspection

Imagine a component:

```text
Component Start

↓

Register Listeners

↓

Component Running

↓

Component Stop

↓

Remove Listeners
```

You can inspect before cleanup:

```js
console.log(
    emitter.eventNames()
);
```

and after cleanup:

```js
console.log(
    emitter.eventNames()
);
```

This can help verify that the component properly cleaned up its listeners.

---

# Important Production Point

`eventNames()` is mainly an **inspection/debugging API**.

You normally should not design application logic like:

```js
if (
    emitter.eventNames().includes(
        "someEvent"
    )
) {

    // Core business logic
}
```

unless there is a specific reason.

A better design is:

```text
Clearly Defined Events

+

Clearly Defined Listener Ownership

+

Proper Lifecycle

↓

Predictable Event System
```

---

# Common Mistakes

## Mistake 1 — Thinking It Returns Listener Functions

It returns:

```text
Event Names
```

not:

```text
Listener Functions
```

---

## Mistake 2 — Thinking It Triggers Events

This:

```js
emitter.eventNames();
```

does not execute listeners.

Only:

```js
emitter.emit("event");
```

triggers them.

---

## Mistake 3 — Thinking Every Event Name Is Returned Forever

An event name appears only when the EventEmitter has listener registrations associated with it.

If all listeners for an event are removed, that event name no longer appears.

---

## Mistake 4 — Forgetting Symbols

Event names can be:

```text
String

or

Symbol
```

So don't always assume every returned value is a string.

---

# Interview Questions

### Q1

What does `eventNames()` do?

### Q2

What does it return?

### Q3

What happens when there are no listeners?

### Q4

Does `eventNames()` return listener functions?

### Q5

Can EventEmitter event names be Symbols?

### Q6

What is the difference between `eventNames()` and `listenerCount()`?

### Q7

What happens to an event name after all its listeners are removed?

### Q8

Does `eventNames()` trigger any listeners?

### Q9

Why can `eventNames()` be useful for debugging?

### Q10

What happens to `eventNames()` after `removeAllListeners()`?

---

# Summary

Use:

```js
emitter.eventNames();
```

to inspect the event names that currently have listeners.

Example:

```text
EventEmitter

├── login
├── logout
└── order.created
```

Then:

```js
emitter.eventNames();
```

returns:

```js
[
    "login",
    "logout",
    "order.created"
]
```

---

# Key Takeaways

- `eventNames()` returns currently registered event names.
- It returns an array.
- The array can contain strings and Symbols.
- It does not execute listeners.
- It is mainly useful for inspection and debugging.
- An event name disappears when it no longer has any listeners.
- `listenerCount()` tells you how many listeners a specific event has.
- `eventNames()` tells you which event names currently have listeners.
- `removeAllListeners()` can make `eventNames()` return an empty array.

---

# Node.js EventEmitter API So Far

We have now covered:

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
```

---

# Next Chapter

➡️ **10 — The `error` Event**

Ab hum EventEmitter ke **sabse important special cases** me se ek cover karenge.

Normal event:

```js
emitter.emit("login");
```

Lekin:

```js
emitter.emit("error", error);
```

ka behavior special hai.

Hum dekhenge:

```text
error event special kyu hai?

↓

Error listener nahi hua to kya hota hai?

↓

Process crash kyu ho sakta hai?

↓

Production me errors kaise handle karne hain?
```

Ye chapter skip nahi karna hai, because production Node.js applications me `error` event ka proper handling bahut important hai.