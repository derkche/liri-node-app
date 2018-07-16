require("dotenv").config();

var inquirer =  require("inquirer");

var Twit = require('twit');
var twitconfig = require('./twitconfig');

var Spotify = require('node-spotify-api');
var spotconfig = require('./spotconfig');

var request = require("request");

var fs = require("fs");

// Twitter Function
function getTweets(){

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

// Spotify Function
function spotifyThis(songQuery){

  var spotify = new Spotify(spotconfig);
  
  spotify.search({ type: 'track', query: songQuery, limit: 1 }, function(err, data) {
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

// OMDB Function via Request
function omdbThis(movieQuery){

    request("http://www.omdbapi.com/?t="+movieQuery+"&y=&plot=short&apikey=trilogy", function(error, response, body) {

      if (!error && response.statusCode === 200) {
        console.log('Title: '+JSON.parse(body).Title);
        console.log('Year: '+JSON.parse(body).Year);
        console.log('IMDB Rating: '+JSON.parse(body).imdbRating);
        console.log('Rotten Tomatoes Rating: '+JSON.parse(body).Ratings[1].Value); //Rotten Tomatoes
        console.log('Country: '+JSON.parse(body).Country);
        console.log('Language: '+JSON.parse(body).Language);
        console.log('Plot: '+JSON.parse(body).Plot);
        console.log('Actors: '+JSON.parse(body).Actors);
      }

    });
}


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
  console.log(inquirerResponse.menu);

  // User chooses Twitter
  if (inquirerResponse.menu == 'My Tweets'){

    console.log("Pulling your most recent 20 tweets...");
    getTweets();

  };

  // User chooses Spotify
  if (inquirerResponse.menu == 'Spotify this song'){

    // ask for a song to query
    inquirer.prompt([
      {
        type: 'input',
        message: 'Song name please',
        name: 'songInput'
      }
    ]).then(function(inquirerResponse){
      // console.log(inquirerResponse.songInput);
      console.log("Fetching your song info...");
      spotifyThis(inquirerResponse.songInput);
    });

  };

  // User choses OMDB
  if(inquirerResponse.menu == 'Movie this'){
    inquirer.prompt([
      {
        type: 'input',
        message:'Movie name please',
        name: 'movieInput'
      }
    ]).then(function(inquirerResponse){
      console.log('Going to BlockBuster for '+inquirerResponse.movieInput+'.')
      omdbThis(inquirerResponse.movieInput);
    });
  };

  //User choses 'Do what it says'
  if(inquirerResponse.menu == 'Do what it says'){

    fs.readFile("./random.txt", "utf8", function(error, data){

      if (error){
        return console.log(error);
      };

      console.log(data);
      return data;


    });
  };

});