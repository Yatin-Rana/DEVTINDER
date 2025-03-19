const validator = require("validator");

const validateSignupData = (req) => {

    const { firstName, lastName, emailId, password } = req.body;



    if (!firstName || !lastName) {
        throw new Error("name is not valid");
    }
    else if (!validator.isEmail(emailId)) {
        throw new Error("email is not valid");
    }
    else if (!validator.isStrongPassword(password)) {
        throw new Error("Please enter a strong password");
    }

}

const validateprofileUpdateData = (req) => {
    // const user = req.user;
    const allowedEditProfileFields = ['firstName', 'lastName', 'age', 'gender', 'about', 'skills', 'photoUrl'];

    return  Object.keys(req.body).every(field => allowedEditProfileFields.includes(field));

}

module.exports = {
    validateSignupData,
    validateprofileUpdateData
}