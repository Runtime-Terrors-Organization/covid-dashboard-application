let map;
let queryLocation = '';
var location;
var currentLoc = 'canada Region';
var apiUrlRegions = "https://api.covid19tracker.ca/regions";
var proxyUrl = "https://sheltered-ocean-70759.herokuapp.com/"
var apiUrl = "https://api.covid19tracker.ca/reports/province/on";
var todaysDate = moment().format('YYYY[-]MM[-]DD');
var yesterday = moment().subtract(1, 'days').format('YYYY[-]MM[-]DD');
var currentHour = moment().format('HH');
//var currentHour = "9";
console.log(yesterday);
console.log(currentHour);
console.log(todaysDate);


var checkedLocations = JSON.parse(localStorage.getItem("checkedLocations"));
if (checkedLocations == null) {
  checkedLocations = []
};

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
        query: currentLoc,
        fields: ["name", "geometry"],
    };
   var service = new google.maps.places.PlacesService(map);
    service.findPlaceFromQuery(request, (results, status) => {
      if (status === google.maps.places.PlacesServiceStatus.OK) {
         map.setCenter(results[0].geometry.location);
      }
      else {
        //
      }

    });
}



/*
var setData = function (list, index) {
  //if a case is null get the previous stat
  // append a prefix previous to it

  // Provincial status
  $(".stats-title").append(`${list.province.toUpperCase()}`);
  $(".total-recoveries").empty().append(`${list.data[index].total_recoveries}`);
  $(".total-vaccinations").empty().append(`${list.data[index].total_vaccinations}`);
  $(".total-vaccinated").empty().append(`${list.data[index].total_vaccinated}`);
   
  $(".region-title").append(`${list.province.toUpperCase()}`);
  $(".total-cases").empty().append(`${list.data[index].total_cases}`);
  $(".active-cases").empty().append(`${list.data[index].change_cases}`);
  $(".total-regionRecoveries").empty().append(`${list.data[index].total_recoveries}`);
   
}

// Proxy Url deals with a CORS issue when using the Covid API
function currentData() { 
  fetch(proxyUrl + apiUrl)
  .then(function(response) {
      if (response.ok) {
        response.json().then(function(text) {

            console.log(text);
          
          // check for date alternate
          let current_index = text.data.length-1;
          if (text.data[current_index] === todaysDate){
            //console.log("date is current")
          }
          else {
            //console.log(current_index);
            //console.log(text);
            setData(text,current_index);
          }

          
        })
      }
      else {
        //console.log("response is null");
      }
  });
}
*/
var addMarker = function (region) {
  var info_window = new google.maps.InfoWindow();
  const marker = new google.maps.Marker({
    map,
    position:region.geometry.location,
  });
  google.maps.event.addListener(marker, "click", function(){
    info_window.setContent(region.name);
    info_window.open(map)
  });
  
}
var upDateMap = function (newlocation) {
  const request = {
      query: newlocation,
      fields: ["name", "geometry"],
  };
 var service = new google.maps.places.PlacesService(map);
  service.findPlaceFromQuery(request, (results, status) => {
    if (status === google.maps.places.PlacesServiceStatus.OK) {
      for (var i = 0; i< results.length; i++) {
        addMarker(results[i]);
      }
      map.setCenter(results[0].geometry.location);
      map.setZoom(12);
     
    }
    else {
      //console.log("Undifined");
    }
    //console.dir(service);
  });
 }
 
var getRegion = function (data, loc_id){
  for (var i = 0; i < data.data.length-1; i++) {
    if (data.data[i].hr_uid == loc_id) {
      $(".region-title").text(`${data.data[i].engname}`);
      var regionTitle = $(".region-title").text();
      upDateMap(regionTitle);
    }
  }
}

function dropDown() {
  fetch(proxyUrl + apiUrlRegions)
  .then(function(response) {
    if (response.ok) {
      response.json().then(function(text) {

        // get the region into seclect
        for (var i = 0; i < text.data.length; i++) {
            var unitID = text.data[i].hr_uid;
            if (unitID > 3000 && unitID < 4000 ) {
                $(".region-dropdown").append(`<option value=${text.data[i].hr_uid}>${text.data[i].engname}</option>`);
            }
        }
        // fetch the region secleted by user on dropdown
       $(".region-dropdown").change( () => {
         var item_ = $(".region-dropdown").val();
         getRegion(text,item_);
       });
       //console.log(text);
      })
    }
  });
}

 



function provincialData() {
    var apiUrlProvincialData = `https://api.covid19tracker.ca/reports/province/on`;
    fetch(proxyUrl + apiUrlProvincialData)
        .then(function(response) {
            if (response.ok) {
                response.json().then(function(text) {
                    console.log(text);
                    for (var i = 360; i < text.data.length; i++) {
                        var date = text.data[i].date;
                        if (date === todaysDate && currentHour >= 11) {
                            console.log(text.data[i]);
                            $(".total-recoveries").append(`${text.data[i].total_recoveries}`);
                            $(".total-vaccinations").append(`${text.data[i].total_vaccinations}`);
                            $(".total-vaccinated").append(`${text.data[i].total_vaccinated}`);
                        } else if (date === yesterday && currentHour < 11) {
                          console.log(text.data[i].date);
                          $(".total-recoveries").append(`${text.data[i].total_recoveries}`);
                          $(".total-vaccinations").append(`${text.data[i].total_vaccinations}`);
                          $(".total-vaccinated").append(`${text.data[i].total_vaccinated}`);
                        }
                    };
                })
            };
        })
};
$(".region-dropdown").on("change", displayData);
function displayData() {
    var locationId = $(this).val();
    //create empty string to hold location

    if (checkedLocations !==null) {
    for (var i = 0; i< checkedLocations.length; i++) {
      if(locationId === checkedLocations[i].location) {
        $(".region-title").text(checkedLocations[i].regionName);
        $(".total-cases").text(checkedLocations[i].totalCase);
        $(".active-cases").text(checkedLocations[i].totalActive);
        $(".total-regionRecoveries").text(checkedLocations[i].totalRecovery);          
      }
    }
  }

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
                        if (date === todaysDate && currentHour >= 12) {
                            console.log(text.data[i]);
                            var totalCases = parseInt(text.data[i].total_cases);
                            var totalRecoveries = parseInt(text.data[i].total_recoveries);
                            var activeCases = totalCases - totalRecoveries;
                            $(".total-cases").text(`${text.data[i].total_cases}`);
                            $(".active-cases").text(activeCases);
                            $(".total-regionRecoveries").text(`${text.data[i].total_recoveries}`);
                        } else if (date === yesterday && currentHour < 12) {
                          console.log(text.data[i].date);
                          var totalCases = parseInt(text.data[i].total_cases);
                          var totalRecoveries = parseInt(text.data[i].total_recoveries);
                          var activeCases = totalCases - totalRecoveries;
                          $(".total-cases").text(`${text.data[i].total_cases}`);
                          $(".active-cases").text(activeCases);
                          $(".total-regionRecoveries").text(`${text.data[i].total_recoveries}`);
                        }
                    };
                  var localStats = {
                    location: locationId,
                    regionName: $(".region-title").text(),
                    totalCase: $(".total-cases").text(),
                    totalActive: $(".active-cases").text(),
                    totalRecovery: $(".total-regionRecoveries").text()
                  };
                  checkedLocations.push(localStats);
                  localStorage.setItem("checkedLocations", JSON.stringify(checkedLocations));
                })
            };
        })
};

//currentData();
provincialData();

dropDown();