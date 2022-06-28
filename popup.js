const form = document.getElementById("popup-form");
const inputElements = ["vPos", "fSize", "fColor"];

// getting the default data from Chrome's local storage
chrome.storage.local.get(inputElements, data => {
    inputElements.forEach(element => {
        document.getElementById(element).value = data[element];
    })
})


// add a listener to the form 
form.addEventListener("submit", e => {
    e.preventDefault();
    const [vPos, fSize, fColor] =  [...inputElements.map(element => e.target[element].value)];

    // if the conditions are met on the chrome tab, then connect to the subtitles parameters in background.js
    chrome.tabs.query({active: true, currentWindow: true}, tabs => {
        chrome.storage.local.set({ vPos, fSize, fColor});
        
        // access script.js to execute the script file and also a function for error handling
        chrome.tabs.executeScript(
            tabs[0].id, 
            {
                file: "script.js"
            }, 
            () => {
                const error = chrome.runtime.lastError;
                if (error) "Error. Tab ID: " + tabs.id + ": " + JSON.stringify(error);

                chrome.tabs.sendMessage(tabs[0].id, { vPos, fSize, fColor});
            }
        )
    }); 
})