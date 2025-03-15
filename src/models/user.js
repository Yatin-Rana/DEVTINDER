const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        minLength: 3,
    },
    lastName: { type: String },
    emailId: {
        type: String, required: true,
        unique: true,
        lowercase: true,
        trim: true,
        minLength: 3,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error("Email is invalid")
            }
        }
    },
    password: {
        type: String,
        required: true,
        minLength: 4,
        validate(value) {
            if (!validator.isStrongPassword(value)) {
                throw new Error("Password is not strong")
            }
        }
    },
    age: {
        type: Number,
        min: 18
    },
    gender: {
        type: String,
        validate(value) {
            if (!["male", "female", "other"].includes(value)) {
                throw new Error("gender data is invalid")
            }
        },
        required: true,

    },
    photoUrl: {
        type: String,
        default: "https://img.freepik.com/free-psd/contact-icon-illustration-isolated_23-2151903337.jpg?t=st=1741866924~exp=1741870524~hmac=32197538498c1ae9058ade098b1ac9ce71b7c091a6f5fcd16c9279c63d80143c&w=900",
        validator(value) {
            if (!validator.isURL(value)) {
                throw new Error("Invalid photo url")
            }
        }
    },
    about: {
        type: String, default: "Default about user profile",
        minLength: 3,
    },
    skills: {
        type: [String],
        default: [],
    }
    ,
}, {
    timestamps: true,
})

const User = mongoose.model('User', userSchema)

module.exports = User;