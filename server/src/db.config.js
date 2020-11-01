const mongoose = require('mongoose');

// console.log(mongoose.connections.id[0]);

mongoose.connect(`mongodb://${process.env.MONGODB_USER}:${process.env.MONGODB_PASSWORD}@${process.env.MONGODB_URL}:${process.env.MONGODB_PORT}/${process.env.MONGODB_DATABASE}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
});
module.exports = mongoose