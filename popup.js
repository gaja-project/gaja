// to save the input value of the radio buttons to adjust the sizing for subtitles

document.addEventListener('DOMContentLoaded', function () {
    
    console.log('hello');


    // const form = document.getElementById("popup-form");
    const inputSize = document.querySelectorAll("input[name=subSize]");
    const dualSubsOn = document.getElementById("subtitle");

    // console.log(dualSubsOn);
    // console.log(inputSize);



    // storing the values from the popup form into chrome storage
    // chrome.stoage.sync.get('font_size', function (data) {
    //     inputSize.value = data.font_size
    // });

    chrome.storage.sync.get('on_off', function (data) {
        console.log("Stored value is: ", data.on_off);
        dualSubsOn.checked = data.on_off;
    });


    // event listener for subtitle size
    inputSize.forEach((radio) => {
        radio.addEventListener('change', function () {
            console.log('button clicked');

            console.log("font size", this);

            inputSize.value = this.value;
            chrome.runtime.sendMessage({
                "message": "update_font_size",
                "value": this.value
            });
        });
    });



    // event listener for turning dual subtitles on
    dualSubsOn.addEventListener('change', function () {   
        console.log('clicked!');

        console.log('this value', this.value);

        if (this.checked) {
            console.log('on')
        } else {
            console.log('off');
        }

        chrome.runtime.sendMessage({
            "message": "update_on_off",
            "value": this.checked
        });
    });

});