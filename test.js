var request = require('request');

var options = {
    'method': 'POST',
    'url': 'https://www.googleapis.com/geolocation/v1/geolocate?key=AIzaSyDn7jrn6QNcoTw3wiMkBR7RHyIkV_-vdu8',
    'headers': {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      "cellTowers": [
        {
          "cellId": 11111,
          "locationAreaCode": 52012,
          "mobileCountryCode": 404,
          "mobileNetworkCode": 78
        }
      ]
    })
  
  };
  request(options, function (error, response) {
    if (error) throw new Error(error);
    console.log(response.body);
  });