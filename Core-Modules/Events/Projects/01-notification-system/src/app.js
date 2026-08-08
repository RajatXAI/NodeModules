const {registerUser, loginUser} = require("./services/userService");


require("./listeners/emailListener");
require("./listeners/smsListener");
require("./listeners/inAppListener");

const user = {

    id: 101,
    username: 'rajat',
    email: 'rajatsaini800670@gamil.com',
    phone: '8006703056'
};

registerUser(user);
console.log("------------------------------");
loginUser(user);

