# Gaja ![logo](/icons/icon16.png)

Gaja is a chrome extension that helps you learn a new language just by watching your favorite shows!

***
## 📖 Table of Contents
- [Overview](#overview)
- [Design](#design)
- [Screenshots](#screenshots)
- [Features](#features)
- [How to use](#how)
- [Development](#development)
- [Team](#team)
***
## 📝 Overview {#overview}
Gaja was created by a team of language learners who wanted the ability to enhace they way they could learn. Through [Co.lab](https://www.joincolab.io), they created and [pitched](https://pitch.com/v/gaja-fx3hh6) a product that could not only help them, but others as well!

Gaja is a chrome extension that adds the functionality to have seperate subtitles at the same time. What this means is that you can have one subtitle be your native language, and the second be a language you are trying to learn!

> Visit the landing page for more information [here](https://mailchi.mp/f9063425d3aa/gaja).

## 🎨 Design {#design}
A link to our figma product design can be found [here](https://www.figma.com/file/Aieb6PwV3zMtLbCo84cK3E/Gaja---Language-learning?node-id=851%3A2010).
Some features that have not yet been implemented can also be found on the figma as well.

## 📺 Screenshots {#screenshots}
A pitch of our product can be found [here]( https://pitch.com/v/gaja-48ymb2).

Slides [here](https://pitch.com/v/gaja-fx3hh6).

Our current deployment of Gaja looks like this.
(insert screenshot)

## ⚙️ Features {#features}
The gaja team is proud to presesnt you these current live features!
Current features include: 
- [Dual subtitles](#dual)
- [Subtitle resizing](#resize)

#### Dual Subtitles {#dual}
Dual subtitles allows a user to see their native language and the language they are trying to learn.

#### Subtitle resizing {#resize}
Subtitle resizing allows a user to resize their subtitles if they might be to big or too small for their screen.

### Other
Gaja hopes to further develop and implement other features that may help and enable users to improve their experience.
Theses inlcude:
- [Subtitle definitions](#sub)
- [Word saving](#word)
- [Flash Cards](#flash) 
- [Notifications](#notif)

##### Subtitle Definitions {#sub}
Subtitle definitions can be used to help a user understand a word they are not fimiliar with.

##### Word Saving {#word}
This can help a user go back to that word that they just can't seem to remember. A key to learning is remembering what a word means!

##### Flash Cards {#flash}
This will allow a user to quiz themselves out of the many words they have saved using the [word saving](#word) feature.

##### Notifications {#notif}
To help users remember to enable their dual subtitles. Practice makes perfect!

> The designs for some of these features and more can found in the figma linked in the [design](#design) section.

<!-- ### Features in development -->


## 📙 How to use {#how}
1. To get started, install the extension from the chrome web store 📥.
(Add gif here)
 
2. Once you have gaja installed should be able to see the gaja icon ![logo](/icons/icon16.png) on your extension tab. You can pin it to your tab bar by clicking the pin 📌 button for easy access. 
(Add gif here)

3. Log on to netflix and select your favorite show or movie 🎥. Go to the subtitle menu and select the language you are trying to learn.
(Add gif here)

4. After you have your subtitles enabled click on the Gaja icon ![logo](/icons/icon16.png). From the dropdown menu toggle the on off ![logo](/icons/onButton2.png) button under dual subtitle. 
(Add gif here)

5. You should now be able to see two seperate subtitles. Right click 🖱 the new subtitle container and from the menu select translate to english.
(Add gif here)

That is it! 🎉 Easy right? You can customize your experience with other features from the gaja dropdown!
Happy learning!🍿🎓

## 🔨 Development {#development}

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
```js script
    // Function to style our container, recieves our new div container, our p tag, and the netflix sub container
    function stylingContainer(newDiv, pTag, netflixTimedtext){
        // Set our subtitle container to be able to use right click translate feature by allowing it translate
        newDiv.setAttribute('translate', 'yes');
        
        // Style code in here
    }
```

## ⭐️ Team {#team}

Meet the Gaja ![image](/icons/icon16.png) Team!
| ![image](/icons/icon48.png)|![image](/icons/icon48.png)| ![image](/icons/icon48.png)| ![image](https://scontent-sjc3-1.xx.fbcdn.net/v/t1.6435-9/192444196_2075868239228294_8536051389295001423_n.jpg?_nc_cat=104&ccb=1-7&_nc_sid=09cbfe&_nc_ohc=K4Q1auipGPMAX9UL7cj&_nc_ht=scontent-sjc3-1.xx&oh=00_AT8t9uUnJka_oOYKw56r0mMJSFi55ztTzr74tt3rrIObiQ&oe=6308A205)|
| :---: | :---: | :---: | :---: |
| **Jay** | **Yovonne** | **Sophie** | **Jose Salazar Mendez** |
| *Product Manager* | *Product Designer* | *Developer* | *Developer* |
| <email@example.com> | <email@example.com>| <email@example.com>| <hose153@gmail.com>|
