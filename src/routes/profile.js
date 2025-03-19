const express = require('express')
const { userAuth } = require('../middlewares/authMiddleware')
const { validateprofileUpdateData } = require('../utils/validatation')
const profileRouter = express.Router()
const bcrypt = require('bcrypt');
const validator = require('validator')
const User = require('../models/user')

profileRouter.get('/profile/view', userAuth, async (req, res) => {
    try {
        const user = req.user;
        console.log(user)
        // console.log(user);
        res.send(user);
    } catch (err) {
        res.status(500).send("Error while getting profile :" + err.message);
    }
})

profileRouter.patch('/profile/edit', userAuth, async (req, res) => {
    try {

        // validateprofileUpdateData(req);

        if (!validateprofileUpdateData(req)) return res.status(400).json({ error: "invalid fields in request" });

        const loggedInUser = req.user;

        Object.keys(req.body).forEach((key) => (loggedInUser[key] = req.body[key]))

        await loggedInUser.save();

        res.json({ message: "data updated successfully", data: loggedInUser })
    } catch (err) {
        res.send(err.message)
    }


})

profileRouter.patch('/profile/password', userAuth, async (req, res) => {
    try {

        const user = req.user;
        // console.log(user);
        const { currentPassword, newPassword } = req.body;

        const compareExistingPassword = await bcrypt.compare(currentPassword, user.password);

        if (!compareExistingPassword) return res.status(400).json({ message: "Your current password is invalid" });

        const validateNewPassword = validator.isStrongPassword(newPassword);

        if (!validateNewPassword) return res.status(400).json({ message: "New password is not strong, try again" });

        const hashedPassword = await bcrypt.hash(newPassword, 8)


        await User.findByIdAndUpdate(user._id, { password: hashedPassword })

        return res.status(200).json({ message: "password changed" });
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }

})

module.exports = profileRouter