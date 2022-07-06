// to save the input value of the radio buttons to adjust the sizing for subtitles

document.addEventListener('DOMContentLoaded', function(){

    // window.addEventListener('click', function (e) {
    //     if (e.target.href !== undefined) {
    //         chrome.tabs.create({ url: e.target.href });
    //     }
    // });

    // const form = document.getElementById("popup-form");
    const inputSize = document.querySelector("input[name=subSize]");
    const dualSubsOn = document.getElementById("subtitle");


    chrome.stoage.sync.get('font_size', function(data) {
        inputSize.value = data.font_size
    });

    chrome.storage.sync.get('on_off', function (data) {
        console.log("Stored value is: ", data.on_off);
        dualSubsOn.checked = data.on_off;

    });

    
    // event listener for subtitle size
    inputSize.addEventListener("change", function() {
        inputSize.value = this.value;
        chrome.runtime.sendMessage({
            "message":"update_font_size",
            "value": this.value
        });
    });

    // event listener for turning dual subtitles on
    dualSubsOn.addEventListener('change', function(){
        chrome.runtime.sendMessage({
            "message": "update_on_off",
            "value": this.checked
        });
    });

});