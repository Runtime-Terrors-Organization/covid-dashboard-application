let map;
let queryLocation = ''
var location;
var apiUrlRegions = "https://api.covid19tracker.ca/regions";
var proxyUrl = "https://sheltered-ocean-70759.herokuapp.com/"
//var apiUrl = "https://api.covid19tracker.ca/reports/province/on";



// let queryLocation = $(".region-title").text(`${text.data[i].engname}`)
// console.log(queryLocation);

//initialize Google map 
function initMap() {
    const myLatlng = { lat: 43.9009643, lng: -79.8026284 }
     map = new google.maps.Map(document.getElementById("map"), {
        center: myLatlng,
        zoom: 10,
    });

    const request = {
        query: 'Australia Region',
        fields: ["name", "geometry"],
    };
   var service = new google.maps.places.PlacesService;
    //service.findPlaceFromQuery(request, (results, status) => {
    //    if (status === google.maps.places.PlacesServiceStatus.OK) {
    //        map.setCenter(results[0].geometry.location);
    //    }
   // });
    console.log(service);


}

var todaysDate = moment().format('YYYY[-]MM[-]DD');
console.log(todaysDate);


// Proxy Url deals with a CORS issue when using the Covid API
/*
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
    fetch(proxyUrl + apiUrlRegions)
        .then(function(response) {
            if (response.ok) {
                response.json().then(function(text) {
                    console.log(text);

                    for (var i = 0; i < text.data.length; i++) {
                        var unitID = text.data[i].hr_uid;
                        if (unitID === 3553 || unitID === 3570 || unitID === 3595) {
                            $(".region-dropdown").append(`<option value=${text.data[i].hr_uid}>${text.data[i].engname}</option>`)
                        }
                    }
                })
            }
        });
};

function provincialData() {
    var apiUrlProvincialData = `https://api.covid19tracker.ca/reports/province/on`;
    fetch(proxyUrl + apiUrlProvincialData)
        .then(function(response) {
            if (response.ok) {
                response.json().then(function(text) {
                    console.log(text);

                    for (var i = 360; i < text.data.length; i++) {
                        var date = text.data[i].date;
                        if (date === todaysDate) {
                            console.log(text.data[i]);
                            $(".total-recoveries").append(`${text.data[i].total_recoveries}`);
                            $(".total-vaccinations").append(`${text.data[i].total_vaccinations}`);
                            $(".total-vaccinated").append(`${text.data[i].total_vaccinated}`);
                        };
                    };
                })
            };
        })
};

$(".region-dropdown").on("change", displayData);


function displayData() {
    var locationId = $(this).val();
    //create empty string to hold location

    // function to change the map location

    fetch(proxyUrl + apiUrlRegions)
        .then(function(response) {
            if (response.ok) {
                response.json().then(function(text) {
                    for (var i = 0; i < text.data.length; i++) {
                        if (text.data[i].hr_uid == locationId) {
                            $(".region-title").text(`${text.data[i].engname}`);
                            var regionTitle = $(".region-title").text();
                            regionTitle = regionTitle.replace('Health Unit', '');
                            regionTitle = regionTitle.replace('Regional', 'region');
                            console.log(regionTitle);
                            return regionTitle;
                        };

                    }

                });

            };
        })

    var apiUrlRegionData = `https://api.covid19tracker.ca/reports/regions/${locationId}`;
    fetch(proxyUrl + apiUrlRegionData)
        .then(function(response) {
            if (response.ok) {
                response.json().then(function(text) {
                    console.log(text);

                    for (var i = 360; i < text.data.length; i++) {
                        var date = text.data[i].date;
                        if (date === todaysDate) {
                            console.log(text.data[i]);

                            var totalCases = parseInt(text.data[i].total_cases);
                            var totalRecoveries = parseInt(text.data[i].total_recoveries);
                            var activeCases = totalCases - totalRecoveries;
                            $(".total-cases").text(`${text.data[i].total_cases}`);
                            $(".active-cases").text(activeCases);
                            $(".total-regionRecoveries").text(`${text.data[i].total_recoveries}`);
                        };
                    };
                })
            };
        })
};
*/
//provincialData();

//dropDown();