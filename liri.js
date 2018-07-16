require("dotenv").config();

var request = require("request");
var inquirer =  require("inquirer");

// Twitter Function
function getTweets(){

  var Twit = require('twit');
  var twitconfig = require('./twitconfig');
  var T = new Twit(twitconfig);
  
  var params = {
    q: 'metalgearchee',
    count: 20
  }
  
  T.get('search/tweets', params, gotData);
  
  function gotData(err, data, response){
  
    for (i=0; i<20; i++){
      console.log(JSON.stringify(data.statuses[i].text, null, 2));
    }
  
  }

};

// Spotify function
function spotifyThis(query){

  var Spotify = require('node-spotify-api');
  var spotconfig = require('./spotconfig');
  var spotify = new Spotify(spotconfig);
  
  spotify.search({ type: 'track', query: query, limit: 1 }, function(err, data) {
    if (err) {
    return console.log('Error occurred: ' + err);
    }
    // console.log(JSON.stringify(data.tracks.items[0], null, 2));

    //this one gets artist name
    console.log('Artist: '+JSON.stringify(data.tracks.items[0].artists[0].name, null, 2));
    //this one gets song name
    console.log('Song: '+JSON.stringify(data.tracks.items[0].name, null, 2));
    //this one gets album name
    console.log('Album: '+JSON.stringify(data.tracks.items[0].album.name, null, 2));
    //this one gets url
    console.log('URL: '+JSON.stringify(data.tracks.items[0].external_urls.spotify, null, 2));
  });

};

inquirer.prompt([
  {
    type: 'list',
    name: 'menu',
    message: 'What do you want to do?',
    choices: [
      'My Tweets',
      'Spotify this song',
      'Movie this',
      'Do what it says'
    ]
  }
]).then(function(inquirerResponse) {

  // console.log(inquirerResponse.menu);

  if (inquirerResponse.menu == 'My Tweets'){
    console.log("Pulling your most recent 20 tweets...");
    getTweets();
  }else if (inquirerResponse.menu == 'Spotify this song'){
    // ask for a song to query
    inquirer.prompt([
      {
        type: 'input',
        message: 'Song name please',
        name: 'songInput'
      }
    ]).then(function(inquirerResponse){
      // console.log(inquirerResponse.songInput);
      spotifyThis(inquirerResponse.songInput);
    });
  }

});
