
let isConnected = false;
let myPort;

let parsedStr;
let blrLed, compLed, heaterLed;
let timeHeader, dateHeader;

let portSelect;
let portForm;
let mainBody;
let connBtn, disconnBtn;
let alertToast;
let alertToastText;
let loopTimer;
let scanTimer;
let autoBtn;
let manualBtn;
let dataModeBtn;
let toggleBtns;

let isModeAuto = true;
let isDataMode = false;

let blr1Toggle, conf11Toggle, conf12Toggle, comp11Toggle, comp12Toggle, htr1Toggle;
let blr2Toggle, conf21Toggle, conf22Toggle, comp21Toggle, comp22Toggle, htr2Toggle;
let spare1Toggle, spare2Toggle, spare3Toggle, spare4Toggle, contFaultToggle;
let blr12Toggle, blr22Toggle;

let dataBody;
let dataTableBody;
let navBtnDiv;
let exportBtn;
let dataLogTable;

let dataInterval;

let mapFrame;
let mapBtn;
let locationIndex = 0;
let locationObj = {} ;

// NAV BTNS & CONNECT BTN LOADING & LISTENING
const loadInitialElements = async () => {
  // ADD EVENT LISTNER ON SUBMIT AND CONNECT TO SELECTED PORT
    loadStartExportBtn();
    // LOAD ALERT TOAST HTML
    // loadToast();

    // LOAD AND ADD NAV BUTTON LISTENERS
    loadNavButtons();

    // LOAD DISCONNECT AND CONNECT BUTTON
    loadConnDisconn();
}
const loadStartExportBtn = () => {
  portForm = document.getElementById("port-form");

  exportBtn = document.getElementById('export-btn');

  portForm.addEventListener('submit', e => {
    e.preventDefault();
    startConnection();
  });

  // // HANDLES ACTUALLY EXPORTING THE DATA
  // exportBtn.addEventListener('click', (e) => {
  //   e.preventDefault();
  //   dataLogTable = document.getElementById('scroll-div');
  //   let csv = tableToCsv(dataLogTable.innerHTML);

  //   ipcRenderer.send('file-request');

  //   ipcRenderer.on('file-response', (event, data) => {
  //     // console.log('obtained file from main process: ' + data );
  //     // console.log(dataLogTable.innerHTML);
  //     fs.writeFile(data, csv, (err) => {

  //       // In case of a error throw err.
  //       if (err) throw err;
  //       alert('File Saved Successfully!')

  //     });
  //   });

  // });
}
const loadNavButtons = () => {
  autoBtn = document.getElementById("auto-btn");
  manualBtn = document.getElementById("manual-btn");
  dataModeBtn = document.getElementById("data-btn");

  toggleBtns = document.getElementsByClassName("switch");
  toggleBtns = [...toggleBtns];

  autoBtn.addEventListener('click', (e) => {
    e.preventDefault();
    autoModeON();
  });
  manualBtn.addEventListener('click', (e) => {
    e.preventDefault();
    manualModeON();
  });
  dataModeBtn.addEventListener('click', (e) => {
    e.preventDefault();
    dataModeON();
  });

  autoModeON();

  manualBtn.hidden = true;

}
// NAV BTNS & CONNECT BTN LOADING & LISTENING


