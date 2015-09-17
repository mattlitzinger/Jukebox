app.factory('Search', ['$http', '$log', function($http, $log) {

  return {
    listResults : function(query) {
      if(query != '') {
        return $http.get('https://www.googleapis.com/youtube/v3/search', {
          params: {
            key: 'AIzaSyAq8o2a85wW5Er4PwXcOlI_3oKQKB-tyxo',
            type: 'video',
            maxResults: '8',
            part: 'id,snippet',
            fields: 'items/id,items/snippet/title',
            lr: 'en',
            q: query
          }
        });
      }
    }
  }

}]);