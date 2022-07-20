chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {

    console.log('the on/off button has been interacted with!', request.message);
    
    if (request.message === "update_on_off" || request.message === "update_font_size") {

        // subElement();
        // console.log('hello! I work!');
        createNewSubContainer()
    }
        // // trying to get access to the font_size value that's been saved onto chrome.storage and changing it to be the user's chosen setting
        // chrome.storage.sync.get('font_size', function (data) {
        //         console.log("Stored font value is: ", data.font_size);

                // subSize = data.font_size;
                // changeSubSize(data.font_size);
        // };

    // console.log('hello');
    // // createNewSubContainer();
});



// subElement = () => {
//     // console.log('observer working');
//     callback = () => {
//         // console.log('hi, subElement observer is working!')
//         const textContainer = document.querySelector('.player-timedtext-text-container');
//         const textContainerSpan = textContainer.firstChild;
//         const textContainerSpan1 = textContainerSpan.firstChild;
//         const textContainerSpan2 = textContainerSpan1.nextSibling;

//         const subsLine1 = textContainerSpan1.innerText;
//         // const subsLine2 = textContainerSpan2.innerText;

//         // textContainerSpan1.style.color = "red";

//         // can't seem to get all the subtitle text to show up consistently=
//         console.log(subsLine1);
//         // console.log("hi", subsLine2);
//         // if (textContainerSpan1 && textContainerSpan2) {
//         //     console.log(subsLine1, subsLine2);
//         // } else if (subsLine1) {
//         // console.log(subsLine1);
//         // } 
//     }
    
//     const subContainer = document.querySelector(".player-timedtext");
//     window.observer = new MutationObserver(callback);
//     window.observer.observe(subContainer, {
//         childList: true,
//         attributes: false,
//         // attributeFilter: ["style"],
//         subtree: true 
//     });
// }



const gettingFormSettings = function(setting) {
    chrome.storage.sync.get(setting, function(data) {
        if (setting === "font_size") {
            window.font_size = data[setting];
        }
    })
}


// // function for updating subtitle size
// const changeSubSize = function(fontSize) {
//     // getting access to the subtitles
//     const windowTextContainer = document.querySelector('.player-timedtext');

//     textContainer = windowTextContainer.querySelectorAll('span')

//     // const textContainer = windowTextContainer.querySelectorAll('.player-timedtext-text-container');
//     // const textContainerSpan1 = textContainer.querySelector('span');
//     // const textContainerSpan2 = textContainerSpan1.querySelector('span');
//     // const subs = textContainerSpan2.innerText;

//     // console.log(subs.innerHTML);

//     textContainer.style.fontSize = `${fontSize}px`;

//     // textContainerSpan1.style.fontSize = `${fontSize}px`;
//     // textContainerSpan2.style.fontSize = `${fontSize}px`;

// }



