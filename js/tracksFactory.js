app.factory('Tracks', ['$http', '$log', function($http, $log) {

	return {
    getTracks : function(playlist_id) {
      return $http.get('http://projects.mlitzinger.com/apis/jukebox/playlist/' + playlist_id + '/');
    },
    addTrack : function(id, title) {
			return $http.post('http://projects.mlitzinger.com/apis/jukebox/track/', { title: title, video_id: id });
		},
		removeTrack : function(id) {
			return $http.delete('http://projects.mlitzinger.com/apis/jukebox/track/', { params: { id: id } });
		}
	}

}]);