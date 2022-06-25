const mongoose = require('mongoose');

const SerialResponse = mongoose.Schema({
    _id: String,
    data: String,
    time: String,
    location: String
});

module.exports = mongoose.model("serialResponse", SerialResponse);