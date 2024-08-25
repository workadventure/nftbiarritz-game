import { CreateUIWebsiteEvent, UIWebsite } from "@workadventure/iframe-api-typings";
import { ModalEvent } from "@workadventure/iframe-api-typings/play/src/front/Api/Events/ModalEvent";
import {Subscription} from "rxjs";
class Discussion{
  private _rootLink: string;
  private uiWebSite?: UIWebsite;
  private subscriptions: Map<string, Subscription>;

  constructor(){
    const prodRootLink = "https://workadventure.github.io/nftbiarritz-game/"
    const devRootLink = 'http://localhost:5173';
    this._rootLink = process.env.NODE_ENV === 'production' ? prodRootLink : devRootLink;
    this.subscriptions = new Map();
  }

  async openDiscussionWebsite(view: string, callbackWhenClosed: Function|null = null){
    const website: CreateUIWebsiteEvent = {
      url: `${this.rootLink}/views/${view}/discussion.html`,
      visible: true,
      position: {
        vertical: "bottom",
        horizontal: "middle"
      },
      allowApi: true,
      size: {
        height: "120px",
        width: "100%"
      },
      margin: {
        bottom: "80px",
        left: "10px",
        right: "10px"
      }
    }
    

    // Open iframe
    this.uiWebSite = await WA.ui.website.open(website);

    // Event to close the website
    // Manage subscription
    if(this.subscriptions.has(`close-${view}`)) this.subscriptions.get(`close-${view}`)?.unsubscribe();
    this.subscriptions.set(`close-${view}`,
      WA.event.on(`close-${view}`).subscribe(() => {
        if(this.uiWebSite)this.uiWebSite.close();
        if(callbackWhenClosed) callbackWhenClosed(this.uiWebSite);
        this.uiWebSite = undefined;
      })
    );
  }

  closeDiscussionWebsite(view: string){
    // Unsuscribe to the event
    if(this.subscriptions.has(`close-${view}`)) this.subscriptions.get(`close-${view}`)?.unsubscribe();

    if(this.uiWebSite)this.uiWebSite.close();
    this.uiWebSite = undefined;
  }

  openModalByView(title: string, view: string, closeCallback?: (arg: ModalEvent) => void){
    WA.ui.modal.openModal({
          title: title,
          src: `${this.rootLink}/views/${view}/modal.html`,
          allowApi: true,
          allow: "fullscreen;camera;microphone",
          position: "center",
      }, 
      closeCallback
    );
  }

  openModalByUrl(title: string, url: string, closeCallback?: (arg: ModalEvent) => void){
    WA.ui.modal.openModal({
          title: title,
          src: url,
          allowApi: true,
          allow: "fullscreen;camera;microphone",
          position: "center",
      }, 
      closeCallback
    );
  }

  get rootLink(){
    return this._rootLink;
  }
}

export const discussion = new Discussion();
