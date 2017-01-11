// must run 'npm install watson-developer-cloud' and 'npm install alchemy-api'
// for this code to work

var watson = require('watson-developer-cloud');
var fs = require('fs');

// text to speech setup
var text_to_speech = new watson.TextToSpeechV1 ({
    username: '630f556d-bab8-481c-b78e-75e0fdb228d3',
    password: 'DEbS5Py0Leri'
});

// alchemy setup
var alchemy_language = watson.alchemy_language({
    api_key: '2436cd7fd981f4272c7de44b31b643bc5d4f6314'
})

// url to pull text from
var parameters = {
    url: 'http://techcrunch.com/2016/01/29/ibm-watson-weather-company-sale'
};

// get text from website
alchemy_language.text(parameters, function(err, response) {
    if (err) {
        console.log('error:', err);
    } else {
        // this will print out text from webpage if uncommmented
        // console.log(response.text);
        
        // form JSON request parameters
        var params = {
            // grabs first few characters for audio file
            text: response.text.substring(0,255),
            voice: 'en-US_AllisonVoice',
            accept: 'audio/wav'
        };
        
        // create .wav file from text
        text_to_speech.synthesize(params).pipe(fs.createWriteStream('webpage.wav'));
    }
});

