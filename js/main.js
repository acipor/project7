// apelle de star
starSelect.init(); 

// lecture du fichier de donnes fourni
$.getJSON(jsonFile, function(result){ 
      $.each(result, function(index){ // lecture du fichier
            var nbMarker = (index+1).toString(); 
            var restaurantName = this.restaurantName;
            var address = this.address;
            var lat = this.lat;
            var long = this.long;
            // ajout restaurant
            var newRestaurant = new factory.Restaurant(restaurantName, address, lat, long, nbMarker, map); 
            //  ajout des ratings
            var sumRatings = 0; 
            $.each(this.ratings, function(){ // Pour chaque objet ratings de chaque data 
               var nwrating = newRestaurant.addRating(this.stars,this.comment);
               sumRatings = this.stars + sumRatings; // On ajout les notes à sumRatings
            });
            // Calcul de la note moyenne
            var avgRatings = sumRatings/this.ratings.length;
            newRestaurant.noteMoyRatig = avgRatings;
            // ajout au array
            restaurants.push(newRestaurant); 
            // affichage du restaurant
            newRestaurant.listRestaurant(nbMarker); 
            // affichage des ratings du restaurant
            newRestaurant.listRestaurantRatings(nbMarker);
            // Ajout de la note moyenne à ce restaurant
            var thatli =  $('li').last().find('.restaurantAvgRating');
            listNoteMoy (thatli,avgRatings,true,starRestaurantsSize); 
      }); // fin each
});  // fin getjson
