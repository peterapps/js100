var opcodes = ["halt","add","sub","mult","div","cp","and","or","not","sl","sr","cpfa","cpta","be","bne","blt","call","ret"];
var op_arg_nums = [0, 3, 3, 3, 3, 2, 3, 3, 2, 3, 3, 3, 3, 3, 3, 3, 2, 1];
var mif = [];
var labels = {};

function message(txt){
    document.getElementById("msg").innerHTML = txt;
    //console.log(txt);
}

function assemble(lines){

    mif = []; // Memory image
    labels = {}; // Dictionary mapping labels to addresses

    for (var i = 0; i < lines.length; ++i){
        if (lines[i].charAt(0) == "#" || lines[i].length == 0) continue; // ignore #include statements

        var tokens = lines[i].match(/\S+/g); // Split by whitespace
        if (tokens == null) continue; // Ignore blank lines
        for (var j = 0; j < tokens.length; ++j){
            if (tokens[j].length >= 2 && tokens[j].charAt(0) == "/" && tokens[j].charAt(1) == "/"){
                tokens.length = j; // Chop off comments
            }
        }

        if (tokens.length == 0) continue; // Ignore blank lines

        var op = opcodes.indexOf(tokens[0]);
        var arg1 = (tokens.length > 1) ? opcodes.indexOf(tokens[1]) : -1;
        if (op > -1){ // This is an opcode
            mif.push(op);
            if (op_arg_nums[op] + 1 != tokens.length){
                message("Line " + i + ": Incorrect number of arguments for " + tokens[0]);
                return false;
            }
            for (var j = 1; j < tokens.length; ++j){ // Grab the correct number of arguments
                if (isNaN(tokens[j])){ // Token is a label
                    mif.push(tokens[j]); // To be replaced later
                } else { // Token is a number
                    mif.push(parseInt(tokens[j]));
                }
            }
            for (var j = tokens.length; j < 4; ++j){
                mif.push(0);
            }
        } else if (arg1 > -1) { // The first thing is a label, and then an opcode
            labels[tokens[0]] = mif.length;
            mif.push(arg1);
            if (op_arg_nums[arg1] + 2 != tokens.length){
                message("Line " + i + ", Label " + tokens[0] + ": Incorrect number of arguments for " + tokens[1]);
                return false;
            }
            for (var j = 2; j < tokens.length; ++j){ // Grab the correct number of arguments
                if (isNaN(tokens[j])){ // Token is a label
                    mif.push(tokens[j]); // To be replaced later
                } else { // Token is a number
                    mif.push(parseInt(tokens[j]));
                }
            }
            for (var j = tokens.length; j < 5; ++j){
                mif.push(0);
            }
        } else { // This is just a label or a piece of data
            if (isNaN(tokens[0])){
                labels[tokens[0]] = mif.length;
                if (tokens.length != 2 || isNaN(tokens[1])){
                    message("Line " + i + ", Label " + tokens[0] + ": There should be one integer value after a label.");
                    return false;
                }
                mif.push(parseInt(tokens[1]));
            } else {
                mif.push(parseInt(tokens[0]));
            }
        }
    }

    for (var i = 0; i < mif.length; ++i){
        if (isNaN(mif[i])){ // mif[i] is a label
            if (mif[i] in labels){
                mif[i] = labels[mif[i]];
            } else {
                message("Undefined label " + mif[i]);
                return false;
            }
        }
    }

    message("Assembled.");
    
    return true;
}