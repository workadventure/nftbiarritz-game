/// <reference types="@workadventure/iframe-api-typings" />

import { discussion } from "./utils/discussion";
import { Subscription } from "rxjs";

console.info('Shaka contest script loaded...');
WA.onInit().then(() => {
    // Disable tutotial
    WA.player.state.tutorialDone = true;

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
    new QuitEnigma();

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
    protected subscriptions: Subscription[];
    constructor(private key: string){
        this.init();
        this.subscriptions = [];
    }
    init(){
        if(!this.subscriptions) this.subscriptions = [];
        this.subscriptions.push(WA.room.area.onEnter(this.key).subscribe(() => this.onEnter()));
        this.subscriptions.push(WA.room.area.onLeave(this.key).subscribe(() => this.onLeave()));
    }

    resolve(){
        WA.player.state.saveVariable(this.key, true);
    }
    onEnter(){
        this._disablePlayerControls();
        this._openDisucssion();
    }
    onLeave(){
        discussion.closeDiscussionWebsite(this.key);
        WA.controls.restorePlayerControls();
        this.subscriptions.forEach(subscription => subscription.unsubscribe());
    }

    _disablePlayerControls(){
        WA.controls.disablePlayerControls();
    }
    _openDisucssion(){
        discussion.openDiscussionWebsite(this.key, () => {
            this.resolve();
            this.onLeave();
        });
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
    // Override the onEnter method to keep enable the player controls
    onEnter(){
        this._openDisucssion();
    }
    resolve(){};
}

class Info2 extends Enigme{
    constructor(){
        super("info2");
    }
    // Override the onEnter method to keep enable the player controls
    onEnter(){
        this._openDisucssion();
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
    private timeToOpenForm: number = 100;
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
        discussion.openModalByView("Biarritz Wave", "waveEnigma", () => {
            this.openForm();
        });

            WA.event.on("waveEnigma:closeModal").subscribe(() => {
                setTimeout(() => {
                    this.openForm();
                }, this.timeToOpenForm);
                WA.ui.modal.closeModal();
            })
    }

    private openForm(){
        setTimeout(() => {
            discussion.openModalByUrl(
                "SHAKA Contest form", 
                "https://docs.google.com/forms/d/e/1FAIpQLSeM4XTvLK-wLIocl8wcLoCcGu_mth-1qWfKwKZfewrrUGyIDg/viewform?embedded=true"
            );
        }, this.timeToOpenForm);
    }
}

class QuitEnigma extends Enigme{
    constructor(){
        super("quit");
    }
    // Override the onEnter method to keep enable the player controls
    onEnter(){
        this._openDisucssion();
    }
    resolve(){};
}
