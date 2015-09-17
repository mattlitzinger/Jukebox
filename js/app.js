
var app = angular.module('app', []);

app.config(['$httpProvider', function ($httpProvider) { 

  delete $httpProvider.defaults.headers.common['X-Requested-With'];

}]);

