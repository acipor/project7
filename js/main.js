
// apelle de star
starSelect.init(); 

// lecture du fichier de donnes fourni
$.getJSON(jsonFile, function(result){ 
      $.each(result, function(index){ 
            var nbMarker = (index+1).toString(); 
            var object= this;
            var restaurantName = object.restaurantName;
            var address = object.address;
            var lat = object.lat;
            var long = object.long;
            var markerPosition = {lat: lat, lng: long};
            var newRestaurant = new Restaurant(restaurantName, address, lat, long); 
            newRestaurant.listRestaurant(nbMarker); // affichage des restaurants
            addMarker(markerPosition, nbMarker, restaurantName, index); // affichage des marker
            
          //  calcul du ratings
            var sumRatings = 0; 
             $.each(this.ratings, function(){ // Pour chaque objet ratings de chaque data 
               var objet = new Rating(this.stars,this.comment);
               objet.listRestaurantRatings(nbMarker); // On ajoute les avis à ce restaruant
               sumRatings = objet.stars + sumRatings; // On ajout les notes à sumRatings
            });
             // Calcul de la note moyenne
            var avgRatings = sumRatings/this.ratings.length; 
            // Ajout de la note moyenne à ce restaurant
            $('li').last().find('.restaurantAvgRating').starRating({ 
                  initialRating: avgRatings,
                  readOnly: true,
                  starSize: starRestaurantsSize
            });
            
      }); // fin each

});  // fin getjson
