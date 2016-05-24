var createSongRow = function(songNumber, songName, songLength) {
  var template =
    ' <tr class="album-view-song-item">'
      +   '<td class="song-item-number" data-song-number="' + songNumber + '">' + songNumber + '</td>'
      +   '<td class="song-item-title">'+ songName + '</td>'
      +   '<td class="song-item-duration">'+ filterTimeCode(songLength) +'</td>'
      + '</tr>'
    ;
    var $row =  $(template);

    var clickHandler = function() {
      var songNumber = parseInt($(this).attr('data-song-number'));

      if (currentlyPlayingSongNumber !== null) {
        var currentlyPlayingHtml = $('.song-item-number[data-song-number="' + currentlyPlayingSongNumber + '"]');
        currentlyPlayingHtml.html(currentlyPlayingSongNumber);
      }
      if (currentlyPlayingSongNumber !== songNumber) {
        setSong(songNumber);
        currentSoundFile.play();
        updateSeekBarWhileSongPlays();
        $(this).html(pauseButtonTemplate);
        currentSongFromAlbum = currentAlbum.songs[songNumber - 1];
        var $volumeFill = $('.volume .fill');
        var $volumeThumb = $('.volume .thumb');
        $volumeFill.width(currentVolume + '%');
        $volumeThumb.css({left: currentVolume + '%'});
        updatePlayerBarSong();
      }
      else if (currentlyPlayingSongNumber === songNumber) {
        $('.main-controls .play-pause').html(playerBarPlayButton);
        if (currentSoundFile.isPaused()){ 
          $(this).html(pauseButtonTemplate);
          $('.main-controls .play-pause').html(playerBarPauseButton);
          currentSoundFile.play();
          updateSeekBarWhileSongPlays();
        }
        else {
          $(this).html(playButtonTemplate);
          $('.main-controls .play-pause').html(playerBarPlayButton);
          currentSoundFile.pause();
        }

      }



    };

    var onHover = function(event) {


      var songNumber = parseInt($(this).find('.song-item-number').attr('data-song-number'));
      var songHtml = $(this).find('.song-item-number');

      if (songNumber !== currentlyPlayingSongNumber) {
        songHtml.html(playButtonTemplate);
      }
    }

    var offHover = function(event) {

      var songNumber = parseInt($(this).find('.song-item-number').attr('data-song-number'));
      var songHtml = $(this).find('.song-item-number');
      console.log("songNumber type is " + typeof songNumber + "\n and currentlyPlayingSongNumber type is " + typeof currentlyPlayingSongNumber);
      if (songNumber !== currentlyPlayingSongNumber) {
        songHtml.html(songNumber);
      }
    }

    $row.find('.song-item-number').click(clickHandler);
    $row.hover(onHover, offHover);
    return $row;
};

var setCurrentAlbum = function(album) {
  currentAlbum = album;
  var $albumTitle = $('.album-view-title');
  var $albumArtist = $('.album-view-artist');
  var $albumReleaseInfo = $('.album-view-release-info');
  var $albumImage = $('.album-cover-art');
  var $albumSongList = $('.album-view-song-list');

  $albumTitle.text(album.title);
  $albumArtist.text(album.artist);
  $albumReleaseInfo.text(album.year + ' ' + album.label);
  $albumImage.attr('src', album.albumArtUrl);

  $albumSongList.empty();

  for (var i = 0; i < album.songs.length; i++) {
    var $newRow = createSongRow(i + 1, album.songs[i].title, album.songs[i].duration);
    $albumSongList.append($newRow);
  }
};

var setSong = function(songNumber){
  if (currentSoundFile) {
    currentSoundFile.stop();
  }
  currentlyPlayingSongNumber = parseInt(songNumber);
  currentSongFromAlbum = currentAlbum.songs[songNumber - 1];
  currentSoundFile = new buzz.sound(currentSongFromAlbum.audioUrl, {
    formats: ['mp3'],
    preload: true
  });
}

