(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["share"],{c9ae:function(e,t,r){},e5c6:function(e,t,r){"use strict";r("c9ae")},f7b2:function(e,t,r){"use strict";(function(e){var a=r("1da1"),i=(r("ac1f"),r("5319"),r("d3b7"),r("25f0"),r("e9c4"),r("ddb0"),r("3ca3"),r("2b3d"),r("9861"),r("96cf"),r("db88")),n=r("bc3a"),s=r("470b");t["a"]={name:"Home",data:function(){return{bdcash:new i(!0),backendURL:"",address:"",file:"",isWriting:!1,showSmsVerification:!1,showEmailVerification:!1,smsverification:"",emailverification:"",unlockPwd:"",showQRCanvas:!1,provider:"",first_tx:{},email:"",providers:[],phone:"",workingmessage:"",success:"",encrypted_wallet:"",public_qrcode:"",sync_qrcode:"",decrypted_wallet:"",linked:"",updated:"",axios:n,shareURL:"",payload:{identity:{username:"",id:""}}}},mounted:function(){var e=this;return Object(a["a"])(regeneratorRuntime.mark((function t(){var r;return regeneratorRuntime.wrap((function(t){while(1)switch(t.prev=t.next){case 0:r=e,r.bdcash.staticnodes=!0,r.checkIdentity();case 3:case"end":return t.stop()}}),t)})))()},methods:{checkIdentity:function(){var t=this;return Object(a["a"])(regeneratorRuntime.mark((function r(){var i,n,d,o,c;return regeneratorRuntime.wrap((function(r){while(1)switch(r.prev=r.next){case 0:i=t,n=i.$route.params.identity;while(-1!==n.indexOf("*"))n=n.replace("*","/");return d=JSON.parse(s.inflateSync(new e(n,"base64")).toString()),i.address=d.address,r.next=7,i.bdcash.get("/transactions/"+i.address);case 7:o=r.sent,c=o.data.length-1,i.first_tx=o.data[c],i.bdcash.post("/read",{protocol:"I://",address:d.address}).then(function(){var e=Object(a["a"])(regeneratorRuntime.mark((function e(t){var r,a,n,s,o,c,l,u;return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:for(a in r={},t.data)n=t.data[a],void 0===r[n.refID]&&(r[n.refID]=n);i.linked=[],e.t0=regeneratorRuntime.keys(d);case 4:if((e.t1=e.t0()).done){e.next=19;break}s=e.t1.value,o=d[s],e.t2=regeneratorRuntime.keys(r);case 8:if((e.t3=e.t2()).done){e.next=17;break}return c=e.t3.value,l=r[c],e.next=13,i.bdcash.verifyMessage(d.key,l.data.signature,JSON.stringify(o));case 13:u=e.sent,!1!==u&&u.address===d.address&&(l.identity=o.identity,i.linked.push(l)),e.next=8;break;case 17:e.next=4;break;case 19:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}());case 11:case"end":return r.stop()}}),r)})))()},storeCredentials:function(){var e=this;e.$buefy.dialog.prompt({message:"Enter a strong password to encrypt the file",inputAttrs:{type:"password"},trapFocus:!0,onConfirm:function(){var t=Object(a["a"])(regeneratorRuntime.mark((function t(r){var a,i,n,s;return regeneratorRuntime.wrap((function(t){while(1)switch(t.prev=t.next){case 0:return t.next=2,e.bdcash.cryptData(e.$route.params.identity,r);case 2:a=t.sent,i=document.getElementById("downloadid"),n=new Blob([a],{type:"eid"}),i.href=URL.createObjectURL(n),i.download=e.address+".eid",s=new MouseEvent("click",{view:window,bubbles:!0,cancelable:!1}),i.dispatchEvent(s);case 9:case"end":return t.stop()}}),t)})));function r(e){return t.apply(this,arguments)}return r}()})}}}}).call(this,r("b639").Buffer)},fbd8:function(e,t,r){"use strict";r.r(t);var a=function(){var e=this,t=e.$createElement,r=e._self._c||t;return r("div",{staticClass:"home"},[r("div",{staticClass:"login-7 tab-box"},[r("h1",[e._v("Digital identities of"),r("div",{staticStyle:{"font-size":"14px"}},[e._v(e._s(e.address))])]),r("br"),r("p",[e._v("These informations are strictly confidentials, please don't share the link with third parties.")]),r("div",{staticStyle:{border:"1px solid #ccc","text-align":"left",color:"#000","border-radius":"5px","margin-top":"20px","font-size":"12px",padding:"15px"}},[r("v-gravatar",{staticStyle:{float:"left",height:"55px","margin-right":"10px"},attrs:{email:e.address}}),r("strong",[e._v("BDCASH ADDRESS")]),r("br"),e._v(" Created at block "),r("strong",[e._v(e._s(e.first_tx.blockheight))]),r("br"),e._v(" "+e._s(e.address.substr(0,6))+"..."+e._s(e.address.substr(-6))),r("br")],1),e._l(e.linked,(function(t){return r("div",{key:t.refID},[r("a",{attrs:{href:"https://proof.bdcashprotocol.com/#/uuid/"+t.uuid,target:"_blank"}},[r("div",{staticStyle:{border:"1px solid #ccc","text-align":"left",color:"#000","border-radius":"5px","margin-top":"20px","font-size":"12px",padding:"15px"}},[r("img",{staticStyle:{float:"left",height:"75px","margin-right":"10px"},attrs:{src:"/"+t.refID.toLowerCase()+".png"}}),r("strong",[e._v(e._s(t.refID))]),void 0!==t.identity.username&&""!==t.identity.username?r("span",[r("br"),e._v(e._s(t.identity.username)),r("br")]):e._e(),void 0!==t.identity.id&&""!==t.identity.id?r("span",[e._v("ID: "+e._s(t.identity.id)),r("br")]):e._e(),e._v(" Written at block "),r("strong",[e._v(e._s(t.block))]),r("br"),e._v(" "+e._s(t.data.signature.substr(0,6))+" ... "+e._s(t.data.signature.substr(-6))+" "),"EID"===t.refID?r("div",[r("div",{staticStyle:{display:"inline-block"}},[r("b",[e._v("SUBJECT")]),e._v(": "+e._s(t.identity.payload.subject)),r("br"),r("b",[e._v("eID NUMBER")]),e._v(": "+e._s(t.identity.payload.id_number)),r("br"),r("b",[e._v("NAME")]),e._v(": "+e._s(t.identity.payload.name)),r("br"),r("b",[e._v("SURNAME")]),e._v(": "+e._s(t.identity.payload.surname)),r("br"),r("b",[e._v("ISSUED BY")]),e._v(": "+e._s(t.identity.payload.issuer)),r("br"),r("b",[e._v("OFFICE")]),e._v(": "+e._s(t.identity.payload.office)),r("br"),r("b",[e._v("COUNTRY")]),e._v(": "+e._s(t.identity.payload.country)),r("br"),r("b",[e._v("P7M HASH")]),e._v(": "+e._s(t.identity.payload.p7mhash)),r("br")])]):e._e()])])])})),r("br"),r("br"),r("a",{staticStyle:{display:"none"},attrs:{id:"downloadid"}}),r("b-button",{attrs:{size:"is-large",type:"is-primary"},on:{click:e.storeCredentials}},[e._v("STORE CREDENTIALS")])],2)])},i=[],n=r("f7b2"),s=n["a"],d=(r("e5c6"),r("2877")),o=Object(d["a"])(s,a,i,!1,null,null,null);t["default"]=o.exports}}]);
//# sourceMappingURL=share.44fccd5e.js.map