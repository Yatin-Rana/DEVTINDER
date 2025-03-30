const express = require('express')
const mongoose = require('mongoose')
const { userAuth } = require('../middlewares/authMiddleware')
const requestRouter = express.Router()
const ConnectionRequest = require('../models/connectionRequest')
const User = require('../models/user')
const sendEmail = require('../utils/sendEmail')
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

        if (mongoose.Types.ObjectId.isValid(toUserId) && fromUserId.equals(new mongoose.Types.ObjectId(toUserId))) {
            return res.status(400).json({ message: "You cannot send a request to yourself" });
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
requestRouter.post('/request/review/:status/:requestId', userAuth, async (req, res) => {

    try {

        const loggedInUser = req.user;
        const { status, requestId } = req.params;
        console.log(requestId);


        const allowedStatus = ['accepted', 'rejected']

        if (!allowedStatus.includes(status)) {
            return res.status(400).json({ message: "invalid status type" });
        }

        const validateRequestId = await ConnectionRequest.findOne({
            _id: requestId,
            toUserId: loggedInUser._id,
            status: 'interested'
        })

        if (!validateRequestId) {
            return res.status(400).json({ message: "request id does not exists" })
        }

        validateRequestId.status = status

        const data = await validateRequestId.save();

        return res.status(200).json({ message: `Connection request ${status} successfully`, data: data })
    } catch (error) {
        return res.status(400).json({ message: error.message })
    }
})



module.exports = requestRouter