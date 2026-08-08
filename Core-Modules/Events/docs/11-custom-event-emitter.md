# Custom EventEmitter

> Learn how to create custom classes based on Node.js EventEmitter and build your own event-driven components.

---

# Table of Contents

- Introduction
- Why Create a Custom EventEmitter?
- Extending EventEmitter
- Basic Custom EventEmitter
- Constructor
- Custom Methods
- Emitting Custom Events
- Listening to Custom Events
- Passing Data
- Complete Example
- Real-World Example
- EventEmitter as a Class Dependency
- Event Naming
- Error Handling
- `super()`
- Why Not Reimplement EventEmitter?
- Production Architecture
- Common Mistakes
- Interview Questions
- Summary
- What's Next?

---

# Introduction

So far we created an EventEmitter directly:

```js
const EventEmitter = require("events");

const emitter = new EventEmitter();
```

Then:

```js
emitter.on();
emitter.emit();
emitter.once();
emitter.off();
```

This works well for simple cases.

But in real applications, we often want an object that has:

```text
Business Logic

+

Events
```

For example:

```text
Order Service

├── createOrder()
├── cancelOrder()
├── completeOrder()
│
└── Events
    ├── order.created
    ├── order.cancelled
    └── order.completed
```

For this, we can create a custom class that extends `EventEmitter`.

---

# Why Create a Custom EventEmitter?

Suppose we have:

```js
const orderEvents =
    new EventEmitter();
```

and separately:

```js
function createOrder() {

    // order logic

    orderEvents.emit(
        "order.created"
    );

}
```

This works.

But we can make the design cleaner by creating an `OrderService` that itself is an EventEmitter.

```text
OrderService

↓

extends EventEmitter

↓

Business Methods

+

Event System
```

Then:

```js
orderService.createOrder();
```

can internally emit:

```text
order.created
```

---

# Extending EventEmitter

We use JavaScript class inheritance:

```js
const EventEmitter = require("events");

class OrderService extends EventEmitter {

}
```

Now:

```text
OrderService

↓

inherits EventEmitter

↓

gets EventEmitter methods
```

So instances of `OrderService` can use:

```js
.on()
.emit()
.once()
.off()
.removeListener()
```

and other EventEmitter functionality.

---

# Basic Custom EventEmitter

```js
const EventEmitter = require("events");

class OrderService extends EventEmitter {

}

const orderService =
    new OrderService();

orderService.on(
    "order.created",
    () => {

        console.log(
            "Order Created"
        );

    }
);

orderService.emit(
    "order.created"
);
```

Output:

```text
Order Created
```

---

# What Happened?

We created:

```js
class OrderService extends EventEmitter
```

This means:

```text
OrderService

↓

inherits from

↓

EventEmitter
```

Then:

```js
const orderService =
    new OrderService();
```

creates an instance that has EventEmitter functionality.

Therefore:

```js
orderService.on(...)
```

works.

And:

```js
orderService.emit(...)
```

also works.

---

# Constructor

When extending a class, if your child class defines a constructor, you need to call:

```js
super();
```

Example:

```js
const EventEmitter = require("events");

class OrderService extends EventEmitter {

    constructor() {

        super();

        console.log(
            "OrderService Created"
        );

    }

}
```

Then:

```js
const orderService =
    new OrderService();
```

Output:

```text
OrderService Created
```

---

# Why `super()`?

`EventEmitter` is the parent class.

```text
EventEmitter

       ↑

       │ extends

       │

OrderService
```

When `OrderService` has its own constructor, `super()` initializes the parent class.

So:

```js
constructor() {

    super();

}
```

means, conceptually:

```text
Initialize EventEmitter

↓

Initialize OrderService
```

Without calling `super()` in a derived class constructor, JavaScript does not allow you to use `this`.

---

# Custom Methods

Now we can add our own business methods.

```js
const EventEmitter = require("events");

class OrderService extends EventEmitter {

    createOrder(order) {

        console.log(
            "Creating Order..."
        );

        this.emit(
            "order.created",
            order
        );

    }

}
```

Now:

```js
const orderService =
    new OrderService();
```

Register listener:

```js
orderService.on(
    "order.created",
    (order) => {

        console.log(
            "Order Created:",
            order.id
        );

    }
);
```

Call business method:

```js
orderService.createOrder({
    id: 101
});
```

Output:

```text
Creating Order...

Order Created: 101
```

---

# Important Concept

Notice this:

```js
this.emit(
    "order.created",
    order
);
```

The service itself emits the event.

The outside code only listens:

```js
orderService.on(
    "order.created",
    listener
);
```

So the architecture becomes:

```text
Application

↓

orderService.createOrder()

↓

OrderService

↓

Business Logic

↓

this.emit("order.created")

↓

Listeners
```

---

# Complete Example

