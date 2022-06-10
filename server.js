const express = require('express');
const http = require('http');
const cors = require('cors');
const app = express();
const server = http.createServer(app);
const moment = require('moment');

const connectDB = require('./utils/db');

const SerialResponse = require('./models/SerialResponse.model');

app.use(cors());
app.use(express.json());
require('dotenv').config()

connectDB();

app.get('/', (req, res) => {
    res.send('<h1>Hello world</h1>');
});

app.post('/serial-data', async (req, res) => {
    try {
        let data = req.body.data;
        console.log('Serial Reponse : ', data);
        const serialRes = await SerialResponse.create({
            data: data,
            time: moment().format('DD MM YYYY HH:mm:ss')
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

server.listen(process.env.PORT || 3000, () => {
    let port = process.env.PORT || 3000;
    console.log(`listening on localhost:${port}`);
});
