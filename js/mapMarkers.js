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
                icon: 'images/blue-dot.png'
                
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

 // erreur
function handleLocationError(browserHasGeolocation, infoWindow, pos) {
        var infoWindow = new google.maps.InfoWindow({map: map});
        infoWindow.setPosition(pos);
        infoWindow.setContent(browserHasGeolocation ?
            'Error: The Geolocation service failed.' :
            'Error: Your browser doesn\'t support geolocation.');
}  



