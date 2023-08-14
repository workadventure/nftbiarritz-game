/// <reference types="@workadventure/iframe-api-typings" />

document.addEventListener("DOMContentLoaded", () => {
    WA.onInit().then(async () => {
        const key = "treasureEnigma";
        // Get close button 
        const closeButton = document.getElementById('closeButton');
        if(closeButton){
            closeButton.addEventListener('click', () => {
                WA.event.broadcast(`close-${key}`, {});
            });
        }
    });
});