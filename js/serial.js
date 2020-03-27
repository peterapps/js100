var serial_console = false;
var serial_prev_state = false;

var serial_input_str = false;
var serial_buffer = [];
var serial_receive_active = false;

function serialSendInit(){
    serial_console = document.getElementById("console");
    serial_console.value = "";
    serial_prev_state = false;
    serial_buffer = [];
    serial_receive_active = false;
}

function serialSendDriver(){
    if (memory[0x800000a0] == 0){ // serial_send_command == 0
        memory[0x800000a1] = 0; // serial_send_response == 0
        serial_prev_state = false;
    } else { // serial_send_command == 1
        if (serial_prev_state) return;
        serial_prev_state = true;
        var data = memory[0x800000a2];
        serial_console.value += String.fromCharCode(data);

        memory[0x800000a1] = 1; // serial_response == 1
    }
}

// Serial receive

function serialReceiveInit(){
    serial_input_str = document.getElementById("serial_input_str");
    serial_input_str.addEventListener("keydown", serialCallback, false);
}

function serialCallback(event){
    if (!running || event.keyCode != 13) return;
    event.preventDefault();
    var txt = serial_input_str.value;
    serial_input_str.value = "";
    for (var i = 0; i < txt.length; ++i){
        serial_buffer.push(txt.charCodeAt(i));
    }
    console.log(serial_buffer);
}

function serialReceiveDriver(){
    if (memory[0x80000090] == 0){ // serial_receive_command == 0
        memory[0x80000091] = 0; // serial_receive_response = 0
        serial_receive_active = false;
    } else { // serial_receive_command == 1
        if (serial_buffer.length == 0 || serial_receive_active) return;
        console.log(serial_buffer);
        memory[0x80000092] = serial_buffer.shift();
        serial_receive_active = true;

        memory[0x80000091] = 1; // serial_response == 1
    }
}