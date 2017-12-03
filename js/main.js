// variables
var map;
var markers = new Array();
var restaurants =  new Array ();

// apelle de star
starSelect.init(); 

// lecture du fichier de donnes fourni
$.getJSON(jsonFile, function(result){ 
      $.each(result, function(index){ 
            var nbMarker = (index+1).toString(); 
            var restaurantName = this.restaurantName;
            var address = this.address;
            var lat = this.lat;
            var long = this.long;
        // ajout restaurant
            var newRestaurant = new Restaurant(restaurantName, address, lat, long, nbMarker, map); 
        //  ajout des ratings
            var sumRatings = 0; 
            $.each(this.ratings, function(){ // Pour chaque objet ratings de chaque data 
               var nwrating = newRestaurant.addRating(this.stars,this.comment);
             sumRatings = this.stars + sumRatings; // On ajout les notes à sumRatings
            });
        // Calcul de la note moyenne
            var avgRatings = sumRatings/this.ratings.length; 

          restaurants.push(newRestaurant); 
          markers.push(newRestaurant.marker);   

          // affichage du restaurant
            newRestaurant.listRestaurant(nbMarker); 
        // affichage des ratings du restaurant
             newRestaurant.listRestaurantRatings(nbMarker);
        
        // Ajout de la note moyenne à ce restaurant
            var thatli =  $('li').last().find('.restaurantAvgRating');
            listNoteMoy (thatli,avgRatings,true,starRestaurantsSize); 

        
      }); // fin each


});  // fin getjson