function createNewSubContainer(){

    const id = "player-timedtext";
    const timedtext = document.getElementsByClassName(id)[0];

    timedtext.setAttribute('translate', 'no');

    // //create container
    const videoContainer = document.querySelector('.watch-video');
    const divy = document.createElement('div');
    divy.className = "my-timed-text-container";

    divy.setAttribute('translate', 'yes');

    videoContainer.appendChild(divy);
    
    const mySubs = document.createElement('p');

    divy.appendChild(mySubs);
    
    // p.innerHTML = "hello world"

    // changing default styling of p tag
    mySubs.style.margin = "0"

    // styling for divy element
    divy.style.width = "100vw"
    divy.style.display = "block"
    divy.style.whiteSpace = "pre-wrap"
    divy.style.textAlign = "center"
    divy.style.position = "absolute"
    divy.style.border = "10px solid yellow"
    divy.style.fontSize = "50px"
    divy.style.top = "80px"
    divy.style.height = "100px";
    

    console.log("Container working")


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
                        //I added this functionality last but it's much better than the clear flag, eventually i'll make this the only way to trigger a sub update,
                        //but for now I'll just make it support the current clear flag functionality
                        
                        // mutation.target.innerText gives us access to the subs (BOTH LINES!)
                        window.old_text = mutation.target.innerText;
                        window.cleared = 1;
                        console.log("Sub changed detected");

                        console.log(mutation.target.innerText);
                        
                        mySubs.innerHTML = mutation.target.innerText;

                        // this.disconnect(); //stop observer so I can add subs without triggering this infinitely
                    }



                }
                // else{

                //     // if (mutation.target.childElementCount===0){ //No children means the mutation was a subtitle CLEAR rather than refresh, double check necessary because refresh would make it here as well but with children (..i think? I forget at this point)

                //     //     window.cleared=1;
                //     //     // document.getElementsByClassName('my-timedtext-container')[0].innerText = "";
                //     //     // window.last_subs="";


                //     // }
                //     //window.my_timedtext_element.innerText = "";

                // }

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


                // window.baseFont = parseFloat(mutation.target.firstChild.firstChild.firstChild.style.fontSize.replace('px','')); //font size changes way more often than on nrk so will take basefont after every clear instead (if inset updates, update this as well)
                // window.current_size = window.baseFont*window.current_multiplier+'px';
                // update_style('font_size');
                //update_style('originaltext_opacity');
                //update_style('originaltext_color');


                if (window.original_text_side == 0) {

                    console.log("0");
                    // Match sub placement data and applies it to my timed text container
                    window.original_subs_placement = parseInt(document.getElementsByClassName("player-timedtext")[0].getBoundingClientRect().x) + (parseInt(document.getElementsByClassName("player-timedtext")[0].getBoundingClientRect().width) * .025);
                    var sub_dist = (parseInt(document.getElementsByClassName("player-timedtext")[0].firstChild.getBoundingClientRect().width) + (window.original_subs_placement) + 10);
                    window.my_timedtext_element.style['left'] = sub_dist + 'px';

                }
                else {
                    console.log("1");
                    // Matches my timed text container ???
                    window.original_subs_placement = parseInt(my_timedtext_element.getBoundingClientRect().x) + parseInt(my_timedtext_element.getBoundingClientRect().width);
                    var sub_dist = (window.original_subs_placement) + 10 - parseInt(document.getElementsByClassName("player-timedtext")[0].getBoundingClientRect().x);
                    document.getElementsByClassName("player-timedtext")[0].firstChild.style['left'] = sub_dist + 'px';
                }


            }
            
        }
        
    };

    window.observer = new MutationObserver(callback);
    window.observer.observe(timedtext,window.config);
} //end of createNewSubContainer function




// function createNewSubContainer(){

//     // we need to make a callback that tracks all changes within the textContainer
//     const callback = function (mutationsList, observer) { //Observes original text box for changes

//         for (const mutation of mutationsList) {

//             console.log(mutation);

//             if (mutation.type === 'childList' && mutation.target.className && mutation.target.className === "player-timedtext") { //track removal/addition to subtitle container 
//                 if (mutation.addedNodes.length === 1) { //If added rather than removed..
//                     if (mutation.target.innerText !== window.old_text) {
//                         //I added this functionality last but it's much better than the clear flag, eventually i'll make this the only way to trigger a sub update,
//                         //but for now I'll just make it support the current clear flag functionality

//                         window.old_text = mutation.target.innerText;
//                         window.cleared = 1;
//                         //console.log("Sub changed detected");
//                     }
//                     this.disconnect(); //stop observer so I can add subs without triggering this infinitely
//                     addSubs(timedtext); //add subs   
//                 }
//                 else {
//                     if (mutation.target.childElementCount === 0) { //No children means the mutation was a subtitle CLEAR rather than refresh, double check necessary because refresh would make it here as well but with children (..i think? I forget at this point)    
//                         window.cleared = 1;
//                         document.getElementsByClassName('my-timedtext-container')[0].innerText = "";
//                         window.last_subs = "";
//                     }
//                 }
//             }

