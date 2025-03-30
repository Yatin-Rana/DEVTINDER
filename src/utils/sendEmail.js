const { SendEmailCommand } = require("@aws-sdk/client-ses");
const { sesClient } = require('../utils/sesClient')

const createSendEmailCommand = (toAddress, fromAddress) => {
    return new SendEmailCommand({
        Destination: {
            /* required */
            CcAddresses: [
                /* more items */
            ],
            ToAddresses: [
                toAddress,
                /* more To-email addresses */
            ],
        },
        Message: {
            /* required */
            Body: {
                /* required */
                Html: {
                    Charset: "UTF-8",
                    Data: "<h1>Yo bro from devtinder</h1>",
                },
                Text: {
                    Charset: "UTF-8",
                    Data: "This is from the body",
                },
            },
            Subject: {
                Charset: "UTF-8",
                Data: "Thanks for Signing up",
            },
        },
        Source: fromAddress,
        ReplyToAddresses: [
            /* more items */
        ],
    });
};

const run = async () => {
    const sendEmailCommand = createSendEmailCommand(
        "yatinr965@gmail.com",
        "devtinderofficial@gmail.com",
    );

    try {
        return await sesClient.send(sendEmailCommand);
    } catch (caught) {
        if (caught instanceof Error && caught.name === "MessageRejected") {
            /** @type { import('@aws-sdk/client-ses').MessageRejected} */
            const messageRejectedError = caught;
            return messageRejectedError;
        }
        throw caught;
    }
};

module.exports = {run}

