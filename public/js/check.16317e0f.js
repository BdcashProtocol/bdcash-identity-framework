(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["check"],{"83d7":function(e,t,r){"use strict";r.r(t);var n=function(){var e=this,t=e.$createElement,r=e._self._c||t;return r("div",{staticClass:"home"},[r("div",{staticClass:"login-7 tab-box"},[!e.address&&e.showQR?r("div",{staticStyle:{position:"fixed",top:"0",background:"#000",left:"0",width:"100%",height:"100%","z-index":"999999999"}},[r("b-button",{staticStyle:{position:"absolute",top:"20px",right:"20px","z-index":"999"},attrs:{size:"is-small",type:"is-primary"},on:{click:e.closeScan}},[e._v("X")]),r("qrcode-stream",{on:{decode:e.onDecode}})],1):e._e(),e.address?e._e():r("div",[r("h1",[e._v("Check and identity")]),r("br"),r("p",[e._v("Use this function to scan an identity and verify if it's valid and matches the blockchain signature.")]),r("br"),r("br"),r("b-button",{attrs:{type:"is-primary"},on:{click:e.openScan}},[e._v("SCAN QR CODE")]),r("br"),r("hr"),r("br"),r("b-field",[r("b-upload",{attrs:{"drag-drop":""},on:{input:e.loadWalletFromFile},model:{value:e.file,callback:function(t){e.file=t},expression:"file"}},[r("section",{staticClass:"section"},[r("div",{staticClass:"content has-text-centered"},[r("p",[e._v("Drag and drop your .eid here or click to upload")])])])])],1)],1),e.address?r("div",[r("h1",[e._v("Digital identities of"),r("div",{staticStyle:{"font-size":"14px"}},[e._v(e._s(e.address))])]),r("br"),r("br"),r("p",[e._v("These informations are strictly confidentials, please don't share them with third parties.")]),r("div",{staticStyle:{border:"1px solid #ccc","text-align":"left",color:"#000","border-radius":"5px","margin-top":"20px","font-size":"12px",padding:"15px"}},[r("v-gravatar",{staticStyle:{float:"left",height:"55px","margin-right":"10px"},attrs:{email:e.address}}),r("strong",[e._v("LYRA ADDRESS")]),r("br"),e._v(" Created at block "),r("strong",[e._v(e._s(e.first_tx.blockheight))]),r("br"),e._v(" "+e._s(e.address.substr(0,6))+"..."+e._s(e.address.substr(-6))),r("br")],1),e._l(e.linked,(function(t){return r("div",{key:t.refID},[r("a",{attrs:{href:"https://proof.scryptachain.org/#/uuid/"+t.uuid,target:"_blank"}},[r("div",{staticStyle:{border:"1px solid #ccc","text-align":"left",color:"#000","border-radius":"5px","margin-top":"20px","font-size":"12px",padding:"15px"},on:{click:function(r){return e.revealID(t.refID)}}},[r("img",{staticStyle:{float:"left",height:"75px","margin-right":"10px"},attrs:{src:"/"+t.refID.toLowerCase()+".png"}}),r("strong",[e._v(e._s(t.refID))]),r("br"),e._v(e._s(t.identity.username)),r("br"),void 0!==t.identity.id?r("span",[e._v("ID: "+e._s(t.identity.id)),r("br")]):e._e(),e._v(" Written at block "),r("strong",[e._v(e._s(t.block))]),r("br"),e._v(" "+e._s(t.data.signature.substr(0,6))+" ... "+e._s(t.data.signature.substr(-6))+" ")])])])}))],2):e._e()])])},a=[],i=r("d557"),s=i["a"],o=(r("8cc4"),r("2877")),c=Object(o["a"])(s,n,a,!1,null,null,null);t["default"]=c.exports},"8cc4":function(e,t,r){"use strict";var n=r("ee60"),a=r.n(n);a.a},a640:function(e,t,r){"use strict";var n=r("d039");e.exports=function(e,t){var r=[][e];return!!r&&n((function(){r.call(null,t||function(){throw 1},1)}))}},ae40:function(e,t,r){var n=r("83ab"),a=r("d039"),i=r("5135"),s=Object.defineProperty,o={},c=function(e){throw e};e.exports=function(e,t){if(i(o,e))return o[e];t||(t={});var r=[][e],d=!!i(t,"ACCESSORS")&&t.ACCESSORS,u=i(t,0)?t[0]:c,l=i(t,1)?t[1]:void 0;return o[e]=!!r&&!a((function(){if(d&&!n)return!0;var e={length:-1};d?s(e,1,{enumerable:!0,get:c}):e[1]=1,r.call(e,u,l)}))}},c975:function(e,t,r){"use strict";var n=r("23e7"),a=r("4d64").indexOf,i=r("a640"),s=r("ae40"),o=[].indexOf,c=!!o&&1/[1].indexOf(1,-0)<0,d=i("indexOf"),u=s("indexOf",{ACCESSORS:!0,1:0});n({target:"Array",proto:!0,forced:c||!d||!u},{indexOf:function(e){return c?o.apply(this,arguments)||0:a(this,e,arguments.length>1?arguments[1]:void 0)}})},d557:function(e,t,r){"use strict";(function(e){r("c975"),r("d3b7"),r("ac1f"),r("25f0"),r("5319"),r("ddb0"),r("96cf");var n=r("1da1"),a=r("07c9"),i=r("bc3a"),s=r("470b");t["a"]={name:"Home",data:function(){return{scrypta:new a(!0),backendURL:"",address:"",showQR:!1,file:"",isWriting:!1,showSmsVerification:!1,showEmailVerification:!1,smsverification:"",emailverification:"",unlockPwd:"",showQRCanvas:!1,provider:"",first_tx:{},email:"",providers:[],phone:"",workingmessage:"",success:"",encrypted_wallet:"",public_qrcode:"",sync_qrcode:"",decrypted_wallet:"",linked:"",updated:"",axios:i,shareURL:"",payload:{identity:{username:"",id:""}}}},mounted:function(){var e=this;e.scrypta.staticnodes=!0},methods:{onDecode:function(t){var r=this;return Object(n["a"])(regeneratorRuntime.mark((function a(){var i,o,c,d,u;return regeneratorRuntime.wrap((function(a){while(1)switch(a.prev=a.next){case 0:i=r,o=t;while(-1!==o.indexOf("*"))o=o.replace("*","/");return c=JSON.parse(s.inflateSync(new e(o,"base64")).toString()),i.address=c.address,a.next=7,i.scrypta.get("/transactions/"+i.address);case 7:d=a.sent,u=d.data.length-1,i.first_tx=d.data[u],i.scrypta.post("/read",{protocol:"I://",address:c.address}).then(function(){var e=Object(n["a"])(regeneratorRuntime.mark((function e(t){var r,n,a,s,o,d,u,l;return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:for(n in r={},t.data)a=t.data[n],void 0===r[a.refID]&&(r[a.refID]=a);i.linked=[],e.t0=regeneratorRuntime.keys(c);case 4:if((e.t1=e.t0()).done){e.next=19;break}s=e.t1.value,o=c[s],e.t2=regeneratorRuntime.keys(r);case 8:if((e.t3=e.t2()).done){e.next=17;break}return d=e.t3.value,u=r[d],e.next=13,i.scrypta.verifyMessage(c.key,u.data.signature,JSON.stringify(o));case 13:l=e.sent,!1!==l&&l.address===c.address&&(u.identity=o.identity,i.linked.push(u)),e.next=8;break;case 17:e.next=4;break;case 19:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}());case 11:case"end":return a.stop()}}),a)})))()},openScan:function(){this.showQR=!0},closeScan:function(){this.showQR=!1},loadWalletFromFile:function(){var t=this,r=t.file,a=new FileReader;a.onload=function(){var r=a.result;t.$buefy.dialog.prompt({message:"Enter archive password",inputAttrs:{type:"password"},trapFocus:!0,onConfirm:function(){var a=Object(n["a"])(regeneratorRuntime.mark((function a(i){var o,c,d,u,l;return regeneratorRuntime.wrap((function(a){while(1)switch(a.prev=a.next){case 0:return a.next=2,t.scrypta.decryptData(r,i);case 2:if(o=a.sent,!1===o){a.next=16;break}c=o;while(-1!==c.indexOf("*"))c=c.replace("*","/");return d=JSON.parse(s.inflateSync(new e(c,"base64")).toString()),t.address=d.address,a.next=10,t.scrypta.get("/transactions/"+t.address);case 10:u=a.sent,l=u.data.length-1,t.first_tx=u.data[l],t.scrypta.post("/read",{protocol:"I://",address:t.address}).then(function(){var e=Object(n["a"])(regeneratorRuntime.mark((function e(r){var n,a,i,s,o,c,u,l;return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:for(a in n={},r.data)i=r.data[a],void 0===n[i.refID]&&(n[i.refID]=i);t.linked=[],e.t0=regeneratorRuntime.keys(d);case 4:if((e.t1=e.t0()).done){e.next=19;break}s=e.t1.value,o=d[s],e.t2=regeneratorRuntime.keys(n);case 8:if((e.t3=e.t2()).done){e.next=17;break}return c=e.t3.value,u=n[c],e.next=13,t.scrypta.verifyMessage(d.key,u.data.signature,JSON.stringify(o));case 13:l=e.sent,!1!==l&&l.address===d.address&&(u.identity=o.identity,t.linked.push(u)),e.next=8;break;case 17:e.next=4;break;case 19:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}()),a.next=17;break;case 16:t.$buefy.toast.open({message:"Wrong password!",type:"is-danger"});case 17:case"end":return a.stop()}}),a)})));function i(e){return a.apply(this,arguments)}return i}()})},a.readAsText(r)}}}}).call(this,r("b639").Buffer)},ee60:function(e,t,r){}}]);
//# sourceMappingURL=check.16317e0f.js.map