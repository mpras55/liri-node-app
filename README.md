# liri-node-app
Language Interpretation and Recognition Interface via Node.js

### Command format
`node liri <command>`

### Commands Supported
* `my-tweets`
* `spotify-this-song`
* `movie-this`
* `do-what-it-says`

### my-tweets
`node liri my-tweets '<twitter handle here>'`
* This will show last 20 tweets for twitter handle provided
* If no handle is provided, handle will default to 'JarvisEnvGroup'

### spotify-this-song
`node liri spotify-this-song '<song name here>'`
* This will show the following information about the song in your terminal/bash window
	* Artist(s)
	* The song's name
	*	A preview link of the song from Spotify
	* The album that the song is from
* If no song is provided then your program will default to "The Sign" by Ace of Base.

### movie-this
`node liri movie-this '<movie name here>'`
* This will output the following information (if available) to your terminal/bash window:
   * Title of the movie.
   * Year the movie came out.
   * IMDB Rating of the movie.
   * Rotten Tomatoes Rating of the movie.
   * Country where the movie was produced.
   * Language of the movie.
   * Plot of the movie.
   * Actors in the movie.
* If the user doesn't type a movie in, the program will output data for the movie 'Mr. Nobody.'

### do-what-it-says
`node liri do-what-it-says`
*  LIRI will take the first line of text inside of random.txt and then use it to call one of LIRI's commands
* Example: 
	* `spotify-this-song,I Want it That Way,`
	* `movie-this,The Matrix,`
	* `spotify-this-song,Baby one more time,`
	* `my-tweets, potus,`

### Log File
* log.txt logs the function calls and response details along with timestamp 