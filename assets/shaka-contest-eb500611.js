var c=Object.defineProperty;var a=(i,s,e)=>s in i?c(i,s,{enumerable:!0,configurable:!0,writable:!0,value:e}):i[s]=e;var n=(i,s,e)=>(a(i,typeof s!="symbol"?s+"":s,e),e);class u{constructor(){n(this,"_rootLink");n(this,"uiWebSite");n(this,"subscriptions");const s="https://workadventure.github.io/nftbiarritz-game/";this._rootLink=s,this.subscriptions=new Map}async openDiscussionWebsite(s,e=null){var l;const r={url:`${this.rootLink}/views/${s}/discussion.html`,visible:!0,position:{vertical:"bottom",horizontal:"middle"},allowApi:!0,size:{height:"120px",width:"100%"},margin:{bottom:"80px",left:"10px",right:"10px"}};this.uiWebSite=await WA.ui.website.open(r),this.subscriptions.has(`close-${s}`)&&((l=this.subscriptions.get(`close-${s}`))==null||l.unsubscribe()),this.subscriptions.set(`close-${s}`,WA.event.on(`close-${s}`).subscribe(()=>{this.uiWebSite&&this.uiWebSite.close(),e&&e(this.uiWebSite),this.uiWebSite=void 0}))}closeDiscussionWebsite(s){var e;this.subscriptions.has(`close-${s}`)&&((e=this.subscriptions.get(`close-${s}`))==null||e.unsubscribe()),this.uiWebSite&&this.uiWebSite.close(),this.uiWebSite=void 0}openModalByView(s,e,r){WA.ui.modal.openModal({title:s,src:`${this.rootLink}/views/${e}/modal.html`,allowApi:!0,allow:"fullscreen;camera;microphone",position:"center"},r)}openModalByUrl(s,e,r){WA.ui.modal.openModal({title:s,src:e,allowApi:!0,allow:"fullscreen;camera;microphone",position:"center"},r)}get rootLink(){return this._rootLink}}const o=new u;console.info("Shaka contest script loaded...");WA.onInit().then(()=>{WA.controls.disableRoomList(),WA.controls.restoreRightClick(),WA.controls.disablePlayerProximityMeeting(),WA.controls.disableMicrophone(),WA.controls.disableWebcam(),new p,new m,new d,new W,new h,new b,new v,WA.ui.website.open({url:`${o.rootLink}/views/inventory/inventory.html`,visible:!0,position:{vertical:"bottom",horizontal:"right"},allowApi:!0,size:{height:"240px",width:"100px"},margin:{bottom:"200px",right:"0px"}}),console.info("Shaka contest script initialized...")});class t{constructor(s){n(this,"subscriptions");this.key=s,this.init(),this.subscriptions=[]}init(){this.subscriptions||(this.subscriptions=[]),this.subscriptions.push(WA.room.area.onEnter(this.key).subscribe(()=>this.onEnter())),this.subscriptions.push(WA.room.area.onLeave(this.key).subscribe(()=>this.onLeave()))}resolve(){WA.player.state.saveVariable(this.key,!0)}onEnter(){this._disablePlayerControls(),this._openDisucssion()}onLeave(){o.closeDiscussionWebsite(this.key),WA.controls.restorePlayerControls(),this.subscriptions.forEach(s=>s.unsubscribe())}_disablePlayerControls(){WA.controls.disablePlayerControls()}_openDisucssion(){o.openDiscussionWebsite(this.key,()=>{this.resolve(),this.onLeave()})}}class p extends t{constructor(){super("start")}init(){WA.controls.disablePlayerControls(),this.onEnter()}resolve(){WA.controls.restorePlayerControls()}}class h extends t{constructor(){super("info1")}onEnter(){this._openDisucssion()}resolve(){}}class b extends t{constructor(){super("info2")}onEnter(){this._openDisucssion()}resolve(){}}class m extends t{constructor(){super("treasureEnigma")}resolve(){super.resolve(),o.openModalByView("Biarritz Map","treasureEnigma")}}class d extends t{constructor(){super("surfEnigma")}}class W extends t{constructor(){super("waveEnigma");n(this,"timeToOpenForm",100)}onEnter(){if(WA.player.state.surfEnigma==null||WA.player.state.surfEnigma==!1){o.openDiscussionWebsite("noBoard");return}super.onEnter()}resolve(){super.resolve(),o.openModalByView("Biarritz Wave","waveEnigma",()=>{this.openForm()}),WA.event.on("waveEnigma:closeModal").subscribe(()=>{setTimeout(()=>{this.openForm()},this.timeToOpenForm),WA.ui.modal.closeModal()})}openForm(){setTimeout(()=>{o.openModalByUrl("SHAKA Contest form","https://docs.google.com/forms/d/e/1FAIpQLSeM4XTvLK-wLIocl8wcLoCcGu_mth-1qWfKwKZfewrrUGyIDg/viewform?embedded=true")},this.timeToOpenForm)}}class v extends t{constructor(){super("quit")}onEnter(){this._openDisucssion()}resolve(){}}
