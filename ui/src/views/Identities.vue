<template>
  <div class="home">
    <div class="login-7 tab-box">
      <h1>Your Digital Identity</h1>
      <div v-if="isLoading"><br>Loading informations from the blockchain...</div>
      <div v-if="!isLoading && Object.keys(identities).length === 0">
        <br>These are your <b>public</b> informations:
        <div style="border:1px solid #ccc; text-align:left; color:#000; border-radius:5px; margin-top:20px; font-size:12px; padding:15px">
            <v-gravatar :email="address" style="float:left; height:55px; margin-right:10px;" />
            <strong>LYRA ADDRESS</strong><br>
            Created at block <strong>{{ first_tx.blockheight }}</strong><br>
            {{ address.substr(0,6) }}...{{ address.substr(-6) }}<br>
        </div>
      </div>
      
      <div v-if="linked.length > 0">
        <div v-if="!showQRCanvas">
          <br>These are your <b>private</b> informations, share it only with trusted parties:
          <div style="border:1px solid #ccc; text-align:left; color:#000; border-radius:5px; margin-top:20px; font-size:12px; padding:15px">
              <v-gravatar :email="address" style="float:left; height:55px; margin-right:10px;" />
              <strong>LYRA ADDRESS</strong><br>
              Created at block <strong>{{ first_tx.blockheight }}</strong><br>
              {{ address.substr(0,6) }}...{{ address.substr(-6) }}<br>
          </div>
          <div v-for="id in linked" v-bind:key="id.refID">
              <a :href="'https://proof.scryptachain.org/#/uuid/' + id.uuid" target="_blank">
                <div style="border:1px solid #ccc; text-align:left; color:#000; border-radius:5px; margin-top:20px; font-size:12px; padding:15px">
                    <img :src = "'/' + id.refID.toLowerCase() + '.png'" style="float:left; height:75px; margin-right:10px;" />
                    <strong>{{ id.refID }}</strong>
                    <span v-if="id.identity.username !== undefined && id.identity.username !== ''"><br>{{ id.identity.username }}<br></span>
                    <span v-if="id.identity.id !== undefined && id.identity.id !== ''">ID: {{ id.identity.id }}<br></span>
                    Written at block <strong>{{ id.block }}</strong><br>
                    {{ id.data.signature.substr(0,6) }} ... {{ id.data.signature.substr(-6) }}
                    <div v-if="id.refID === 'EID'">
                      <div style="display:inline-block;">
                        <b>SUBJECT</b>: {{ id.identity.payload.subject }}<br>
                        <b>eID NUMBER</b>: {{ id.identity.payload.id_number }}<br>
                        <b>NAME</b>: {{ id.identity.payload.name }}<br>
                        <b>SURNAME</b>: {{ id.identity.payload.surname }}<br>
                        <b>ISSUED BY</b>: {{ id.identity.payload.issuer }}<br>
                        <b>OFFICE</b>: {{ id.identity.payload.office }}<br>
                        <b>COUNTRY</b>: {{ id.identity.payload.country }}<br>
                        <b>P7M HASH</b>: {{ id.identity.payload.p7mhash }}<br>
                      </div>
                    </div>
                </div>
              </a>
          </div>
        </div>
        <canvas style="margin-top:20px;" id="qrcode" v-if="showQRCanvas"></canvas>
        <br>
        <b-button  style="width:100%" v-on:click="toggleQR" type="is-primary"><span v-if="!showQRCanvas">SHOW</span><span v-if="showQRCanvas">HIDE</span> QR-CODE</b-button><br>
        <a :href="shareURL" target="_blank"><b-button  style="width:100%" type="is-success">SHARE IDENTITY</b-button></a><br>
      </div>
      
      <div v-if="Object.keys(identities).length > 0 && !unlocked">
        <br>These are your <b>public</b> informations:
        <div style="border:1px solid #ccc; text-align:left; color:#000; border-radius:5px; margin-top:20px; font-size:12px; padding:15px">
            <v-gravatar :email="address" style="float:left; height:55px; margin-right:10px;" />
            <strong>LYRA ADDRESS</strong><br>
            Created at block <strong>{{ first_tx.blockheight }}</strong><br>
            {{ address.substr(0,6) }}...{{ address.substr(-6) }}<br>
        </div>
        <div v-for="id in identities" style="position:relative" v-bind:key="id.refID">
            <a :href="'https://proof.scryptachain.org/#/uuid/' + id.uuid" target="_blank">
              <div style="border:1px solid #ccc; text-align:left; color:#000; border-radius:5px; margin-top:20px; font-size:12px; padding:15px">
                  <img :src = "'/' + id.refID.toLowerCase() + '.png'" style="float:left; height:55px; margin-right:10px;" />
                  <strong>{{ id.refID }}</strong><br>
                  Written at block <strong>{{ id.block }}</strong><br>
                  {{ id.data.signature.substr(0,6) }} ... {{ id.data.signature.substr(-6) }}
              </div>
            </a>
            <a href="#" v-on:click="revokeID(id.uuid)">
              <b-icon style="position:absolute; z-index:10; cursor:pointer; top:27px; right:30px" icon="account-minus" size="is-medium"></b-icon>
            </a>
        </div>
        <br>
        <b-button type="is-primary" style="width:100%" v-on:click="unlockWallet()" size="is-big">Unlock private informations</b-button>
        <b-button type="is-success" style="width:100%" v-on:click="downloadSidFile()" size="is-big">Backup .sid file</b-button>
        <a id="downloadsid" style="display:none"></a>
      </div>
    </div>
  </div>
