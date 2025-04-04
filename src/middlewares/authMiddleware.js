const jwt = require('jsonwebtoken');
const User = require('../models/user');

const userAuth = async (req, res, next) => {
    try {
        const token = req.cookies.token;
        // console.log(token)
        if (!token) return res.status(401).json({message:"unauthorized user,please Login"})

        const decodedData = jwt.verify(token, process.env.JWT_SECRET)
        // console.log(decodedData)

        const { _id } = decodedData;
        // console.log(_id) // to check if we're getting id or not
        const user = await User.findById(_id); //passing id here
        // console.log(user)
        if (!user) throw new Error("user does not exist from authmiddleware")

        req.user = user;
        // console.log(req.user)

        next()
    } catch (err) {
        res.status(400).send("error occured:" + " " + err.message);
    }
}

module.exports = { userAuth }