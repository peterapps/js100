var audioCtx = false;
var audioBuffer = [];

function audioInit(){
    audioCtx = new AudioContext({
        sampleRate: 8000
    });
    audioReset();
}

function audioReset(){
    audioBuffer = [];
}

function audioPlay(){
    // Copy buffer array to AudioBuffer object
    var buffer = audioCtx.createBuffer(1, audioBuffer.length, audioCtx.sampleRate);
    var channel = buffer.getChannelData(0);
    for (var i = 0; i < audioBuffer.length; ++i){
        channel[i] = audioBuffer[i];
    }

    var source = audioCtx.createBufferSource();
    source.buffer = buffer;
    source.connect(audioCtx.destination);
    source.start();
}

function audioDriver(){
    if (memory[0x80000040] == 0){ // speaker_command == 0
        memory[0x80000041] = 0; // speaker_response = 0
    } else { // speaker_command == 1
        var data = memory[0x80000042] / 2147483648.0;
        audioBuffer.push(data);
        memory[0x80000041] = 1; // speaker_response = 1
    }
}