/// <reference types="@workadventure/iframe-api-typings" />

document.addEventListener("DOMContentLoaded", () => {
    const key = "info1";
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
    });
});