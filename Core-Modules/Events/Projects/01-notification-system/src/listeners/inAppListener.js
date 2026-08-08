const eventBus = require("../events/eventsBus");

eventBus.on("user.registered", (user) => {
  console.log(`[IN-APP] Notification created for user ${user.id}`);
});
