//GeoIQ
//apikey="eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJtYWlsSWRlbnRpdHkiOiJndXB0YWJoYW51MTk5OUBnbWFpbC5jb20ifQ.kE6dbqkrarNLFUTDTLlRPvcqtJ8mxSd6TrgvjwqjpGU"

//Geocoding
//apiKey="AIzaSyB3kAwioi5Adu1oBvr-tYIxKub_DkJ4Lx8"

var x = document.getElementById("demo");
var modal1=document.getElementById("modal1");
var modal2=document.getElementById("modal2");
var span1 = document.getElementById("close1");
var span2 = document.getElementById("close2");
var modal1Content = document.getElementById("modal1Content");
var ContainmentZones = document.getElementById("ContainmentZones");
var current=document.getElementById("current");
var button=document.getElementById("submit");
// var apikey="AIzaSyB3kAwioi5Adu1oBvr-tYIxKub_DkJ4Lx8";

var map, infoWindow;

var geocoder;
var markers=[];
function init() 
{
	// console.log("Init");
  	geocoder = new google.maps.Geocoder();
  	button.onclick=function() 
  	{
    geocodeAddress(geocoder);
  	};
  	map = new google.maps.Map(document.getElementById('map'), 
  	{
  		center: {lat: 28.6139, lng: 77.2090},
  		zoom: 8
	});
	infoWindow = new google.maps.InfoWindow;
}

  	function geocodead(address)
	{
		geocoder.geocode({'address': address}, function(results, status) 
		{
		if (status === google.maps.GeocoderStatus.OK) 
		{
		// console.log("Results",results);
			if(results.length==0)
	    	{
	        alert("Address not found.")
	    	}
	    	else
	    	{
	      		latitude=results[0].geometry.location.lat();
	      		longitude=results[0].geometry.location.lng();
	      	    var pos1 = {
	          				lat: latitude,
	          				lng: longitude
	        				};
	        	var marker = new google.maps.Marker({
							position: pos1,
							map: map,
							title:'C'
							}); 
				markers.push(marker); 	
	    	}
		} 
		else 
		{	
	  		alert('Geocode was not successful for the following reason: ' + status);
		}
		});
	}

var latitude;
var longitude;
function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(findContainment);
  } else {
    x.innerHTML = "Geolocation is not supported by this browser.";
  }
}

function findContainment(position) {
	// x.innerHTML = "Latitude: " + position.coords.latitude +
	// "<br>Longitude: " + position.coords.longitude;
	latitude=position.coords.latitude;
	longitude=position.coords.longitude;

	// console.log(latitude,longitude);
	// distance=document.getElementById('distance').value;
	var apiurl="https://data.geoiq.io/dataapis/v1.0/covid/nearbyzones";
	var object={
	  "key": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJtYWlsSWRlbnRpdHkiOiJndXB0YWJoYW51MTk5OUBnbWFpbC5jb20ifQ.kE6dbqkrarNLFUTDTLlRPvcqtJ8mxSd6TrgvjwqjpGU",
	  "lng": longitude,
	  "lat": latitude,
	  "radius": 5000
	}

	var pos = {
              lat: position.coords.latitude,
              lng: position.coords.longitude
            	};
    DeleteMarkers();
    infoWindow.setPosition(pos);
    infoWindow.setContent('Location used');
    infoWindow.open(map);
    map.setCenter(pos);
    map.setZoom(13);
	// Making a POST request using an axios instance from a connected library
	axios.post(apiurl,object)
	  // Handle a successful response from the server
	  .then(response => {
	          // Getting a data object from response that contains the necessary data from the server
	          const data = response.data;
	          if(data.numberOfNearbyZones>0){
	          	nearContainmentZone(data);
	          }
	          else{
	          	notNearContainmentZone();
	          }
	          // console.log(typeof data);
	          // console.log("Data1",data.containmentZoneNames);
	          // console.log(data.containmentZoneNames.length);
	  })
	  // Catch and print errors if any
	  .catch(error => console.error('Error', error));
}

function findContainment1(latitude,longitude) {
	var apiurl="https://data.geoiq.io/dataapis/v1.0/covid/nearbyzones";
	// distance=document.getElementById('distance').value;
	var object={
	  "key": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJtYWlsSWRlbnRpdHkiOiJndXB0YWJoYW51MTk5OUBnbWFpbC5jb20ifQ.kE6dbqkrarNLFUTDTLlRPvcqtJ8mxSd6TrgvjwqjpGU",
	  "lng": longitude,
	  "lat": latitude,
	  "radius": 5000
	}
	var pos = {
          lat: latitude,
          lng: longitude
        	};
    DeleteMarkers();
	infoWindow.setPosition(pos);
	infoWindow.setContent('Location used');
	infoWindow.open(map);
    map.setCenter(pos);
    map.setZoom(13);

	axios.post(apiurl,object)
	  .then(response => {
			  const data = response.data;
	          if(data.numberOfNearbyZones>0){
	          	nearContainmentZone(data);
	          }
	          else{
	          	notNearContainmentZone();
	          }
	  })
	  // Catch and print errors if any
	  .catch(error => console.error('Error', error));
}

function handleLocationError(browserHasGeolocation, infoWindow, pos) {
	infoWindow.setPosition(pos);
	infoWindow.setContent(browserHasGeolocation ?
	                      'Error: The Geolocation service failed.' :
	                      'Error: Your browser doesn\'t support geolocation.');
	infoWindow.open(map);
}

function nearContainmentZone(data){
	var i=1;
	data.containmentZoneNames.forEach(function(zoneName){
		ContainmentZones.innerHTML+="<li>"+zoneName+"</li>";
		geocodead(zoneName);
	});
	modal1.style.display="block";
}

function notNearContainmentZone(){
	modal2.style.display="block";
}

span1.onclick = function() {
  modal1.style.display = "none";
  ContainmentZones.innerHTML="";
}
span2.onclick = function() {
  modal2.style.display = "none";
}

current.onclick=function(){
	getLocation();
}

function geocodeAddress(geocoder) {
  var address = document.getElementById('address').value;
  // console.log("Address",address);
  // console.log("Called",address);
  geocoder.geocode({'address': address}, function(results, status) {
    if (status === google.maps.GeocoderStatus.OK) {
    	// console.log("Results",results);
    	if(results.length==0)
	    {
	        alert("Address not found.")
	    }
	    else
	    {
	      	latitude=results[0].geometry.location.lat();
	      	longitude=results[0].geometry.location.lng();
	      	findContainment1(latitude,longitude);
	    }
    } 
    else {
      alert('Geocode was not successful for the following reason: ' + status);
    }
  });
}
function DeleteMarkers() {
    //Loop through all the markers and remove
    for (var i = 0; i < markers.length; i++) {
        markers[i].setMap(null);
    }
    markers = [];
};
window.onclick = function(event) {
  if (event.target == modal1 || event.target == modal2) {
    modal1.style.display = "none";
    modal2.style.display = "none";
  }
}
