const express = require('express')
const userRouter = express.Router();
const { userAuth } = require('../middlewares/authMiddleware')
const ConnectionRequest = require('../models/connectionRequest')
const User = require('../models/user')



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

userRouter.get('/feed', userAuth, async (req, res) => {
    try {
        const USER_SAFE_DATA = ["firstName", "lastName", "age", "gender", "photoUrl", "about", "skills"]
        const loggedInUser = req.user;

        let limit = parseInt(req.query.limit) || 10;
        const page = parseInt(req.query.page) || 1
        limit = limit > 50 ? 50 : limit ;
        const skip = (page - 1) * limit;


        const connections = await ConnectionRequest.find({
            $or: [
                { toUserId: loggedInUser._id },
                { fromUserId: loggedInUser._id }]
        }).select("fromUserId  toUserId")

        const hideUsersFromFeed = new Set();

        connections.forEach((req) => {
            hideUsersFromFeed.add(req.fromUserId.toString())
            hideUsersFromFeed.add(req.toUserId.toString())
        });

        const user = await User.find({
            $and: [
                { _id: { $nin: Array.from(hideUsersFromFeed) } },
                { _id: { $ne: loggedInUser._id } }
            ]
        }).select(USER_SAFE_DATA).skip(skip).limit(limit);

        return res.status(200).json(user);

    } catch (err) {
        return res.status(400).json({ message: err.message })
    }
})


module.exports = userRouter;