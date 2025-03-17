const express = require('express')
const { userAuth } = require('../middlewares/authMiddleware')
const requestRouter = express.Router()

requestRouter.post('/sendConnectionRequest', userAuth, async (req, res) => {
    const user = req.user;
    console.log(user)
    res.send(user.firstName + ' ' + 'sent a connection request')
})

module.exports = requestRouter