window.addEventListener("load", function(){
    document.getElementById("form").addEventListener("submit", handleSubmit, false);
    document.getElementById("load_btn").addEventListener("click", handleLoad, false);
    document.getElementById("run_btn").addEventListener("click", handleRun, false);
    document.getElementById("directory").addEventListener("change", updatePrefix, false);
    if (document.getElementById("directory").files.length > 0) updatePrefix();
    basicIOInit();
    touchInit();
    audioInit();
    keyboardInit();
    serialReceiveInit();
}, false);

function updatePrefix(event){
    var dir = document.getElementById("directory").files[0].webkitRelativePath.split("/")[0];
    document.getElementById("dir_prefix").innerHTML = dir;
}

function absolutePath(curr_path, rel_path){
    var curr_dir = curr_path.split("/");
    curr_dir.pop();
    var tokens = rel_path.split("/");
    for (var i = 0; i < tokens.length; ++i){
        var token = tokens[i];
        if (token == ".."){
            curr_dir.pop();
        }
        else if (token != "."){
            curr_dir.push(token);
        }
    }
    return curr_dir.join("/");
}

var files = [];
var file_dict = {};

function readFile(i, callback){
    if (i == files.length){
        callback();
        return;
    }
    if (!files[i].webkitRelativePath.endsWith(".e")){
        readFile(i+1, callback);
        return;
    }
    var reader = new FileReader();
    reader.onload = function(e){
        file_dict[files[i].webkitRelativePath] = e.target.result;
        readFile(i+1, callback);
    };
    reader.readAsText(files[i]);
}

function parseIncludes(txt, callback){
    var lines = txt.split("\n");
    for (var i = 0; i < lines.length; ++i){
        if (lines[i].startsWith("#include ")){
        }
    }
}

function parseIncludes(absPath){
    var lines = file_dict[absPath].split("\n");
    var result = [];
    for (var i = 0; i < lines.length; ++i){
        if (lines[i].startsWith("#include ")){
            var relPath = lines[i].substring(9);
            var relPath = absolutePath(absPath, relPath);
            result = result.concat(parseIncludes(relPath));
        } else {
            result.push(lines[i]);
        }
    }
    return result;
}

function handleSubmit(event){
    event.preventDefault();

    file_txt = "";
    file_dict = {};

    var dir = document.getElementById("directory").files[0].webkitRelativePath.split("/")[0];
    var main_path = dir + "/" + document.getElementById("main_path").value;
    files = document.getElementById("directory").files;

    readFile(0, function(){
        var lines = parseIncludes(main_path);
        assemble(lines);
    });
}