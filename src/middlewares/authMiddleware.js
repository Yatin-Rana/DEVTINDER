const jwt = require('jsonwebtoken');
const User = require('../models/user');

const userAuth = async (req, res, next) => {
    try {
        const token = req.cookies.token;
        if (!token) throw new Error("No token found!!!")

        const decodedData = jwt.verify(token, "yehaisecret")

        const { userId } = decodedData;
        // console.log(userId)
        const user = await User.findById(userId);
        // console.log(user)
        if (!user) throw new Error("user does not exist")

        req.user = user;
        // console.log(req.user)

        next()
    } catch (err) {
        res.status(400).send("error occured:", err.message);
    }
}

module.exports = { userAuth }