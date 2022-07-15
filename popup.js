// to save the input value of the radio buttons to adjust the sizing for subtitles

document.addEventListener('DOMContentLoaded', function () {
    
    const inputSize = document.querySelectorAll("input[name=subSize]");
    const dualSubsOn = document.getElementById("subtitle");

    // getting the values from the popup form into chrome storage
    chrome.storage.sync.get('font_size', function (data) {
        inputSize.checked = data.font_size;
        console.log("Stored font value is: ", data.font_size);
    });

    // chrome keeping track of if on-off button is activated for dual subs
    chrome.storage.sync.get('on_off', function (data) {
        dualSubsOn.checked = data.on_off;
        console.log("Stored value is: ", data.on_off);
    });

    // event listener for subtitle size
    inputSize.forEach((input) => {
        input.addEventListener('change', function () {
            input.value = this.value;
            chrome.runtime.sendMessage({
                "message": "update_font_size",
                "value": this.value
            });
        });
    });

    // event listener for turning dual subtitles on
    dualSubsOn.addEventListener('change', function () {   
        // if (this.checked) {
        //     console.log('on')
        // } else {
        //     console.log('off');
        // }

        chrome.runtime.sendMessage({
            "message": "update_on_off",
            "value": this.checked
        });
    });

}); //end of document event listener