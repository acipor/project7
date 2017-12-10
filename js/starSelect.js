// ------ affichage de la note moyenne note:initialRa dans la li=findli ----------------------------------------
function listNoteMoy (findli,initialRa,reado,stsize) {
          findli.starRating({ 
                    initialRating: initialRa,
                    readOnly: reado,
                    starSize: stsize
                      });  
 }  
 
//------------  Tri des restaurants en fonctions des etoiles --------------------------------
var starSelect = {
	init: function(){
		var starSelectRow = $('<div/>').addClass('row').appendTo($('#starSelection')); 
		$('<div/>').addClass('col-xs-12 center-align').text(textSelect).addClass('h3').appendTo(starSelectRow);
		//  starMin note minimum
		 $('<div/>').addClass('col-xs-6  center-align').attr('id', 'starMin').starRating({
			initialRating: 0,
			starSize: starSelectSize, 
			disableAfterRate: false,
			callback: function(currentRating, $el){ // test si starMin > starMax
				if(currentRating > Number($('#starMax').starRating('getRating'))){
					$('#starMax').starRating('setRating', currentRating);
				}
			}
		}).appendTo(starSelectRow);
		// starMax note maximale
		$('<div/>').addClass('col-xs-6 center-align').attr('id', 'starMax').starRating({
			initialRating: 5,
			starSize: starSelectSize,
			disableAfterRate: false,
			callback: function(currentRating, $el){ // test si starMax < starMax
				if(currentRating < Number($('#starMin').starRating('getRating'))){
					$('#starMin').starRating('setRating', currentRating);
				}
			}
		}).appendTo(starSelectRow);
		// bouton classer restaurants 
		var divBtnStarSelect = $('<div/>').addClass('col-xs-12 divBtnStarSelect center-align').appendTo(starSelectRow);
		$('<button/>').addClass('btn btn-success btn-lg').attr('id', "btnStarSelect").text(textBtnSelect).appendTo(divBtnStarSelect);
		// event sur clique  bouton 
		$('#btnStarSelect').on('click', function(){
			var minStar = Number($('#starMin').starRating('getRating')); // Note min
			var maxStar = Number($('#starMax').starRating('getRating')); // Note max
            // parcours des restaurants
			for (j = 0; j < restaurants.length; j++) { 
        		 restaurants[j].listRestaurantMinMax(minStar,maxStar);	 
        	};  
		});
	}
} // fin starselect

