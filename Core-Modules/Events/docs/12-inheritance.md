# Event Bus

> Learn how to use EventEmitter as an application-level event bus and connect different parts of a Node.js backend through events.

---

# Table of Contents

- Introduction
- What is an Event Bus?
- Why Do We Need an Event Bus?
- Direct Communication Problem
- Event Bus Solution
- Basic Event Bus
- Publish and Subscribe
- Complete Example
- Event Bus Architecture
- Order Example
- Multiple Consumers
- Event Data
- Central Event Bus
- Event Naming
- Event Bus vs EventEmitter
- Event Bus vs Message Broker
- Production Architecture
- Error Handling
- Listener Cleanup
- Common Mistakes
- Interview Questions
- Summary
- What's Next?

---

# Introduction

We already learned `EventEmitter`.

Now imagine:

```text
Order Service

↓

needs to notify

↓

Email Service

Notification Service

Audit Service

Analytics Service
```

Instead of directly calling all of them, we can use an:

```text
Event Bus
```

The Event Bus acts as a communication point between different parts of the application.

---

# What is an Event Bus?

An Event Bus is a mechanism that allows one part of an application to publish an event while other parts subscribe to that event.

Basic idea:

```text
Publisher

↓

Event Bus

↓

Subscribers
```

Example:

```text
OrderService

↓

"order.created"

↓

EventBus

├── Email
├── Notification
├── Audit
└── Analytics
```

---

# Why Do We Need an Event Bus?

Suppose we have an Order Service.

Without an Event Bus:

```js
function createOrder(order) {

    saveOrder(order);

    sendEmail(order);

    updateInventory(order);

    createNotification(order);

    writeAuditLog(order);

}
```

Now `OrderService` knows about:

```text
Email

Inventory

Notification

Audit
```

This creates tight coupling.

---

# Direct Communication Problem

Imagine:

```text
OrderService

↓

EmailService

↓

NotificationService

↓

AuditService

↓

AnalyticsService
```

The Order Service must know:

```text
Who should be called?

How should they be called?

What arguments do they need?
```

As the application grows, this becomes difficult to maintain.

---

# Event Bus Solution

Instead:

```js
function createOrder(order) {

    saveOrder(order);

    eventBus.emit(
        "order.created",
        order
    );

}
```

Order Service only says:

```text
"An order was created."
```

It doesn't need to know who is listening.

---

# Event Bus Architecture

```text
                 Event Bus
                    │
       ┌────────────┼────────────┐
       │            │            │
       ▼            ▼            ▼
    Email        Audit       Analytics
       │            │            │
       ▼            ▼            ▼
    Service      Service      Service
```

Publisher:

```text
OrderService
```

Event:

```text
order.created
```

Subscribers:

```text
Email

Audit

Analytics
```

---

# Basic Event Bus

An Event Bus can be built using EventEmitter.

```js
const EventEmitter =
    require("events");

const eventBus =
    new EventEmitter();
```

Now:

```js
eventBus.on(
    "order.created",
    (order) => {

        console.log(
            "Send Email:",
            order.id
        );

    }
);
```

Publish:

```js
eventBus.emit(
    "order.created",
    {
        id: 101
    }
);
```

Output:

```text
Send Email: 101
```

---

# Publish and Subscribe

Two important concepts:

## Publish

Publishing means:

```text
An event is emitted.
```

Example:

```js
eventBus.emit(
    "order.created",
    order
);
```

---

## Subscribe

Subscribing means:

```text
Registering a listener for an event.
```

Example:

```js
eventBus.on(
    "order.created",
    handler
);
```

---

# Basic Mental Model

```text
Publisher

↓

publish

↓

Event Bus

↓

subscribe

↓

Consumer
```

Or:

```text
emit()

↓

Event Bus

↓

on()
```

---

# Complete Example

```js
const EventEmitter =
    require("events");

const eventBus =
    new EventEmitter();

eventBus.on(
    "order.created",
    (order) => {

        console.log(
            "Email Service:",
            order.id
        );

    }
);

eventBus.on(
    "order.created",
    (order) => {

        console.log(
            "Notification Service:",
            order.id
        );

    }
);

function createOrder(order) {

    console.log(
        "Order saved:",
        order.id
    );

    eventBus.emit(
        "order.created",
        order
    );

}

createOrder({
    id: 101,
    amount: 5000
});
```

Output:

```text
Order saved: 101

Email Service: 101

Notification Service: 101
```

---

# Complete Flow

```text
createOrder()

↓

Save Order

↓

emit("order.created")

↓

Event Bus

├── Email Listener
│
└── Notification Listener
```

---

# Order Example

Imagine an e-commerce backend.

When an order is created:

```text
Order Created
```

We emit:

```text
order.created
```

Different modules subscribe.

---

# Email Subscriber

