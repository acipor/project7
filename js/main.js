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
            restaurants.push(newRestaurant); 
            markers.push(newRestaurant.marker);
            // affichage du restaurant
            newRestaurant.listRestaurant(nbMarker); 
            
            //  calcul du ratings
            var sumRatings = 0; 
             $.each(this.ratings, function(){ // Pour chaque objet ratings de chaque data 
               var objet = new Rating(this.stars,this.comment);
               objet.listRestaurantRatings(nbMarker); // On ajoute les avis à ce restaruant
               sumRatings = this.stars + sumRatings; // On ajout les notes à sumRatings
            });
             // Calcul de la note moyenne
            var avgRatings = sumRatings/this.ratings.length; 
            // Ajout de la note moyenne à ce restaurant
            var thatli =  $('li').last().find('.restaurantAvgRating');
            listNoteMoy (thatli,avgRatings,true,starRestaurantsSize); 

            

      }); // fin each

});  // fin getjson
