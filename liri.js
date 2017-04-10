// required for reading and writing files
var fs = require("fs");

// required for getting the API keys to twitter
var keys = require("./keys.js")

// required for using APIs
var Twitter = require("twitter");
var spotify = require("spotify");
var request = require("request");

var client = new Twitter ({
	  consumer_key: keys.twitterKeys.consumer_key,
	  consumer_secret: keys.twitterKeys.consumer_secret,
	  access_token_key: keys.twitterKeys.access_token_key,
	  access_token_secret: keys.twitterKeys.access_token_secret
	});

var action = process.argv[2]
var input = process.argv[3]
var queryURL = ("http://www.omdbapi.com/?t=" + input + "&y=&plot=short&r=json");


switch (action) {
	case "my-tweets":
		myTweets();
		break;

	case "spotify-this-song":
		spotifyThisSong();
		break;

	case "movie-this":
		movieThis();
		break;

	case "do-what-it-says":
		doWhatItSays();
		break;
}

function myTweets() {

	client.get('statuses/user_timeline', {screen_name: '@mkheeger', count: '20'}, function(error, tweets, response) {

		for (var i=0; i<20; i++) {
			console.log('Recent Tweet: ' + tweets[i].text + '\n' + 'Tweeted: ' + tweets[i].user.created_at)
		}
	});
}

function spotifyThisSong() {
	spotify.search({type:'track', query: input}, function(err, data){

		if (err) {
			console.log('Error occurred: ' + err);
			return
		}

		if (!input) {
			input = 'the sign, ace of base'
			spotifyThisSong()
		} else {
			console.log("Artist: " + JSON.stringify(data.tracks.items[0].album.artists[0].name, null, 4))
			console.log("Song Name: " + JSON.stringify(data.tracks.items[0].name, null, 4))
			console.log("Preview link: " + JSON.stringify(data.tracks.items[0].preview_url, null, 4))
			console.log("Album: " + JSON.stringify(data.tracks.items[0].album.name, null, 4))
		}
	});
};

function movieThis() {

	request(queryURL, function(error, response, body) {

		if (error) {
			console.log('Error occurred: ' + err);
			return
		}

		if (!input) {
			input = 'Mr.Nobody'
			queryURL = ("http://www.omdbapi.com/?t=" + input + "&y=&plot=short&r=json");
			console.log(input)
			movieThis()
		} else {
			 console.log("Title: " + JSON.parse(body).Title);
			 console.log("Release Year: " + JSON.parse(body).Year);
			 console.log("Rated: " + JSON.parse(body).Rated);
			 console.log("Country: " + JSON.parse(body).Country);
			 console.log("Language: " + JSON.parse(body).Language);
			 console.log("Plot: " + JSON.parse(body).Plot);
			 console.log("Actors: " + JSON.parse(body).Actors);
			 console.log("Rotten Tomatoes: " + JSON.parse(body).Ratings[1].Value);
			 console.log("Rotten Tomatoes Site: " + JSON.parse(body).Website);
		}
	});
}

function doWhatItSays() {
	fs.readFile("random.txt", "utf8", function(error, data) {
		if (error) {
			console.log(error);
		}

		var command = data.split(',')

		action = command[0]
		input = command[1]

		console.log(action, input)

		switch (action) {
			case "my-tweets":
				myTweets();
				break;

			case "spotify-this-song":
				spotifyThisSong();
				break;

			case "movie-this":
				movieThis();
				break;

			case "do-what-it-says":
				doWhatItSays();
				break;
		}
	});
}