</template>

<script>
const ScryptaCore = require('@scrypta/core')
const axios = require('axios')
const QRious = require('qrious')
var zlib = require('zlib')

export default {
  name: 'Home',
  data() {
    return {
        scrypta: new ScryptaCore(true),
        backendURL: '',
        address: '',
        file: '',
        isWriting: false,
        showSmsVerification: false,
        showEmailVerification: false,
        smsverification: '',
        emailverification: '',
        unlockPwd: '',
        showQRCanvas: false,
        provider: '',
        unlocked: false,
        email: '',
        providers: [],
        identities: [],
        phone: '',
        workingmessage: '',
        success: '',
        encrypted_wallet: '',
        public_qrcode: '',
        sync_qrcode: '',
        decrypted_wallet: '',
        linked: '',
        updated: '',
        isLoading: true,
        first_tx: {},
        axios: axios,
        shareURL: '',
        payload: {
          identity:{
            username: '',
            id: ''
          }
        }
      }
    },
    async mounted (){
      const app = this
      await app.checkUser()
      app.checkIdentities()
    },
    methods: {
        toggleQR(){
          const app = this
          if(app.showQRCanvas){
            app.showQRCanvas = false
          }else{
            app.showQRCanvas = true
            setTimeout(function(){
              var qr = new QRious({
                element: document.getElementById('qrcode'),
                value: app.public_qrcode
              });
              qr.level = 'L';
              let width = window.screen.width - 40;
              if(width > 360){
                width = 400
              }
              qr.size = width
            },30)
          }
        },
        async checkUser(){
          let user = await this.scrypta.returnDefaultIdentity()
          if (user) {
            let split = user.split(':')
            this.address = split[0];
            this.encrypted_wallet = user
            return true
          }
        },
        async checkIdentities(){
          const app = this
          let transactions = await app.scrypta.get('/transactions/' + app.address)
          let last = transactions.data.length - 1
          app.first_tx = transactions.data[last]
          app.scrypta.post('/read', {
            protocol: 'I://',
            address: app.address
          }).then(async result => {
            var identities = {}
            app.identities = {}
            for(let k in result.data){
              let id = result.data[k]
              if(identities[id.refID] === undefined){
                identities[id.refID] = id
              }
            }
            app.identities = identities
            app.isLoading = false
          })
        },
        unlockWallet(){
          const app = this
          app.$buefy.dialog.prompt({
            message: `Enter wallet password`,
            inputAttrs: {
              type: "password"
            },
            trapFocus: true,
            onConfirm: async password => {
              let sid = await app.scrypta.readKey(password, app.encrypted_wallet);
              if(sid !== false){
                if(sid.identity !== undefined){
                  app.linked = []
                  for(let k in sid.identity){
                    let id = sid.identity[k]
                    //PRIVATE VERIFICATION
                    let signed = await app.scrypta.signMessage(sid.prv, JSON.stringify(id))
                    for(let y in app.identities){
                      let idB = app.identities[y]
                      if(idB.data.signature === signed.signature){
                        //PUBLIC VERIFICATION
                        let verify = await app.scrypta.verifyMessage(sid.key, idB.data.signature, JSON.stringify(id))
                        if(verify !== false && verify.address === app.address){
                          idB.identity = id.identity
                          app.linked.push(idB)
                        }
                      }
                    }
                  }
                  app.unlocked = true
                  
                  sid.identity.address = app.address
                  sid.identity.key = sid.key
                  let compressed = zlib.deflateSync(JSON.stringify(sid.identity)).toString('base64')
                  var find = '/'
                  var re = new RegExp(find, 'g')
                  compressed = compressed.replace(re, '*')
                  app.shareURL = 'https://me.scrypta.id/#/share/' + compressed
                  app.public_qrcode = compressed
                  
                }else{
                  app.$buefy.toast.open({
                    message: "The .sid file doesn't contain any identity! Please use the latest version!",
                    type: "is-danger"
                  });
                }
              } else {
                app.$buefy.toast.open({
                  message: "Wrong password!",
                  type: "is-danger"
                });
              }
            }
          })
        },
        downloadSidFile(){
          var a = document.getElementById("downloadsid");
          var file = new Blob(
            [this.encrypted_wallet],
            { type: "sid" }
          );
          a.href = URL.createObjectURL(file);
          a.download = this.address + ".sid";
          var clickEvent = new MouseEvent("click", {
            view: window,
            bubbles: true,
            cancelable: false
          });
          a.dispatchEvent(clickEvent);
        },
        revokeID(uuid){
          const app = this
          app.$buefy.dialog.prompt({
            message: `Enter wallet password`,
            inputAttrs: {
              type: "password"
            },
            trapFocus: true,
            onConfirm: async password => {
              let sid = await app.scrypta.readKey(password, app.encrypted_wallet);
              if(sid !== false){
                let invalidated = await app.scrypta.invalidate(app.encrypted_wallet, password, uuid)
                if(invalidated !== false){
                  app.$buefy.toast.open({
                    message: "Identity invalidated correctly, please wait at least 2 minutes.",
                    type: "is-success"
                  });
                }else{
                  app.$buefy.toast.open({
                    message: "Wrong password!",
                    type: "is-danger"
                  });
                }
              } else {
                app.$buefy.toast.open({
                  message: "Wrong password!",
                  type: "is-danger"
                });
              }
            }
          })
        }
    }
}
</script>
<style>
  .home{
    padding: 20px;
  }
</style> 