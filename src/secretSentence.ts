/// <reference types="@workadventure/iframe-api-typings" />

import { Popup } from "@workadventure/iframe-api-typings";

console.info('Script secret sentence started successfully');

let words = new Set([
    "word1",
    "word2",
    "word3",
    "word4",
    "word5",
    "word6",
]);

interface Sentance{
    word1: boolean,
    word2: boolean,
    word3: boolean,
    word4: boolean,
    word5: boolean,
    word6: boolean,
}

let formPopup: Popup|undefined = undefined;
let nonExit1Popup: Popup|undefined = undefined;
let nonExit2Popup: Popup|undefined = undefined;
let timeOutIndice: NodeJS.Timeout|undefined;
let timeOutIndiceEverySecond: NodeJS.Timeout|undefined;
let lastIndice = "noindice";
let isOpenSecretSentenceWebsite = false;

// Waiting for the API to be ready
WA.onInit().then(() => {
    const url = new URL(WA.room.mapURL);

    // disable player controls
    WA.controls.disablePlayerControls();

    // open rules of the game
    WA.ui.modal.openModal({
        title: "The game rules",
        src: `${url.protocol}//${url.host}${url.protocol === 'https:' ? "/nftbiarritz-game/" : '/'}secretSentence/rules.html`,
        allowApi: true,
        allow: "microphone; camera",
        position: "center",
    }, () => {
        initGame(url);
        WA.ui.modal.closeModal();
        getIndiceEverySecond();
        WA.ui.actionBar.removeButton("start");
    });

    // add start button
    WA.ui.actionBar.addButton({
        id: "start",
        label: "Let's go!",
        callback: () => {
            initGame(url);
            WA.ui.modal.closeModal();
            getIndiceEverySecond();
            WA.ui.actionBar.removeButton("start");
        }
    });
});

// function to init the game
function initGame(url: URL){
    // active player controls
    WA.controls.restorePlayerControls();
    
    // add secret sentence button
    WA.ui.actionBar.addButton({
        id: "secrect-sentence",
        type: "action",
        imageSrc: `${url.protocol}//${url.host}${url.protocol === 'https:' ? "/nftbiarritz-game/" : '/'}secretSentence/images/key-white.svg`,
        toolTip: "The secret sentence",
        callback: () => {
            if(isOpenSecretSentenceWebsite){
                WA.ui.modal.closeModal();
                isOpenSecretSentenceWebsite = false;
                return;
            }

            const wordsFound = Object.keys(WA.player.state.sentance as Sentance).filter((word) => {
                // @ts-ignore
                return (WA.player.state.sentance as Sentance)[word] === true;
            });
            WA.ui.modal.openModal({
                title: "Review secret sentence 👀",
                src: `${url.protocol}//${url.host}${url.protocol === 'https:' ? "/nftbiarritz-game/" : '/'}secretSentence/review.html?lastIndice=${lastIndice}&words=${wordsFound.join(",")}`,
                allowApi: true,
                allow: "microphone; camera",
                position: "center",
            }, () => {
                WA.ui.modal.closeModal();
                isOpenSecretSentenceWebsite = false;
            });
            isOpenSecretSentenceWebsite = true;
        }
    });

    // init user state
    if(!WA.player.state.sentance){
        WA.player.state.sentance = {
            word1: false,
            word2: false,
            word3: false,
            word4: false,
            word5: false,
            word6: false,
        };
    }

    // init user interaction
    for(const word of [...words.keys()]){
        WA.room.area.onEnter(word).subscribe(() => {
            console.info(`You fin the word ${word}!`);
            // @ts-ignore
            if((WA.player.state.sentance as Sentance)[word] === true) return;
            // @ts-ignore
            (WA.player.state.sentance as Sentance)[word] = true;
            const wordsFound = Object.keys(WA.player.state.sentance as Sentance).filter((word) => {
                // @ts-ignore
                return (WA.player.state.sentance as Sentance)[word] === true;
            });
            WA.ui.modal.openModal({
                title: "Congarts, you found an object 🎉",
                src: `${url.protocol}//${url.host}${url.protocol === 'https:' ? "/nftbiarritz-game/" : '/'}secretSentence/index.html?current=${word}&words=${wordsFound.join(",")}`,
                allowApi: true,
                allow: "microphone; camera",
                position: "center",
            }, () => {
                getIndiceEverySecond();
                WA.ui.modal.closeModal();
            });
            lastIndice = "noindice";
            stopIndiceEverySecond();
            WA.ui.banner.closeBanner();
        });
    }

    WA.room.area.onEnter('form').subscribe(() => {
        if(
            (WA.player.state.sentance as Sentance).word1 && 
            (WA.player.state.sentance as Sentance).word2 && 
            (WA.player.state.sentance as Sentance).word3 && 
            (WA.player.state.sentance as Sentance).word4 && 
            (WA.player.state.sentance as Sentance).word5 && 
            (WA.player.state.sentance as Sentance).word6
        ){
            stopIndiceEverySecond();
            formPopup = WA.ui.openPopup("formPopup", "Congarts you found the secret sentance 🎉🎉", [
                {
                    label: "Get your NFT",
                    className: "primary",
                    callback: (popup => {
                        // go to form
                        WA.ui.modal.openModal({
                            title: "Get your NFT",
                            src: "https://blocksurvey.io/nftbiarritz-2023-VCYczIDFT2qN2NkIyoF99A-o",
                            allowApi: true,
                            allow: "microphone; camera",
                            position: "center",
                        }, () => {
                            WA.ui.modal.closeModal();
                        });
                        popup.close();
                        formPopup = undefined;
                    })
                }
            ]);
        }else{
            formPopup = WA.ui.openPopup("formPopup", "You are missing words to access the form 😭😭\n\rAs we are very nice, an index will appear 💪", [
                {
                    label: "Continue",
                    className: "primary",
                    callback: (popup => {
                        popup.close();
                        formPopup = undefined;
                    })
                }
            ]);
            if(timeOutIndice){
                clearTimeout(timeOutIndice);
            }
            timeOutIndice = setTimeout(() => {
                WA.ui.banner.openBanner({
                    id: "indice",
                    bgColor: "#1c1c29",
                    textColor: "#ffffff",
                    text: `Your new clue : ${getIndice(true)}`,
                    closable: true,
                });
            }, 1000);
        }
    });

    WA.room.area.onLeave('form').subscribe(() => {
        if(formPopup !== undefined){
            formPopup.close();
            formPopup = undefined;
        }
        WA.ui.modal.closeModal();
    });

    WA.room.area.onEnter('noneExit1').subscribe(() => {
        nonExit1Popup = WA.ui.openPopup("noneExit1Popup", "Hop hop hop... ou vas-tu ?! ", [
            {
                label: "Continue",
                className: "primary",
                callback: (popup => {
                    popup.close();
                    nonExit1Popup = undefined;
                })
            }
        ])
    });
    WA.room.area.onLeave('noneExit1').subscribe(() => {
        nonExit1Popup?.close();
    });

    WA.room.area.onEnter('noneExit2').subscribe(() => {
        nonExit2Popup = WA.ui.openPopup("noneExit2Popup", "Hop hop hop... ou vas-tu ?!", [
            {
                label: "Continue",
                className: "primary",
                callback: (popup => {
                    popup.close();
                    nonExit2Popup = undefined;
                })
            }
        ])
    });
    WA.room.area.onLeave('noneExit2').subscribe(() => {
        nonExit2Popup?.close();
    });
}