//             else if (window.on_off && mutation.type === 'attributes' && mutation.target.className === "player-timedtext" && mutation.target.firstChild && mutation.target.style.inset != window.old_inset) { //For adjusting subtitle style when window is resized
//                 //Netflix constantly refreshes the text so I have to constantly reapply them
//                 const caption_row = document.getElementsByClassName("player-timedtext")[0];
//                 var container_count = caption_row.childElementCount;
//                 if (container_count == 2) { // Why work around Netflix sometimes using a seperate container for each row when I can just force it back into using one.. wish I'd done this earlier
//                     document.getElementsByClassName('player-timedtext-text-container')[0].firstChild.innerText = document.getElementsByClassName('player-timedtext-text-container')[0].firstChild.innerText + '\n ' + document.getElementsByClassName("player-timedtext-text-container")[1].firstChild.innerText;
//                     $('.player-timedtext-text-container')[1].remove();
//                     container_count = 0;
//                 }

//                 window.baseFont = parseFloat(mutation.target.firstChild.firstChild.firstChild.style.fontSize.replace('px', '')); //font size changes way more often than on nrk so will take basefont after every clear instead (if inset updates, update this as well)
//                 window.current_size = window.baseFont * window.current_multiplier + 'px';
//                 update_style('font_size');


//     var elements = document.getElementsByTagName("*");
//     for(var id = 0; id < elements.length; ++id) { elements[id].addEventListener('contextmenu',function(e){e.stopPropagation()},true);elements[id].oncontextmenu = null; }

//     //Pull Original Sub Container
//     var id = "player-timedtext";
//     const timedtext = document.getElementsByClassName(id)[0]; //Original Container

//     //My container creation my-timedtext-container

//     // $(".my-timedtext-container").remove(); // should actually do this after video exit rather than before video start since it will fix the text lingering a bit on exit

//     // $(".watch-video").append(`<div class='my-timedtext-container' style='display: block; white-space: pre-wrap; text-align: center; position: absolute; font-size:21px;line-height:normal;font-weight:normal;color:#ffffff;text-shadow:#000000 0px 0px 7px;font-family:Netflix Sans,Helvetica Nueue,Helvetica,Arial,sans-serif;font-weight:bolder'><span id=my_subs_innertext></span></div>`)
//     window.my_timedtext_element= document.getElementsByClassName('my-timedtext-container')[0];
    
//     my_timedtext_element.setAttribute('translate','yes');

//     window.last_subs = '';

    
//     //For Placement
//     window.old_inset = timedtext.style.inset;
//     window.original_subs_placement = parseInt(document.getElementsByClassName("player-timedtext")[0].getBoundingClientRect().width)*.025; //Original text is placed at Left:5%, using .right on original subs wasn't consistent

//     window.cleared=1; //Only takes new subs on clear, necessary because subs are constantly refreshed 

//     window.config = { attributes: true, childList: true, subtree:true,attributeFilter: [ "style"]};

//     window.old_text = "";

//     // const callback = function(mutationsList, observer){ //Observes original text box for changes
//     //     for (const mutation of mutationsList){
//     //         if (mutation.type === 'childList' && mutation.target.className && mutation.target.className==="player-timedtext"){ //track removal/addition to subtitle container
                
//     //             if (mutation.addedNodes.length===1){ //If added rather than removed..

//     //                 if (mutation.target.innerText!==window.old_text){ 
//     //                     //I added this functionality last but it's much better than the clear flag, eventually i'll make this the only way to trigger a sub update,
//     //                     //but for now I'll just make it support the current clear flag functionality

//     //                     window.old_text=mutation.target.innerText;
//     //                     window.cleared=1;
//     //                     //console.log("Sub changed detected");

//     //                 }

//     //                 this.disconnect(); //stop observer so I can add subs without triggering this infinitely
//     //                 addSubs(timedtext); //add subs
                    
//     //             }
//     //             else{
                
//     //                 if (mutation.target.childElementCount===0){ //No children means the mutation was a subtitle CLEAR rather than refresh, double check necessary because refresh would make it here as well but with children (..i think? I forget at this point)
                        
//     //                     window.cleared=1;
//     //                     document.getElementsByClassName('my-timedtext-container')[0].innerText = "";
//     //                     window.last_subs="";
                        

//     //                 }
//     //                 //window.my_timedtext_element.innerText = "";
                    
//     //             }
                
                
//     //         }
            