var seek = function(time) {
  if (currentSoundFile){
    currentSoundFile.setTime(time);
  }
};

var setVolume = function (volume) {
  if (currentSoundFile) {
    currentSoundFile.setVolume(volume);
  }
}

var getSongNumberCell = function(number){
  return $('.song-item-number[data-song-number="' + number + '"]');
}

var trackSong = function (album, song) {
  return album.songs.indexOf(song);
}
var nextSong = function(){
  var getLastSongNumber = function(index){
    return index === 0 ? currentAlbum.songs.length : index;
  };
  var currentSongIndex = trackSong(currentAlbum, currentSongFromAlbum);
  currentSongIndex++;

  if(currentSongIndex >= currentAlbum.songs.length) {
    currentSongIndex = 0;
  }

  currentlyPlayingSongNumber = currentSongIndex + 1;
  currentSongFromAlbum = currentAlbum.songs[currentSongIndex];

  $('.currently-playing .song-name').text(currentSongFromAlbum.title);
  $('.currently-playing .artist-name').text(currentAlbum.artist);
  if(currentSongIndex >= currentAlbum.songs.length) {
    currentSongIndex = 0;
  }

  setSong(currentSongIndex + 1);
  currentSoundFile.play();
  updateSeekBarWhileSongPlays();



  $('.currently-playing .song-name').text(currentSongFromAlbum.title);
  $('.currently-playing .artist-name').text(currentAlbum.artist);
  $('.currently-playing .artist-song-mobile').text(currentSongFromAlbum.title + " - " + currentAlbum.title);
  $('.main-controls .play-pause').html(playerBarPauseButton);

  var lastSongNumber = getLastSongNumber(currentSongIndex);
  var $nextSongNumberCell = getSongNumberCell(currentlyPlayingSongNumber);
  var $lastSongNumberCell = getSongNumberCell(lastSongNumber);

  $nextSongNumberCell.html(pauseButtonTemplate);
  $lastSongNumberCell.html(lastSongNumber);

};

var previousSong = function(){
  var getLastSongNumber = function(index){
    return index === (currentAlbum.songs.length - 1) ? 1 : index + 2;
  };
  var currentSongIndex = trackSong(currentAlbum, currentSongFromAlbum);
  currentSongIndex--;

  if(currentSongIndex < 0) {
    currentSongIndex = currentAlbum.songs.length - 1;
  }

  setSong(currentSongIndex + 1);
  currentSoundFile.play();
  updateSeekBarWhileSongPlays();

  updatePlayerBarSong();

  $('.currently-playing .song-name').text(currentSongFromAlbum.title);
  $('.currently-playing .artist-name').text(currentAlbum.artist);
  $('.currently-playing .artist-song-mobile').text(currentSongFromAlbum.title + " - " + currentAlbum.title);
  $('.main-controls .play-pause').html(playerBarPauseButton);

  var lastSongNumber = getLastSongNumber(currentSongIndex);
  var $prevSongNumberCell = getSongNumberCell(currentlyPlayingSongNumber);
  var $lastSongNumberCell = getSongNumberCell(lastSongNumber);

  $prevSongNumberCell.html(pauseButtonTemplate);
  $lastSongNumberCell.html(lastSongNumber);

};


var setCurrentTimeInPlayerBar = function(currentTime) {
  $('.current-time').text(currentTime);
};

var setTotalTimeInPlayerBar = function(totalTime) {
  $('.total-time').text(totalTime);
};

var filterTimeCode = function(timeInSeconds) {
  var seconds = parseFloat(timeInSeconds);
  var minutes = Math.floor(seconds / 60);
  var wholeSeconds = Math.floor(seconds);
  var secondsRemaining = Math.floor(seconds % 60)
  var time =  minutes + ':' + secondsRemaining;
  if (secondsRemaining < 10){
    time = minutes + ':0' + secondsRemaining;
  }
  return time

};
var updateSeekBarWhileSongPlays = function(){
  if (currentSoundFile) {

    currentSoundFile.bind('timeupdate', function(event){
      var seekBarFillRatio = this.getTime() / this.getDuration();
      var $seekBar = $('.seek-control .seek-bar');

      updateSeekPercentage($seekBar, seekBarFillRatio);
      setCurrentTimeInPlayerBar(filterTimeCode(this.getTime()));
      setTotalTimeInPlayerBar(filterTimeCode(this.getDuration()));
    });
  }
};

