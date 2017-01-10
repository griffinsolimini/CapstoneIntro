var TextToSpeechV1 = require('watson-developer-cloud/text-to-speech/v1');
var fs = require('fs');

var text_to_speech = new TextToSpeechV1 ({
    username: '630f556d-bab8-481c-b78e-75e0fdb228d3',
    password: 'DEbS5Py0Leri'
});

var params = {
    text: 'Hello World.',
    voice: 'en-US_AllisonVoice',
    accept: 'audio/wav'
};

text_to_speech.synthesize(params).pipe(fs.createWriteStream('hello_world.wav'));

