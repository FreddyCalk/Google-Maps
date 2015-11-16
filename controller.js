// Angular App Module and controller
angular.module('myApp',[]).controller('mapController',function($scope){
	// Initializing the map options on load
	var apiKey = 'AIzaSyALbD8scArYbj-bAZUvZOk7ld5KUTxAE5A';

	var mapOption = {
		zoom: 4,
		center: new google.maps.LatLng(40.000,-98.000),
		mapTypeId: google.maps.mapTypeId
	}
	// makes the new google maps object visible to the DOM via Angular
	$scope.map = new google.maps.Map($('#map')[0],mapOption)
	$scope.markers = [];
	// adding an info window to each marker that will appear on hover.
	var infoWindow = new google.maps.InfoWindow();
	// This function serves to place the specified marker on the city with which it correlates.
	function createMarker(city,index){

		if(index==0){
			// New York City Icon
        	icon = 'media/1.png';
        }else if(index==38){
        	// Atlanta, GA Icon
        	icon ='media/atl.png';
        }else{
        	// default Icon image for the rest of the cities
        	icon = 'http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2%7CFE7569';
        }
        // method to get information from the JavaScript object into a useable format for the Google API.
		var latLon = city.latLon.split(' ');
		// finds the location of the degree symbol and slices the string from the beginning to the character
		// right before the degree symbol.
		var lat = latLon[0].slice(0,latLon[0].indexOf('&#176')-1);
		var lon = '-'+latLon[1].slice(0,latLon[1].indexOf('&#176')-1);
		// Defines the marker options
		var marker = new google.maps.Marker({
			map: $scope.map,
			position: new google.maps.LatLng(lat, lon),
			title: city.city,
			icon: icon
		})
		var weatherAPI = 'f41d10de3c0215d8df8b41a0b82a5f87'
		var weatherUrl = "http://api.openweathermap.org/data/2.5/weather?q="+city.city+",us,ga&units=imperial&APPID="+weatherAPI;
		
		$.getJSON(weatherUrl, function(weatherData){
        	console.log(weatherData)
		// defining the HTML content of the infor boxes that appear when you click on a marker.
		var markerContentHTML = '<div class="infoWindowContent">';
			markerContentHTML += '<div class="state"><span class="bold">State:</span> ' + city.state + '</div>';
		    markerContentHTML += '<div class="total-pop"><span class="bold">Total Population:</span> ' + city.yearEstimate + '</div>';
		    markerContentHTML += '<div class="pop-dens-last-year"><span class="bold">2010 Census:</span> ' + city.lastCensus + '</div>';
		    markerContentHTML += '<div class="pop-change"><span class="bold">Population Change %:</span> ' + city.change + '</div>';
		    markerContentHTML += '<div class="pop-dens"><span class="bold">Population Density:</span> ' + city.lastPopDensityMiles + '</div>';
		    markerContentHTML += '<div class="land-area"><span class="bold">Land Area:</span> ' + city.landAreaSqMiles + '</div>';
		    markerContentHTML += '<div><span class="bold">Temperature:</span> '+weatherData.main.temp+'&#176F</div>';
		    markerContentHTML += '<img class="floated" src="http://openweathermap.org/img/w/'+weatherData.weather[0].icon+'.png"><br>';
		    markerContentHTML += '<div><span class="bold">Winds:</span> '+cardinalDirection(weatherData.wind.deg)+ ' at '+ weatherData.wind.speed+ ' mph</div><br>';
		    markerContentHTML += '<a href="#" onclick="getDirections('+lat+','+lon+')">Get directions</a><br>';
		    markerContentHTML += '<a href="#" onclick="lodgingSearch('+lat+','+lon+')">Get Lodging</a><br>';
		    markerContentHTML += '<a href="#" onclick="grocerySearch('+lat+','+lon+')">Find Food</a>';
	    	markerContentHTML += '</div>';
    		marker.content = markerContentHTML;
	    	google.maps.event.addListener(marker, 'click', function(){
	    	infoWindow.setContent('<h2>'+ marker.title + '</h2>' + marker.content);
	    	infoWindow.open($scope.map, marker);
	    });
    	});
    	// adding the marker that just got made to the total marker Array.
    	$scope.markers.push(marker)
	}
	// function that binds the buttons to the info boxes for each city
	$scope.triggerClick = function(i){
		google.maps.event.trigger($scope.markers[i-1],'click');
	}
	// when the search bar is submitted, the map markers are updated to show only the cities
	// that appear in the search results
	$scope.updateMarkers = function(){
		for(i=0;i<$scope.markers.length;i++){
			$scope.markers[i].setMap(null);
		}
		for(i=0;i<$scope.filteredCities.length;i++){
			createMarker($scope.filteredCities[i],i);
		}
		// clears the input field on submit
		$('#filter-input').val('')	
	}

	getDirections = function(lat,lon){
		var directionsService = new google.maps.DirectionsService();
   		var directionsDisplay = new google.maps.DirectionsRenderer();
   		var map = new google.maps.Map($('#map')[0],{
   			zoom:7,
   			mapTypeId: google.maps.MapTypeId.ROADMAP
   		})
   		directionsDisplay.setMap(map);
   		directionsDisplay.setPanel($('#map-panel')[0]);
   		// Prompt the user to input their current location.
   		var origin = prompt('Enter your current location!');
   		var request = {
          origin: origin, 
          destination: new google.maps.LatLng(lat,lon),
          // specifies that we want driving directions 
          travelMode: google.maps.DirectionsTravelMode.DRIVING
        };
        // calls directions service so that the route can be plotted on the map
        directionsService.route(request, function(response, status) {
          if (status == google.maps.DirectionsStatus.OK) {
            directionsDisplay.setDirections(response);
          }
        });
	}
	// Letting the object be visible to the DOM and creating markers
	$scope.cities = cities;
	for(i=0; i<cities.length; i++){
		createMarker(cities[i],i);
	}

	function cardinalDirection(deg){
			var direction;
			if((deg<11.25)||(deg>348.75)){
				direction = 'N';
			}else if(deg<33.75){
				direction = 'NNE';
			}else if(deg<56.25){
				direction = 'NE';
			}else if(deg<78.75){
				direction = 'ENE';
			}else if(deg<101.25){
				direction = 'E';
			}else if(deg<123.75){
				direction = 'ESE';
			}else if(deg<146.25){
				direction = 'SE';
			}else if(deg<168.75){
				direction = 'SSE';
			}else if(deg<191.25){
				direction = 'S';
			}else if(deg<213.75){
				direction = 'SSW';
			}else if(deg<236.25){
				direction = 'SW';
			}else if(deg<258.75){
				direction = 'WSW';
			}else if(deg<281.25){
				direction = 'W';
			}else if(deg<303.75){
				direction = 'WNW';
			}else if(deg<326.25){
				direction = 'NW';
			}else if(deg<348.75){
				direction = 'NNW';
			}
			return direction;
		}

	// Function to display local lodging options.  Passing lat and lon for starting location
	lodgingSearch = function(lat1, lon1){
		var map;
		var infowindow;

		  var pyrmont = {lat: lat1, lng: lon1};
		  // Setting center of area to look for lodging
		  map = new google.maps.Map(document.getElementById('map'), {
		    center: pyrmont,
		    zoom: 12
		  });
		  // Generate a new info window
		  infowindow = new google.maps.InfoWindow();

		  var service = new google.maps.places.PlacesService(map);
		  service.nearbySearch({
		    location: pyrmont,
		    radius: 10000,
		    types: ['lodging']
		  }, callback);
		  // Google function that calls back the lodging results
		function callback(results, status) {
		  if (status === google.maps.places.PlacesServiceStatus.OK) {
		    for (var i = 0; i < results.length; i++) {
		      createMarker(results[i]);
		    }
		  }
		}
		// Creates and drops the lodging icons
		function createMarker(place) {
		  var placeLoc = place.geometry.location;
		  var marker = new google.maps.Marker({
		    map: map,
		    position: place.geometry.location,
		    icon: "media/lodging.png"
		  });
		  // var html="<div id='info-window'>"+place.name+"<br>"+place.vicinity+"</div>"
		  google.maps.event.addListener(marker, 'click', function() {
		    infowindow.open(map, this);
			
			var request = {
		    	placeId: place.place_id
			};

		  var service = new google.maps.places.PlacesService(map);
		  service.getDetails(request, function (place, status) {
		    if (status == google.maps.places.PlacesServiceStatus.OK) {
		      // If the request succeeds, draw the place location on the map
		      // as a marker, and register an event to handle a click on the marker.
		      var marker = new google.maps.Marker({
		        map: map,
		        position: place.geometry.location,
		        icon: "media/lodging.png"
		      });
		      console.log(place)
		      	var html = "<div id='info-window'>"+place.name+"<br>"+place.formatted_address+"<br>"
		      		html += place.formatted_phone_number+"</div>"
	      		console.log(html)
		        infowindow.setContent(html);
		      
			}
		})
	})
	}
}



// Function to return local grocery stores. Passing lat and lon
	grocerySearch = function(lat1, lon1){
		var map;
		var infowindow;
		var pyrmont = {lat: lat1, lng: lon1};
		var input = $('#golf-search').text();
		var map;
		var service;
		var infowindow;
		// Set the center location to display nearby stores
		  map = new google.maps.Map(document.getElementById('map'), {
		    center: pyrmont,
		    zoom: 11
		  });
		  // Generate a new info window for each store returned
		  infowindow = new google.maps.InfoWindow();

		  var service = new google.maps.places.PlacesService(map);
		  service.nearbySearch({
		    location: pyrmont,
		    radius: 10000,
		    types: ['grocery_or_supermarket']
		  }, callback);
		  // Returned results

		function callback(results, status) {
		  if (status === google.maps.places.PlacesServiceStatus.OK) {
		    for (var i = 0; i < results.length; i++) {
		      createMarker(results[i]);
		    }
		  }
		}
		// Create custom grocery store icons and place them
		function createMarker(place) {
		  var placeLoc = place.geometry.location;
		  var marker = new google.maps.Marker({
		    map: map,
		    position: place.geometry.location,
		    icon:"media/grocerystore.png"
		  });
		  google.maps.event.addListener(marker, 'click', function() {
		    var placeId = place.id;
		    infowindow.open(map, this);

		    var request = {
		    	placeId: place.place_id
			};

			var service = new google.maps.places.PlacesService(map);
			service.getDetails(request, function (place, status) {
		    if (status == google.maps.places.PlacesServiceStatus.OK) {
		      // If the request succeeds, draw the place location on the map
		      // as a marker, and register an event to handle a click on the marker.
		      var marker = new google.maps.Marker({
		        map: map,
		        position: place.geometry.location,
		        icon: "media/grocerystore.png"
		      });
		      console.log(place)
		      	var html = "<div id='info-window'>"+place.name+"<br>"+place.formatted_address+"<br>"
		      		html += place.formatted_phone_number+"</div>"
	      		console.log(html)
		        infowindow.setContent(html);		      
			}
		})
		  });
		}
	}
})