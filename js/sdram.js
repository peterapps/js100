var sdram_data = [];

function sdramInit(){
    sdram_data = new Array(20000); // Should be 33554432 but that lags
    for (var i = 0; i < sdram_data.length; ++i){
        sdram_data[i] = 0;
    }
}

function sdramDriver(){
    if (memory[0x80000030] == 0){ // sdram_command == 0
        memory[0x80000031] = 0; // sdram_response == 0
    } else { // sdram_command == 1
        var address = memory[0x80000033];
        if (memory[0x80000032] == 0){ // sdram_write == 0
            memory[0x80000035] = sdram_data[address];
        } else { // sdram_write == 1
            sdram_data[address] = memory[0x80000034];
        }

        memory[0x80000031] = 1; // sdram_response == 1
    }
}