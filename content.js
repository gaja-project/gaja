chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {

    // console.log('the on/off button has been interacted with!', request.message);
    
    // if (request.message === "update_on_off" || request.message === "update_font_size") {
    if (request.message === "update_on_off") {
        window.on_off = request.value;
        console.log(window.on_off);
        if(window.on_off){
            createNewSubContainer();
            try{
                window.my_timed_text_container.style['display']='block';
            }
            catch(e){
                console.log(e)
            }
            console.log("Called Sub Container")
        } else {
            // try {
            //     document.getElementsByClassName("my-timed-text-container")
            // } catch(e){
            //     console.log(e)
            // }
            const mySubContainer = document.querySelector('.my-timed-text-container');
            mySubContainer.style.display = "none";
            window.observer.disconnect();
            console.log("Removed sub container");
        }
    }

});


function deleteSubContainer(){
    const mySubContainer = document.querySelector('.my-timed-text-container');
    mySubContainer.remove();
    // mutationObserver.disconnect();
    // Disconnect the observer

}


const gettingFormSettings = function(setting) {
    chrome.storage.sync.get(setting, function(data) {
        if (setting === "font_size") {
            window.font_size = data[setting];
        }
    })
}




// Function to create a subtitle container that holds the second pair of subtitles
function createNewSubContainer(){

    // Get orignal container
    const id = "player-timedtext";
    const timedtext = document.getElementsByClassName(id)[0];

    // Set translate to no, that way both subtitles container don't translate to english
    // timedtext.setAttribute('translate', 'no');

    // Create container and append it to Netflix's watch video class, this container also houses the original subtitle container
    const videoContainer = document.querySelector('.watch-video');
    const divy = document.createElement('div');
    divy.className = "my-timed-text-container";

    // Set our subtitle container to be able to use right click translate feature
    divy.setAttribute('translate', 'yes');

    // Create a p container to hold subtitle data
    videoContainer.appendChild(divy);
    const mySubs = document.createElement('p');
    divy.appendChild(mySubs);
    // p.innerHTML = "hello world"


    // to keep track of changes in where the subtitles are from Netflix, and then adjusting our subtitles to sit right above the container
    // Changing default styling of p tag
    mySubs.style.margin = "0"

    // Styling for divy element
    divy.style.width = "100vw"
    divy.style.display = "block"
    divy.style.whiteSpace = "pre-wrap"
    divy.style.textAlign = "center"
    divy.style.position = "absolute"
    divy.style.border = "10px solid yellow"
    divy.style.fontSize = "50px"
    divy.style.top = "80px"
    divy.style.height = "100px";
    // console.log("Container working")


    // this code here needs to be dynamic
    // Gets original sub placement attributes
    window.original_subs_placement_height = parseInt(timedtext.getBoundingClientRect().height); 
    // window.original_subs_placement_y = parseInt(timedtext.getBoundingClientRect().y); 
    window.original_subs_placement_bottom = parseInt(timedtext.getBoundingClientRect().bottom); 
    // divy.style.height = original_subs_placement_height + "px";
    // divy.style.top = original_subs_placement_bottom +'px';



    // window.old_inset = timedtext.style.inset;
    // window.original_subs_placement = parseInt(document.getElementsByClassName("player-timedtext")[0].getBoundingClientRect().width)*.025; //Original text is placed at Left:5%, using .right on original subs wasn't consistent

    // (console.log(window));
    window.cleared=1; //Only takes new subs on clear, necessary because subs are constantly refreshed 

    window.config = { attributes: true, childList: true, subtree: true }; //attributeFilter:[ "style"]

    window.old_text = "";
    mySubs.style.position = "relative";
    // mySubs.style.height = subs_placement_height + "px";
    // mySubs.style.bottom = subs_placement_y + 10 + "px";

    mySubs.style.height = "100px";
    // mySubs.style.bottom = "0px";
    mySubs.style.top = "420px"
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
    
    console.log(timedtext.getBoundingClientRect().height)

    // divy.style.height = original_subs_placement_height + "px";
    // divy.style.bottom = original_subs_placement_y + "px";
    // divy.style.height = original_subs_placement_height + "px";
    divy.style.height = "510px";
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
    divy.style.fontSize = "50px"
    // divy.style.top = "80px"
    // divy.style.height = "100px"; 


    const callback = function (mutationsList, observer) { //Observes original text box for changes
        // console.log('observer callback function working');
        // console.log(mutationsList);

        for (const mutation of mutationsList) {
            // console.log ('mutation of mutuation list working');
            // console.log(mutation);

            
            // mutation.type === 'childList', because Netflix will add subs by appending a child to the player-timed-text
            if (mutation.type === 'childList' && mutation.target.className === "player-timedtext") { //track removal/addition to subtitle container
                
                
                if (mutation.addedNodes.length === 1) { //If the player-timedtext-text-container is added (element which houses the subs)
                    // console.log("Observer observed something")
                    
                    if (mutation.target.innerText !== window.old_text) {
                        
                        // mutation.target.innerText gives us access to the subs (BOTH LINES!)
                        window.old_text = mutation.target.innerText;
                        window.cleared = 1;
                        console.log("Sub changed detected");

                        console.log(mutation.target.innerText);
                        
                        mySubs.innerHTML = mutation.target.innerText;
                        // this.disconnect()
                        // this.disconnect(); //stop observer so I can add subs without triggering this infinitely
                    }



                }

            }

            else if (window.on_off && mutation.type === 'attributes' && mutation.target.className === "player-timedtext" && mutation.target.firstChild && mutation.target.style.inset != window.old_inset) { //For adjusting subtitle style when window is resized

                //Netflix constantly refreshes the text so I have to constantly reapply them
                const caption_row = document.getElementsByClassName("player-timedtext")[0];
                var container_count = caption_row.childElementCount;
                if (container_count == 2) {
                    console.log("combine container")
                    // Why work around Netflix sometimes using a seperate container for each row when I can just force it back into using one.. wish I'd done this earlier
                    document.getElementsByClassName('player-timedtext-text-container')[0].firstChild.innerText = document.getElementsByClassName('player-timedtext-text-container')[0].firstChild.innerText + '\n ' + document.getElementsByClassName("player-timedtext-text-container")[1].firstChild.innerText;

                    //removes sub
                    const netflixElement = document.getElementsByClassName('player-timedtext-text-container')
                    netflixElement.remove();

                    // $('.player-timedtext-text-container')[1].remove();    
                    container_count = 0;
                }

            }
            
        }
        
    };

    window.observer = new MutationObserver(callback);
    window.observer.observe(timedtext,window.config);
} //end of createNewSubContainer function


