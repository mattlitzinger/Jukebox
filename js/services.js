app.factory('Tracks', ['$http', '$log', function($http, $log) {

	return{
    getTracks : function(playlist_id) {
      return $http.get('http://projects.mlitzinger.com/apis/jukebox/playlist/' + playlist_id + '/');
    },
    addTrack : function(id, title) {
			return $http.post('http://projects.mlitzinger.com/apis/jukebox/track/', { title: title, video_id: id, user_key: 'fiat2015' });
		},
		removeTrack : function(id) {
			return $http.delete('http://projects.mlitzinger.com/apis/jukebox/track/', { params: { id: id, user_key: 'fiat2015' } });
		}
	}

}]);

app.service('Search', ['$http', '$log', function($http, $log) {
	var results = [];

	this.listResults = function(query) {
		if(query != '') {
	    $http.get('https://www.googleapis.com/youtube/v3/search', {
        params: {
          key: 'AIzaSyAq8o2a85wW5Er4PwXcOlI_3oKQKB-tyxo',
          type: 'video',
          maxResults: '8',
          part: 'id,snippet',
          fields: 'items/id,items/snippet/title',
          lr: 'en',
          q: query
        }
      })
      .success(function(response) {
        results.length = 0;
	      for(var i = response.items.length - 1; i >= 0; i--) {
		      results.push({
		        id: response.items[i].id.videoId,
		        title: response.items[i].snippet.title
		      });
		    }
		    $log.info(results);
		    return results;
      })
      .error(function(error) {
        $log.info(error);
      });
    } else {
    	results.length = 0;
    }
  }

  this.getResults = function() {
    return results;
  }

}]);