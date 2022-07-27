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
    // If window observer exists, remove the observer
    if(window.observer) {
        window.observer.disconnect();

        // Select container to be removed. getElement by class name does not work for this case
        const mySubContainer = document.querySelector('.my-timed-text-container');
        mySubContainer.remove()
    }
}


// Function to create a subtitle container that holds the second pair of subtitles
function createNewSubContainer(){

    // Get Netflix's container
    const netflixEL = "player-timedtext";
    const timedtext = document.getElementsByClassName(netflixEL)[0];

    // Set translate to no, that way both subtitles container don't translate to english
    timedtext.setAttribute('translate', 'no');

    // Create container and append it to Netflix's watch video class, this container also houses the original subtitle container
    const videoContainer = document.querySelector('.watch-video');
    const divy = document.createElement('div');
    divy.className = "my-timed-text-container";

    // Set our subtitle container to be able to use right click translate feature
    divy.setAttribute('translate', 'yes');

    // Create a p element to hold our subtitle data
    videoContainer.appendChild(divy);
    const mySubs = document.createElement('p');
    divy.appendChild(mySubs);

    // Style our container in a new function
    stylingContainer(divy, mySubs, timedtext);
    
    // Set window object variables
    window.cleared = 1; //Only takes new subs on clear, necessary because subs are constantly refreshed 
    window.config = { attributes: true, childList: true, subtree: true }; //attributeFilter:[ "style"]
    window.old_text = "";
    
    // This callback function operates the observer by observing node changes
    const callback = function (mutationsList, observer) {

        for (const mutation of mutationsList) {

            

            // mutation.type === 'childList', because Netflix will add subs by appending a child to the player-timed-text
            if (mutation.type === 'childList' && mutation.target.className === "player-timedtext") {
                
                if (mutation.addedNodes.length === 1) {

                    // to keep track of changes in where the subtitles are from Netflix, and then adjusting our subtitles to sit right above the container
                    if (mutation.target.className === "player-timedtext-text-container") {
                        mySubs.style.top = (mutation.target.offsetTop - 110) + "px";
                    }
                    
                    if (mutation.target.innerText !== window.old_text) {
                        
                        // mutation.target.innerText gives us access to the subs (BOTH LINES!)
                        window.old_text = mutation.target.innerText;
                        window.cleared = 1;

                        // console.log("Sub changed detected");
                        // console.log(mutation.target.innerText);
                        
                        // Set the subtitle data to our subtitle container
                        mySubs.innerHTML = mutation.target.innerText;
                
                    }
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

    // Constant varables to make this easier
    const containerStyle = newDiv.style
    const pStyle = pTag.style

    // Gets original sub placement attributes and then using them to position our subtitle container element (divy)
    // const boundingContainer = document.querySelector('.player-timedtext-text-container');

    // window.subs_placement_height = parseInt(boundingContainer.getBoundingClientRect().height);
    // window.subs_placement_y = parseInt(boundingContainer.getBoundingClientRect().y);
    // window.subs_placement_x = parseInt(boundingContainer.getBoundingClientRect().x);
    // window.subs_placement_bottom = parseInt(boundingContainer.getBoundingClientRect().bottom); 

    // Changing default styling of p tag
    // P tag comes with margins, this removes those margins
    pStyle.margin = "0";
    pStyle.fontSize = "25px";

    pStyle.border = "1px solid yellow";

    // Style our p tag
    pStyle.position = "relative";
    pStyle.height = "100px";
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
    containerStyle.height = original_subs_placement_height + "px";
    // containerStyle.width = original_subs_placement_width + "px";
    containerStyle.width = "100vh";
    containerStyle.top = original_subs_placement_y + "px";
    containerStyle.left = original_subs_placement_x + "px";
    containerStyle.bottom = original_subs_placement_bottom + "px";

    // Display block is important to make our container visible
    containerStyle.display = "block"
    containerStyle.whiteSpace = "pre-wrap"
    containerStyle.textAlign = "center"
    containerStyle.position = "absolute" 

}

const fontSizeUpdate = function(size) {
    const subtitles = document.querySelector(".my-timed-text-container");

    const mySubs = subtitles.querySelector('p');

    // console.log(mySubs);
    mySubs.style.fontSize = size + "px";
}