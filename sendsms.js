const twilio = require('twilio');

const authToken = "ebc9f04d45636e8929a8493113a776a4";
const accountSid = "AC413b144ed56567cbcc0f66968aee8221";

const client = new twilio(accountSid, authToken);

client.messages.create({
    body: "hello world",
    to: "+2348141804018",
    from: '+18773232968'
}).then(console.log).catch(console.log)