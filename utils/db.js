const mongoose = require('mongoose');

const connectDB = () => {
    let dbUrl = 'mongodb+srv://ajay:ajay@cluster0.9ljycxo.mongodb.net/v1?retryWrites=true&w=majority';
    console.log(dbUrl);
    mongoose
        .connect(dbUrl, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })
        .then(() => console.log("db connected"))
        .catch((err) => console.log(err));
}

module.exports = connectDB;