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


window.addEventListener('load', e => {
    console.log('track page loaded');
    let mapFrame = document.getElementById('map-frame');
    // mapFrame.src = `//maps.google.com/maps?q=23.0619486,77.5401496&z=15&output=embed` 
    mapFrame.src = "https://www.google.com/maps/d/u/0/embed?mid=1cMRzn0rnFVgfZaR6f0k4XAyPiKvH4Q4&ehbc=2E312F"
})