// variables
var map;
var markers = new Array();

// initmap
function initMap(){
    map = new google.maps.Map(document.getElementById('map'),
     {
    zoom: defaultZoom,
    center: defaultPosition
    });
    
     infoWindow = new google.maps.InfoWindow({map: map});
     geocoder = new google.maps.Geocoder();
     service = new google.maps.places.PlacesService(map);
  
    // test geolocation
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            var pos = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
                        };
            
            var marker = new google.maps.Marker({
                position: pos,
                map: map,
                title: 'Vous êtes ici', 
                icon: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png'
                
            });
            map.setCenter(pos);
            addRestaurantNearby(pos);
        },function() { handleLocationError(true, infoWindow, map.getCenter());});
    } else {
        // Browser doesn't support Geolocation
        handleLocationError(false, infoWindow, map.getCenter());
        addRestaurantNearby(defaultPosition);
        }   
}

function handleLocationError(browserHasGeolocation, infoWindow, pos) {
        var infoWindow = new google.maps.InfoWindow({map: map});
        infoWindow.setPosition(pos);
        infoWindow.setContent(browserHasGeolocation ?
            'Error: The Geolocation service failed.' :
            'Error: Your browser doesn\'t support geolocation.');
}   

// affichage marker
function addMarker(markerPosition, label, title, indexLi){
    var marker = new google.maps.Marker({
        position: markerPosition,
        label: label, 
        title: title,
        map: map
    });
    markers.push(marker);  
    //  ajout de l'evenement click sur le marker
       marker.addListener('click', function(){
       // on affiche le restaurant qui correspond au marqueur 
       var liens=$('a');
       liens[indexLi].click();
             });
} 

