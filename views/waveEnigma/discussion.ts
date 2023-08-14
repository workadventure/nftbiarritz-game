/// <reference types="@workadventure/iframe-api-typings" />

document.addEventListener("DOMContentLoaded", () => {
    const key = "waveEnigma";
    WA.onInit().then(async () => {
        // Get close button 
        const closeButton = document.getElementById('closeButton');
        if(closeButton){
            closeButton.addEventListener('click', () => {
                WA.event.broadcast(`close-${key}`, {});
            });
        }
    });
});