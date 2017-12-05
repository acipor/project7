//------------  Fonction  objet restaurant ---------------------
function Restaurant(restaurantName, address, lat, long, nbMarker, map) {
   this.restaurantName = restaurantName;
   this.address = address;
   this.lat = lat;
   this.long = long;
   this.nbMarker = nbMarker; 

   this.marker = new google.maps.Marker({
            position:{lat:lat, lng:long}, 
            label: nbMarker, 
            title: restaurantName,
            map: map
    }); 

    google.maps.event.addListener(this.marker, "click", function() { 
            var liens=$('a');
            liens[this.label-1].click();
    }); 

    this.listeRatings = Array();

    this.addRating = function (stars, comment) { 
        var rating = {"stars":stars,"comment":comment};
        this.listeRatings.push(rating);
        return rating;
    }

    this.noteMoyRatig = 0;

    this.listRestaurantRatings =  function(pos){ // affichage des ratings 
        for (var i = 0; i < this.listeRatings.length ; i++) {
            var rowRestaurantRatings = $('li:nth-child('+ pos +')').find('.restaurantRatings');
            var colRestaurantRatings = $('<div>').addClass('col-xs-12 colRestaurantRatings').appendTo(rowRestaurantRatings);
            $('<div/>').addClass('ratingsRestaurant').starRating({initialRating: this.listeRatings[i]["stars"], readOnly: true, starSize: starRatingsSize}).appendTo(colRestaurantRatings);
            $('<span/>').addClass('commentsRestaurant').text(this.listeRatings[i]["comment"]).appendTo(colRestaurantRatings);
        }
    }

    this.listRestaurant = function(nbMarker){ // affichage du restaurant 
        var li = $('<li/>').addClass('row panel-heading').attr('id', nbMarker).appendTo($("ul"));
        // ajout informations du restaurant a li
        var listeColapse= "#collapse"+ nbMarker;
        var liHeader = $('<a/>').attr('href',listeColapse).addClass('col-xs-12 btn btn-default').attr('data-toggle','collapse').attr('data-parent','#accordion').appendTo(li); 
        var leftCol = $('<div/>').addClass('col-xs-12').appendTo(liHeader);
        var leftRow = $('<div/>').addClass('row').appendTo(leftCol);
        $('<div/>').addClass('col-xs-1').text(this.nbMarker).appendTo(leftRow);
        $('<div/>').addClass('col-xs-8 center-align h4').text(this.restaurantName).appendTo(leftRow);
        $('<div/>').addClass('col-xs-10 center-align').text(this.address).appendTo(leftRow);
        $('<div/>').addClass('col-xs-10 center-align restaurantAvgRating').appendTo(leftRow);
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


} // fin objet restaurant


//-----------  ajout des restaurants : results (avec la recherche de google Places) a la  position ----------------------------
function addRestaurantWithSearch(position, results){
    var ratings = []; //  tableau ratings
    var restaurantName = results.name; 
    var address = (results.formatted_address).slice(0, -8); 
    var lat = results.geometry.location.lat(); // latitude 
    var lont = results.geometry.location.lng(); // longitude
    var liIndex = $('li').length; // index de  li
    var nbMarker = (liIndex+1).toString(); // numéro du marker 
    var newRestaurant = new Restaurant(restaurantName, address, lat, lont, nbMarker, map); 
   
    newRestaurant.listRestaurant(nbMarker); // affiche restaurant

    // ajout avis  restaurant et calcule de la note moyenne 
   var findLi = $('li').last().find('.restaurantAvgRating'); 
   if ($.type(results.reviews) === "array"){ // si resultat 
                var sumRatings = 0;
                $.each(results.reviews, function(){
                    var nbStars = this.rating;
                    var readComment = this.text;
                    // ajout du rating au restaurant
                    var nwrating = newRestaurant.addRating(nbStars,readComment);
                    sumRatings = sumRatings + nbStars;
                }); // fin each
                // affichage des ratings 
                newRestaurant.listRestaurantRatings(nbMarker);
                // arrondi de la note moyenne à 0.5
                var avgRatings = sumRatings/newRestaurant.listeRatings.length;
                avgRatings =  Math.round(avgRatings);
                newRestaurant.noteMoyRatig = avgRatings;
                // note:avgRatings
                listNoteMoy (findLi,newRestaurant.noteMoyRatig,true,starRestaurantsSize);     
     }
     else { 
            // sinon note:0
            alert("erreur type reviews");
            newRestaurant.noteMoyRatig = 0;
            listNoteMoy (findLi,newRestaurant.noteMoyRatig,true,starRestaurantsSize);       
    }
    restaurants.push(newRestaurant); // ajout restaurant
    markers.push(newRestaurant.marker); // ajout marker

    // Si le restaurant n'est pas dans la fourchette de la recherche on le cache
    var minStar = Number($('#starMin').starRating('getRating')); // Note minimale
    var maxStar = Number($('#starMax').starRating('getRating')); // Note maximale
    var thatStartRating =Number( $('li').last().find('.restaurantAvgRating').starRating('getRating'));
    if ((thatStartRating<minStar || thatStartRating>maxStar)){ // Si le restaurant est en dehors de minstar et maxstar
        $('li').last().addClass('hide'); // on cache li
        markers[liIndex].setVisible(false); // on cache le marker
    } 
}

//--------------  ajout un avis à li ---------------------------------------
function addnewRestaurantRatings(liIndex){
    var stars = Number($('#starsForm').starRating('getRating')); //  stars
    var comment = $('#newRatingForm').val(); // commentaire
    slRestaurant = restaurants[liIndex+1]; // restaurant auquel il faut ajouter avis 
    var nwrating = slRestaurant.addRating(stars,comment); // ajout avis
    // affichage des ratings du restaurant
    slRestaurant.listRestaurantRatings(liIndex+1);
    // initialisation des variables du formulaires
    $('#starsForm').starRating('setRating', 2.5); 
    $('#newRatingForm').val(''); 
   // recalcule de la  nouvelle moyenne du restaurant et mise à jour de starRating
    var sumRatings = 0; 
    $('li:nth-child('+(liIndex+1)+')').find('.ratingsRestaurant').each(function(){
          sumRatings = sumRatings + Number($(this).starRating('getRating'));
    })
    // arrondi à 0.5 
    var avgRatings = (sumRatings / $('li:nth-child('+(liIndex+1)+')').find('.ratingsRestaurant').length);
    avgRatings = Math.round(avgRatings);
    $('li:nth-child('+(liIndex+1)+')').find('.restaurantAvgRating').starRating('setRating', avgRatings);
    // vérification si restaurant est dans la recherche
    var minStar = Number($('#starMin').starRating('getRating')); // Note minimale
    var maxStar = Number($('#starMax').starRating('getRating')); // Note maximale
    if ((avgRatings<minStar || avgRatings>maxStar)){ // Si le restaurant est en dehors de la fourchette
        $('li:nth-child('+(liIndex+1)+')').addClass('hide'); // on cache li
        markers[liIndex].setVisible(false); // on cache le marker
    }
}