// NAV BTN LISTENERS
const autoModeON = () => {

  mainBody = document.getElementById('body-div');
  dataBody = document.getElementById('data-div');

  isModeAuto = true;
  isDataMode = false;
  autoBtn.style.backgroundColor = "#de4d31";
  manualBtn.style.backgroundColor = "#c9c4c3";
  dataModeBtn.style.backgroundColor = "#c9c4c3";
  autoBtn.style.color = "white";
  manualBtn.style.color = "black";
  dataModeBtn.style.color = "black";


  // CHANGING TABLE COLOR TO RED FOR MANUAL & BLUE FOR AUTO
  let tables = document.getElementsByTagName('table');
  tables = [...tables]
  tables.map(table => {
    table.style.backgroundColor = '#d0f5ec';
  });

  // HIDING SHOWING TOGGLE BUTTONS
  toggleBtns.map((btn) => {
    // console.log('toggle hidden', btn);
    btn.style.display = "none";
  });

  mainBody.style.display = "block";
  dataBody.style.display = "none";
  exportBtn.style.display = "none";

  // if (isConnected) myPort.write("AUTO\n");

  // WHEN EXITING MANUAL MODE, TURNING ALL TOGGLE SWITCHES OFF
  if (isConnected) {
    blr1Toggle.checked = false;
    htr1Toggle.checked = false;
    conf11Toggle.checked = false;
    conf12Toggle.checked = false;
    comp11Toggle.checked = false;
    comp12Toggle.checked = false;

    blr2Toggle.checked = false;
    htr2Toggle.checked = false;
    conf21Toggle.checked = false;
    conf22Toggle.checked = false;
    comp21Toggle.checked = false;
    comp22Toggle.checked = false;

    spare1Toggle.checked = false;
    spare2Toggle.checked = false;
    spare3Toggle.checked = false;
    spare4Toggle.checked = false;
    contFaultToggle.checked = false;

    blr12Toggle.checked = false;
    blr22Toggle.checked = false;
  }
}
const manualModeON = () => {

  mainBody = document.getElementById('body-div');
  dataBody = document.getElementById('data-div');

  isModeAuto = false;
  isDataMode = false;
  manualBtn.style.backgroundColor = "#de4d31";
  autoBtn.style.backgroundColor = "#c9c4c3";
  dataModeBtn.style.backgroundColor = "#c9c4c3";
  autoBtn.style.color = "black";
  manualBtn.style.color = "white";
  dataModeBtn.style.color = "black";


  // CHANGING TABLE COLOR TO RED FOR MANUAL & BLUE FOR AUTO
  let tables = document.getElementsByTagName('table');
  tables = [...tables]
  tables.map(table => {
    table.style.backgroundColor = "#fcd2ca";
  });

  // HIDING SHOWING TOGGLE BUTTONS
  toggleBtns.map((btn) => {
    btn.style.display = "block";
  });

  mainBody.style.display = "block";
  dataBody.style.display = "none";
  exportBtn.style.display = "none";

  // if (isConnected) myPort.write("MANU\n");
}
const dataModeON = () => {

  mainBody = document.getElementById('body-div');
  dataBody = document.getElementById('data-div');

  exportBtn = document.getElementById('export-btn');

  isModeAuto = true;
  isDataMode = true;
  manualBtn.style.backgroundColor = "#c9c4c3";
  autoBtn.style.backgroundColor = "#c9c4c3";
  dataModeBtn.style.backgroundColor = "#de4d31";
  autoBtn.style.color = "black";
  manualBtn.style.color = "black";
  dataModeBtn.style.color = "white";

  mainBody.style.display = "none";
  dataBody.style.display = "block";
  exportBtn.style.display = "block";

  // if (isConnected) myPort.write("AUTO\n");

}
const loadConnDisconn = () => {
  connBtn = document.getElementById('port-submit');
  disconnBtn = document.getElementById('port-disconnect');
  exportBtn = document.getElementById('export-btn');

  disconnBtn.addEventListener('click', (e) => {
    e.preventDefault();
    isConnected = false;
    disconnectPort();
  });

  mainBody = document.getElementById('body-div');
  dataBody = document.getElementById('data-div');
  navBtnDiv = document.getElementById('nav-btn-div');

  if (isConnected) {
    connBtn.style.display = "none";
    disconnBtn.style.display = "block";
    navBtnDiv.style.display = "block";
    if (isDataMode) {
      mainBody.style.display = "none";
      dataBody.style.display = "block";
      exportBtn.style.display = "block";
    }
    else {
      mainBody.style.display = "block";
      dataBody.style.display = "none";
      exportBtn.style.display = "none";
    }
  } else {
    console.log('inside hide disconnect')
    connBtn.style.display = "block";
    disconnBtn.style.display = "none";
    mainBody.style.display = "none";
    dataBody.style.display = "none";
    navBtnDiv.style.display = "none";
    exportBtn.style.display = "none";
  }
}
// NAV BTN LISTENERS




