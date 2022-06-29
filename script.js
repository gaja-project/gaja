chrome.runtime.onMessage.addListener((message, _sender, _sendResponse) => {
    changeSubtitleStyle(message.vPos, message.fSize, message.fColor);
}) 

changeSubtitleStyle = (vPos, fSize, fColor) => {
    // logging that our function works
    console.log("%cnetflix-subtitles-styler: obsvr working")

    // getting access to the subtitles
    const textContainer = document.querySelector('.player-timedtext-text-container');
    const textContainerSpan1 = textContainer.firstChild;
    const textContainerSpan2 = textContainerSpan1.firstChild;
    const subs = textContainerSpan2.innerText;
    
    console.log(subs);

    // to do: need to rewrite the popup.html and popup.js so that when the submit button is clicked, then the extension remains on for the entire duration ~ change the eventListener so that it continuously monitors the subs
    // Create a function that listens to when the there is a mouseover event in the textContainerSpan2
        // consult Yvonne to ask if we should make it a toggle button?
        // 

    callback = () => {
        // grabs subtitle data from nextflix
        const subtitles = document.querySelector(".player-timedtext");
        
        // styles the location of subtitles
        if (subtitles) {
            subtitles.style.bottom = vPos + "px";
        }
        console.log(subtitles.data);

        const observer = new MutationObserver(callback);
        observer.observer(document.body, {
            subtree: true,
            attributes: false,
            childList: true
        })
    }
}