// ------ affichage des etoiles de la note moyenne note:initialRa dans la li=findli ----------------------------------------
function listNoteMoy (findli,initialRa,reado,stsize) {
          findli.starRating({ 
                    initialRating: initialRa,
                    readOnly: reado,
                    starSize: stsize
                      });  
 }  
 
//------------  Tri des restaurants en fonctions des etoiles min et max--------------------------------
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

		// event sur clique  bouton classer
		$('#btnStarSelect').on('click', function(){
			var minStar = Number($('#starMin').starRating('getRating')); // Note min
			var maxStar = Number($('#starMax').starRating('getRating')); // Note max
			$('li').each(function(index){ 
				var thatStartRating = restaurants[index].noteMoyRatig; // note du restaurant
				if ((thatStartRating<minStar || thatStartRating>maxStar)){ // Si  li n'est pas dans note
						$(this).addClass('hide'); // on cache li
			    		restaurants[index].marker.setVisible(false); // on cache marker 
				} else{
					// Sinon on affiche si dans les limites
					if($(this).hasClass('hide') && map.getBounds().contains(restaurants[index].marker.getPosition())){
						$(this).removeClass('hide');
						restaurants[index].marker.setVisible(true);
					// Si  li est caché et marker n'est pas sur la map 
					}else if($(this).hasClass('hide')){
						restaurants[index].marker.setVisible(true);
					};
				}
			});
		}); // fin click
	}

} // fin starselect

