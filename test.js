const bscoords = require('bscoords');

bscoords.init({
    apikey_mylnikov: '',
    apikey_opencellid: 'pk.581e4364cd018c81a477b9d35ba19607',
    apikey_mozilla: '',
    'timeout': 3000
});


let mcc = 404;
let mnc = 78;
let lac = 52012
let cid = 41323;

bscoords
    .all(mcc, mnc, lac, cid)
    .then(coords => {
        console.log(`All:`);
        console.log(JSON.stringify(coords, null, 4));
    })
    .catch(err => {
        console.log(`All ERROR:`);
        console.log(err);
    });