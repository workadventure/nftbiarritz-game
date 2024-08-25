/// <reference types="@workadventure/iframe-api-typings" />

document.addEventListener("DOMContentLoaded", () => {
    WA.onInit().then(async () => {
        // Get close button 
        const closeButton = document.getElementById('closeButton');
        if(closeButton){
            closeButton.addEventListener('click', () => {
                WA.event.broadcast('waveEnigma:closeModal', {});

                // Open new tab to show the form
                //WA.nav.openTab('https://docs.google.com/forms/d/e/1FAIpQLSeM4XTvLK-wLIocl8wcLoCcGu_mth-1qWfKwKZfewrrUGyIDg/viewform?embedded=true');
            });
        }
    });
});