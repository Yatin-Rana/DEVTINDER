const express = require('express')
const userRouter = express.Router();
const { userAuth } = require('../middlewares/authMiddleware')
const ConnectionRequest = require('../models/connectionRequest')

userRouter.get('/user/requests/received', userAuth, async (req, res) => {
    try {

        const loggedInUser = req.user;

        const fetchConnectionRequests = await ConnectionRequest.find({
            toUserId: loggedInUser._id,
            status: "interested"
        }).populate("fromUserId", ["firstName", "lastName", "photoUrl", "gender", "about", "skills"])

        return res.status(200).json({
            message: "received requests fetched successfully",
            data: fetchConnectionRequests
        })
    } catch (error) {
        return res.status(400).json({
            message: "an error occured while fetching requests",
            error: error.message
        })
    }

})

userRouter.get('/user/connections', userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;

        const getConnections = await ConnectionRequest.find({
            $or: [
                { toUserId: loggedInUser._id, status: "accepted" },
                { fromUserId: loggedInUser._id, status: "accepted" }
            ]
        }).populate("fromUserId", ["firstName", "lastName", "age", "gender", "skills", "about"])
            .populate("toUserId", ["firstName", "lastName", "age", "gender", "skills", "about"])


        const data = getConnections.map((row) => {
            if (row.toUserId._id.toString() === loggedInUser._id.toString()) {
                return row.fromUserId
            }
            return row.toUserId;
        })

        return res.status(200).json({ data: data });



    } catch (error) {
        res.status(400).json({ message: "error while fetching connections", error: error.message })
    }

})




module.exports = userRouter;