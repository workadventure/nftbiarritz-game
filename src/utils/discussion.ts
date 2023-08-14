import { CreateUIWebsiteEvent, UIWebsite } from "@workadventure/iframe-api-typings";

class Discussion{
  private _rootLink: string;
  private uiWebSite?: UIWebsite;
  constructor(){
    const prodRootLink = "https://workadventure.github.io/nftbiarritz-game/"
    const devRootLink = 'http://localhost:5173';
    this._rootLink = process.env.NODE_ENV === 'production' ? prodRootLink : devRootLink;
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
    WA.event.on(`close-${view}`).subscribe(() => {
      if(this.uiWebSite)this.uiWebSite.close();
      if(callbackWhenClosed) callbackWhenClosed(this.uiWebSite);
      this.uiWebSite = undefined;
    });
  }

  closeDiscussionWebsite(){
    if(this.uiWebSite)this.uiWebSite.close();
    this.uiWebSite = undefined;
  }

  openModalByView(title: string, view: string){
    WA.ui.modal.openModal({
        title: title,
        src: `${this.rootLink}/views/${view}/modal.html`,
        allowApi: true,
        allow: "fullscreen;camera;microphone",
        position: "center",
    });
  }

  openModalByUrl(title: string, url: string){
    WA.ui.modal.openModal({
        title: title,
        src: url,
        allowApi: true,
        allow: "fullscreen;camera;microphone",
        position: "center",
    });
  }

  get rootLink(){
    return this._rootLink;
  }
}

export const discussion = new Discussion();
