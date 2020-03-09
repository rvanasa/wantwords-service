const mongoose = require('mongoose');

module.exports = () => {
    mongoose.Promise = Promise;
    mongoose.set('useNewUrlParser', true);
    mongoose.set('useCreateIndex', true);

    return mongoose.createConnection(process.env.DATABASE);
};