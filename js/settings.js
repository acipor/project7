// variables générales
var map;
var markers = new Array();
var restaurants =  new Array ();
var defaultPosition = {lat: 48.8737815, lng: 2.3501660};
var defaultZoom = 16; // default zoom
var infoWindow;
var geocoder;
var service;
var defaultRadius = '1000' ; // radius pour la recherche des restaurants
var starSelectSize = 20; // Taille des étoiles 
var textSelect = 'Choisir les restaurants à montrer:'; // Texte
var textBtnSelect = 'Classer restaurants'; // Texte du bouton 
var starRestaurantsSize = 20; // Taille des étoiles de la note du restaurant
var starRatingsSize = 12;  // Taille des étoiles des avis
var jsonFile = 'data/restaurant.json'; // Nom du fichier Json appellé 