```js
eventBus.on(
    "order.created",
    (order) => {

        sendOrderEmail(order);

    }
);
```

---

# Inventory Subscriber

```js
eventBus.on(
    "order.created",
    (order) => {

        updateInventory(order);

    }
);
```

---

# Audit Subscriber

```js
eventBus.on(
    "order.created",
    (order) => {

        createAuditLog(order);

    }
);
```

---

# Analytics Subscriber

```js
eventBus.on(
    "order.created",
    (order) => {

        trackOrder(order);

    }
);
```

Now:

```text
order.created

├── Email
├── Inventory
├── Audit
└── Analytics
```

---

# Multiple Consumers

This is one of the biggest advantages.

The publisher:

```js
eventBus.emit(
    "order.created",
    order
);
```

doesn't need to know:

```text
How many listeners exist?
```

There could be:

```text
1

5

10
```

consumers.

The publisher only publishes the event.

---

# Event Data

Events usually carry useful information.

Instead of:

```js
eventBus.emit(
    "order.created"
);
```

we can send:

```js
eventBus.emit(
    "order.created",
    {
        orderId: 101,
        userId: 20,
        amount: 5000
    }
);
```

Listener:

```js
eventBus.on(
    "order.created",
    (event) => {

        console.log(
            event.orderId
        );

    }
);
```

---

# Prefer Structured Event Data

For larger systems, a structured event object is usually easier to maintain.

Example:

```js
eventBus.emit(
    "order.created",
    {
        orderId: 101,
        userId: 20,
        amount: 5000,
        createdAt: new Date()
    }
);
```

Instead of:

```js
eventBus.emit(
    "order.created",
    101,
    20,
    5000,
    new Date()
);
```

The object makes the event contract easier to understand.

---

# Central Event Bus

In a small application:

```text
src/

├── services/
│
├── controllers/
│
├── events/
│
└── eventBus.js
```

`eventBus.js`:

```js
const EventEmitter =
    require("events");

const eventBus =
    new EventEmitter();

module.exports = eventBus;
```

Now different modules can import it.

---

# Order Service

```js
const eventBus =
    require("../events/eventBus");

function createOrder(order) {

    // Database operation

    eventBus.emit(
        "order.created",
        order
    );

}
```

---

# Event Subscribers

For example:

```js
const eventBus =
    require("./eventBus");

eventBus.on(
    "order.created",
    (order) => {

        console.log(
            "Send email:",
            order.id
        );

    }
);
```

---

# Important Initialization Problem

There is an important detail.

The listeners must be registered before the event is emitted.

Wrong order:

```text
Create Order

↓

emit("order.created")

↓

Register Listener
```

The listener misses the event.

Correct:

```text
Application Start

↓

Register Listeners

↓

Application Running

↓

Create Order

↓

emit("order.created")

↓

Listeners Execute
```

---

# Event Bus Is Not Persistent

This is extremely important.

Suppose:

```text
OrderService

↓

emit("order.created")
```

If no listener is currently registered:

```text
Event is not stored
```

It is not automatically saved somewhere.

EventEmitter does not provide:

```text
Message Persistence
```

---

# Event Bus vs EventEmitter

Technically, an Event Bus can be implemented using EventEmitter.

So:

```text
EventEmitter

↓

Mechanism
```

while:

```text
Event Bus

↓

Architectural role
```

Example:

```js
const eventBus =
    new EventEmitter();
```

Here the EventEmitter object is being used as an Event Bus.

---

# Event Bus vs Message Broker

This distinction is extremely important for production systems.

## Event Bus with EventEmitter

```text
Node Process

↓

EventEmitter

↓

Listeners
```

Characteristics:

```text
In-memory

In-process

Not persistent

No automatic cross-server delivery
```

---

## Message Broker

Examples:

```text
Kafka

RabbitMQ

NATS

Redis Pub/Sub
```

These can provide communication between separate processes/services, depending on the technology and configuration.

Example:

```text
Service A

↓

Message Broker

↓

Service B
```

This is suitable for distributed architectures.

---

# Example

EventEmitter:

```text
Server A

↓

EventEmitter

↓

Server A
```

It does not automatically become:

```text
Server A

↓

Server B
```

---

Message broker:

```text
Server A

↓

Broker

↓

Server B
```

This is a fundamentally different architecture.

---

# Production Architecture

A backend might look like:

```text
HTTP Request

↓

Controller

↓

Service

↓

Database

↓

Event Bus

├── Email
├── Notification
├── Audit
└── Analytics
```

For example:

```text
POST /orders

↓

OrderController

↓

OrderService.createOrder()

↓

INSERT order

↓

eventBus.emit("order.created")

↓

Consumers
```

---

# Event Bus and Service Layer

A clean architecture can look like:

```text
Controller

↓

Service

↓

Repository / Database

↓

Event

↓

Event Handlers
```

