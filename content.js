chrome.runtime.onMessage.addListener((message, _sender, _sendResponse) => {
    // createNewSubContainer();
    changeSubtitle(message.vSubtitle, message.vDefinition, message.small, message.medium, message.large);
})

changeSubtitle = (vSubtitle, vDefinition, small, medium, large) => {
    // logging that our function works
    console.log("%cnetflix-subtitles: obsvr working")

    // getting access to the subtitles
    const textContainer = document.querySelector('.player-timedtext-text-container');
    // const textContainerSpan1 = textContainer.firstChild;
    // const textContainerSpan2 = textContainerSpan1.firstChild;
    // const subs = textContainerSpan2.innerText;``
    
    console.log(textContainer.innerHTML); 
    // within the two spans that live in the textContainer, we need to access the subtitles
    
    


    // we need to make a callback that tracks all changes within the textContainer
    const callback = function(mutationsList, observer){ //Observes original text box for changes
        
        for (const mutation of mutationsList){

            console.log(mutation);

            if (mutation.type === 'childList' && mutation.target.className && mutation.target.className==="player-timedtext"){ //track removal/addition to subtitle container 
                if (mutation.addedNodes.length===1){ //If added rather than removed..
                    if (mutation.target.innerText!==window.old_text){ 
                        //I added this functionality last but it's much better than the clear flag, eventually i'll make this the only way to trigger a sub update,
                        //but for now I'll just make it support the current clear flag functionality

                        window.old_text=mutation.target.innerText;
                        window.cleared=1;
                        //console.log("Sub changed detected");
                    }
                    this.disconnect(); //stop observer so I can add subs without triggering this infinitely
                    addSubs(timedtext); //add subs   
                }
                else{
                    if (mutation.target.childElementCount===0){ //No children means the mutation was a subtitle CLEAR rather than refresh, double check necessary because refresh would make it here as well but with children (..i think? I forget at this point)    
                        window.cleared=1;
                        document.getElementsByClassName('my-timedtext-container')[0].innerText = "";
                        window.last_subs="";
                    }
                }
            }
            
            else if(window.on_off && mutation.type==='attributes' && mutation.target.className==="player-timedtext" && mutation.target.firstChild && mutation.target.style.inset != window.old_inset){ //For adjusting subtitle style when window is resized
                    //Netflix constantly refreshes the text so I have to constantly reapply them
                    const caption_row = document.getElementsByClassName("player-timedtext")[0];
                    var container_count = caption_row.childElementCount;
                    if (container_count == 2){ // Why work around Netflix sometimes using a seperate container for each row when I can just force it back into using one.. wish I'd done this earlier
                        document.getElementsByClassName('player-timedtext-text-container')[0].firstChild.innerText= document.getElementsByClassName('player-timedtext-text-container')[0].firstChild.innerText + '\n '+ document.getElementsByClassName("player-timedtext-text-container")[1].firstChild.innerText;
                        $('.player-timedtext-text-container')[1].remove();    
                        container_count=0;
                    }

                    window.baseFont = parseFloat(mutation.target.firstChild.firstChild.firstChild.style.fontSize.replace('px','')); //font size changes way more often than on nrk so will take basefont after every clear instead (if inset updates, update this as well)
                    window.current_size = window.baseFont*window.current_multiplier+'px';
                    update_style('font_size');


                    if (window.original_text_side == 0){
                        window.original_subs_placement = parseInt(document.getElementsByClassName("player-timedtext")[0].getBoundingClientRect().x)+ (parseInt(document.getElementsByClassName("player-timedtext")[0].getBoundingClientRect().width)*.025);
                        var sub_dist = (parseInt(document.getElementsByClassName("player-timedtext")[0].firstChild.getBoundingClientRect().width)+(window.original_subs_placement)+10);
                        window.my_timedtext_element.style['left']=sub_dist+'px';

                    }
                    else{
                        window.original_subs_placement = parseInt(my_timedtext_element.getBoundingClientRect().x)+ parseInt(my_timedtext_element.getBoundingClientRect().width);
                        var sub_dist = (window.original_subs_placement)+10 - parseInt(document.getElementsByClassName("player-timedtext")[0].getBoundingClientRect().x);
                        document.getElementsByClassName("player-timedtext")[0].firstChild.style['left']=sub_dist+'px';
                    }

                
            }
            
        }
    };

    window.observer = new MutationObserver(callback);
    window.observer.observe(textContainer, {
        childList: true, 
        subtree: true
    });

}




// function createNewSubContainer(){

//     let elements = document.getElementsByTagName("*");

//     //idk
//     for(let id = 0; id < elements.length; ++id) {
//         elements[id].addEventListener('contextmenu',function(e){e.stopPropagation()},true);
//             elements[id].oncontextmenu = null;
//     }

//     //create container
//     const videoContainer = document.querySelector('.watch-video');
//     const div = document.createElement('div');
//     div.className = "my-timed-text-container"
//     videoContainer.appendChild(div);

// }