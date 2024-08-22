/// <reference types="@workadventure/iframe-api-typings" />

import { discussion } from "./utils/discussion";

console.info('Shaka contest script loaded...');
WA.onInit().then(() => {
    // Disabled controls for the contest
    WA.controls.disableRoomList();
    WA.controls.restoreRightClick();
    WA.controls.disablePlayerProximityMeeting();
    WA.controls.disableMapEditor();
    WA.controls.disableMicrophone();
    WA.controls.disableWebcam();

    new Start();
    new treasureEnigme();
    new SurfEnigme();
    new WaveEnigme();
    new Info1();
    new Info2();

    // Open invetory  
    WA.ui.website.open({
        url: `${discussion.rootLink}/views/inventory/inventory.html`,
        visible: true,
        position: {
          vertical: "bottom",
          horizontal: "right"
        },
        allowApi: true,
        size: {
          height: "240px",
          width: "100px"
        },
        margin: {
          bottom: "200px",
          right: "0px"
        }
      });

    console.info('Shaka contest script initialized...');
});


abstract class Enigme{
    constructor(private key: string){
        this.init();
    }
    init(){
        WA.room.area.onEnter(this.key).subscribe(() => this.onEnter());
        WA.room.area.onLeave(this.key).subscribe(() => this.onLeave());
    }

    resolve(){
        WA.player.state.saveVariable(this.key, true);
    }
    onEnter(){
        WA.controls.disablePlayerControls();
        discussion.openDiscussionWebsite(this.key, () => {
            this.resolve();
            this.onLeave();
        });
    }
    onLeave(){
        discussion.closeDiscussionWebsite();
        WA.controls.restorePlayerControls();
    }
}

class Start extends Enigme{
    constructor(){
        super("start");
    }

    init(){
        // Block the user
        WA.controls.disablePlayerControls();
        // When we load the map, we show the start discussion
        this.onEnter();
    }
    resolve(): void {
        WA.controls.restorePlayerControls();
    }
}

class Info1 extends Enigme{
    constructor(){
        super("info1");
    }
    resolve(){};
}

class Info2 extends Enigme{
    constructor(){
        super("info2");
    }
    resolve(){};
}

class treasureEnigme extends Enigme{
    constructor(){
        super("treasureEnigma");
    }
    resolve(){
        super.resolve();
        // Show the map with the treasure
        discussion.openModalByView("Biarritz Map", "treasureEnigma");
    }
}

class SurfEnigme extends Enigme{
    constructor(){
        super("surfEnigma");
    }
}

class WaveEnigme extends Enigme{
    constructor(){
        super("waveEnigma");
    }
    onEnter(){
        if(WA.player.state.surfEnigma == undefined || WA.player.state.surfEnigma == false){
            discussion.openDiscussionWebsite("noBoard");
            return;
        }
        super.onEnter();
    }
    resolve(){
        super.resolve();
        discussion.openModalByUrl(
            "SHAKA Contest form", 
            "https://docs.google.com/forms/d/e/1FAIpQLSeM4XTvLK-wLIocl8wcLoCcGu_mth-1qWfKwKZfewrrUGyIDg/viewform?embedded=true"
        );
    }
}