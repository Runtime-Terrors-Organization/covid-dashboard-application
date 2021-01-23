var proxyUrl = "https://sheltered-ocean-70759.herokuapp.com/";
var regionFocus = ["3595", "3570", "3553"];

function dropDown() {
  var apiUrlRegions = "https://api.covid19tracker.ca/regions";
	fetch(proxyUrl + apiUrlRegions)
		.then(function(response) {
			if (response.ok) {
				response.json().then(function(text) {
					console.log(text);

				for(var i = 0; i < text.data.length; i++) {
          $(".region-dropdown").append(`
          <option value=${text.data[i].hr_uid}>${text.data[i].engname}</option>
          `)
        };
      })
    }
  });
};


dropDown();