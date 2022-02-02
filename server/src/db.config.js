const mongoose = require('mongoose');
require('dotenv').config()

console.log('attempting connection...');
console.log(`mongodb://${process.env.MONGODB_USER}:${process.env.MONGODB_PASSWORD}@${process.env.MONGODB_URL}:${process.env.MONGODB_PORT}/${process.env.MONGODB_DATABASE}`);
mongoose.connect(`mongodb://${process.env.MONGODB_USER}:${process.env.MONGODB_PASSWORD}@${process.env.MONGODB_URL}:${process.env.MONGODB_PORT}/${process.env.MONGODB_DATABASE}`, {
    connectTimeoutMS: 1000,
    authSource: "admin",
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
});

mongoose.connection.on('error', err => {
    console.error(err);
});

mongoose.connection.on('connected', () => {
    console.log("mongoose connected");
});

module.exports = mongoose