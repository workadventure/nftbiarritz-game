/// <reference types="@workadventure/iframe-api-typings" />

document.addEventListener("DOMContentLoaded", () => {
    WA.onInit().then(async () => {
        displayImage((WA.player.state.treasureEnigma != undefined && WA.player.state.treasureEnigma == true), "treasureEnigma");
        displayImage((WA.player.state.surfEnigma != undefined && WA.player.state.surfEnigma == true), "surfEnigma");
        displayImage((WA.player.state.waveEnigma != undefined && WA.player.state.waveEnigma == true), "waveEnigma");
    });
});

const displayImage = (condition: boolean, keyElement: string) => {
    const koElement = document.getElementById(`${keyElement}-ko`) as HTMLImageElement;
    const okElement = document.getElementById(`${keyElement}-ok`) as HTMLImageElement;
    if(!okElement || !koElement) return;

    if(condition === true){
        koElement.style.display = "none";
        okElement.style.display = "block";
    }else{
        koElement.style.display = "block";
        okElement.style.display = "none";
    }
}