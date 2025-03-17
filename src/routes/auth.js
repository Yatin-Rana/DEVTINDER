const express = require('express')
const User = require('../models/user');
const { validateSignupData } = require('../utils/validatation');
const bcrypt = require('bcrypt')

const authRouter = express.Router();

authRouter.post('/signup', async (req, res) => {

    //validation of data
    //encrypt password before saving
    //indstury standard is to create helper functions for these tasks

    try {
        validateSignupData(req);

        const { firstName, lastName, emailId, password, age, gender, photoUrl, about } = req.body;

        const passwordHash = await bcrypt.hash(req.body.password, 8);


        const user = new User({
            firstName,
            lastName,
            emailId,
            password: passwordHash,
            age,
            gender,
            photoUrl,
            about,
        }
        );
        await user.save();
        res.send("user signed up successfully");
    } catch (err) {
        console.log("error occured during singup", err.message);
        res.status(500).send("Error while signing up :" + err.message);
    }
})


authRouter.post('/login', async (req, res) => {
    const { emailId, password } = req.body;

    try {
        const user = await User.findOne({ emailId });

        if (!user) {
            throw new Error("invalid credentials");
        }

        const isMatch = await user.validatePassword(password);
// const token = jwt.sign({ userId: user._id }, "yehaisecret", { expiresIn: '1d' })
        if (!isMatch) {
            throw new Error("invalid credentials came after schema check of pass");
        }

        const token = await user.getJWT();
        res.cookie("token", token, { expires: new Date(Date.now() + 900000) })
        res.send("logged in successfully and setted cookie");

    } catch (err) {
        res.status(500).send("Error while logging in :" + err.message);
    }

})


module.exports = authRouter 