//     //         else if(window.on_off && mutation.type==='attributes' && mutation.target.className==="player-timedtext" && mutation.target.firstChild && mutation.target.style.inset != window.old_inset){ //For adjusting subtitle style when window is resized
//     //                 //Netflix constantly refreshes the text so I have to constantly reapply them

//     //                 const caption_row = document.getElementsByClassName("player-timedtext")[0];
//     //                 var container_count = caption_row.childElementCount;
//     //                 if (container_count == 2){ // Why work around Netflix sometimes using a seperate container for each row when I can just force it back into using one.. wish I'd done this earlier
//     //                     document.getElementsByClassName('player-timedtext-text-container')[0].firstChild.innerText= document.getElementsByClassName('player-timedtext-text-container')[0].firstChild.innerText + '\n '+ document.getElementsByClassName("player-timedtext-text-container")[1].firstChild.innerText;
//     //                     $('.player-timedtext-text-container')[1].remove();    
//     //                     container_count=0;
//     //                 }


//     //                 window.baseFont = parseFloat(mutation.target.firstChild.firstChild.firstChild.style.fontSize.replace('px','')); //font size changes way more often than on nrk so will take basefont after every clear instead (if inset updates, update this as well)
//     //                 window.current_size = window.baseFont*window.current_multiplier+'px';
//     //                 update_style('font_size');
//     //                 //update_style('originaltext_opacity');
//     //                 //update_style('originaltext_color');
                    

//     //                 if (window.original_text_side == 0){
//     //                     window.original_subs_placement = parseInt(document.getElementsByClassName("player-timedtext")[0].getBoundingClientRect().x)+ (parseInt(document.getElementsByClassName("player-timedtext")[0].getBoundingClientRect().width)*.025);
//     //                     var sub_dist = (parseInt(document.getElementsByClassName("player-timedtext")[0].firstChild.getBoundingClientRect().width)+(window.original_subs_placement)+10);
//     //                     window.my_timedtext_element.style['left']=sub_dist+'px';

//     //                 }
//     //                 else{
//     //                     window.original_subs_placement = parseInt(my_timedtext_element.getBoundingClientRect().x)+ parseInt(my_timedtext_element.getBoundingClientRect().width);
//     //                     var sub_dist = (window.original_subs_placement)+10 - parseInt(document.getElementsByClassName("player-timedtext")[0].getBoundingClientRect().x);
//     //                     document.getElementsByClassName("player-timedtext")[0].firstChild.style['left']=sub_dist+'px';
//     //                 }

                
//     //         }
            
//     //     }
//     // };

//     window.observer = new MutationObserver(callback);
//     window.observer.observe(timedtext,window.config);

//     }



////////////********* code from another example **********////////////

// changeSubtitle = (vSubtitle, vDefinition, small, medium, large) => {
//     // logging that our function works
//     console.log("%cnetflix-subtitles: obsvr working")

//     // getting access to the subtitles
//     const textContainer = document.querySelector('.player-timedtext-text-container');
//     // const textContainerSpan1 = textContainer.firstChild;
//     // const textContainerSpan2 = textContainerSpan1.firstChild;
//     // const subs = textContainerSpan2.innerText;``

//     console.log(textContainer.innerHTML);
//     // within the two spans that live in the textContainer, we need to access the subtitles
    //window.observer = new MutationObserver(callback);
    //window.observer.observe(timedtext,window.config);

//}

//     console.log(textContainer.innerHTML);
//     // within the two spans that live in the textContainer, we need to access the subtitles


//                 if (window.original_text_side == 0) {
//                     window.original_subs_placement = parseInt(document.getElementsByClassName("player-timedtext")[0].getBoundingClientRect().x) + (parseInt(document.getElementsByClassName("player-timedtext")[0].getBoundingClientRect().width) * .025);
//                     var sub_dist = (parseInt(document.getElementsByClassName("player-timedtext")[0].firstChild.getBoundingClientRect().width) + (window.original_subs_placement) + 10);
//                     window.my_timedtext_element.style['left'] = sub_dist + 'px';

