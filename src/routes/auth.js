const express = require('express')
const User = require('../models/user');
const { validateSignupData } = require('../utils/validatation');
const bcrypt = require('bcrypt');
const authRouter = express.Router();
const sendEmail = require('../utils/sendEmail')

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
        const savedUser = await user.save();
        const token = await savedUser.getJWT();
        
       
        res.cookie("token", token, { expires: new Date(Date.now() + 900000) })
        res.send(savedUser)

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
            throw new Error("invalid credentials");
        }

        const token = await user.getJWT();
        const emailResult = await sendEmail.run()
        console.log(emailResult);
        res.cookie("token", token, { expires: new Date(Date.now() + 900000) })
        res.send(user);

    } catch (err) {
        res.status(500).send(err.message);
    }

})

authRouter.post('/logout', async (req, res) => {

    res.clearCookie('token', { path: '/' })
    res.send('logged out')

    // console.log('user has been redirected to /admin')
})

module.exports = authRouter 