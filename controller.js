// Angular App Module and controller
angular.module('myApp',[]).controller('mapController',function($scope){


	var mapOption = {
		zoom: 4,
		center: new google.maps.LatLng(40.000,-98.000),
		mapTypeId: google.maps.mapTypeId
	}

	$scope.map = new google.maps.Map($('#map')[0],mapOption)
	$scope.markers = [];

	var infoWindow = new google.maps.InfoWindow();

	

	function createMarker(city,index){
		var latLon = city.latLon.split(' ');

		var lat = latLon[0].slice(0,latLon[0].indexOf('&#176')-1);
		var lon = -latLon[1].slice(0,latLon[1].indexOf('&#176')-1);

		var marker = new google.maps.Marker({
			map: $scope.map,
			position: new google.maps.LatLng(lat, lon),
			title: city.city,
			icon: 'http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=•%7CFE7569'
		})
		var markerContentHTML = '<div class="infoWindowContent">';
		    markerContentHTML += '<div class="total-pop">Total Population: ' + city.yearEstimate + '</div>';
		    markerContentHTML += '<div class="pop-dens-last-year">2010 Census: ' + city.lastCensus + '</div>';
		    markerContentHTML += '<div class="pop-change">Population Change %: ' + city.change + '</div>';
		    markerContentHTML += '<div class="pop-dens">Population Density: ' + city.lastPopDensityMiles + '</div>';
		    markerContentHTML += '<div class="state">State: ' + city.state + '</div>';
		    markerContentHTML += '<div class="land-area">Land Area: ' + city.landAreaSqMiles + '</div>';

		    markerContentHTML += '<a href="#" onclick="getDirections('+lat+','+lon+')">Get directions</a><br>';
		    markerContentHTML += '<a href="#" onclick="lodgingSearch('+lat+','+lon+')">Get Lodging</a>';

		    // markerContentHTML += '<a href="#" onclick="getDirections('+lat+','+lon+')">Get directions</a>';

	    markerContentHTML += '</div>';
	    marker.content = markerContentHTML;
	    google.maps.event.addListener(marker, 'click', function(){
	    	infoWindow.setContent('<h2>'+ marker.title + '</h2>' + marker.content);
	    	infoWindow.open($scope.map, marker);
	    });

    	$scope.markers.push(marker)
	}
	$scope.triggerClick = function(i){
		google.maps.event.trigger($scope.markers[i-1],'click');
	}

	$scope.updateMarkers = function(){
		for(i=0;i<$scope.markers.length;i++){
			$scope.markers[i].setMap(null);
		}
		for(i=0;i<$scope.filteredCities.length;i++){
			createMarker($scope.filteredCities[i],i);
		}
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

   		var request = {
           //Origin hardcoded to Atlanta. Require geocode current loc,
           //or give user input
          origin: '1807 Meadowdale Ave NE Atlanta, GA 30306', 
          destination: new google.maps.LatLng(lat,lon), 
          travelMode: google.maps.DirectionsTravelMode.DRIVING
        };

        directionsService.route(request, function(response, status) {
          if (status == google.maps.DirectionsStatus.OK) {
            directionsDisplay.setDirections(response);
          }
        });
	}

	$scope.cities = cities;
	for(i=0; i<cities.length; i++){
		createMarker(cities[i],i);
	}

	


	lodgingSearch = function(lat1, lon1){
		var map;
		var infowindow;

		// function initMap() {
		  var pyrmont = {lat: lat1, lng: lon1};

		  map = new google.maps.Map(document.getElementById('map'), {
		    center: pyrmont,
		    zoom: 12
		  });

		  infowindow = new google.maps.InfoWindow();

		  var service = new google.maps.places.PlacesService(map);
		  service.nearbySearch({
		    location: pyrmont,
		    radius: 10000,
		    types: ['lodging']
		  }, callback);
		// }

		function callback(results, status) {
		  if (status === google.maps.places.PlacesServiceStatus.OK) {
		    for (var i = 0; i < results.length; i++) {
		      createMarker(results[i]);
		    }
		  }
		}

		function createMarker(place) {
		  var placeLoc = place.geometry.location;
		  var marker = new google.maps.Marker({
		    map: map,
		    position: place.geometry.location
		  });

		  google.maps.event.addListener(marker, 'click', function() {
		    infowindow.setContent(place.name);
		    infowindow.open(map, this);
		  });
		}
	}


	var input = $('#golf-search').text();
	var map;
	var service;
	var infowindow;

	function initialize() {
	  var pyrmont = new google.maps.LatLng(-33.8665433,151.1956316);

	  map = new google.maps.Map(document.getElementById('map'), {
	      center: pyrmont,
	      zoom: 15
	    });

	  var request = {
	    location: pyrmont,
	    radius: '500',
	    types: [input]
	  };

	  service = new google.maps.places.PlacesService(map);
	  service.nearbySearch(request, callback);
	}

	function callback(results, status) {
	  if (status == google.maps.places.PlacesServiceStatus.OK) {
	    for (var i = 0; i < results.length; i++) {
	      var place = results[i];
	      createMarker(results[i]);
	    }
	  }
	}
	$('#golf-search').click(function(){
		var map = new google.maps.Map($('#map')[0],{
   			zoom:7,
   			mapTypeId: google.maps.MapTypeId.ROADMAP
   		})
		
	})

})





