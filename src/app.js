const express = require('express'); //referencing to that express folder inside node modules
const connectDb = require('../src/config/database')
const app = express(); //creating an express application
const User = require('./models/user')
const cookieParser = require('cookie-parser')
const authRouter = require('./routes/auth')
const profileRouter = require('./routes/profile')
const requestRouter = require('./routes/request')


//first connect to the database then start listening 
app.use(express.json())
app.use(cookieParser())

app.use('/', authRouter);
app.use('/', profileRouter);
app.use('/', requestRouter);

connectDb().then(() => {
    console.log('db connected')
    app.listen(7777, () => {
        console.log('server running on port 7777');
    })
}).catch((err) => {
    console.log('error occured while connecting to db', err.message)
})









//get all records
app.get('/feed', async (req, res) => {
    const users = await User.find({});
    res.send(users);
})

// get unique records
app.get('/user', async (req, res) => {
    const emailId = req.body.emailId;
    try {

        const user = await User.find({ emailId: emailId });

        res.send(user);
    } catch (err) {
        console.log("error occured while geting data", err.message);
        res.status(500).send("bund marao");
    }
})

app.delete('/user', async (req, res) => {
    const userId = req.body.userId;

    try {
        const user = await User.findByIdAndDelete({ userId })
    } catch (err) {
        console.log("error occured while geting data", err.message);
        res.status(500).send("bund marao,  kardia delete");
    }
})

app.patch('/user/:userId', async (req, res) => {
    const userId = req.params?.userId;
    const data = req.body.data;


    try {

        const ALLOWED_UPDATES = ["firstName", "lastName", "emailId", "password", "skills"]

        const isUpdateAllowed = object.keys(data).every((k) =>
            ALLOWED_UPDATES.includes(k))

        if (!isUpdateAllowed) {
            throw new Error("invalid update");
        }

        if (data?.skills.length > 10) {
            throw new Error("skills length should be less than 10")
        }

        const updateUser = await User.findByIdAndUpdate(userId, { data }, {
            returnDocument: "after",
            runValidators: true,
        })

        res.send(updateUser);
    } catch (err) {
        console.log("error occured while geting data", err.message);
        res.status(500).send("bund marao");
    }
})