// function to get an indice every 20 seconds
function stopIndiceEverySecond(){
    if(timeOutIndiceEverySecond){
        clearTimeout(timeOutIndiceEverySecond);
    }
}
function getIndiceEverySecond(){
    if(timeOutIndiceEverySecond){
        clearTimeout(timeOutIndiceEverySecond);
    }
    timeOutIndiceEverySecond = setTimeout(() => {
        const indice = getIndice();
        if(indice != undefined){
            WA.ui.banner.openBanner({
                id: "indice",
                bgColor: "#1c1c29",
                textColor: "#ffffff",
                text: `Ton indice : ${indice}`,
                closable: true,
            });
        }
        return getIndiceEverySecond();
    }, 20000);
}

function getIndice(force = false): string|undefined{
    if(
        (WA.player.state.sentance as Sentance).word1 === false && 
        (lastIndice != "word1" || force)
    ){
        lastIndice = "word1";
        return "Do you like chess games with the captain on the deck?";
    }
    if(
        (WA.player.state.sentance as Sentance).word1 && 
        (WA.player.state.sentance as Sentance).word2 === false && 
        (lastIndice != "word2" || force)
    ){
        lastIndice = "word2";
        return "You will discover a certain taste for hunting in the hold!";
    }
    if(
        (WA.player.state.sentance as Sentance).word1 && 
        (WA.player.state.sentance as Sentance).word2 && 
        (WA.player.state.sentance as Sentance).word3 === false && 
        (lastIndice != "word3" || force)
    ){
        lastIndice = "word3";
        return "A treasure is in plain sight!";
    }
    if(
        (WA.player.state.sentance as Sentance).word1 && 
        (WA.player.state.sentance as Sentance).word2 && 
        (WA.player.state.sentance as Sentance).word3 && 
        (WA.player.state.sentance as Sentance).word4 === false && 
        (lastIndice != "word4" || force)
    ){
        lastIndice = "word4";
        return "Well hidden, you have to venture into the darkest corners of the hold!";
    }
    if(
        (WA.player.state.sentance as Sentance).word1 && 
        (WA.player.state.sentance as Sentance).word2 && 
        (WA.player.state.sentance as Sentance).word3 && 
        (WA.player.state.sentance as Sentance).word4 && 
        (WA.player.state.sentance as Sentance).word5 === false && 
        (lastIndice != "word5" || force)
    ){
        lastIndice = "word5";
        return "Have you ever seen the captain's apartments and the treasure it contains?"
    }
    if(
        (WA.player.state.sentance as Sentance).word1 && 
        (WA.player.state.sentance as Sentance).word2 && 
        (WA.player.state.sentance as Sentance).word3 && 
        (WA.player.state.sentance as Sentance).word4 && 
        (WA.player.state.sentance as Sentance).word5 && 
        (WA.player.state.sentance as Sentance).word6 === false && 
        (lastIndice != "word6" || force)
    ){
        lastIndice = "word6";
        return "A boat, a captain, a treasure, a secret path, a deserted island ... You can say a prayer there!"
    }
    if(
        (WA.player.state.sentance as Sentance).word1 && 
        (WA.player.state.sentance as Sentance).word2 && 
        (WA.player.state.sentance as Sentance).word3 && 
        (WA.player.state.sentance as Sentance).word4 && 
        (WA.player.state.sentance as Sentance).word5 && 
        (WA.player.state.sentance as Sentance).word6 && 
        lastIndice != "form"
    ){
        lastIndice != "form";
        return "The end is near!";
    }
    return;
}

export {};
