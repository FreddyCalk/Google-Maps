function initialize() {
	var hashes = window.location.href.slice(window.location.href.indexOf('?')+1)
    hashes = hashes.slice(hashes.indexOf('=')+1);


    // for(i=0;i<hashes.length;i++){
    // 	address.push(hashes[i])

    // }
    var url = "https://maps.googleapis.com/maps/api/geocode/json?address="+hashes;
    var lat;
    var lng;
    $.getJSON(url, function(data){
    	console.log(data)
    	lat = data.results[0].geometry.location.lat;
    	lng = data.results[0].geometry.location.lng;
    	
    })


    if(lat !== ""){
    	var latlng = new google.maps.LatLng(lat, lng)
    }else{
		var latlng = new google.maps.LatLng(33.7422291,-84.4497954);
    }
    var myOptions = {
       zoom: 12,
       center: latlng,
       mapTypeId: google.maps.MapTypeId.ROADMAP
   };
   var map = new google.maps.Map(document.getElementById("map-canvas"),
           myOptions);
}

$(document).ready(function(){
    google.maps.event.addDomListener(window, 'load', initialize);    
});