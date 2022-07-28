# Gaja ![logo](/icons/icon16.png)

Gaja is a chrome extension that helps you learn a new language just by watching your favorite shows!

***
## 📖 Table of Contents
- [Overview](#-overview)
- [Design](#-design)
- [Screenshots](#-screenshots)
- [Features](#-features)
- [How to use](#-how-to-use)
- [Development](#-development)
- [Team](#-team)
***
## 📝 Overview
Gaja was created by a team of language learners who wanted the ability to enhance the overall language learning experience. Through [Co.lab](https://www.joincolab.io), they created and [pitched](https://pitch.com/v/gaja-48ymb2) a product that could not only help them, but others as well!

Gaja is a Chrome extension that enables two different language subtitles to be displayed at the same time. What this means is that you can have one subtitle be your native language, and the second be language you are trying to learn!


Our landing page can be found [here](https://mailchi.mp/f9063425d3aa/gaja)
Our slides to our pitch can be found [here](https://pitch.com/v/gaja-fx3hh6)

## 🎨 Design
A link to our Figma product design can be found [here](https://www.figma.com/file/Aieb6PwV3zMtLbCo84cK3E/Gaja---Language-learning?node-id=851%3A2010).
Some features that have not yet been implemented can also be found on the Figma as well!

## 📺 Screenshots
A pitch of our product can be found [here]( https://pitch.com/v/gaja-48ymb2).

Slides [here](https://pitch.com/v/gaja-fx3hh6).

Our current deployment of Gaja looks like this.
(insert screenshot)

## ⚙️ Features
The Gaja team is proud to present you these current features!
Current features include: 
- [Dual subtitles](#dual-subtitles)
- [Subtitle resizing](#subtitle-resizing)

#### Dual Subtitles 
Dual subtitles allows a user to see their native language and the language they are trying to learn.

#### Subtitle resizing
Subtitle resizing allows users to resize the subtitles shown in their native langgauge to a size that would best work for them and their viewing needs.

### Other
Gaja hopes to further develop and implement other features that may help and enable users to improve their experience.
Theses inlcude:
- [Subtitle definitions](#subtitle-definitions)
- [Word saving](#word-saving)
- [Flash Cards](#flash-cards) 
- [Notifications](#notifications)

##### Subtitle Definitions
Subtitle definitions can be used to help users understand a word they are not fimiliar with.

##### Word Saving
This can help users go back to that word that they just can't seem to remember. A key to learning is remembering what a word means!

##### Flash Cards
This will allow users to quiz themselves out of the many words they have saved using the [word saving](#word-saving) feature.

##### Notifications
To help users remember to enable their dual subtitles. Practice makes perfect!

> The designs for some of these features and more can found in the Figma linked in the [design](#-design) section.

<!-- ### Features in development -->


## 📙 How to use
1. To get started, install the extension from the Chrome Web Store 📥.
<!-- (Add gif here) -->
 
2. Once you have Gaja installed should be able to see the Gaja icon ![logo](/icons/icon16.png) on your extension tab. You can pin it to your tab bar by clicking the pin 📌 button for easy access. 
<!-- (Add gif here) -->

3. Log on to Netflix and select your favorite show or movie 🎥. Go to the subtitle menu and select the language you are trying to learn.
<!-- (Add gif here) -->

4. After you have your subtitles enabled click on the Gaja icon ![logo](/icons/icon16.png). From the dropdown menu toggle the on or off ![logo](/icons/onButton2.png) button under dual subtitle. 
<!-- (Add gif here) -->

5. You should now be able to see two seperate subtitles. Right click 🖱 the new subtitle container and from the menu select translate to English.


That's it! 🎉 Easy right? You can customize your experience with other features from the Gaja dropdown!
Happy learning!🍿🎓

## 🔨 Development

Gaja's uses Html, CSS, and Javascript to get the job done 💪.

***
The popup contents can be found in the `popup.htlm` file. Here we create a form for user interaction.
```html
    <form id="popup-form" class="container"> 
```
This form holds the buttons and toggles for user interaction. Currently this form only houses a on / off switch and the size selection radio buttons.
***
The CSS to the popup window can be found in the `popup.css` file. This file is meant to only style the popup. This file does not do any subtitle modifications.
***
The script for the functionality of the popup window can be found in `background.js`. In here we add event listeners such as this
```js script
    chrome.runtime.onMessage.addListener()
```
to check for any user input on the form and set the default variables for `content.js` to use. We can set then set these variables using: 
```js script
    chrome.storage.sync.set()
```
which sets variable into chrome local storage. These vairables will then speak with our `content.js`.
***

Our `content.js` holds our meat and potatoes. In here we have our dual subtitle and font sizing functionality. 
To start, our file holds a listener to check any user changes which should have been toggled by `background.js`. Once a user activates the dual subtitles, our first mission is to create a new container for these subtitles in our
```js script
    // Creates a subtitle container
    function createNewSubContainer(){

        // Get Netflix's container returns it for refrence
        const timedtext = getNetflixContainer()

        // Style our subtitle container in a new function
        stylingContainer(divy, mySubs, timedtext);

        const callback = function (mutationsList, observer){
            // Observer information
        }

        // Our observer that uses the callback to run
        window.observer = new MutationObserver(callback);
        window.observer.observe(timedtext, window.config);
    }
```
We also need netflix's container for reference which we get using 
```js script
    function getNetflixContainer(){
        const netflixEl = "player-timedtext";
        const timedtext = document.getElementsByClassName(netflixEl)[0];

        // Set translate to no, that way both subtitles container don't translate to english
        timedtext.setAttribute('translate', 'no');
        return timedtext
    }
```
Setting the container attribute to no is important because it allows one subtitle container to remain the same while the other translates. Which leads us to the other function we call in our `createNewSubContainer()` function which is the `stylingContainer()` function. In here we style our new container using the netflix container as reference and we also style our p tag which exists in our new container.
```js script
    // Function to style our container, recieves our new div container, our p tag, and the netflix sub container
    function stylingContainer(newDiv, pTag, netflixTimedtext){
        // Set our subtitle container to be able to use right click translate feature by allowing it translate
        newDiv.setAttribute('translate', 'yes');
        
        // Style code in here
    }
```
Lastly in our `createNewSubContainer()` function we have our callback function that allows us to manage our container to any updates it observers from netflix's subtitle container.

## ⭐️ Team

Meet the Gaja ![image](/icons/icon16.png) Team!
| ![image](/icons/icon48.png)|![image](/icons/icon48.png)| ![image](/icons/icon48.png)| ![image](https://media-exp1.licdn.com/dms/image/C4D03AQGNYP-5COsuZQ/profile-displayphoto-shrink_800_800/0/1612807517282?e=1664409600&v=beta&t=9pJGmLBu8z8sPssiPSCRJcEzhnDMbe6M4pDHVvQH9aA)|
| :---: | :---: | :---: | :---: |
| **Taylor Joyce** | **Yovonne** | **Sophie** | **Jose Salazar Mendez** |
| *Product Manager* | *Product Designer* | *Developer* | *Developer* |
| <taylor@taylorjoyce.io> | <email@example.com>| <sophie1620@gmail.com>| <hose153@gmail.com>|
