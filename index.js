// must run 'npm install watson-developer-cloud' and 'npm install alchemy-api'
// for this code to work
// Also run 'npm install readline'

var watson = require('watson-developer-cloud');
var fs = require('fs');
var readline = require('readline')


//Global variables
var keywordsToSay = ''
var textToSay = ''
var keywordError = -1
var textError = -1
var keywordsArr = null

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

function getCount() {
    //If no error thrown getting keywords or text excerpt, identify how many times the keywords appear in the excerpt
    if (keywordError == 0 && textError == 0) {
        var keywordCount = 0
        console.log('Generating a count file...')

        for (i = 0; i < keywordsArr.length && i < 10; i++) {
            //console.log("Comparison:")
            //console.log("textToSay: " + textToSay)
            //console.log("keywordArr " + keywordsArr[i])
            if (textToSay.indexOf(keywordsArr[i].text) >= 0) {
                keywordCount++
            }
        }

        console.log('Generating audio file \'count.wav\'')
        speech_params.text = keywordCount.toString()
        text_to_speech.synthesize(speech_params).pipe(fs.createWriteStream('count.wav'));
    }
    else {
        console.log('Failed to generate count file')
    }
}


//Starting
//Ask for website
rl.question('Enter a web address:  ', (webAddress) => {
    console.log('Getting the keywords...')

    //Use this web address with alchemy
    alchemy_params.url = webAddress
    alchemy_language.combined(alchemy_params, function (err, response) {
        if (err) {
            keywordError = 1
            console.log('error:', err);
    }
	else {
	    //Successful, so get the key words
	    keywordsArr = response.keywords
	    keywordsToSay = ""
	    //Limit the number of words to be said to be 10 or less
	    for(i = 0; i < keywordsArr.length && i < 10; i++) {
		keywordsToSay += keywordsArr[i].text + '. '
	    }

	    //Now send this string to Watson text to speech
	    console.log('Generating audio file \'keywords.wav\'')
        speech_params.text = keywordsToSay
        console.log(keywordsToSay)
	    text_to_speech.synthesize(speech_params).pipe(fs.createWriteStream('keywords.wav'));
        console.log('Keywords file is generating!')
        keywordError = 0
        getCount()
	}
    });

    console.log('Getting the text...')
    alchemy_language.text(alchemy_params, function (err, response) {
        if (err) {
            console.log('error:', err);
        }
        else {
            textToSay = JSON.stringify(response, null, 2)
            if (textToSay.length > textToSay.indexOf('\"text\":') + 7 + 250) {
                textToSay = textToSay.slice(textToSay.indexOf('\"text\":') + 7, textToSay.indexOf('\"text\":') + 7 + 250)
            }
            else {
                textToSay = textToSay.slice(textToSay.indexOf('\"text\":') + 7, textToSay.length)
            }
            console.log('Generating audio file \'text.wav\'')
            speech_params.text = textToSay
            console.log(textToSay)
            text_to_speech.synthesize(speech_params).pipe(fs.createWriteStream('text.wav'));
            console.log('Text file is generating!')
            textError = 0
        }
    });
   
    // Close the readline module 
    rl.close()
});