The Service owns business logic.

Event handlers handle reactions to business events.

---

# Error Handling

Remember the special EventEmitter error event.

If your Event Bus can emit:

```js
eventBus.emit(
    "error",
    error
);
```

you need appropriate error handling.

Example:

```js
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

However, application-specific event handlers can also throw errors or reject Promises, and those failures need their own deliberate handling strategy.

---

# Listener Cleanup

Suppose a temporary component subscribes:

```js
eventBus.on(
    "order.created",
    handleOrder
);
```

When the component is destroyed:

```js
eventBus.off(
    "order.created",
    handleOrder
);
```

This prevents stale listeners.

---

# Common Mistakes

## Mistake 1 — Thinking Event Bus Means Distributed Messaging

An EventEmitter-based Event Bus is still:

```text
In-process
```

It does not automatically communicate between servers.

---

## Mistake 2 — Assuming Events Are Stored

This:

```js
eventBus.emit(
    "order.created",
    order
);
```

does not create a durable message.

If nobody is listening at that moment, the event is effectively lost.

---

## Mistake 3 — Registering Listeners Too Late

Wrong:

```js
createOrder();

registerOrderListener();
```

The event may already have been emitted.

---

## Mistake 4 — Putting Business Logic in the Event Bus

Avoid turning the Event Bus into:

```text
Controller

↓

Event Bus

↓

Everything
```

The Event Bus should primarily handle communication.

Business logic should stay in appropriate services/handlers.

---

## Mistake 5 — Creating One Giant Global Event Bus Without Ownership

A huge shared Event Bus can become difficult to understand.

Example:

```text
1000 Events

+

500 Listeners

+

20 Modules
```

At that point, event ownership and naming conventions become very important.

---

# Event Naming Convention

Prefer:

```text
user.created

user.updated

user.deleted

order.created

order.cancelled

payment.completed
```

Avoid:

```text
userAction

process

done

event1
```

Good event names describe:

```text
A fact that happened
```

---

# Production Best Practices

### 1. Use clear event names

```text
order.created
```

is better than:

```text
order
```

---

### 2. Keep event payloads structured

```js
{
    orderId,
    userId,
    amount
}
```

---

### 3. Keep handlers focused

For example:

```text
Email Handler

↓

Email-related work
```

Don't put unrelated responsibilities into one listener.

---

### 4. Keep listener ownership clear

Know:

```text
Who registered this listener?

Who removes it?

How long should it live?
```

---

### 5. Don't treat EventEmitter as a distributed queue

For:

```text
Cross-process communication

Durability

Retries

Consumer groups

Large-scale messaging
```

use an appropriate messaging system.

---

# Interview Questions

### Q1

What is an Event Bus?

### Q2

How can EventEmitter be used as an Event Bus?

### Q3

What is the difference between EventEmitter and Event Bus?

### Q4

What is the difference between an in-process Event Bus and a message broker?

### Q5

Are EventEmitter events persistent?

### Q6

What happens if nobody is listening when an event is emitted?

### Q7

Why should event listeners be registered during application initialization?

### Q8

Why should event payloads usually be structured?

### Q9

Why can a giant global Event Bus become difficult to maintain?

### Q10

When should you use Kafka, RabbitMQ, NATS, or another broker instead of EventEmitter?

---

# Summary

An Event Bus provides:

```text
Publisher

↓

Event

↓

Multiple Subscribers
```

Using EventEmitter:

```js
const eventBus =
    new EventEmitter();
```

Publisher:

```js
eventBus.emit(
    "order.created",
    order
);
```

Subscriber:

```js
eventBus.on(
    "order.created",
    handler
);
```

---

# Key Takeaways

- Event Bus is an architectural communication mechanism.
- EventEmitter can be used to implement an in-process Event Bus.
- Publishers emit events.
- Subscribers listen for events.
- Multiple consumers can react to the same event.
- EventEmitter events are in-memory and in-process.
- Events are not automatically persisted.
- Events emitted before listeners register are not replayed.
- Event payloads should be structured and meaningful.
- Event handlers should have focused responsibilities.
- Listener lifecycle and cleanup matter.
- For distributed communication and durable messaging, use a proper message broker.

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
```

---

# Next Chapter

➡️ **13 — EventEmitter Internals**

Ab hum thoda deeper jayenge.

Ab tak humne kaha:

```text
.on()

↓

Listener Register
```

Lekin ab actual conceptual model samjhenge:

```text
EventEmitter Object

↓

Event Name

↓

Listener Storage

↓

Function References

↓

emit()

↓

Lookup

↓

Listener Execution
```

Isse tumhe clear hoga ki EventEmitter internally **listener registrations ko kaise organize karta hai** aur `on()`, `emit()`, `off()` actually ek dusre se kaise connected hain.