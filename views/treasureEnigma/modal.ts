/// <reference types="@workadventure/iframe-api-typings" />

document.addEventListener("DOMContentLoaded", () => {
    WA.onInit().then(async () => {
        // Get close button 
        const closeButton = document.getElementById('closeButton');
        if(closeButton){
            closeButton.addEventListener('click', () => {
                WA.ui.modal.closeModal();
            });
        }
    });
});