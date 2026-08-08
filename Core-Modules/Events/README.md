# Node.js Events Module

> A practical and production-focused guide to the Node.js `events` module and EventEmitter.

---

## Overview

The Node.js `events` module provides the `EventEmitter` class.

EventEmitter allows objects to:

- Emit events
- Listen for events
- Execute listener functions
- Remove listeners
- Create custom events
- Build event-driven systems

The Events module is one of the core concepts of Node.js.

Many Node.js APIs are based on EventEmitter.

Examples include:

- Streams
- HTTP servers
- TCP servers
- Child processes
- Process events
- Custom application events

Understanding EventEmitter makes many other Node.js APIs easier to understand.

---

# Learning Goals

After completing this module, you should be able to:

- Understand Event-Driven Programming
- Understand EventEmitter
- Create custom events
- Register event listeners
- Emit events
- Remove listeners
- Execute listeners only once
- Handle EventEmitter errors
- Inspect registered listeners
- Extend EventEmitter
- Build custom event systems
- Understand how Node.js uses events internally
- Use events in production applications

---

# Module Structure

```text
08-events-module/

├── README.md
│
├── 01-introduction.md
├── 02-event-emitter.md
├── 03-on.md
├── 04-emit.md
├── 05-on-vs-once.md
├── 06-off-removeListener.md
├── 07-removeAllListeners.md
├── 08-listenerCount.md
├── 09-eventNames.md
├── 10-error-event.md
├── 11-custom-event-emitter.md
├── 12-inheritance.md
├── 13-event-emitter-internals.md
├── 14-event-emitter-and-event-loop.md
├── 15-event-emitter-and-streams.md
│
└── projects/
    │
    ├── 01-notification-system/
    ├── 02-order-processing/
    ├── 03-chat-event-system/
    └── 04-mini-event-bus/