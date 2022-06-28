changeSubtitleStyle = (vPos, fSize, fColor) => {
    // logging that our function works
    console.log("%cnetflix-subtitles-styler: obsvr working")

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