//                 }
//                 else {
//                     window.original_subs_placement = parseInt(my_timedtext_element.getBoundingClientRect().x) + parseInt(my_timedtext_element.getBoundingClientRect().width);
//                     var sub_dist = (window.original_subs_placement) + 10 - parseInt(document.getElementsByClassName("player-timedtext")[0].getBoundingClientRect().x);
//                     document.getElementsByClassName("player-timedtext")[0].firstChild.style['left'] = sub_dist + 'px';
//                 }


//             }

//         }
//     };

    

// }




//     // we need to make a callback that tracks all changes within the textContainer
//     const callback = function (mutationsList, observer) { //Observes original text box for changes

//         for (const mutation of mutationsList) {

//             console.log(mutation);

//             if (mutation.type === 'childList' && mutation.target.className && mutation.target.className === "player-timedtext") { //track removal/addition to subtitle container 
//                 if (mutation.addedNodes.length === 1) { //If added rather than removed..
//                     if (mutation.target.innerText !== window.old_text) {
//                         //I added this functionality last but it's much better than the clear flag, eventually i'll make this the only way to trigger a sub update,
//                         //but for now I'll just make it support the current clear flag functionality


//                         window.old_text = mutation.target.innerText;
//                         window.cleared = 1;
//                         //console.log("Sub changed detected");
//                     }
//                     this.disconnect(); //stop observer so I can add subs without triggering this infinitely
//                     // addSubs(timedtext); //add subs   
//                 }
//                 else {
//                     if (mutation.target.childElementCount === 0) { //No children means the mutation was a subtitle CLEAR rather than refresh, double check necessary because refresh would make it here as well but with children (..i think? I forget at this point)    
//                         window.cleared = 1;
//                         document.getElementsByClassName('my-timedtext-container')[0].innerText = "";
//                         window.last_subs = "";
//                     }
//                 }
//             }

//             else if (window.on_off && mutation.type === 'attributes' && mutation.target.className === "player-timedtext" && mutation.target.firstChild && mutation.target.style.inset != window.old_inset) { //For adjusting subtitle style when window is resized
//                 //Netflix constantly refreshes the text so I have to constantly reapply them
//                 const caption_row = document.getElementsByClassName("player-timedtext")[0];
//                 var container_count = caption_row.childElementCount;
//                 if (container_count == 2) { // Why work around Netflix sometimes using a seperate container for each row when I can just force it back into using one.. wish I'd done this earlier
//                     document.getElementsByClassName('player-timedtext-text-container')[0].firstChild.innerText = document.getElementsByClassName('player-timedtext-text-container')[0].firstChild.innerText + '\n ' + document.getElementsByClassName("player-timedtext-text-container")[1].firstChild.innerText;
//                     $('.player-timedtext-text-container')[1].remove();
//                     container_count = 0;
//                 }

//                 window.baseFont = parseFloat(mutation.target.firstChild.firstChild.firstChild.style.fontSize.replace('px', '')); //font size changes way more often than on nrk so will take basefont after every clear instead (if inset updates, update this as well)
//                 window.current_size = window.baseFont * window.current_multiplier + 'px';
//                 update_style('font_size');


//                 if (window.original_text_side == 0) {
//                     window.original_subs_placement = parseInt(document.getElementsByClassName("player-timedtext")[0].getBoundingClientRect().x) + (parseInt(document.getElementsByClassName("player-timedtext")[0].getBoundingClientRect().width) * .025);
//                     var sub_dist = (parseInt(document.getElementsByClassName("player-timedtext")[0].firstChild.getBoundingClientRect().width) + (window.original_subs_placement) + 10);
//                     window.my_timedtext_element.style['left'] = sub_dist + 'px';

//                 }
//                 else {
//                     window.original_subs_placement = parseInt(my_timedtext_element.getBoundingClientRect().x) + parseInt(my_timedtext_element.getBoundingClientRect().width);
//                     var sub_dist = (window.original_subs_placement) + 10 - parseInt(document.getElementsByClassName("player-timedtext")[0].getBoundingClientRect().x);
//                     document.getElementsByClassName("player-timedtext")[0].firstChild.style['left'] = sub_dist + 'px';
//                 }


//             }

//         }
//     };

//     window.observer = new MutationObserver(callback);
//     window.observer.observe(textContainer, {
//         childList: true,
//         subtree: true
//     });

// }
