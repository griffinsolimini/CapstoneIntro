var watson = require('watson-developer-cloud');
var TextToSpeechV1 = require('watson-developer-cloud/text-to-speech/v1');
var fs = require('fs');
var readline = require('readline')

//JSON Data
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

var alchemy_language = watson.alchemy_language({
    api_key: '7fd6173ff60e2d8ba6a6ff58e1fe3ed02bbb2b05'
});

var alchemy_params = {
    extract: 'keywords',
    url: ''
}    


var text_to_speech = new TextToSpeechV1 ({
    username: '630f556d-bab8-481c-b78e-75e0fdb228d3',
    password: 'DEbS5Py0Leri'
});

var speech_params = {
    text: '',
    voice: 'en-US_AllisonVoice',
    accept: 'audio/wav'
};

//Starting, ask for website
var response

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
	    console.log('Generating audio file')
	    speech_params.text = textToSay
	    text_to_speech.synthesize(speech_params).pipe(fs.createWriteStream('outputFromProgram.wav'));
	    
	}
    });
    
    rl.close()
});


//Requesting the voice audio
//text_to_speech.synthesize(params).pipe(fs.createWriteStream('hello_world.wav'));