```js
const EventEmitter = require("events");

class OrderService extends EventEmitter {

    constructor() {

        super();

    }

    createOrder(order) {

        console.log(
            "Creating order..."
        );

        // Business logic

        this.emit(
            "order.created",
            order
        );

    }

}

const orderService =
    new OrderService();

orderService.on(
    "order.created",
    (order) => {

        console.log(
            "Send Email:",
            order.id
        );

    }
);

orderService.on(
    "order.created",
    (order) => {

        console.log(
            "Update Inventory:",
            order.id
        );

    }
);

orderService.createOrder({
    id: 101,
    amount: 5000
});
```

Output:

```text
Creating order...

Send Email: 101

Update Inventory: 101
```

---

# Complete Flow

```text
createOrder()

↓

Business Logic

↓

this.emit("order.created", order)

↓

EventEmitter

↓

Find Listeners

↓

Email Listener

↓

Inventory Listener
```

---

# Passing Data

A custom EventEmitter can pass data just like a normal EventEmitter.

Example:

```js
class UserService extends EventEmitter {

    createUser(user) {

        this.emit(
            "user.created",
            user
        );

    }

}
```

Listener:

```js
userService.on(
    "user.created",
    (user) => {

        console.log(
            user.name
        );

    }
);
```

Call:

```js
userService.createUser({
    id: 1,
    name: "Rahul"
});
```

Output:

```text
Rahul
```

---

# Real-World Example

Imagine an e-commerce backend.

We have:

```text
OrderService
```

It handles:

```text
Create Order

Cancel Order

Complete Order
```

We can emit events:

```text
order.created

order.cancelled

order.completed
```

Example:

```js
const EventEmitter = require("events");

class OrderService extends EventEmitter {

    createOrder(order) {

        // Create order in database

        this.emit(
            "order.created",
            order
        );

    }

    cancelOrder(order) {

        // Cancel order in database

        this.emit(
            "order.cancelled",
            order
        );

    }

    completeOrder(order) {

        // Complete order in database

        this.emit(
            "order.completed",
            order
        );

    }

}
```

Now consumers can listen:

```js
const orderService =
    new OrderService();
```

---

# Order Created Listener

```js
orderService.on(
    "order.created",
    (order) => {

        console.log(
            "Send Order Confirmation"
        );

    }
);
```

---

# Order Cancelled Listener

```js
orderService.on(
    "order.cancelled",
    (order) => {

        console.log(
            "Send Cancellation Email"
        );

    }
);
```

---

# Order Completed Listener

```js
orderService.on(
    "order.completed",
    (order) => {

        console.log(
            "Send Completion Notification"
        );

    }
);
```

---

# Event-Driven Architecture

Now the system looks like:

```text
                OrderService
                     │
        ┌────────────┼────────────┐
        │            │            │
        ▼            ▼            ▼
 order.created  order.cancelled  order.completed
        │            │            │
        ▼            ▼            ▼
      Email        Email        Notification
```

This separates:

```text
Order Business Logic

from

Event Consumers
```

---

# EventEmitter as a Class Dependency

Another approach is to keep EventEmitter separate.

Example:

```js
class OrderService {

    constructor(eventBus) {

        this.eventBus =
            eventBus;

    }

    createOrder(order) {

        // Business logic

        this.eventBus.emit(
            "order.created",
            order
        );

    }

}
```

Then:

```js
const EventEmitter = require("events");

const eventBus =
    new EventEmitter();

const orderService =
    new OrderService(
        eventBus
    );
```

Now:

```text
OrderService

↓

depends on

↓

EventBus
```

instead of:

```text
OrderService

↓

is itself

↓

EventEmitter
```

Both approaches are valid.

---

# Which Design Should You Use?

There is no universal rule.

## Extend EventEmitter

Useful when the object itself naturally represents an event source.

Example:

```text
Socket
Stream
Worker
Connection
```

---

## Inject an Event Bus

Useful when you want business services to remain separate from the event mechanism.

Example:

```text
OrderService

↓

EventBus

↓

Multiple Consumers
```

This can make large applications easier to structure.

---

# Event Naming

Use clear event names.

Good:

```text
user.created

user.deleted

order.created

order.cancelled

payment.success
```

Avoid vague names:

```text
done

data

thing

event1
```

Good event names describe:

```text
What happened
```

For example:

```text
order.created
```

means:

```text
An order was created.
```

---

# Event Names Should Usually Represent Facts

A useful pattern is:

```text
entity.action
```

Examples:

```text
user.created

user.deleted

order.created

order.cancelled

payment.completed
```

These describe something that already happened.

This makes event-driven systems easier to reason about.

---

# Error Handling

A custom EventEmitter should also respect the special `error` event behavior.

Example:

```js
class Worker extends EventEmitter {

    start() {

        try {

            // Some work

        } catch (error) {

            this.emit(
                "error",
                error
            );

        }

    }

}
```

Consumers can listen:

```js
worker.on(
    "error",
    (error) => {

        console.error(error);

    }
);
```

If your class can emit `"error"`, its users should know that and handle it appropriately.

