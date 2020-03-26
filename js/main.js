window.addEventListener("load", function(){
    document.getElementById("form").addEventListener("submit", handleSubmit, false);
    document.getElementById("load_btn").addEventListener("click", handleLoad, false);
    document.getElementById("run_btn").addEventListener("click", handleRun, false);
    basicIOInit();
}, false);

function handleSubmit(event){
    event.preventDefault();

    var file_txt = "";
    var files = [document.getElementById("main_file").files[0]];
    var supp_files = document.getElementById("supp_files").files;
    for (var i = 0; i < supp_files.length; ++i) files.push(supp_files[0]);

    var j = 0;
    for (var i = 0; i < files.length; ++i){
        var reader = new FileReader();
        reader.onload = function(e){
            file_txt += e.target.result + "\n";
            ++j;
            if (j == files.length){
                assemble(file_txt);
            }
        }
        reader.readAsText(files[i]);
    }
}