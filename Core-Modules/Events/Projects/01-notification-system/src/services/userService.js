const eventsBus = require('../events/eventsBus');

function registerUser(user){

    console.log(`Register user: ${user.username}`);

    eventsBus.emit("user.registered", user);


}

function loginUser(user){

    console.log(`Login user: ${user.username}`);

    eventsBus.emit("user.login", user);
}

module.exports ={

    registerUser,
    loginUser
}