// LOAD I/0 AND ANALOG TABLES AND START HITTING API
const startConnection = () => {


  // GET OUTPUT ELEMENTS HTML, INTO MEMORY
  getOutputElements();


  // parser.on('data', readSerialData);
  startListening();

  isConnected = true;

  loopTimer = setInterval(loadConnDisconn, 500);

}
const startListening = () => {

  mapFrame = document.getElementById('map-frame');
  mapBtn = document.getElementById('map-btn');

  mapBtn.addEventListener('click', e => {
    e.preventDefault();
    if(locationIndex >= locationObj.length-1) locationIndex = 0;
    else locationIndex += 1;

    console.log('location index = ', locationIndex);
    changeLocationOnMap(locationObj);
  })

  // GET CURRENT URL
  let currUrl = window.location.href;
  let unitId = currUrl.slice(currUrl.indexOf('id')+3, currUrl.length);
  console.log(`current url : ${window.location.href}, unit : ${unitId}`);

  // FETCHING COORDINATES FROM SERVER
  fetch(`${rootUrl}/get-location/${unitId}`)
    .then(response => response.json())
    .then(data => {
      locationObj = data['location'];
      console.log('location data', data);

      changeLocationOnMap(locationObj);
    });

  // FETCHING DATA FROM SERIAL AT REGULAR INTERVALS
  dataInterval = setInterval(() => {
    fetch(`${rootUrl}/get-data/${unitId}`)
      .then(response => response.json())
      .then(data => {
        console.log(data);
        let str = JSON.stringify(data.data.data);
        str = str.slice(1, str.length-1);
        updateDateTime(data.data.time);
        readSerialData(str);
      });
  }, 2000);
}
const readSerialData = (data) => {
  parsedStr = data;
  if (data.substring(0, 1) == '<') {
    // CHANGE OUTPUTS AND SOON AS NEW DATA RECEIVED
    changeOutput(data);
  }

  console.log('inside parsing data', data);
}
// LOAD I/0 AND ANALOG TABLES AND START HITTING API

const disconnectPort = () => {
  myPort.close();
  loadConnDisconn();
  clearTimeout(loopTimer);

  autoModeON();
  mainBody.style.display = "none";
}

const updateDateTime = (str) => {
  timeHeader.innerHTML = str.slice(0, 10);
  dateHeader.innerHTML = str.slice(11, 19);
}

// TABLE VALUE LISTENERS
const changeOutput = (data) => {
  // UNIT 1
  if (parsedStr.substring(14, 15) == '1') {
    blrLed.style = "background-color: rgb(88, 206, 88); color: white;";
    blrLed.innerHTML = "ON";
  } else {
    blrLed.style = "background-color: rgb(228, 58, 58); color: white;";
    blrLed.innerHTML = "OFF";
  }

  if (parsedStr.substring(16, 17) == '1') {
    compLed.style = "background-color: rgb(88, 206, 88); color: white;";
    compLed.innerHTML = "ON";
  } else {
    compLed.style = "background-color: rgb(228, 58, 58); color: white;";
    compLed.innerHTML = "OFF";
  }

  if (parsedStr.substring(18, 19) == '1') {
    heaterLed.style = "background-color: rgb(88, 206, 88); color: white;";
    heaterLed.innerHTML = "ON";
  } else {
    heaterLed.style = "background-color: rgb(228, 58, 58); color: white;";
    heaterLed.innerHTML = "OFF";
  }

}
const getOutputElements = () => {
  blrLed = document.getElementById('blr-led');
  compLed = document.getElementById('comp-led');
  heaterLed = document.getElementById('heater-led');
  timeHeader = document.getElementById('time-header');
  dateHeader = document.getElementById('date-header');
}

// TABLE VALUE LISTENERS




