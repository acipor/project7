//------------------- factory restaurant ---------------------------------
function FactoryRestaurant() {   
   this.Restaurant = function (restaurantName, address, lat, long, nbMarker, map) {
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

        this.addRating = function(stars, comment) { 
            var rating = {"stars":stars,"comment":comment};
            this.listeRatings.push(rating);
            return rating;
        }

        this.noteMoyRatig = 0; // note moyenne du resto

        this.calcSumRatings = function() { // calcul de la note moyenne
            var sumRat = 0; 
            for (i = 0; i < this.listeRatings.length; i++) { 
                sumRat = this.listeRatings[i]["stars"] + sumRat; 
            };
        return sumRat;
        }

        this.listRestaurantMinMax = function(minStar,maxStar) { // affichage de li du resto si note entre min et max etoiles
            var thatStartRating = this.noteMoyRatig;
             if ((thatStartRating<minStar || thatStartRating>maxStar)){ // Si le restaurant est en dehors de minstar et maxstar
                $('li:nth-child('+(this.nbMarker)+')').addClass('hide'); // on cache li
                this.marker.setVisible(false); // on cache le marker
            } else {
                $('li:nth-child('+(this.nbMarker)+')').removeClass('hide'); // on affiche li
                this.marker.setVisible(true); // on affiche marker
            }
        }

        this.listRestaurantRatings =  function(pos){ // affichage des ratings de la li à index pos
            var rowRestaurantRatings = $('li:nth-child('+ pos +')').find('.restaurantRatings');
                for (var i = 0; i < this.listeRatings.length ; i++) {
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

        this.showRestaurant =  function(indexLi){ // affiche le marker et la li restaurant corresspondant à indexLi
            this.marker.getVisible(true); 
            $('li:nth-child('+(indexLi+1)+')').removeClass('hide'); 
        }

        this.hideRestaurant =  function(indexLi){ // cache le marker et la li 
            this.marker.getVisible(false); 
            $('li:nth-child('+(indexLi+1)+')').addClass('hide');  
        }

    } // restaurant

   this.createRestaurantFromSearch = function (results,nbMarker)
    {
        var restaurantName = results.name; 
        var address = (results.formatted_address).slice(0, -8); 
        var lat = results.geometry.location.lat(); // latitude 
        var lont = results.geometry.location.lng(); // longitude
        return new factory.Restaurant(restaurantName, address, lat, lont, nbMarker, map); 
   } // createRestaurantFromSearch

   this.createRestaurantFromForm = function (restaurantName, address, lat, long, nbMarker, map)
   {
        return new factory.Restaurant(restaurantName, address, lat, long, nbMarker, map); 
   } // createRestaurantFromForm

} // fin factory 

var factory = new FactoryRestaurant();

//-----------  ajout des restaurants : results (avec la recherche de google Places) a la  position ----------------------------
function addRestaurantWithSearch(position, results){
    var ratings = []; //  tableau ratings
    var liIndex = $('li').length; // index de  li
    var nbMarker = (liIndex+1).toString(); // numéro du marker 
    var newRestaurant = factory.createRestaurantFromSearch(results,nbMarker); // création du restaurant
    newRestaurant.listRestaurant(nbMarker); // affiche restaurant
    // ajout avis  restaurant et calcule de la note moyenne 
    if ($.type(results.reviews) === "array"){ // si resultat array
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
                // calcul de la note moyenne
                var avgRatings = Math.round(sumRatings/newRestaurant.listeRatings.length);
                newRestaurant.noteMoyRatig = avgRatings;
                //  affichage note moyenne:avgRatings
                $("#" + nbMarker).find('.restaurantAvgRating').starRating({initialRating: avgRatings,readOnly: true,starSize: starRestaurantsSize});
     }
     else { 
            // sinon note=0
            newRestaurant.noteMoyRatig = 0;
            $("#" + nbMarker).find('.restaurantAvgRating').starRating({initialRating: 0,readOnly: true,starSize: starRestaurantsSize});  
    }
    restaurants.push(newRestaurant); // ajout restaurant
    // test si le restaurant newRestaurant a une note  entre starMin et starMax et affichage
    newRestaurant.listRestaurantMinMax(Number($('#starMin').starRating('getRating')),Number($('#starMax').starRating('getRating')));
}

//--------------  ajout un avis à li ---------------------------------------
function addnewRestaurantRatings(liIndex){
    var newStars = Number($('#starsForm').starRating('getRating')); //  stars
    var newComment = $('#newRatingForm').val(); // commentaire
    slRestaurant = restaurants[liIndex]; // restaurant auquel il faut ajouter avis 
    var nwrating = slRestaurant.addRating(newStars,newComment); // ajout avis
    // affichage du rating du restaurant dans la li coresspondante
    var rowRestaurantRatings = $('li:nth-child('+ (liIndex+1) +')').find('.restaurantRatings');
    var colRestaurantRatings = $('<div>').addClass('col-xs-12 colRestaurantRatings').appendTo(rowRestaurantRatings);
    $('<div/>').addClass('ratingsRestaurant').starRating({initialRating: newStars, readOnly: true, starSize: starRatingsSize}).appendTo(colRestaurantRatings);
    $('<span/>').addClass('commentsRestaurant').text(newComment).appendTo(colRestaurantRatings);
    // initialisation des variables du formulaire
    $('#starsForm').starRating('setRating', 3); 
    $('#newRatingForm').val(''); 
    //  calcule de la somme des avis 
    var sumRatings = slRestaurant.calcSumRatings();
    // recalcul de la note moyenne 
    var avgRatings = Math.round(sumRatings /slRestaurant.listeRatings.length);
    slRestaurant.noteMoyRatig = avgRatings;
    // afichage de la note moyenne
    $('li:nth-child('+(liIndex+1)+')').find('.restaurantAvgRating').starRating('setRating', avgRatings);
    // test si le restaurant slRestaurant a une note  entre starMin et starMax
    slRestaurant.listRestaurantMinMax(Number($('#starMin').starRating('getRating')),Number($('#starMax').starRating('getRating')));
}

