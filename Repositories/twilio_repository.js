const twilio = require('twilio');
const RepositoryResponse = require("./repository_response");

const authToken = "ebc9f04d45636e8929a8493113a776a4";
const accountSid = "AC413b144ed56567cbcc0f66968aee8221";
const from = "18773232968";

class TwilioRepository {
    constructor(to, message) {
        this.client = new twilio(accountSid, authToken);
        this.message = message;
        this.to = to;
    }

    async sendMessage() {
        try {
            const response = await this.client.messages.create({
                body: this.message,
                to: this.to,
                from
            });
            console.log(response);
            return new RepositoryResponse('twilio', true, "Message Sent", null, null, null);
        } catch (error) {
            console.log(error);
            return new RepositoryResponse('twilio', false, 'Error sending messages', null, error, null);
        }

    }
}

module.exports = TwilioRepository;