// ADD ROW TO DATA TABLE
const addRow = (data) => {
  dataTableBody = document.getElementById('data-table-body');
  let scrollDiv = document.getElementById('scroll-div');
  let resString = "";
  let logString = "";

  if (1) {
    //DATE
    resString += `<td class="stickyCell1">${parsedStr.substring(14, 24)}</td>`;
    logString += `${parsedStr.substring(14, 24)},`;

    //TIME
    resString += `<td class="stickyCell2">${parsedStr.substring(5, 13)}</td>`;
    logString += `${parsedStr.substring(5, 13)},`;

    // BLR1/1
    if (parsedStr.substring(164, 165) == '1') resString += '<td style="background-color: rgb(88, 206, 88); color: white;">ON</td>';
    else resString += '<td style="background-color: rgb(228, 58, 58); color: white;">OFF</td>';
    if (parsedStr.substring(164, 165) == '1') logString += 'ON,';
    else logString += 'OFF,';

    // BLR1/2
    if (0) resString += '<td style="background-color: rgb(88, 206, 88); color: white;">ON</td>';
    else resString += '<td style="background-color: rgb(228, 58, 58); color: white;">OFF</td>';
    if (0) logString += 'ON,';
    else logString += 'OFF,';

    // BLR2/1
    if (parsedStr.substring(166, 167) == '1') resString += '<td style="background-color: rgb(88, 206, 88); color: white;">ON</td>';
    else resString += '<td style="background-color: rgb(228, 58, 58); color: white;">OFF</td>';
    if (parsedStr.substring(166, 167) == '1') logString += 'ON,';
    else logString += 'OFF,';

    // BLR2/2
    if (0) resString += '<td style="background-color: rgb(88, 206, 88); color: white;">ON</td>';
    else resString += '<td style="background-color: rgb(228, 58, 58); color: white;">OFF</td>';
    if (0) logString += 'ON,';
    else logString += 'OFF,';

    // CONF1/1
    if (parsedStr.substring(168, 169) == '1') resString += '<td style="background-color: rgb(88, 206, 88); color: white;">ON</td>';
    else resString += '<td style="background-color: rgb(228, 58, 58); color: white;">OFF</td>';
    if (parsedStr.substring(168, 169) == '1') logString += 'ON,';
    else logString += 'OFF,';

    // CONF1/2
    if (parsedStr.substring(170, 171) == '1') resString += '<td style="background-color: rgb(88, 206, 88); color: white;">ON</td>';
    else resString += '<td style="background-color: rgb(228, 58, 58); color: white;">OFF</td>';
    if (parsedStr.substring(170, 171) == '1') logString += 'ON,';
    else logString += 'OFF,';


    // CONF2/1
    if (parsedStr.substring(172, 173) == '1') resString += '<td style="background-color: rgb(88, 206, 88); color: white;">ON</td>';
    else resString += '<td style="background-color: rgb(228, 58, 58); color: white;">OFF</td>';
    if (parsedStr.substring(172, 173) == '1') logString += 'ON,';
    else logString += 'OFF,';

    // CONF2/2
    if (parsedStr.substring(174, 175) == '1') resString += '<td style="background-color: rgb(88, 206, 88); color: white;">ON</td>';
    else resString += '<td style="background-color: rgb(228, 58, 58); color: white;">OFF</td>';
    if (parsedStr.substring(174, 175) == '1') logString += 'ON,';
    else logString += 'OFF,';

    // COMP1/1
    if (parsedStr.substring(176, 177) == '1') resString += '<td style="background-color: rgb(88, 206, 88); color: white;">ON</td>';
    else resString += '<td style="background-color: rgb(228, 58, 58); color: white;">OFF</td>';
    if (parsedStr.substring(176, 177) == '1') logString += 'ON,';
    else logString += 'OFF,';

    // COMP1/2
    if (parsedStr.substring(178, 179) == '1') resString += '<td style="background-color: rgb(88, 206, 88); color: white;">ON</td>';
    else resString += '<td style="background-color: rgb(228, 58, 58); color: white;">OFF</td>';
    if (parsedStr.substring(178, 179) == '1') logString += 'ON,';
    else logString += 'OFF,';

    // COMP2/1
    if (parsedStr.substring(180, 181) == '1') resString += '<td style="background-color: rgb(88, 206, 88); color: white;">ON</td>';
    else resString += '<td style="background-color: rgb(228, 58, 58); color: white;">OFF</td>';
    if (parsedStr.substring(180, 181) == '1') logString += 'ON,';
    else logString += 'OFF,';

    // COMP2/2
    if (parsedStr.substring(182, 183) == '1') resString += '<td style="background-color: rgb(88, 206, 88); color: white;">ON</td>';
    else resString += '<td style="background-color: rgb(228, 58, 58); color: white;">OFF</td>';
    if (parsedStr.substring(182, 183) == '1') logString += 'ON,';
    else logString += 'OFF,';

    // HTR1
    if (parsedStr.substring(160, 161) == '1') resString += '<td style="background-color: rgb(88, 206, 88); color: white;">ON</td>';
    else resString += '<td style="background-color: rgb(228, 58, 58); color: white;">OFF</td>';
    if (parsedStr.substring(160, 161) == '1') logString += 'ON,';
    else logString += 'OFF,';

    // HTR2
    if (parsedStr.substring(162, 163) == '1') resString += '<td style="background-color: rgb(88, 206, 88); color: white;">ON</td>';
    else resString += '<td style="background-color: rgb(228, 58, 58); color: white;">OFF</td>';
    if (parsedStr.substring(162, 163) == '1') logString += 'ON,';
    else logString += 'OFF,';

  }
  if (1) {
    // RT1
    resString += `<td style="background-color: #ABDD93;">${data.substring(25, 29)}</td>`;
    // RT2
    resString += `<td style="background-color: #ABDD93;">${data.substring(30, 34)}</td>`;
    // AT1
    resString += `<td style="background-color: #ABDD93;">${data.substring(35, 39)}</td>`;
    // AT2
    resString += `<td style="background-color: #ABDD93;">${data.substring(40, 44)}</td>`;
    // ST1
    resString += `<td style="background-color: #ABDD93;">${data.substring(45, 49)}</td>`;
    // ST2
    resString += `<td style="background-color: #ABDD93;">${data.substring(50, 54)}</td>`;
    // RH
    resString += `<td style="background-color: #ABDD93;">${data.substring(55, 59)}</td>`;
  }
  if (1) {
    // HP11
    resString += `<td style="background-color: #ABDD93;">${data.substring(55, 59)}</td>`;
    // HP12
    resString += `<td style="background-color: #ABDD93;">${data.substring(60, 64)}</td>`;
    // HP21
    resString += `<td style="background-color: #ABDD93;">${data.substring(65, 69)}</td>`;
    // HP22
    resString += `<td style="background-color: #ABDD93;">${data.substring(70, 74)}</td>`;
    // LP11
    resString += `<td style="background-color: #ABDD93;">${data.substring(75, 79)}</td>`;
    // LP12
    resString += `<td style="background-color: #ABDD93;">${data.substring(80, 84)}</td>`;
    // LP21
    resString += `<td style="background-color: #ABDD93;">${data.substring(85, 89)}</td>`;
    // LP22
    resString += `<td style="background-color: #ABDD93;">${data.substring(90, 94)}</td>`;
  }
  if (1) {
    // BLR1/1
    if (parsedStr.substring(128, 129) == '1') resString += '<td style="background-color: rgb(88, 206, 88); color: white;">OK</td>';
    else resString += '<td style="background-color: rgb(228, 58, 58); color: white;">N_OK</td>';

    // BLR1/2
    if (0) resString += '<td style="background-color: rgb(88, 206, 88); color: white;">OK</td>';
    else resString += '<td style="background-color: rgb(228, 58, 58); color: white;">N_OK</td>';

    // BLR2/1
    if (parsedStr.substring(130, 131) == '1') resString += '<td style="background-color: rgb(88, 206, 88); color: white;">OK</td>';
    else resString += '<td style="background-color: rgb(228, 58, 58); color: white;">N_OK</td>';

    // BLR2/2
    if (0) resString += '<td style="background-color: rgb(88, 206, 88); color: white;">OK</td>';
    else resString += '<td style="background-color: rgb(228, 58, 58); color: white;">N_OK</td>';

    // COKF1/1
    if (parsedStr.substring(116, 117) == '1') resString += '<td style="background-color: rgb(88, 206, 88); color: white;">OK</td>';
    else resString += '<td style="background-color: rgb(228, 58, 58); color: white;">N_OK</td>';

    // COKF1/2
    if (parsedStr.substring(118, 119) == '1') resString += '<td style="background-color: rgb(88, 206, 88); color: white;">OK</td>';
    else resString += '<td style="background-color: rgb(228, 58, 58); color: white;">N_OK</td>';

    // COKF2/1
    if (parsedStr.substring(120, 121) == '1') resString += '<td style="background-color: rgb(88, 206, 88); color: white;">OK</td>';
    else resString += '<td style="background-color: rgb(228, 58, 58); color: white;">N_OK</td>';

    // COKF2/2
    if (parsedStr.substring(122, 123) == '1') resString += '<td style="background-color: rgb(88, 206, 88); color: white;">OK</td>';
    else resString += '<td style="background-color: rgb(228, 58, 58); color: white;">N_OK</td>';

    // HP1/1
    if (parsedStr.substring(100, 101) == '1') resString += '<td style="background-color: rgb(88, 206, 88); color: white;">OK</td>';
    else resString += '<td style="background-color: rgb(228, 58, 58); color: white;">N_OK</td>';

    // HP1/2
    if (parsedStr.substring(102, 103) == '1') resString += '<td style="background-color: rgb(88, 206, 88); color: white;">OK</td>';
    else resString += '<td style="background-color: rgb(228, 58, 58); color: white;">N_OK</td>';

    // HP2/1
    if (parsedStr.substring(104, 105) == '1') resString += '<td style="background-color: rgb(88, 206, 88); color: white;">OK</td>';
    else resString += '<td style="background-color: rgb(228, 58, 58); color: white;">N_OK</td>';

    // HP2/2
    if (parsedStr.substring(106, 107) == '1') resString += '<td style="background-color: rgb(88, 206, 88); color: white;">OK</td>';
    else resString += '<td style="background-color: rgb(228, 58, 58); color: white;">N_OK</td>';

    // LP1/1
    if (parsedStr.substring(108, 109) == '1') resString += '<td style="background-color: rgb(88, 206, 88); color: white;">OK</td>';
    else resString += '<td style="background-color: rgb(228, 58, 58); color: white;">N_OK</td>';

    // LP1/2
    if (parsedStr.substring(110, 111) == '1') resString += '<td style="background-color: rgb(88, 206, 88); color: white;">OK</td>';
    else resString += '<td style="background-color: rgb(228, 58, 58); color: white;">N_OK</td>';

    // LP2/1
    if (parsedStr.substring(112, 113) == '1') resString += '<td style="background-color: rgb(88, 206, 88); color: white;">OK</td>';
    else resString += '<td style="background-color: rgb(228, 58, 58); color: white;">N_OK</td>';

    // LP2/2
    if (parsedStr.substring(114, 115) == '1') resString += '<td style="background-color: rgb(88, 206, 88); color: white;">OK</td>';
    else resString += '<td style="background-color: rgb(228, 58, 58); color: white;">N_OK</td>';

    // HTR1
    if (parsedStr.substring(124, 125) == '1') resString += '<td style="background-color: rgb(88, 206, 88); color: white;">OK</td>';
    else resString += '<td style="background-color: rgb(228, 58, 58); color: white;">N_OK</td>';

    // HTR2
    if (parsedStr.substring(126, 127) == '1') resString += '<td style="background-color: rgb(88, 206, 88); color: white;">OK</td>';
    else resString += '<td style="background-color: rgb(228, 58, 58); color: white;">N_OK</td>';
  }
  dataTableBody.innerHTML += `<tr>${resString}</tr>`;

  scrollDiv.scrollTop = scrollDiv.scrollHeight;
}
// ADD ROW TO DATA TABLE



loadInitialElements();

const changeLocationOnMap = (locationObj) => {

  let lat = locationObj[locationIndex]['location']['lat'];
  let long = locationObj[locationIndex]['location']['lng'];

  mapFrame = document.getElementById('map-frame');
  mapFrame.src = `//maps.google.com/maps?q=${lat},${long}&z=15&output=embed` 
}


var unitSearch = document.getElementById('unit-search');
var searchBtn = document.getElementById('search-btn');

searchBtn.addEventListener('click', e => {
    e.preventDefault();
    let id = unitSearch.value;
    unitSearch.value = "";
    // console.log(`Inside search listener : ${unitSearch.value}`);
    window.location.replace(`${rootUrl}/dashboard/?id=${id}`);
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



