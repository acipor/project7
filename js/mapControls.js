var neWRadius = defaultRadius;

// evenement changement du zoom sur la map
google.maps.event.addDomListener(map, 'zoom_changed', function() {
  var zoom = map.getZoom();
  if (zoom < defaultZoom ) {
     neWRadius= (defaultZoom/zoom) * defaultRadius;
  } else {
    neWRadius = defaultRadius;
  }
});

// evenement dragend sur map
map.addListener('dragend', function(){
   position = map.getCenter();
   addRestaurantNearby(position); // appel fonction 
});

// mise a jour des marker et restaurants quand limites de map changent
map.addListener('bounds_changed', function(){ 
    $.each(markers, function (index, marker){ // 
        if(map.getBounds().contains(marker.getPosition()) && marker.getVisible()){ 
            marker.getVisible(true);
            $('li:nth-child('+(index+1)+')').removeClass('hide');  // marker visible , affichage restaurant
        } else { // Sinon
            marker.getVisible(false);
            $('li:nth-child('+(index+1)+')').addClass('hide'); // marker cache, cache restaurant
        }
    });  
});

// ajouter un  restaurant sur clic sur la map
map.addListener('click', function(event){
    // On unbind le submit et on le relance pour éviter l'ajoute de plusieurs restaurants après plusieurs clicks
    $('#formRestaurant').unbind('submit').submit();
    // On remet les valeurs du modal à 0
    $('#newRestaurantName').val(''); 
    $('#newRestaurantAddress').val('');
    var clickPosition = event.latLng; //  position du click
    $('#modal2').modal('show'); 
    // on récupère l'adresse 
    geocoder.geocode({'location': clickPosition}, function(results, status) {
        if (status === 'OK') {
            if (results[0]) {               
                $('#newRestaurantAddress').val(results[0].formatted_address);
        } else {
            window.alert('No results found');
        }
    } else {
        window.alert('Geocoder failed due to: ' + status);
        }
    }); 
    // action  submit modal2
    $('#formRestaurant').submit(function(){
        $('#modal2').modal('hide'); // On ferme le modal
        var restaurantName = $('#newRestaurantName').val(); 
        var address = $('#newRestaurantAddress').val(); 
        var lat = clickPosition.lat(); // Lat du click
        var long = clickPosition.lng(); // Lng du click
        // création du restaurant 
        var newRestaurant = new createNewRestaurant(restaurantName, address, lat, long);
        console.log(newRestaurant);
        var liLength = $('li').length; 
        addRestaurant(newRestaurant, (liLength+1)); // On ajoute le restaurant à la li
        addMarker(clickPosition, (liLength+1).toString(), restaurantName, liLength); // On ajoute le marker du restaurant
        $('li').last().find('.restaurantAvgRating').starRating({ // Ajout de la note moyenne à ce restaurant
            initialRating: 0,
            readOnly: true,
            starSize: starRestaurantsSize
        });  
    }); 
});

// recherche de restaurants  autour de position
function addRestaurantNearby(position){
    var request = {
        location: position,
        radius: neWRadius,
        types: ['restaurant'],
    };
  service.nearbySearch(request, callback); // lance la requete search
}

// fonction callback
function callback(results, status){
        if(status == google.maps.places.PlacesServiceStatus.OK){ 
            $.each(results,function(){ 
                var placeID = {placeId: this.place_id}; //  le place_id
                service.getDetails(placeID, function(results, status){ // on recupere les informations
                    if (status == google.maps.places.PlacesServiceStatus.OK){ 
                        var position = results.geometry.location; // coordonnées du restaurant
                        // test si  marker existe deja à cette position
                        var doesItExist = false;
                        $.each(markers, function(index){
                            if(this.getPosition().equals(position)){
                                doesItExist = true;
                            }
                            // si marker existe pas appel fonction addRestaurantWithSearch
                            if(((index+1) === markers.length) && (doesItExist === false)){
                                addRestaurantWithSearch(position, results)
                            }
                        });
                    }
                });
            });
        }
}

var liClique="";
// document.ready
$(document).ready(function(){
        $('#starsForm').starRating({initialRating: 2.5, starSize: 25, disableAfterRate: false});   
        // recherche du li clique a partir de sa classe panel-heading   
        $(document).on("click", ".panel-heading", function () {
                liClique = this.id;   
            });   
});


// action submit modal1
$('#formRating').submit(function(){
    liClique=liClique-1;
    $('#modal1').modal('hide');
    addnewRestaurantRatings(liClique); // Fonction qui ajout l'avis dans la <li> correspondante
});
