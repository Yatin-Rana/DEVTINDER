const { SESClient } = require("@aws-sdk/client-ses");
require('dotenv').config();

const REGION = "us-east-1";

const sesClient = new SESClient({
    region: REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    }
},

);


module.exports = { sesClient }