/// <reference types="@workadventure/iframe-api-typings" />

document.addEventListener("DOMContentLoaded", () => {
    const key = "info2";
    WA.onInit().then(async () => {
        // Get the avatar and replace by the avatar of the user
        WA.player.getWokaPicture().then((wokaPicture) => {
            const avatarElement = document.getElementById('avatar') as HTMLImageElement;
            if(avatarElement){
                avatarElement.src = wokaPicture;
            }
        });

        // Get close button 
        const closeButton = document.getElementById('closeButton');
        if(closeButton){
            closeButton.addEventListener('click', () => {
                WA.event.broadcast(`close-${key}`, {});
            });
        }

        // Get quit button
        const quitButton = document.getElementById('quitButton');
        if(quitButton){
            quitButton.addEventListener('click', () => {
                WA.nav.goToRoom("/@/tcm/workadventure/shaka-biarritz-2024#contest");
            });
        }
    });
});