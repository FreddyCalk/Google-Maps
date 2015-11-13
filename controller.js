// Angular App Module and controller
angular.module('myApp',[]).controller('mapController',function($scope){

	// Initializing the map options on load
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
		// defining the HTML content of the infor boxes that appear when you click on a marker.
		var markerContentHTML = '<div class="infoWindowContent">';
		    markerContentHTML += '<div class="total-pop">Total Population: ' + city.yearEstimate + '</div>';
		    markerContentHTML += '<div class="pop-dens-last-year">2010 Census: ' + city.lastCensus + '</div>';
		    markerContentHTML += '<div class="pop-change">Population Change %: ' + city.change + '</div>';
		    markerContentHTML += '<div class="pop-dens">Population Density: ' + city.lastPopDensityMiles + '</div>';
		    markerContentHTML += '<div class="state">State: ' + city.state + '</div>';
		    markerContentHTML += '<div class="land-area">Land Area: ' + city.landAreaSqMiles + '</div>';
		    markerContentHTML += '<a href="#" onclick="getDirections('+lat+','+lon+')">Get directions</a><br>';
		    markerContentHTML += '<a href="#" onclick="lodgingSearch('+lat+','+lon+')">Get Lodging</a><br>';
		    markerContentHTML += '<a href="#" onclick="grocerySearch('+lat+','+lon+')">Find Food</a>';
	    	markerContentHTML += '</div>';
    		marker.content = markerContentHTML;
	    	google.maps.event.addListener(marker, 'click', function(){
	    	infoWindow.setContent('<h2>'+ marker.title + '</h2>' + marker.content);
	    	infoWindow.open($scope.map, marker);
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

	

	// Function to display local lodging options.  Passing lat and lon for starting location
	lodgingSearch = function(lat1, lon1){
		var map;
		var infowindow;

		// function initMap() {
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
			console.log(place);
		  var placeLoc = place.geometry.location;
		  var marker = new google.maps.Marker({
		    map: map,
		    position: place.geometry.location,
		    icon: "media/lodging.png"
		  });
		  var html="<div id='info-window'>"+place.name+"<br>"+place.vicinity+"</div>"
		  google.maps.event.addListener(marker, 'click', function() {
		    infowindow.setContent(html);
		    infowindow.open(map, this);
		  });
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
		  var html="<div id='info-window'>"+place.name+"<br>"+place.vicinity+"</div>"
		  google.maps.event.addListener(marker, 'click', function() {
		    infowindow.setContent(html);
		    infowindow.open(map, this);
		  });
		}
	}
})
	





