require("dotenv").config();

var key = require("./key.js");
var fs = require("fs");
var request = require("request");
var Twitter = require('twitter');
var Spotify = require('node-spotify-api');
var moment = require('moment');

var operation = process.argv[2];
// var parameter = process.argv[3];
var logFile = "log.txt";
var random = "random.txt";

var spotify = new Spotify(key.spotify);
var client = new Twitter(key.twitter);
var movie = "";
var song = "";
var logTime = "";

// console.log(key.spotify);
// console.log(key.twitter);
// console.log(key.twitter.consumer_key);
// console.log(key.twitter.consumer_secret);

switch (operation) {
	case "my-tweets":
		myTweets();
		break;
	case "spotify-this-song":
		if (process.argv.length > 3) {
			for (let i = 3; i < process.argv.length; i++) {
				song += (process.argv[i] + " ");
			}
		} else {
			song = "The Sign";
		}
		// Call spotifySong function with 'song' parameter
		spotifySong(song);
		break;
	case "movie-this":
		if (process.argv.length > 3) {
			for (let i = 3; i < process.argv.length; i++) {
				movie += (process.argv[i] + " ");
			}
		} else {
			movie = "Mr. Nobody";
		}
		// Call movieThis()
		movieThis(movie);
		break;
	case "do-what-it-says":
		randomize();
		break;
	default:
		errorInput();
		break;
}

function myTweets() {
	// console.log("Running my tweets");
	logTime = moment().format('YYYY/MM/DD HH:mm:ss');
	// console.log("[" + logTime + "]");
	fs.appendFile(logFile, "[" + logTime + "] >> myTweets() \n", function (err) {
		if (err) { return; }
	});

	var params = { screen_name: 'JarvisEnvGroup' };
	client.get('statuses/user_timeline', params, function (error, tweets, response) {
		logTime = moment().format('YYYY/MM/DD HH:mm:ss');
		if (!error) {
			// console.log("Number of tweets: " + tweets.length);
			console.log("Twitter User Name: " + tweets[0].user.name);
			console.log("Twitter Handle: @" + tweets[0].user.screen_name + "\n");
			for (let i = 0; i < tweets.length; i++) {
				console.log(tweets[i].text);
				console.log(tweets[i].created_at + " (GMT) \n");
				// if(i === 20){
				// 	break;
				// }
			}
			fs.appendFile(logFile,
				"[" + logTime + "] \n" + JSON.stringify(tweets, null, 2) + "\n",
				function (err) {
					if (err) { return; }
				});
		} else {
			console.log("Error: " + error + "\nResponse: " + JSON.stringify(response, null, 2) + "\n");
			fs.appendFile(logFile,
				"[" + logTime + "] \n" + "Error: " + error + "\nResponse: " + JSON.stringify(response, null, 2) + "\n",
				function (err) {
					if (err) { return; }
				});
		}
	});
}

function spotifySong(songTrack) {
	// console.log("Spotify the Song");
	// console.log("Song Track: " + songTrack);
	logTime = moment().format('YYYY/MM/DD HH:mm:ss');
	fs.appendFile(logFile, "[" + logTime + "] >> spotifySong() \n", function (err) {
		if (err) { return; }
	});

	spotify.search({ type: 'track', query: songTrack }, function (err, data) {
		logTime = moment().format('YYYY/MM/DD HH:mm:ss');
		if (err) {
			console.log('Error occurred: ' + err);
			fs.appendFile(logFile, "[" + logTime + "] \n" + "Error occurred: " + err + "\n", function (err) {
				if (err) { return; }
			});
			return;
		}
		// console.log(JSON.stringify(data.tracks.items[0], null, 2));
		// Artist(s) - Strings the artist names from the array
		let artists = "";
		for (let i = 0; i < data.tracks.items[0].artists.length; i++) {
			if (i === 0) {
				artists += data.tracks.items[0].artists[i].name;
			} else {
				artists += (", " + data.tracks.items[0].artists[i].name);
			}
		}
		console.log("Artist/s: " + artists);

		// The song's name
		console.log("Song name: " + data.tracks.items[0].name);

		// A preview link of the song from Spotify
		if (data.tracks.items[0].preview_url != null) {
			console.log("Preview link: " + data.tracks.items[0].preview_url);
		}
		// The album that the song is from
		console.log("Album name: " + data.tracks.items[0].album.name);
		fs.appendFile(logFile,
			"[" + logTime + "] \n" + "Spotify URL: " + data.tracks.href + "\n" + JSON.stringify(data.tracks.items[0], null, 2) + "\n",
			function (err) {
				if (err) { return; }
			});
	});
}

