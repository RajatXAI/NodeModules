const eventBus = require("../events/eventsBus");

eventBus.on("user.registered", (user)=>{

    console.log(`[SMS] Welcome SMS sent to ${user.phone}`)
})