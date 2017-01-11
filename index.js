// must run 'npm install watson-developer-cloud' and 'npm install alchemy-api'
// for this code to work
// Also run 'npm install readline'

var watson = require('watson-developer-cloud');
var fs = require('fs');
var readline = require('readline')

//JSON Data
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// alchemy setup
var alchemy_language = watson.alchemy_language({
    api_key: '2436cd7fd981f4272c7de44b31b643bc5d4f6314'
})

// alchemy params setup
var alchemy_params = {
    url: ''
}    

// text to speech setup
var text_to_speech = new watson.TextToSpeechV1 ({
    username: '630f556d-bab8-481c-b78e-75e0fdb228d3',
    password: 'DEbS5Py0Leri'
});

var speech_params = {
    text: '',
    voice: 'en-US_AllisonVoice',
    accept: 'audio/wav'
};


//Starting
//Ask for website
rl.question('Enter a web address:  ', (webAddress) => {
    console.log('Getting the keywords...')

    //Use this web address with alchemy
    alchemy_params.url = webAddress
    alchemy_language.combined(alchemy_params, function (err, response) {
	if (err) { console.log('error:', err); }
	else {
	    //Successful, so get the key words
	    var keywordsArr = response.keywords
	    textToSay = ""
	    //Limit the number of words to be said to be 10 or less
	    for(i = 0; i < keywordsArr.length && i < 10; i++) {
		textToSay += keywordsArr[i].text + ' '
	    }

	    //Now send this string to Watson text to speech
	    console.log('Generating audio file \'webpage.wav\'')
	    speech_params.text = textToSay
	    text_to_speech.synthesize(speech_params).pipe(fs.createWriteStream('webpage.wav'));
	    
	}
    });
   
    // Close the readline module 
    rl.close()
});




