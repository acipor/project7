// Fonction  objet restaurant
function Restaurant(restaurantName, address, lat, long) {
   this.restaurantName = restaurantName;
   this.address = address;
   this.lat = lat;
   this.long = long;

   // 
   this.listRestaurant = function(nbMarker){
    var li = $('<li/>').addClass('row panel-heading').attr('id', nbMarker).appendTo($("ul"));
    // ajout informations du restaurant a li
    var listeColapse= "#collapse"+ nbMarker;
    var liHeader = $('<a/>').attr('href',listeColapse).addClass('col-xs-12 btn btn-default').attr('data-toggle','collapse').attr('data-parent','#accordion').appendTo(li); 
    var leftCol = $('<div/>').addClass('col-xs-12').appendTo(liHeader);
    var leftRow = $('<div/>').addClass('row').appendTo(leftCol);
    $('<div/>').addClass('col-xs-1').text(nbMarker).appendTo(leftRow);
    $('<div/>').addClass('col-xs-8 h4').text(this.restaurantName).appendTo(leftRow);
    $('<div/>').addClass('col-xs-10').text(this.address).appendTo(leftRow);
    $('<div/>').addClass('col-xs-10 restaurantAvgRating').appendTo(leftRow);
    var newRating = $('<div/>').addClass('col-xs-10 newRating').appendTo(leftRow); 
    var btnNewRating = $('<button/>').addClass('btn btn-info btn-md btnNewRating').attr('data-toggle','modal').attr('data-target','#modal1').appendTo(newRating); 
    $('<i/>').text('ajouter avis').appendTo(btnNewRating);
    // collapse
    var idAvis= "collapse"+ nbMarker;
    var liBody = $('<div/>').attr('id',idAvis).addClass('col-xs-12 panel collapse').appendTo(li); 
    // ajout avis au collapse
    $('<div/>').addClass('row panel-body restaurantRatings').appendTo(liBody);
    // Ajout de l'image google street  au colapse
    var restaurantLocation = "location="+this.lat+","+this.long;
    var rightCol = $('<div/>').addClass('col-xs-12 colStreetview').appendTo(liBody); 
    var callImage = "https://maps.googleapis.com/maps/api/streetview?size=400x400&"+restaurantLocation+"&key=AIzaSyBj-wbljM14eCsEPBZe6A8Ca3ZzQGfTGxQ";
    $('<img>').addClass('streetview').attr('src', callImage).appendTo(rightCol);
    };

}; // fin objet restaurant

// Fonction  objet rating
function Rating(stars, comment){
    this.stars = stars;
    this.comment = comment;

    this.listRestaurantRatings =  function(nthChildLi){
    var rowRestaurantRatings = $('li:nth-child('+nthChildLi+')').find('.restaurantRatings');
    var colRestaurantRatings = $('<div>').addClass('col-xs-12 colRestaurantRatings').appendTo(rowRestaurantRatings);
    $('<div/>').addClass('ratingsRestaurant').starRating({initialRating: this.stars, readOnly: true, starSize: starRatingsSize}).appendTo(colRestaurantRatings);
    $('<span/>').addClass('commentsRestaurant').text(this.comment).appendTo(colRestaurantRatings);
        }
} // fin objet rating


// ajout des restaurants : results (avec la recherche de google Places) a la  position
function addRestaurantWithSearch(position, results){
    var ratings = []; //  tableau ratings
    var restaurantName = results.name; 
    var address = (results.formatted_address).slice(0, -8); 
    var lat = results.geometry.location.lat(); // latitude 
    var lont = results.geometry.location.lng(); // longitude
    var liIndex = $('li').length; // index de  li
    var nbMarker = (liIndex+1).toString(); // numéro du marker 
    var restaurant = new Restaurant(restaurantName, address, lat, lont); // création objet restaurant
    addMarker(position, nbMarker, restaurantName, liIndex); //  ajout marker
    restaurant.listRestaurant(nbMarker); // ajout restaurant
    // ajout avis  restaurant et calcule de la note moyenne 
    if ($.type(results.reviews) === "array"){
        var sumRatings = 0;
        $.each(results.reviews, function(){
            var stars = this.rating;
            var comment = this.text;
            sumRatings = sumRatings + stars;
            var nwrating = new Rating(stars, comment);
            nwrating.listRestaurantRatings(nbMarker);
            ratings.push(nwrating);
        });
        var avgRatings = Math.round(2*sumRatings/ratings.length)/2;
        $('li').last().find('.restaurantAvgRating').starRating({ // Ajout de la note moyenne à ce restaurant
            initialRating: avgRatings,
            readOnly: true,
            starSize: starRestaurantsSize
        });        
    } else { // sinon  initialRating=0
        $('li').last().find('.restaurantAvgRating').starRating({ 
            initialRating: 0,
            readOnly: true,
            starSize: starRestaurantsSize
        });        
    }
    // Si le restaurant n'est pas dans la fourchette de la recherche on le cache
    var minStar = Number($('#starMin').starRating('getRating')); // Note minimale
    var maxStar = Number($('#starMax').starRating('getRating')); // Note maximale
    var thatStartRating =Number( $('li').last().find('.restaurantAvgRating').starRating('getRating'));
    if ((thatStartRating<minStar || thatStartRating>maxStar)){ // Si le restaurant est en dehors de la fourchette
        $('li').last().addClass('hide'); // on cache li
        markers[liIndex].setVisible(false); // on cache le marker
    } 
}

// ajout un avis à li
function addnewRestaurantRatings(liIndex){
   var stars = Number($('#starsForm').starRating('getRating')); //  stars
    var comment = $('#newRatingForm').val(); // commentaire
    var nwrating = new Rating(stars, comment); // creation de  avis
    nwrating.listRestaurantRatings((liIndex+1)); // ajout avis au restaurant 
    $('#starsForm').starRating('setRating', 2.5); // initialisation par default variable
    $('#newRatingForm').val(''); // initialisation variable
   // recalcule de la  nouvelle moyenne du restaurant et mise à jour de starRating
    var sumRatings = 0; 
    $('li:nth-child('+(liIndex+1)+')').find('.ratingsRestaurant').each(function(){
          sumRatings = sumRatings + Number($(this).starRating('getRating'));
    })
    // arrondi à 0.5 ()
    var avgRatings = Math.round(2*(sumRatings / $('li:nth-child('+(liIndex+1)+')').find('.ratingsRestaurant').length))/2;
    $('li:nth-child('+(liIndex+1)+')').find('.restaurantAvgRating').starRating('setRating', avgRatings);
    // vérification si restaurant est dans la recherche
    var minStar = Number($('#starMin').starRating('getRating')); // Note minimale
    var maxStar = Number($('#starMax').starRating('getRating')); // Note maximale
    if ((avgRatings<minStar || avgRatings>maxStar)){ // Si le restaurant est en dehors de la fourchette
        $('li:nth-child('+(liIndex+1)+')').addClass('hide'); // on cache li
        markers[liIndex].setVisible(false); // on cache le marker
    }
}

