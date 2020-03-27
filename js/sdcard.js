var sdcard_data = [];

function sdcardInit(){
    var files = document.getElementById("sd_file").files;
    if (files.length == 0){
        return;
    }
    var reader = new FileReader();
    reader.onload = function(e){
        sdcard_data = new Int32Array(e.target.result);
    };
    reader.readAsArrayBuffer(files[0]);
}

function sdcardDriver(){
    if (memory[0x80000080] == 0){ // sd_command == 0
        memory[0x80000081] = 0; // sd_response == 0
    } else { // sd_command == 1
        if (sdcard_data.length == 0){
            message("No SD card data file specified.");
            running = false;
            return;
        }
        var address = memory[0x80000083];
        if (memory[0x80000082] == 0){ // sd_write == 0
            memory[0x80000085] = sdcard_data[address];
        } else { // sd_write == 1
            sdcard_data[address] = memory[0x80000084];
        }

        memory[0x80000081] = 1; // sd_response = 1
    }
}