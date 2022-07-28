// Track on-off toggling for dual subtitles
chrome.storage.sync.get('on_off', function (data) {
    if (data.on_off != null) {
        // console.log("Preferences: on_off : " + data.on_off + " this is working!");
    }
    else {
        chrome.storage.sync.set({ 'on_off': false });
        // console.log("data is null");

    }
});


chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {

        // keeping track of if dual subs is turned on or not
        if (request.message === "update_on_off") {
            // console.log("Background.js recieved message from SUBTITLE to update on_off to " + request.value);

            //Store into chrome using chrome.storage API
            chrome.storage.sync.set({ 'on_off': request.value });

            // Keeps track of the tab we are currently on
            chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {

                //Pass message onto Content.js
                chrome.tabs.sendMessage(tabs[0].id, {
                    "message": "update_on_off",
                    "value": request.value
                });

            });
        }

        // keeping track of subtitle size
        if (request.message === "update_font_size") {

            // console.log("Background.js recieved message from SUBSIZE to update font size to " + request.value);

            //Store into local variables
            chrome.storage.sync.set({ 'font_size': request.value });

            chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) { //Pass message onto Content.js
                chrome.tabs.sendMessage(tabs[0].id, {
                    "message": "update_font_size",
                    "value": request.value
                });
            });
        }
    }
);