function movieThis(movieName) {
	logTime = moment().format('YYYY/MM/DD HH:mm:ss');
	fs.appendFile(logFile, "[" + logTime + "] >> movieThis() \n" + "Request URL: " + "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=trilogy" + "\n", function (err) {
		if (err) { return; }
	});
	// console.log("Running movie this");

	// console.log("Movie: " + movieName);
	// console.log("Request URL: " + "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=trilogy");

	request("http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=trilogy", function (error, response, body) {
		logTime = moment().format('YYYY/MM/DD HH:mm:ss');
		// If the request is successful (i.e. if the response status code is 200)
		if (!error && response.statusCode === 200) {
			fs.appendFile(logFile,
				"[" + logTime + "] \n" + JSON.stringify(body, null, 2) + "\n",
				function (err) {
					if (err) { return; }
				});
			// Check if movie information was found
			if (JSON.parse(body).Response === "True") {
				// * Title of the movie.
				console.log("Title of the movie: " + JSON.parse(body).Title);
				// * Year the movie came out.
				console.log("Release Year is: " + JSON.parse(body).Year);
				// * IMDB Rating of the movie - if available
				if (JSON.parse(body).Ratings[0]) {
					console.log("IMDB rating is: " + JSON.parse(body).Ratings[0].Value);
				}
				// * Rotten Tomatoes Rating of the movie - if available
				if (JSON.parse(body).Ratings[1]) {
					console.log("Rotten Tomatoes rating is: " + JSON.parse(body).Ratings[1].Value);
				}
				// * Country where the movie was produced.
				if (JSON.parse(body).Country) {
					console.log("Production country/ies: " + JSON.parse(body).Country);
				}
				// * Language of the movie.
				if (JSON.parse(body).Language) {
					console.log("Language/s: " + JSON.parse(body).Language);
				}
				// * Plot of the movie.
				if (JSON.parse(body).Plot) {
					console.log("Plot of the movie: " + JSON.parse(body).Plot);
				}
				// * Actors in the movie.
				if (JSON.parse(body).Actors) {
					console.log("Actors: " + JSON.parse(body).Actors);
				}
			} else {
				console.log("Data not found for " + movieName + "\nPlease check for any spelling errors and try again \n");
			}
		} else {
			console.log("Error occurred: " + error + "\nResponse Code: " + response.statusCode);
			fs.appendFile(logFile,
				"[" + logTime + "] \n" + "Error occurred: " + error + "\nResponse Code: " + response.statusCode + "\n",
				function (err) {
					if (err) { return; }
				});
		}
	});
}

function randomize() {
	logTime = moment().format('YYYY/MM/DD HH:mm:ss');
	fs.appendFile(logFile, "[" + logTime + "] >> randomize() \n", function (err) {
		if (err) { return; }
	});
	// console.log("Random functon from file");
	fs.readFile(random, "utf8", function (err, data) {
		if (err) {
			return console.log(err);
		}
		let dataArr = data.split(",");
		// console.log(dataArr);
		fs.appendFile(logFile, "Random function: " + dataArr[0] + "\n", function (err) {
			if (err) { return; }
		});

		switch (dataArr[0]) {
			case "my-tweets":
				console.log("Getting My Tweets");
				myTweets();
				break;
			case "spotify-this-song":
				console.log("Spotifying... ");
				spotifySong(dataArr[1]);
				break;
			case "movie-this":
				console.log("Getting movie info...");
				movieThis(dataArr[1]);
				break;
			default:
				errorInput();
				break;
		}
	});
}

function errorInput() {
	console.log("Input not recognized");
	logTime = moment().format('YYYY/MM/DD HH:mm:ss');
	fs.appendFile(logFile, "[" + logTime + "] >> errorInput() \n", function (err) {
		if (err) { return; }
	});
}