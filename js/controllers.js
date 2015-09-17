app.controller('PlaylistController', ['$window', '$scope', '$log', 'Tracks', 'Search', function ($window, $scope, $log, Tracks, Search) {
  
  $scope.playlist = {
    id: '603',
    tracks: []
  };

  Tracks.getTracks($scope.playlist.id).success(function(data){
    $scope.playlist.tracks = data;
    $log.info($scope.playlist.tracks);
    if($scope.playlist.tracks.length > 0) {
      getYoutubeAPI();
    }
  });

  $scope.togglePlayerState = function() {
    if($scope.playerState == 'PLAYING') {
      $scope.player.pauseVideo();
    } else {
      $scope.player.playVideo();
    }
  }

  $scope.addTrack = function(id, title) {
    Tracks.addTrack(id, title).success(function() {
      Tracks.getTracks($scope.playlist.id).success(function(data){
        $scope.playlist.tracks = data;
        if($scope.playlist.tracks.length == 1) {
          getYoutubeAPI();
        }
      });
      $scope.query = '';
      $log.info('Track added to playlist ...');
    });
  }

  $scope.removeTrack = function(id) {
    Tracks.removeTrack(id).success(function() {
      Tracks.getTracks($scope.playlist.id).success(function(data){
        $scope.playlist.tracks = data;
      });
      $log.info('Track removed from playlist ...');
    });
  }

  $scope.queueNextTrack = function() {
    Tracks.removeTrack($scope.playlist.tracks[0].id).success(function() {
      Tracks.getTracks($scope.playlist.id).success(function(data){
        $scope.playlist.tracks = data;
        if($scope.playlist.tracks.length > 0) {
          $scope.player.loadVideoById($scope.playlist.tracks[0].video_id);
        } else {
          $scope.player.stopVideo();
          $log.info('Playlist has ended ...');
        }
      });
      $log.info('Track removed from playlist ...');
    });
  }

  $scope.results = Search.getResults();
  $scope.query = '';

  $scope.search = function() {
    Search.listResults($scope.query);
  }

  $scope.hasResults = function() {
    if($scope.query != '') {
      return true;
    }
  }

  $window.onYouTubeIframeAPIReady = function() {
    var timer;
    $scope.player = new YT.Player('video', {
      videoId: $scope.playlist.tracks[0].video_id,
      playerVars: {
        rel: 0,
        showinfo: 0
      },
      events: {
        'onReady': function(event) {
          event.target.setVolume(50);
          event.target.playVideo();
        },
        'onStateChange': function(event) {
          if (event.data == YT.PlayerState.PLAYING) {

            $scope.playerState = 'PLAYING';

            var playButton = angular.element( document.querySelector('.play-button') );
            playButton.removeClass('fa-play').addClass('fa-pause');
            $log.info('Track is playing ...');

            var playerTotalTime = event.target.getDuration();
            timer = setInterval(function() {
              var playerCurrentTime = event.target.getCurrentTime();
              var playerTimeDifference = (playerCurrentTime / playerTotalTime) * 100;
              var progressBar = angular.element( document.querySelector('.progress-bar') );
              progressBar.css('width', playerTimeDifference + '%');
            }, 500);

          } else if (event.data == YT.PlayerState.PAUSED) {

            $scope.playerState = 'PAUSED';

            var playButton = angular.element( document.querySelector('.play-button') );
            playButton.removeClass('fa-pause').addClass('fa-play');
            $log.info('Track is paused ...');

            clearTimeout(timer);

          } else if(event.data == YT.PlayerState.ENDED){

            var playButton = angular.element( document.querySelector('.play-button') );
            playButton.removeClass('fa-pause').addClass('fa-play');
            $scope.playerState = 'ENDED';

            $log.info('Track has ended ...');

            clearTimeout(timer);

            var progressBar = angular.element( document.querySelector('.progress-bar') );
            progressBar.css('width', '0');

            $scope.queueNextTrack(); 
          }
        },
        'onError': function(event) {
          if (event.data == 101 || event.data == 150) {
            $log.error('Track is restricted from playback ...');
            $scope.queueNextTrack();
          } else {
            $log.error('Track was not found ...');
          }
        }
      }
    });
    $log.info('Playlist is starting ...');
  }

  function getYoutubeAPI() {
    var tag = document.createElement('script');
    tag.src = 'http://www.youtube.com/iframe_api';
    var firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

    $log.info('Youtube API is ready ...');
  }

}]);