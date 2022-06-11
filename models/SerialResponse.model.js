const mongoose = require('mongoose');

const SerialResponse = mongoose.Schema({
    _id: String,
    data: String,
    time: String,
});

module.exports = mongoose.model("serialResponse", SerialResponse);