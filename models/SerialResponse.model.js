const mongoose = require('mongoose');

const SerialResponse = mongoose.Schema({
    _id: String,
    data: String,
    time: String,
    latitude: String,
    longitude: String,
    speed: String,
    altitude: String
});

module.exports = mongoose.model("serialResponse", SerialResponse);