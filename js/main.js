
// apelle de star
starSelect.init(); 

// lecture du fichier de donnes fourni
$.getJSON(jsonFile, function(result){ 
      $.each(result, function(index){ 
            var nbMarker = (index+1).toString(); 
            var markerPosition = {lat: this.lat, lng: this.long};
            addMarker(markerPosition, nbMarker, this.restaurantName, index); // affichage des marker
            addRestaurant(this, nbMarker); // affichage des restaurants
            //  calcul du ratings
            var sumRatings = 0; 
             $.each(this.ratings, function(){ // Pour chaque objet ratings de chaque data 
                addRestaurantRatings(this, nbMarker); // On ajoute les avis à ce restaruant
                sumRatings = this.stars + sumRatings; // On ajout les notes à sumRatings
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
