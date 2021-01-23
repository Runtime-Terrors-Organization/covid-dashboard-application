var todaysDate = moment().format('YYYY[-]MM[-]DD');
console.log(todaysDate);






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
					
					for(var i = 360; i < text.data.length; i++) {
						var dates = text.data[i].date;
						console.log(dates);
						if ( dates === todaysDate) {
							console.log("matched")
						}
					}
					
					
				})
			}
		})
	