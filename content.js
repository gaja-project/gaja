chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    
    // Window.on_off will be true or false based on the update_on_off value from user
    // if (request.message === "update_on_off" || request.message === "update_font_size") {
    if (request.message === "update_on_off") {
        
        // Calls functions to create a dual subtitle container
        window.on_off = request.value;
        if (window.on_off) {
            createNewSubContainer();
            console.log("Called Sub Container")
        } else {
            removeSubContainer()
            console.log("Removed Sub container");
        }
    }
    
    if (request.message === "update_font_size") {
        // console.log(request.value);
        window.font_size = request.value;

        fontSizeUpdate(window.font_size);
    }
});


// Function to stop the observer and remove the subtitle container
function removeSubContainer(){
    window.observer.disconnect();

    // Select container to be removed. getElement by class name does not work for this case
    const mySubContainer = document.querySelector('.my-timed-text-container');
    mySubContainer.remove()
}


// Function to create a subtitle container that holds the second pair of subtitles
function createNewSubContainer(){

    // Get Netflix's container
    const id = "player-timedtext";
    const timedtext = document.getElementsByClassName(id)[0];

    // Set translate to no, that way both subtitles container don't translate to english
    timedtext.setAttribute('translate', 'no');

    // Create container and append it to Netflix's watch video class, this container also houses the original subtitle container
    const videoContainer = document.querySelector('.watch-video');
    const divy = document.createElement('div');
    divy.className = "my-timed-text-container";

    // Set our subtitle container to be able to use right click translate feature
    divy.setAttribute('translate', 'yes');

    // TODO Create a function to style container
    // Create a p container to hold subtitle data
    videoContainer.appendChild(divy);
    const mySubs = document.createElement('p');
    divy.appendChild(mySubs);

    // Changing default styling of p tag
    mySubs.style.margin = "0";
    mySubs.style.fontSize = "25px";

    const boundingContainer = document.querySelector('.player-timedtext-text-container');
    // console.log(boundingContainer.getBoundingClientRect().height);

    // Gets original sub placement attributes and then using them to position our subtitle container element (divy)
    window.subs_placement_height = parseInt(boundingContainer.getBoundingClientRect().height);
    window.subs_placement_y = parseInt(boundingContainer.getBoundingClientRect().y);
    window.subs_placement_x = parseInt(boundingContainer.getBoundingClientRect().x);
    window.subs_placement_bottom = parseInt(boundingContainer.getBoundingClientRect().bottom); 

    mySubs.style.position = "relative";
    // mySubs.style.height = subs_placement_height + "px";
    // mySubs.style.bottom = subs_placement_y + 10 + "px";

    mySubs.style.height = "100px";
    // mySubs.style.bottom = "0px";
    // mySubs.style.top = "420px"
    mySubs.style.width = "100%";
    // mySubs.style.border = "1px solid green";
    mySubs.style.display = "flex";
    mySubs.style.flexDirection = "row";
    mySubs.style.justifyContent = "center";


    window.original_subs_placement_height = parseInt(timedtext.getBoundingClientRect().height);
    window.original_subs_placement_width = parseInt(timedtext.getBoundingClientRect().width);
    window.original_subs_placement_y = parseInt(timedtext.getBoundingClientRect().y);
    window.original_subs_placement_x = parseInt(timedtext.getBoundingClientRect().x);
    window.original_subs_placement_bottom = parseInt(timedtext.getBoundingClientRect().bottom);

    // console.log(timedtext.getBoundingClientRect().height);

    // divy.style.height = original_subs_placement_height + "px";
    // divy.style.bottom = original_subs_placement_y + "px";
    divy.style.height = original_subs_placement_height + "px";
    // divy.style.height = "100%";
    divy.style.width = original_subs_placement_width + "px";
    divy.style.top = original_subs_placement_y + "px";
    divy.style.left = original_subs_placement_x + "px";
    divy.style.bottom = original_subs_placement_bottom + "px";

    // styling for divy element
    // divy.style.width = "100vw"
    divy.style.display = "block"
    divy.style.whiteSpace = "pre-wrap"
    divy.style.textAlign = "center"
    divy.style.position = "absolute"
    // divy.style.border = "1px solid yellow"
    // divy.style.fontSize = "50px"
    // divy.style.top = "80px"
    // divy.style.height = "100px"; 

    window.cleared = 1; //Only takes new subs on clear, necessary because subs are constantly refreshed 
    window.config = { attributes: true, childList: true, subtree: true }; //attributeFilter:[ "style"]
    window.old_text = "";
    
    // This callback function operates the observer by observing node changes
    const callback = function (mutationsList, observer) {

        for (const mutation of mutationsList) {

            // to keep track of changes in where the subtitles are from Netflix, and then adjusting our subtitles to sit right above the container
            if (mutation.target.className === "player-timedtext-text-container") {
                mySubs.style.top = (mutation.target.offsetTop - 110) + "px";
            }

            // mutation.type === 'childList', because Netflix will add subs by appending a child to the player-timed-text
            if (mutation.type === 'childList' && mutation.target.className === "player-timedtext") {
                
                if (mutation.addedNodes.length === 1) {
                    
                    if (mutation.target.innerText !== window.old_text) {
                        
                        // mutation.target.innerText gives us access to the subs (BOTH LINES!)
                        window.old_text = mutation.target.innerText;
                        window.cleared = 1;

                        // console.log("Sub changed detected");
                        // console.log(mutation.target.innerText);
                        
                        // Set the subtitle data to our subtitle container
                        mySubs.innerHTML = mutation.target.innerText;
                
                        // Disconnect?? 
                        // this.disconnect(); //stop observer so I can add subs without triggering this infinitely
                    }
                }
            }           
        }       
    };

    // Create our observer that uses our callback function
    window.observer = new MutationObserver(callback);
    window.observer.observe(timedtext, window.config);

} //end of createNewSubContainer function

const fontSizeUpdate = function(size) {
    const subtitles = document.querySelector(".my-timed-text-container");

    const mySubs = subtitles.querySelector('p');

    // console.log(mySubs);
    mySubs.style.fontSize = size + "px";
}