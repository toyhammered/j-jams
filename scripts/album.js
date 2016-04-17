var albumPicasso = {
  title: 'The Colors',
  artist: 'Pablo Picasso',
  label: 'Cubism',
  year: '1881',
  albumArtUrl: 'assets/images/album_covers/01.png',
  songs: [
    { title: 'Blue', duration: '4:26'},
    { title: 'Green', duration: '3:14' },
    { title: 'Red', duration: '5:01' },
    { title: 'Pink', duration: '3:21'},
    { title: 'Magenta', duration: '2:15'}
  ]
}

var albumMarconi = {
   title: 'The Telephone',
   artist: 'Guglielmo Marconi',
   label: 'EM',
   year: '1909',
   albumArtUrl: 'assets/images/album_covers/20.png',
   songs: [
     { title: 'Hello, Operator?', duration: '1:01' },
     { title: 'Ring, ring, ring', duration: '5:01' },
     { title: 'Fits in your pocket', duration: '3:21'},
     { title: 'Can you hear me now?', duration: '3:14' },
     { title: 'Wrong phone number', duration: '2:15'}
   ]
 };

 var albumLedZeppelin = {
    title: 'Houses of Holy',
    artist: 'Led Zeppelin',
    label: 'Atlantic Records',
    year: '1973',
    albumArtUrl: 'assets/images/album_covers/lz.jpg',
    songs: [
      { title: 'The Song Remains The Same', duration: '5:32' },
      { title: 'The Rain Song', duration: '7:39' },
      { title: 'Over the Hills and Far Away', duration: '4:50'},
      { title: 'The Crunge', duration: '3:17' },
      { title: 'Dancing Days', duration: '3:43'},
      { title: 'D\'yer Mak\'er', duration: '4:23'},
      { title: 'No Quarter', duration: '7:00'},
      { title: 'The Ocean', duration: '4:31'}
    ]
  };

 var createSongRow = function(songNumber, songName, songLength) {
   var template =
          ' <tr class="album-view-song-item">'
          +   '<td class="song-item-number">'+ songNumber + '</td>'
          +   '<td class="song-item-title">'+ songName + '</td>'
          +   '<td class="song-item-duration">'+ songLength +'</td>'
          + '</tr>'
          ;
          return template;
 };

 var setCurrentAlbum = function(album) {
   var albumTitle = document.getElementsByClassName('album-view-title')[0];
   var albumArtist = document.getElementsByClassName('album-view-artist')[0];
   var albumReleaseInfo = document.getElementsByClassName('album-view-release-info')[0];
   var albumImage = document.getElementsByClassName('album-cover-art')[0];
   var albumSongList = document.getElementsByClassName('album-view-song-list')[0];

   albumTitle.firstChild.nodeValue = album.title;
   albumArtist.firstChild.nodeValue = album.artist;
   albumReleaseInfo.firstChild.nodeValue = album.year + ' ' + album.label;
   albumImage.setAttribute('src', album.albumArtUrl);

   albumSongList.innerHTML = '';

   for (var i = 0; i < album.songs.length; i++) {
     albumSongList.innerHTML += createSongRow(i + 1, album.songs[i].title, album.songs[i].duration);
   }
 };

  toggleAlbum = function(){
   var albumImage = document.getElementsByClassName('album-cover-art')[0];
   var albums = [albumPicasso, albumMarconi, albumLedZeppelin]
   var theIndex = 1;
   albumImage.addEventListener('click', function(){
      setCurrentAlbum(albums[theIndex])
      theIndex = (theIndex+1)%(albums.length);
   });
 };

 window.onload = function() {
   setCurrentAlbum(albumPicasso)
   toggleAlbum();
 };
