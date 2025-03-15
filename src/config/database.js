const mongoose = require('mongoose');

const connectDb = async () => {

    const conn = await mongoose.connect('mongodb+srv://raktsetu001:gESBkJrIZz9s5jfk@nmn.my2ux.mongodb.net/devtinder');

}

connectDb();

module.exports = connectDb;