---

# `super()` and EventEmitter

Example:

```js
class Worker extends EventEmitter {

    constructor(name) {

        super();

        this.name = name;

    }

}
```

Now the object has:

```text
Worker properties

+

EventEmitter functionality
```

So:

```js
worker.on(...);

worker.emit(...);
```

works.

---

# Why Not Reimplement EventEmitter?

You could theoretically build your own system:

```js
const listeners = {};
```

and implement:

```text
on()

emit()

off()
```

yourself.

But Node.js already provides:

```js
EventEmitter
```

with mature behavior and APIs.

Therefore, normally use:

```js
extends EventEmitter
```

instead of rebuilding it unnecessarily.

---

# Production Architecture

A realistic application might look like:

```text
Controller

↓

Service

↓

Database

↓

Emit Event

↓

Event Listeners

├── Email
├── Notification
├── Audit
└── Analytics
```

Example:

```text
POST /orders

↓

OrderController

↓

OrderService.createOrder()

↓

Database Insert

↓

order.created

↓

Listeners
```

This is a common event-driven pattern.

---

# Important Limitation

Remember:

```text
EventEmitter

↓

In-process event mechanism
```

If you have:

```text
Node Process A
```

and:

```text
Node Process B
```

an EventEmitter in A does not automatically send events to B.

For distributed communication, systems such as:

```text
Redis

RabbitMQ

Kafka

NATS
```

may be used.

Those are different technologies and will be studied separately.

---

# Common Mistakes

## Mistake 1 — Forgetting `super()`

Wrong:

```js
class Service extends EventEmitter {

    constructor() {

        this.name = "Service";

    }

}
```

Correct:

```js
class Service extends EventEmitter {

    constructor() {

        super();

        this.name = "Service";

    }

}
```

---

## Mistake 2 — Emitting Before Listener Registration

Example:

```js
service.createOrder(order);

service.on(
    "order.created",
    handler
);
```

The event has already happened.

EventEmitter does not automatically replay past events to future listeners.

Better:

```js
service.on(
    "order.created",
    handler
);

service.createOrder(order);
```

---

## Mistake 3 — Using Too Many Events

Don't create events for every tiny internal operation.

Bad:

```text
order.variable.created

order.variable.updated

order.variable.checked

order.variable.processed
```

unless these events actually provide architectural value.

Use events where they make the system clearer or decoupled.

---

## Mistake 4 — Treating EventEmitter as a Message Broker

EventEmitter is not:

```text
Kafka

RabbitMQ

Redis Pub/Sub
```

It works inside the Node.js process.

---

## Mistake 5 — Forgetting Error Handling

If your custom EventEmitter can emit:

```js
this.emit(
    "error",
    error
);
```

make sure consumers understand that this event needs proper handling.

---

# Interview Questions

### Q1

How do you create a custom EventEmitter class?

### Q2

Why do we use:

```js
extends EventEmitter
```

?

### Q3

Why is `super()` required in a derived class constructor?

### Q4

Can a custom class have both business methods and EventEmitter methods?

### Q5

How do you emit an event from inside a class?

### Q6

Why use:

```js
this.emit()
```

instead of creating a separate EventEmitter?

### Q7

What is the difference between extending EventEmitter and injecting an EventEmitter?

### Q8

Can EventEmitter communicate between two Node.js processes?

### Q9

Why should event names describe facts?

### Q10

What should you consider if your custom class emits `"error"`?

---

# Summary

We can create a custom EventEmitter:

```js
const EventEmitter = require("events");

class OrderService extends EventEmitter {

    createOrder(order) {

        this.emit(
            "order.created",
            order
        );

    }

}
```

Then:

```js
const orderService =
    new OrderService();

orderService.on(
    "order.created",
    (order) => {

        console.log(
            "Order created:",
            order.id
        );

    }
);
```

And:

```js
orderService.createOrder({
    id: 101
});
```

produces:

```text
Order created: 101
```

---

# Key Takeaways

- A custom class can extend `EventEmitter`.
- `extends EventEmitter` gives the class EventEmitter functionality.
- If a derived constructor exists, call `super()` before using `this`.
- Custom methods can emit domain-specific events.
- Events can carry data.
- Event names should clearly describe what happened.
- EventEmitter works within a Node.js process.
- For cross-process communication, use a proper messaging system.
- Extending EventEmitter and injecting an EventEmitter are both valid architectural approaches.
- A custom EventEmitter can combine business behavior with event-driven behavior.

---

# Next Chapter

➡️ **12 — Building an Event Bus**

Ab hum ek real-world abstraction banayenge:

```text
EventBus

↓

Central Event Communication

↓

Publish Event

↓

Multiple Subscribers
```

Example:

```text
OrderService
     │
     ▼
 EventBus
     │
 ├── Email
 ├── Notification
 ├── Audit
 └── Analytics
```

Yahan se EventEmitter ka use **actual backend architecture** me connect hona start hoga.