<template>
  <div class="home">
    <div class="login-7 tab-box">
      <h1>Digital identities of<div style="font-size:14px;">{{ address }}</div></h1>
      <br><p>These informations are strictly confidentials, please don't share the link with third parties.</p>
      <div style="border:1px solid #ccc; text-align:left; color:#000; border-radius:5px; margin-top:20px; font-size:12px; padding:15px">
          <v-gravatar :email="address" style="float:left; height:55px; margin-right:10px;" />
          <strong>BDCASH ADDRESS</strong><br>
          Created at block <strong>{{ first_tx.blockheight }}</strong><br>
          {{ address.substr(0,6) }}...{{ address.substr(-6) }}<br>
      </div>
      <div v-for="id in linked" v-bind:key="id.refID">
          <a :href="'https://proof.scryptachain.org/#/uuid/' + id.uuid" target="_blank">
            <div style="border:1px solid #ccc; text-align: left; color:#000; border-radius:5px; margin-top:20px; font-size:12px; padding:15px">
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
      <br><br>
      <a id="downloadid" style="display:none"></a>
      <b-button size="is-large" v-on:click="storeCredentials" type="is-primary">STORE CREDENTIALS</b-button>
    </div>
  </div>
</template>

<script>
const ScryptaCore = require('@bdcash-protocol/core')
const axios = require('axios')
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
    async mounted (){
      const app = this
      app.scrypta.staticnodes = true
      app.checkIdentity()
    },
    methods: {
        async checkIdentity(){
          const app = this
          let compressed = app.$route.params.identity
          while(compressed.indexOf('*') !== -1){
            compressed = compressed.replace('*','/')
          }
          let identity = JSON.parse(zlib.inflateSync(new Buffer(compressed, 'base64')).toString())
          app.address = identity.address
          let transactions = await app.scrypta.get('/transactions/' + app.address)
          let last = transactions.data.length - 1
          app.first_tx = transactions.data[last]
          app.scrypta.post('/read', {
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
                let verify = await app.scrypta.verifyMessage(identity.key, idB.data.signature, JSON.stringify(id))
                if(verify !== false && verify.address === identity.address){
                  idB.identity = id.identity
                  app.linked.push(idB)
                }
              }
            }
          })
        },
        storeCredentials(){
          const app = this
          app.$buefy.dialog.prompt({
            message: `Enter a strong password to encrypt the file`,
            inputAttrs: {
              type: "password"
            },
            trapFocus: true,
            onConfirm: async password => {
              let encrypted = await app.scrypta.cryptData(app.$route.params.identity, password)
              var a = document.getElementById("downloadid");
              var file = new Blob(
                [encrypted],
                { type: "eid" }
              );
              a.href = URL.createObjectURL(file);
              a.download = app.address + ".eid";
              var clickEvent = new MouseEvent("click", {
                view: window,
                bubbles: true,
                cancelable: false
              });
              a.dispatchEvent(clickEvent);
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
