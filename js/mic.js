var mic_active = false;
var mic_trying = false;

var mic_ctx = false;
var mic_analyser = false;
var mic_source = false;
var mic_stream = false;
var mic_array = [];
var mic_sample = 0;

function micInit(){
    mic_active = false;
    mic_trying = false;
}

function micGetPermission(){

    if(navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia({ audio: true }).then(function(stream) {
            mic_ctx = new AudioContext();
            mic_source = mic_ctx.createMediaStreamSource(stream);
            mic_analyser = mic_ctx.createAnalyser();
            mic_source.connect(mic_analyser);
            mic_analyser.fftSize = 256;
            mic_array = new Float32Array(mic_analyser.fftSize);
            mic_stream = stream;

            mic_active = true;
        }).catch(function(err){
            message("There was an error loading the microphone.");
            running = false;
        });
    } else {
        message("Could not load microphone.");
        running = false;
    }
}

function micDriver(){
    if (!running && mic_active){
        mic_stream.getTracks().forEach(function(track) {
            track.stop();
        });
        mic_active = false;
        mic_trying = false;
    }


    if (memory[0x80000050] == 0){ // microphone_command == 0
        memory[0x80000051] = 0; // microphone_response = 0
    } else { // microphone_command == 1
        if (!mic_trying){
            micGetPermission();
            mic_trying = true;
        }
        if (!mic_active){
            memory[0x80000051] = 0;
            return;
        }
        
        mic_analyser.getFloatTimeDomainData(mic_array);
        mic_sample = Math.floor(mic_array[mic_analyser.fftSize/2] * 2147483648);
        memory[0x80000052] = mic_sample;

        memory[0x80000051] = 1; // microphone_response = 1
    }
}