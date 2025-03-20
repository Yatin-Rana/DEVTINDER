const mongoose = require('mongoose');

const connectionRequestSchema = new mongoose.Schema(
    {
        fromUserId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            
        },
        toUserId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User' // Reference to the User model (if applicable)
        },
        status: {
            type: String,
            required: true,
            enum: {
                values: ['ignored', 'interested', 'accepted', 'rejected'],
                message: '{VALUE} is not a valid status'
            }
        }
    },
    {
        timestamps: true
    }
);

//this will make the query fast and do optimization and stuff
connectionRequestSchema.index({fromUserId:1,toUserId:1});

const ConnectionRequest = mongoose.model('ConnectionRequest', connectionRequestSchema);

module.exports = 
    ConnectionRequest
