chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    
    // Window.on_off will be true or false based on the update_on_off value from user
    if (request.message === "update_on_off") {
        
        // Calls functions to create a dual subtitle container
        window.on_off = request.value;
        if (window.on_off) {
            createNewSubContainer();
            // console.log("Called Sub Container")
        } else {
            removeSubContainer()
            // console.log("Removed Sub container");
        }
    }
    
    // Get value to check if any changes made to font size buttons
    if (request.message === "update_font_size" && window.on_off) {
        window.font_size = request.value;

        fontSizeUpdate(window.font_size);
    }
});


// Function to stop the observer and remove the subtitle container
function removeSubContainer(){
    // If window observer exists, remove the observer
    if(window.observer) {
        window.observer.disconnect();

        // Select container to be removed. getElement by class name does not work for this case
        const mySubContainer = document.querySelector('.my-timed-text-container');
        mySubContainer.remove()
    }
}

// Get Netflix's container returns it for reference 
function getNetflixContainer(){
    // Get Netflix's container
    const netflixEl = "player-timedtext";
    const timedtext = document.getElementsByClassName(netflixEl)[0];

    // Set translate to no, that way both subtitles container don't translate to english
    timedtext.setAttribute('translate', 'no');
    return timedtext
}

// Function to create a subtitle container that holds the second pair of subtitles
function createNewSubContainer(){

    //We need this this element
    const timedtext = getNetflixContainer()

    // Create container and append it to Netflix's watch video class, this container also houses the original subtitle container
    const videoContainer = document.querySelector('.watch-video');

    const divy = document.createElement('div');
    divy.className = "my-timed-text-container";

    // Append our new container to the Netflix's video container
    videoContainer.appendChild(divy);

    // Create a p element to hold our subtitle data
    const mySubs = document.createElement('p');
    divy.appendChild(mySubs);

    // Style our container in a new function
    stylingContainer(divy, mySubs, timedtext);
    
    // Set window object variables
    window.cleared = 1; //Only takes new subs on clear, necessary because subs are constantly refreshed 
    window.config = { attributes: true, childList: true, subtree: true }; //attributeFilter:[ "style"]
    window.old_text = "";

    // This callback function operates by observing node changes

    const callback = function (mutationsList, observer) {

        for (const mutation of mutationsList) {

            // to keep track of changes in where the subtitles are from Netflix, and then adjusting our subtitles to sit right above the container
            if (mutation.target.className === "player-timedtext-text-container") {
                mySubs.style.top = (mutation.target.offsetTop - 75) + "px";
                // console.log((mutation.target))
            }

            // mutation.type === 'childList', because Netflix will add subs by appending a child to the player-timed-text
            if (mutation.type === 'childList' && mutation.target.className === "player-timedtext") {
                
                if (mutation.addedNodes.length === 1) {
                    
                    if (mutation.target.innerText !== window.old_text) {
                        
                        // mutation.target.innerText gives us access to the subs (BOTH LINES!)
                        // set old text as current text for next observer change
                        window.old_text = mutation.target.innerText;
                        window.cleared = 1;

                        // console.log("Sub changed detected");
                        // console.log(mutation.target.innerText);
                        
                        // Set the subtitle data to our subtitle container
                        mySubs.innerHTML = mutation.target.innerText;
                
                    }

                } else if (mutation.target.childElementCount === 0) { 

                    // No children means the mutation was a subtitle CLEAR rather than refresh, double check necessary because refresh would make it here as well but with children
                    // Mutation checks to see if there is any change to the element, if none, then remove the subs
                    window.cleared = 1;
                    mySubs.innerText = "";
                    window.last_subs = "";
                }

            } 

        }   

    };

    // Create our observer that uses our callback function
    window.observer = new MutationObserver(callback);
    window.observer.observe(timedtext, window.config);

} //end of createNewSubContainer function


// Function to style our container, recieves our div container, our p tag, and netflix sub container
function stylingContainer(newDiv, pTag, netflixTimedtext){

    // Set our subtitle container to be able to use right click translate feature
    newDiv.setAttribute('translate', 'yes');

    // Constant varables to make this easier
    const containerStyle = newDiv.style
    const pStyle = pTag.style

    // Changing default styling of p tag, Note: P tag comes with margins, this removes those margins
    pStyle.margin = "0";
    pStyle.fontSize = "25px";

    // Style our p tag
    pStyle.position = "relative";
    pStyle.height = "70px";
    pStyle.width = "100%";
    pStyle.display = "flex";
    pStyle.flexDirection = "row";
    pStyle.justifyContent = "center";

    // Retrieve original container placement
    window.original_subs_placement_height = parseInt(netflixTimedtext.getBoundingClientRect().height);
    window.original_subs_placement_width = parseInt(netflixTimedtext.getBoundingClientRect().width);
    window.original_subs_placement_y = parseInt(netflixTimedtext.getBoundingClientRect().y);
    window.original_subs_placement_x = parseInt(netflixTimedtext.getBoundingClientRect().x);
    window.original_subs_placement_bottom = parseInt(netflixTimedtext.getBoundingClientRect().bottom);


    // Style our container using the old container properties
    containerStyle.height = "100px";
    containerStyle.width = original_subs_placement_width + "px";
    containerStyle.top = original_subs_placement_y + "px";
    containerStyle.left = original_subs_placement_x + "px";
    containerStyle.bottom = original_subs_placement_bottom + "px";

    // Display block is important to make our container visible
    containerStyle.display = "block"
    containerStyle.whiteSpace = "pre-wrap"
    containerStyle.textAlign = "center"
    containerStyle.position = "absolute" 

}

// Function changes our p tag font size
const fontSizeUpdate = function(size) {
    const subtitles = document.querySelector(".my-timed-text-container");

    const mySubs = subtitles.querySelector('p');

    mySubs.style.fontSize = size + "px";
}