var a=Object.defineProperty;var c=(i,e,s)=>e in i?a(i,e,{enumerable:!0,configurable:!0,writable:!0,value:s}):i[e]=s;var o=(i,e,s)=>(c(i,typeof e!="symbol"?e+"":e,s),s);class l{constructor(){o(this,"rootLink");o(this,"uiWebSite");const e="https://workadventure.github.io/nftbiarritz-game/";this.rootLink=e}async openDiscussionWebsite(e,s=null){const r={url:`${this.rootLink}/views/${e}/discussion.html`,visible:!0,position:{vertical:"bottom",horizontal:"middle"},allowApi:!0,size:{height:"120px",width:"100%"},margin:{bottom:"80px",left:"10px",right:"10px"}};this.uiWebSite=await WA.ui.website.open(r),WA.event.on(`close-${e}`).subscribe(()=>{this.uiWebSite&&this.uiWebSite.close(),s&&s(this.uiWebSite),this.uiWebSite=void 0})}closeDiscussionWebsite(){this.uiWebSite&&this.uiWebSite.close(),this.uiWebSite=void 0}openModal(e,s){WA.ui.modal.openModal({title:e,src:`${this.rootLink}/views/${s}/modal.html`,allowApi:!0,allow:"fullscreen;camera;microphone",position:"center"})}}const n=new l;console.info("Shaka contest script loaded...");WA.onInit().then(()=>{WA.controls.disableRoomList(),WA.controls.restoreRightClick(),WA.controls.disablePlayerProximityMeeting(),WA.controls.disableMapEditor(),WA.controls.disableMicrophone(),WA.controls.disableWebcam(),new b,new p,new d,new u,new h,console.info("Shaka contest script initialized...")});class t{constructor(e){this.key=e,this.init()}init(){WA.room.area.onEnter(this.key).subscribe(()=>this.onEnter()),WA.room.area.onLeave(this.key).subscribe(()=>this.onLeave())}resolve(){WA.player.state.saveVariable(this.key,!0)}onEnter(){n.openDiscussionWebsite(this.key,()=>{this.resolve(),this.onLeave()})}onLeave(){n.closeDiscussionWebsite()}}class u extends t{constructor(){super("info1")}}class h extends t{constructor(){super("info2")}}class b extends t{constructor(){super("treasureEnigma")}resolve(){super.resolve(),n.openModal("Biarritz Map","treasureEnigma")}}class p extends t{constructor(){super("surfEnigma")}}class d extends t{constructor(){super("waveEnigma")}resolve(){super.resolve()}}
