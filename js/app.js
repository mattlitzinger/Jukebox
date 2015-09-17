
var app = angular.module('app', ['ngRoute']);

app.config(['$httpProvider', '$routeProvider', '$locationProvider', function ($httpProvider, $routeProvider, $locationProvider) { 

  delete $httpProvider.defaults.headers.common['X-Requested-With'];

  $routeProvider
    .when('/', { 
      controller: 'HomeController', 
      templateUrl: 'views/home.html' 
    }) 
    .when('/playlist/:playlist_id', { 
      controller: 'PlaylistController', 
      templateUrl: 'views/playlist.html' 
    }) 
    .otherwise({ 
      redirectTo: '/'
    }); 

  $locationProvider.html5Mode(true);
}]);

