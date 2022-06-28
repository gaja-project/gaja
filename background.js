chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.local.set({ vPos: 300, fSize: 24, fColor: "#FFFFFF" });

    chrome.declarativeContent.onPageChanged.removeRules(undefined, () => {
        chrome.declarativeContent.onPageChanged.addRules([
            // array with rules
            {
                conditions: [
                    new chrome.declarativeContent.PageStateMatcher({
                        pageUrl: { hostSuffix: "netflix.com" }
                    })
                ], 
                actions: [ new chrome.declarativeContent.ShowPageAction()]
            }


        ]);
    });
});