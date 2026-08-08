const eventBus = require("../events/eventsBus");

eventBus.on("user.registered", (user) => {

    console.log(`[EMAIL] Welcome email sent to ${user.email}`)
})