const mongoose = require('mongoose')


const connectionRequestSchema = new mongoose.Schema({

    fromUserId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    toUserId: {
        type: mongoose.Schema.Types.SchemaType.ObjectId,
        required: true
    },
    status: {
        type: string,
        required: true,
        values: ['ignored', 'interested', 'accepted', 'rejected'],
        message: `${VALUE} is invalid`
    }
}, {
    timestamps: true
})

const ConnectionRequestModel = new mongoose.model("ConnectionRequest", connectionRequestSchema)

module.exports = {
    ConnectionRequestModel
}