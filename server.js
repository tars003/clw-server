const express = require('express');
const http = require('http');
const cors = require('cors');
const app = express();
const server = http.createServer(app);
const moment = require('moment');
const path = require('path');
const axios = require('axios');
var request = require('request');

const connectDB = require('./utils/db');

const SerialResponse = require('./models/SerialResponse.model');

const geolocationURI = "https://www.googleapis.com/geolocation/v1/geolocate?key=AIzaSyDn7jrn6QNcoTw3wiMkBR7RHyIkV_-vdu8";

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
        let { data, espId, location } = req.body;


        console.log('Serial Reponse : ', req.body);
        const srObj = await SerialResponse.findById(espId);
        if (!srObj) await SerialResponse.create({ _id: espId });
        const serialRes = await SerialResponse.findByIdAndUpdate(espId, {
            data: data,
            location: location || srObj?.location,
            time: moment().utcOffset("+05:30").format('DD MM YYYY HH:mm:ss')
        });

        // // IF LOCATION RECEIVED IN REQUEST
        // if (location) {
        //     let formattedLocation = formatLocation(location);
        //     console.log('formatted loction : ', formattedLocation);
        // }

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

app.get('/get-data/:espId', async (req, res) => {
    try {
        const srObj = await SerialResponse.findById(req.params.espId);
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

app.get('/get-location/:espId', async (req, res) => {
    try {
        const srObj = await SerialResponse.findById(req.params.espId);

        let arr = formatLocation(srObj.location);
        let resultArr = [];
        for(let i=0; i<arr.length; i++) {
            let data = {
                "cellTowers": [
                    {
                        "cellId": arr[i]["CID"],
                        "locationAreaCode": arr[i]["LAC"],
                        "mobileCountryCode": arr[i]["MCC"],
                        "mobileNetworkCode": arr[i]["MNC"],
                    }
                ]
            }
            const config = {
                method: 'post',
                url: 'https://www.googleapis.com/geolocation/v1/geolocate?key=AIzaSyDn7jrn6QNcoTw3wiMkBR7RHyIkV_-vdu8',
                headers: {
                    'Content-Type': 'application/json',
                    'Cache-Control' : 'no-cache'
                },
                data: data
            };
            let coordinates = await axios(config);
            let result = coordinates.data;
            // console.log('result -----------------', result);
            resultArr.push(result);
        }

        return res.status(200).json({
            success: true,
            time: srObj.time,
            location: resultArr
        })
    } catch (err) {
        console.log('error !', err);
        return res.status(503).json({
            success: false,
            error: err
        })
    }

});

app.get('/get-units', async (req, res) => {
    try {
        const srObj = await SerialResponse.find();
        return res.status(200).json({
            success: true,
            count: srObj.length,
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

app.get('/all-units', function (req, res) {
    res.sendFile(path.join(__dirname, '/templates/allUnits.html'));
});

app.get('/track', function (req, res) {
    res.sendFile(path.join(__dirname, '/templates/track.html'));
});

app.get('/faults', function (req, res) {
    res.sendFile(path.join(__dirname, '/templates/faults.html'));
});

server.listen(process.env.PORT || 3000, () => {
    let port = process.env.PORT || 3000;
    console.log(`listening on localhost:${port}`);
});

const formatLocation = (location) => {
    let a = location.split('`');
    let b = a.slice(1, a.length - 3);
    let result = [];
    b.map((c) => {
        let d = c.split(',');
        let f = [];
        for (let index = 0; index < d.length; index++) {
            if (index == 3 || index == 5 || index == 7) { }
            else
                f.push(d[index].slice(d[index].indexOf(':') + 1, d[index].length));
        }
        f = f.map((t, index) => {
            // IF is HEX
            if (!isHex(t) && index != 0) return parseInt(t, 16);
            else return t;
        })
        // console.log('inside f', f);
        let obj = {
            'Operator': f[0],
            'MCC': f[1],
            'MNC': f[2],
            'LAC': f[4],
            'CID': f[3]
        }
        result.push(obj);
    });

    return result;
}

function isHex(h) {
    var a = parseInt(h, 16);
    return (a.toString(16) === h)
}