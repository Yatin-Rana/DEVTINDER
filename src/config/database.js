const mongoose = require('mongoose');

const connectDb = async () => {

    const conn = await mongoose.connect(process.env.MONGO_URL);

}

connectDb();

module.exports = connectDb;