const express = require('express')
const { userAuth } = require('../middlewares/authMiddleware')
const profileRouter = express.Router()

profileRouter.get('/profile', userAuth, async (req, res) => {
    try {
        const user = req.user;
        console.log(user)
        // console.log(user);
        res.send(user);
    } catch (err) {
        res.status(500).send("Error while getting profile :" + err.message);
    }
})


module.exports = profileRouter