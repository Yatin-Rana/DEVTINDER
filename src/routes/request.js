const express = require('express')
const { userAuth } = require('../middlewares/authMiddleware')
const requestRouter = express.Router()
const ConnectionRequest = require('../models/connectionRequest')
const User = require('../models/user')

requestRouter.post('/request/send/:status/:toUserId', userAuth, async (req, res) => {
    try {
        const user = req.user;
        const fromUserId = user._id;
        const toUserId = req.params.toUserId;  //to the user we are sending req
        const status = req.params.status;

        const allowedStatusTypes = ['interested', 'ignored'];

        if (!allowedStatusTypes.includes(status)) {
            return res.status(400).json({ message: "invalid status type" });
        }

        const validateToUser = await User.findById(toUserId);

        if (!validateToUser) {
            return res.status(500).json({ message: "The user does not exists" })
        }

        const requestExists = await ConnectionRequest.findOne({
            $or: [
                { fromUserId, toUserId }, {
                    fromUserId: toUserId, toUserId: fromUserId
                }
            ]
        })

        if (requestExists) {
            return res.status(500).json({ message: "request already exists" })
        }

        const connectionReq = await ConnectionRequest({
            fromUserId,
            toUserId,
            status
        })

        connectionReq.save();


        return res.status(200).json({ message: "request sent successfully", data: connectionReq })
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }

})



module.exports = requestRouter