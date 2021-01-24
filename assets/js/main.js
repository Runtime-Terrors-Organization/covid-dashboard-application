var todaysDate = moment().format('YYYY[-]MM[-]DD');
console.log(todaysDate);

let map;

function initMap() {
    map = new google.maps.Map(document.getElementById("map"), {
        center: {
            lat: 43.8999746,
            lng: -79.8026238
        },
        zoom: 8,
    });
}

// Proxy Url deals with a CORS issue when using the Covid API
var proxyUrl = "https://sheltered-ocean-70759.herokuapp.com/"
var apiUrl = "https://api.covid19tracker.ca/reports/province/on";

fetch(proxyUrl + apiUrl)
    .then(function(response) {
        if (response.ok) {
            response.json().then(function(text) {
                console.log(text);
                console.log(text.data.length);
                //For loop to compare current date to date in API

                for (var i = 360; i < text.data.length; i++) {
                    var dates = text.data[i].date;
                    console.log(dates);
                    if (dates === todaysDate) {
                        console.log("matched")
                    }
                }


            })
        }
    });


function dropDown() {
    var apiUrlRegions = "https://api.covid19tracker.ca/regions";
    fetch(proxyUrl + apiUrlRegions)
        .then(function(response) {
            if (response.ok) {
                response.json().then(function(text) {
                    console.log(text);

                    for (var i = 0; i < text.data.length; i++) {

                        var unitID = text.data[i].hr_uid;
                        
                            if (unitID === 3553 || unitID === 3570 || unitID === 3595) {
                                $(".region-dropdown").append(`<option value=${text.data[i].hr_uid}>${text.data[i].engname}</option>`)
                            } else {
                                $(".region-dropdown").append(`<option value=${text.data[i].hr_uid} disabled >${text.data[i].engname}</option>`)
                            }
                    };
                })
            }
        });
};

dropDown();