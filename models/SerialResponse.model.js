const mongoose = require('mongoose');

const SerialResponse = mongoose.Schema({
    data: String,
    time: String,
});

module.exports = mongoose.model("serialResponse", SerialResponse);