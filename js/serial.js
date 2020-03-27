var serial_console = false;
var serial_prev_state = false;

function serialSendInit(){
    serial_console = document.getElementById("console");
    serial_console.value = "";
    serial_prev_state = false;
}

function serialSendDriver(){
    if (memory[0x800000a0] == 0){ // serial__send_command == 0
        memory[0x800000a1] = 0; // serial_send_response == 0
        serial_prev_state = false;
    } else { // serial_send_command == 1
        if (serial_prev_state) return;
        serial_prev_state = true;
        var data = memory[0x800000a2];
        console.log("Printing: " + data);
        serial_console.value += String.fromCharCode(data);

        memory[0x800000a1] = 1; // serial_response == 1
    }
}