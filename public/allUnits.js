// import {rootUrl} from './config.js';
// let rootUrl = "https://nxp-server.herokuapp.com";
const rootUrl = "http://localhost:5000";

var unitSearch = document.getElementById('unit-search');
var searchBtn = document.getElementById('search-btn');
var searchTab = document.getElementById('search-tab');

// searchTab.addEventListener('click', (e) => {
//     e.preventDefault();
//     console.log('inside search tab');
//     unitSearch.focus();
// })

searchBtn.addEventListener('click', e => {
    e.preventDefault();
    let id = unitSearch.value;
    unitSearch.value = "";
    // console.log(`Inside search listener : ${unitSearch.value}`);
    window.location.replace(`${rootUrl}/dashboard/?id=${id}`);
    // unitSearch.focus();
});

unitSearch.addEventListener('keyup', e => {
    e.preventDefault();
    if(e.key == "Enter") {
        let id = unitSearch.value;
        unitSearch.value = "";
        // console.log(`Inside search listener : ${unitSearch.value}`);
        window.location.replace(`${rootUrl}/dashboard/?id=${id}`);
    }
});

let cardDiv = document.getElementById("card-div");

window.addEventListener('load', (event) => {
    console.log('page is fully loaded');
    
    // FETCHING ALL UNITS FROM SERVER
    fetch(`${rootUrl}/get-units`)
        .then(response => response.json())
        .then(data => {
            // locationObj = data['location'];
            console.log('units data', data);
            insertCards(data);
        });
});

const insertCards = (body) => {

    let data = body.data;
    console.log("Inside insertCards", data);

    for(let i=0; i<data.length; i++) {
        let newCard = "";
        newCard += `<div class="card unit-card" ><div class="card-body"><h5 class="card-title">`;
        newCard += `${data[i]['serialNo']}`;
        newCard += `</h5><hr class="bg-danger border-2 border-top border-danger"><p class="card-text">Unit Id :`;
        newCard += ` ${data[i]['_id']} `;
        newCard += ` <br> Mfg Date : `;
        newCard += `${data[i]['mfgDate']}`;
        newCard += `<br> Time : `;
        newCard += `${data[i]['time']}`;
        newCard += `</p><a href="/dashboard/?id=${data[i]['_id']}" class="btn btn-primary"> MORE DETAILS</a></div></div>`
        console.log('new card', newCard);

        cardDiv.innerHTML += newCard;
    }
    
    console.log("exiting ")

    return;
}
