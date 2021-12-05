<template>
  <div class="home">
    <div class="login-7 tab-box">
      <div v-if="!address && showQR" style="position:fixed; top: 0; background:#000; left: 0; width:100%; height:100%; z-index: 999999999;">
        <b-button size="is-small" type="is-primary" v-on:click="closeScan" style="position:absolute; top: 20px; right: 20px; z-index: 999;">X</b-button>
        <qrcode-stream @decode="onDecode"></qrcode-stream>
      </div>
      <div v-if="!address">
        <h1>Check and identity</h1><br>
        <p>Use this function to scan an identity and verify if it's valid and matches the blockchain signature.</p><br><br>
        <b-button v-on:click="openScan" type="is-primary">SCAN QR CODE</b-button><br><hr><br>
        <b-field>
            <b-upload v-model="file" v-on:input="loadWalletFromFile" drag-drop>
              <section class="section">
                <div class="content has-text-centered">
                  <p>Drag and drop your .eid here or click to upload</p>
                </div>
              </section>
            </b-upload>
        </b-field>
      </div>
      <div v-if="address">
        <h1>Digital identities of<div style="font-size:14px;">{{ address }}</div></h1>
        <br><br><p>These informations are strictly confidentials, please don't share them with third parties.</p>
        <div style="border:1px solid #ccc; text-align:left; color:#000; border-radius:5px; margin-top:20px; font-size:12px; padding:15px">
            <v-gravatar :email="address" style="float:left; height:55px; margin-right:10px;" />
            <strong>BDCASH ADDRESS</strong><br>
            Created at block <strong>{{ first_tx.blockheight }}</strong><br>
            {{ address.substr(0,6) }}...{{ address.substr(-6) }}<br>
        </div>
        <div v-for="id in linked" v-bind:key="id.refID">
            <a :href="'https://proof.bdcashprotocol.com/#/uuid/' + id.uuid" target="_blank">
              <div v-on:click="revealID(id.refID)" style="border:1px solid #ccc; text-align: left; color:#000; border-radius:5px; margin-top:20px; font-size:12px; padding:15px">
                  <img :src = "'/' + id.refID.toLowerCase() + '.png'" style="float:left; height:75px; margin-right:10px;" />
                  <strong>{{ id.refID }}</strong><br>{{ id.identity.username }}<br>
                  <span v-if="id.identity.id !== undefined">ID: {{ id.identity.id }}<br></span>
                  Written at block <strong>{{ id.block }}</strong><br>
                  {{ id.data.signature.substr(0,6) }} ... {{ id.data.signature.substr(-6) }}
              </div>
            </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
const BDCashCore = require('@bdcash-protocol/core')
const axios = require('axios')
var zlib = require('zlib')

export default {
  name: 'Home',
  data() {
    return {
        bdcash: new BDCashCore(true),
        backendURL: '',
        address: '',
        showQR: false,
        file: '',
        isWriting: false,
        showSmsVerification: false,
        showEmailVerification: false,
        smsverification: '',
        emailverification: '',
        unlockPwd: '',
        showQRCanvas: false,
        provider: '',
        first_tx: {},
        email: '',
        providers: [],
        phone: '',
        workingmessage: '',
        success: '',
        encrypted_wallet: '',
        public_qrcode: '',
        sync_qrcode: '',
        decrypted_wallet: '',
        linked: '',
        updated: '',
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
    mounted(){
      const app = this
      app.bdcash.staticnodes = true
    },
    methods: {
        async onDecode(decodedString){
          const app = this
          let compressed = decodedString
          while(compressed.indexOf('*') !== -1){
            compressed = compressed.replace('*','/')
          }
          let identity = JSON.parse(zlib.inflateSync(new Buffer(compressed, 'base64')).toString())
          app.address = identity.address
          let transactions = await app.bdcash.get('/transactions/' + app.address)
          let last = transactions.data.length - 1
          app.first_tx = transactions.data[last]
          app.bdcash.post('/read', {
            protocol: 'I://',
            address: identity.address
          }).then(async result => {
            var identities = {}
            for(let k in result.data){
              let id = result.data[k]
              if(identities[id.refID] === undefined){
                identities[id.refID] = id
              }
            }
            app.linked = []
            for(let k in identity){
              let id = identity[k]
              for(let y in identities){
                let idB = identities[y]
                //PUBLIC VERIFICATION
                let verify = await app.bdcash.verifyMessage(identity.key, idB.data.signature, JSON.stringify(id))
                if(verify !== false && verify.address === identity.address){
                  idB.identity = id.identity
                  app.linked.push(idB)
                }
              }
            }
          })
        },
        openScan(){
          this.showQR = true
        },
        closeScan(){
          this.showQR = false
        },
        loadWalletFromFile() {
          const app = this;
          const file = app.file;
          const reader = new FileReader();
          reader.onload = function() {
            var dataKey = reader.result;

            app.$buefy.dialog.prompt({
              message: `Enter archive password`,
              inputAttrs: {
                type: "password"
              },
              trapFocus: true,
              onConfirm: async password => {
                let key = await app.bdcash.decryptData(dataKey, password)
                if (key !== false) {
                  let compressed = key
                  while(compressed.indexOf('*') !== -1){
                    compressed = compressed.replace('*','/')
                  }
                  let identity = JSON.parse(zlib.inflateSync(new Buffer(compressed, 'base64')).toString())
                  app.address = identity.address
                  let transactions = await app.bdcash.get('/transactions/' + app.address)
                  let last = transactions.data.length - 1
                  app.first_tx = transactions.data[last]
                  app.bdcash.post('/read', {
                    protocol: 'I://',
                    address: app.address
                  }).then(async result => {
                    var identities = {}
                    for(let k in result.data){
                      let id = result.data[k]
                      if(identities[id.refID] === undefined){
                        identities[id.refID] = id
                      }
                    }
                    app.linked = []
                    for(let k in identity){
                      let id = identity[k]
                      for(let y in identities){
                        let idB = identities[y]
                        //PUBLIC VERIFICATION
                        let verify = await app.bdcash.verifyMessage(identity.key, idB.data.signature, JSON.stringify(id))
                        if(verify !== false && verify.address === identity.address){
                          idB.identity = id.identity
                          app.linked.push(idB)
                        }
                      }
                    }
                  })
                } else {
                  app.$buefy.toast.open({
                    message: "Wrong password!",
                    type: "is-danger"
                  });
                }
              }
            });
          };
          reader.readAsText(file);
        }
    }
}
</script>
<style>
  .home{
    padding: 20px;
  }
</style> 