var updateSeekPercentage = function($seekBar, seekBarFillRatio) {
  var offsetXPercent = seekBarFillRatio * 100;

  offsetXPercent = Math.max(0, offsetXPercent);
  offsetXPercent = Math.min(100, offsetXPercent);

  var percentageString = offsetXPercent + '%';
  $seekBar.find('.fill').width(percentageString);
  $seekBar.find('.thumb').css({left: percentageString});
};

var setupSeekBars = function() {
  var $seekBars = $('.player-bar .seek-bar');

  $seekBars.click(function(event){

    var offsetX = event.pageX - $(this).offset().left;
    var barWidth = $(this).width();
    var seekBarFillRatio = offsetX / barWidth;

    if ($(this).parent().attr('class') == 'seek-control') {
      seek(seekBarFillRatio * currentSoundFile.getDuration());
    } else {
      setVolume(seekBarFillRatio * 100);   
    }

    updateSeekPercentage($(this), seekBarFillRatio);
  });

  $seekBars.find('.thumb').mousedown(function(event){
    var $seekBar = $(this).parent();

    $(document).bind('mousemove.thumb', function(event){
      var offsetX = event.pageX - $seekBar.offset().left;
      var barWidth = $seekBar.width();
      var seekBarFillRatio = offsetX / barWidth;

      if ($seekBar.parent().attr('class') == 'seek-control') {
        seek(seekBarFillRatio * currentSoundFile.getDuration());   
      } else {
        setVolume(seekBarFillRatio);
      }

      updateSeekPercentage($seekBar, seekBarFillRatio);
    }); 

    $(document).bind('mouseup.thumb', function(event){
      $(document).unbind('mousemove.thumb');
      $(document).unbind('mouseup.thumb');
    });
  });
};


var updatePlayerBarSong = function(){
  $('.currently-playing .song-name').html(currentSongFromAlbum.title);
  $('.currently-playing .artist-name').html(currentAlbum.artist);
  $('.currently-playing .artist-song-mobile').html(currentSongFromAlbum.title + " | " + currentAlbum.artist);

  $('.main-controls .play-pause').html(playerBarPauseButton)
}

var togglePlayFromPlayerBar = function() {

  var $currentlyPlayingCell = getSongNumberCell(currentlyPlayingSongNumber);

  if(currentSoundFile.isPaused()) {

    $currentlyPlayingCell.html(pauseButtonTemplate);
    $(this).html(playerBarPauseButton);
    currentSoundFile.play();
    updateSeekBarWhileSongPlays();

  } else if (currentSoundFile) {
    $currentlyPlayingCell.html(playButtonTemplate);
    $(this).html(playerBarPlayButton);
    currentSoundFile.pause();
  }
};

var playButtonTemplate = '<a class="album-song-button"><span class="ion-play"></span></a>';
var pauseButtonTemplate = '<a class="album-song-button"><span class="ion-pause"></span></a>';
var playerBarPlayButton = '<span class="ion-play"></span>';
var playerBarPauseButton = '<span class="ion-pause"></span>';
var playPauseButtonToggle = $('.main-controls .play-pause');

var currentAlbum = null;
var currentlyPlayingSongNumber = null;
var currentSongFromAlbum = null;
var currentSoundFile = null;
var currentVolume = 80;

var $previousButton = $('.main-controls .previous')
var $nextButton = $('.main-controls .next')

$(document).ready(function() {
  setCurrentAlbum(albumPicasso);
  $previousButton.click(previousSong);
  $nextButton.click(nextSong);
  playPauseButtonToggle.click(togglePlayFromPlayerBar);
  setupSeekBars();
});
