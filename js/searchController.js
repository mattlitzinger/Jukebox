app.controller('SearchController', ['$scope', '$rootScope', '$log', 'Tracks', 'Search', function ($scope, $rootScope, $log, Tracks, Search) {

  $scope.addTrack = function(id, title) {
    Tracks.addTrack(id, title).success(function() {
      Tracks.getTracks($rootScope.playlist.id).success(function(data){
        $rootScope.playlist.tracks = data;
        if($rootScope.playlist.tracks.length == 1) {
          createPlayer();
        }
      });
      $scope.query = '';
      $log.info('Track added to playlist ...');
    });
  }

  $scope.results = [];
  $scope.query = '';

  $scope.search = function() {
    Search.listResults($scope.query).success(function(response) {
      $scope.results.length = 0;
      for(var i = response.items.length - 1; i >= 0; i--) {
        $scope.results.push({
          id: response.items[i].id.videoId,
          title: response.items[i].snippet.title
        });
      }
    });
  }

  $scope.hasResults = function() {
    if($scope.query != '') {
      return true;
    }
  }

}]);