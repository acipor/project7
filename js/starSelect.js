// ------ affichage de la note moyenne note:iniRa sur findli ----------------------------------------
function listNoteMoy (findli,iniRa,reado,stsize) {
          findli.starRating({ 
                    initialRating: iniRa,
                    readOnly: reado,
                    starSize: stsize
                      });  
 }  
 
//------------  Tri des restaurants en fonctions des stars --------------------------------
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
			$('li').each(function(index){ 
				var thatStartRating =Number($(this).find('.restaurantAvgRating').starRating('getRating'));
				if ((thatStartRating<minStar || thatStartRating>maxStar)){ // Si  restaurant n'est pas dans note
					$(this).addClass('hide'); // on cache <li>
					markers[index].setVisible(false); // On cache le marker 
				} else{
					// Si <li> a une classe .hide est que le marker est sur la map on enlève la classe et on le met en visible true
					if($(this).hasClass('hide') && map.getBounds().contains(markers[index].getPosition())){
						$(this).removeClass('hide');
						markers[index].setVisible(true);
					// Si  <li> a une classe .hide mais que le marker n'est pas sur la map on met juste le marker en visible true
					}else if($(this).hasClass('hide')){
						markers[index].setVisible(true);
					};
				}
			});
		});
	}
} // fin starselect

