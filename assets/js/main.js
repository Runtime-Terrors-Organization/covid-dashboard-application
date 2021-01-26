let map;

function initMap() {
  map = new google.maps.Map(document.getElementById("map"), {
    center: {
      lat: -34.397,
      lng: 150.644
    },
  zoom: 8,
  });
}

var todaysDate = moment().format('YYYY[-]MM[-]DD');
console.log(todaysDate);


// Proxy Url deals with a CORS issue when using the Covid API
//var proxyUrl = "https://sheltered-ocean-70759.herokuapp.com/"
//var apiUrl = "https://api.covid19tracker.ca/reports/province/on";

fetch(proxyUrl + apiUrl)
	.then(function(response) {
    if (response.ok) {response.json().then(function(text) {
				console.log(text);
				console.log(text.data.length);
				//For loop to compare current date to date in API
				
				for(var i = 360; i < text.data.length; i++) {
					var dates = text.data[i].date;
					console.log(dates);
					if ( dates === todaysDate) {
						console.log("matched")
					}
				}
			})
		}
  });

  
function dropDown() {
  //var apiUrlRegions = "https://api.covid19tracker.ca/regions";
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
            };
          }
        })
      }
    });
};

function provincialData() {
  //var apiUrlProvincialData = `https://api.covid19tracker.ca/reports/province/on`;
  fetch(proxyUrl + apiUrlProvincialData)
  .then(function(response) {
    if (response.ok) {
      response.json().then(function(text) {
        console.log(text);

        for(var i = 360; i < text.data.length; i++) {
          var date = text.data[i].date;
          if ( date === todaysDate) {
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

  //var apiUrlRegions = "https://api.covid19tracker.ca/regions";
  fetch(proxyUrl + apiUrlRegions)
	.then(function(response) {
		if (response.ok) {
			response.json().then(function(text) {
        console.log(text);
        for (var i = 0; i < text.data.length; i++) {
          if (text.data[i].hr_uid == locationId) {
          $(".region-title").append(`${text.data[i].engname}`)
          };
        }
      });
    };
  })

  //var apiUrlRegionData = `https://api.covid19tracker.ca/reports/regions/${locationId}`;
  fetch(proxyUrl + apiUrlRegionData)
  .then(function(response) {
    if (response.ok) {
      response.json().then(function(text) {
        console.log(text);

        for(var i = 360; i < text.data.length; i++) {
          var date = text.data[i].date;
          if ( date === todaysDate) {
            console.log(text.data[i]);

            var totalCases = parseInt(text.data[i].total_cases);
            var totalRecoveries = parseInt(text.data[i].total_recoveries);
            var activeCases = totalCases - totalRecoveries;
            $(".total-cases").append(`${text.data[i].total_cases}`);
            $(".active-cases").append(activeCases);
            $(".total-regionRecoveries").append(`${text.data[i].total_recoveries}`);
          };
        };
      })
    };
  })
};

provincialData();

dropDown();