const express = require('express');
const http = require('http');
const cors = require('cors');
const app = express();
const server = http.createServer(app);
const moment = require('moment');
const path = require('path');

const connectDB = require('./utils/db');

const SerialResponse = require('./models/SerialResponse.model');

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname + '/public'));
require('dotenv').config()

connectDB();

app.get('/', (req, res) => {
    res.send('<h1>Hello world</h1>');
});

app.post('/serial-data', async (req, res) => {
    try {
        let { data, espId, location} = req.body;
        

        console.log('Serial Reponse : ', req.body);
        const srObj = await SerialResponse.findById(espId);
        if (!srObj) await SerialResponse.create({ _id: espId });
        const serialRes = await SerialResponse.findByIdAndUpdate(espId, {
            data: data,
            location: location || srObj?.location,
            time: moment().utcOffset("+05:30").format('DD MM YYYY HH:mm:ss')
        });

        return res.status(200).json({
            success: true
        });
    } catch (err) {
        console.log('error !', err);
        return res.status(503).json({
            success: false,
            error: err
        })
    }
});

app.get('/get-data', async (req, res) => {
    try {
        const srObj = await SerialResponse.findById('1');
        return res.status(200).json({
            success: true,
            data: srObj
        });
    } catch (err) {
        console.log('error !', err);
        return res.status(503).json({
            success: false,
            error: err
        })
    }
});

app.get('/dashboard', function (req, res) {
    res.sendFile(path.join(__dirname, '/templates/index.html'));
});

server.listen(process.env.PORT || 3000, () => {
    let port = process.env.PORT || 3000;
    console.log(`listening on localhost:${port}`);
});
