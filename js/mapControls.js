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
   position = map.getCenter(); // repositionnement du centre
   addRestaurantNearby(position); // recherche restaurants autour de position
});

// mise a jour des restaurants et  markers quand les limites de la map changent
map.addListener('bounds_changed', function(){ 
    $.each(restaurants, function (index, restaurant){  
        if(map.getBounds().contains(restaurant.marker.getPosition()) && restaurant.marker.getVisible()){ 
             restaurant.showRestaurant(index);
        } else { 
            restaurant.hideRestaurant(index);
        }
    });  
});

// ajouter un restaurant sur clic sur la map
map.addListener('click', function(event){
    // unbind le click et on le relance pour éviter l'ajout de plusieurs restaurants après plusieurs clicks
    $('#btnResto').unbind('click').click();
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
    // action click sur btnResto
    $('#btnResto').click(function() {
        $('#modal2').modal('hide'); // On ferme le modal
        // création du restaurant 
        var liLength = restaurants.length;
        var nbMarker = (liLength+1).toString();
        var newRestaurant = factory.createRestaurantFromForm($('#newRestaurantName').val(), $('#newRestaurantAddress').val() , clickPosition.lat(), clickPosition.lng(), nbMarker, map); 
        newRestaurant.noteMoyRatin = 0;
        restaurants.push(newRestaurant); // ajout au array restaurants
        newRestaurant.listRestaurant(liLength+1); // affichage du restaurant
        // Ajout de la note moyenne à ce restaurant
        $("#" + nbMarker).find('.restaurantAvgRating').starRating({ 
                    initialRating: 0,
                    readOnly: true,
                    starSize: starRestaurantsSize
                      });  
        // test si le restaurant newRestaurant a une note  starMin et starMax
         newRestaurant.listRestaurantMinMax(Number($('#starMin').starRating('getRating')),Number($('#starMax').starRating('getRating')));
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
                        // test si  restaurant existe deja à cette position
                        var doesItExist = false;
                        $.each(restaurants, function(index, restaurant){
                            if(restaurant.marker.getPosition().equals(position)){
                                doesItExist = true;
                            }
                            // si restaurant n'existe pas appel fonction addRestaurantWithSearch
                            if(((index+1) === restaurants.length) && (doesItExist === false)){
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
        $('#starsForm').starRating({initialRating: 3, starSize: 25, disableAfterRate: false});   
        // recherche du li cliqué a partir de sa classe panel-heading   
        $(document).on("click", ".panel-heading", function () {
                liClique = this.id;   
            });
});

// action click sur btnAvis
$('#btnAvis').click(function() {
      liClique=liClique-1;
        $('#modal1').modal('hide');
        addnewRestaurantRatings(liClique); // Fonction qui ajout l'avis dans la <li> correspondante
});