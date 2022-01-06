<template>
  <div class="home">
    <div class="login-7 tab-box">
        <div class="container-fluid">
            <div class="row">
                <div class="" v-if="address">
                    <div class="login-inner-form" v-if="!success">
                        <div class="details">
                            <h1>Link a Digital Identity</h1>
                            <br>to {{ address }}<br><br>
                            <div class="columns" v-bind:class="{ isGithub: isGithub, isGoogle: isGoogle, isTwitter: isTwitter, isLinkedin: isLinkedin, isEmail: isEmail, isPhone: isPhone, isEid: isEid, isEthereum: isEthereum }">
                              <div v-for="provider in providers" class="column is-one-third-mobile" v-on:click="selectProvider(provider)" v-bind:key="provider">
                                  <div :class="'card is-' + provider" style="cursor:pointer">
                                    <div class="card-content">
                                      <img :src="'/'+provider+'.png'" width="100%">
                                    </div>
                                    <footer class="card-footer">
                                      <p class="card-footer-item">
                                        <span>
                                          {{ provider.toUpperCase() }}
                                        </span>
                                      </p>
                                    </footer>
                                  </div>
                              </div>
                            </div>
                            <form id="verificationForm" :action="backendURL + '/auth/' + provider" method="GET">
                                <br>
                                <div class="form-group" v-if="provider === 'email' && showEmailVerification === false">
                                  Insert your e-mail to continue:<br><br>
                                  <b-input v-model="email" type="email" placeholder="Insert E-Mail"></b-input><br>
                                </div>
                                <div class="form-group" v-if="provider === 'phone' && showSmsVerification === false">
                                    Insert your phone number to continue:<br><br>
                                    <b-input v-model="phone"  placeholder="Insert Phone number"></b-input>
                                    <br><small>Insert the country prefix before (ex +393331122333)</small><br><br>
                                </div>
                                <div class="form-group" v-if="provider === 'phone' && showSmsVerification === true">
                                    Insert the OTP received by SMS:<br><br>
                                    <b-input v-model="smsverification"  placeholder="Insert code"></b-input><br>
                                </div>
                                <div class="form-group" v-if="provider === 'email' && showEmailVerification === true">
                                    Insert the OTP received by E-Mail:<br><br>
                                    <b-input v-model="emailverification" placeholder="Insert code"></b-input><br>
                                </div>
                                <div class="form-group" v-if="provider === 'eid' && showEidVerification === false">
                                    Insert the eID card number:<br><br>
                                    <b-input v-model="eidnumber" placeholder="Insert card number"></b-input><br>
                                    <a id="downloadcid" style="display:none"></a>
                                </div>
                                <div class="form-group" v-if="provider === 'eid' && showEidVerification === true">
                                    Sign your .cie file with your eID card and upload again the .p7m file:<br><br>
                                    <input type="file" id="file" ref="file" v-on:change="loadP7mFromFile()"/><br><br>
                                </div>
                                <div class="form-group row">
                                    <div class="col-12">
                                        <b-button v-if="provider !== 'phone' && provider !== 'email' && provider !== 'eid' && provider !== 'ethereum'" v-on:click="submitVerification()" type="is-primary">Start verification with {{ provider.toUpperCase() }}</b-button>
                                        <b-button v-if="provider === 'phone' && showSmsVerification === false" v-on:click="sendSMS()" type="is-primary">Send verification SMS</b-button>
                                        <b-button v-if="provider === 'phone' && showSmsVerification === true" v-on:click="verifySMS()" type="is-primary">Verify SMS</b-button>
                                        <b-button v-if="provider === 'email' && showEmailVerification === false" v-on:click="sendEmail()" type="is-primary">Send verification e-mail</b-button>
                                        <b-button v-if="provider === 'email' && showEmailVerification === true" v-on:click="verifyEMail()" type="is-primary">Verify e-mail</b-button>
                                        <b-button v-if="provider === 'eid' && showEidVerification === false" v-on:click="createEidPayload()" type="is-primary">Create e-identity file</b-button>
                                        <b-button v-if="provider === 'ethereum'" v-on:click="signWithEthereum()" type="is-primary">Start verification with ETH</b-button>
                                        <br>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div><!--login-form-->
                    <div v-if="!updated">
                        <div class="login-inner-form" v-if="success">
                            <img src="/success.png" width="200"><br>
                            <br>You've successfully verified your <b>{{ success.toUpperCase() }}</b> account:<br><br>
                            <div v-if="payload.identity.username !== undefined">
                              <b>Username:</b> {{ payload.identity.username }}<br>
                            </div>
                            <span v-if="payload.identity.id !== undefined">
                              <b>ID:</b> {{ payload.identity.id }}<br><br>
                            </span><br>
                            <div v-if="success === 'eid'">
                              <b>SUBJECT</b>: {{ payload.identity.payload.subject }}<br>
                              <b>eID NUMBER</b>: {{ payload.identity.payload.id_number }}<br>
                              <b>NAME</b>: {{ payload.identity.payload.name }}<br>
                              <b>SURNAME</b>: {{ payload.identity.payload.surname }}<br>
                              <b>ISSUED BY</b>: {{ payload.identity.payload.issuer }}<br>
                              <b>OFFICE</b>: {{ payload.identity.payload.office }}<br>
                              <b>COUNTRY</b>: {{ payload.identity.payload.country }}<br>
                              <b>P7M HASH</b>: {{ payload.identity.payload.p7mhash }}<br><br>
                            </div>
                            <b-button v-on:click="writeIdentity()" v-if="!isWriting" type="is-primary">Write signature</b-button>
                            <div v-if="isWriting">
                              {{ workingmessage }}
                            </div>
                        </div>
                    </div>
                    <div v-if="updated">
                        <div class="login-inner-form text-center">
                            <h1>Process completed!</h1>
                            <br><br>
                            Now is time to download your updated .sid file and sync your dApps and your extension!<br>
                            Please note, no one keeps your identity payload, only you can share it, these informations are not stored in any server.<br><br>
                            <a id="downloadsid" style="display:none"></a>
                            <b-button v-on:click="downloadSidFile()" style="width:100%" type="is-primary">Download .sid file</b-button><br><br>
                            <a :href="shareURL" target="_blank"><b-button  style="width:100%" type="is-success">SHARE IDENTITY</b-button></a><br><br>
                            <a href="/">Go back</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
  </div>
</template>

<script>
const BDCashCore = require('@bdcash-protocol/core')
const axios = require('axios')
var zlib = require('zlib')
var ethUtil = require('ethereumjs-util')
var sigUtil = require('eth-sig-util')
const web3 = window.web3
const ethereum = window.ethereum

export default {
  name: 'Home',
  data() {
    return {
        bdcash: new BDCashCore(true),
        backendURL: '',
        address: '',
        file: '',
        isWriting: false,
        showSmsVerification: false,
        showEmailVerification: false,
        showEidVerification: false,
        smsverification: '',
        emailverification: '',
        eidnumber: '',
        unlockPwd: '',
        showQRCanvas: false,
        isGithub: false,
        isGoogle: false,
        isTwitter: false,
        isLinkedin: false,
        isEid: true,
        isEmail: false,
        isEthereum: false,
        isPhone: false,
        provider: 'eid',
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
      let url = document.URL
      const app = this
      app.bdcash.staticnodes = true
      let normalized = window.location.href
      let dot = normalized.split('?')
      app.backendURL = dot[0].replace(':8080/',':3000/').replace('/#/','').replace(':3000/',':3000').replace('.id/','.id')
      let providersRequest = await app.axios.get(app.backendURL + '/providers');
      let providers = providersRequest.data.providers
      app.providers = providers

      let check = await this.checkUser()
      if(check === true){
        if(url.indexOf('?') !== -1){
          let split = url.split('?')
          if(split[1] !== undefined){
            let params = split[1].split('=')
            if(params[1] !== undefined && params[1].replace('#','').replace('#/','').replace('/','') === 'success'){
              app.success = params[0]
              app.axios.post(app.backendURL + '/auth/' + params[0] + '/session').then(payload => {
                if(payload.data.identity !== undefined){
                  app.payload = payload.data
                }else{
                  window.location = '/'
                }
              })
            }
          }
        }
      }
    },
    methods: {
        selectProvider(provider){
          const app = this
          app.provider = provider
          app.isGithub = false
          app.isGoogle = false
          app.isPhone = false
          app.isEmail = false
          app.isEid = false
          app.isEthereum = false
          app.isLinkedin = false
          app.isTwitter = false
          if(provider === 'github'){
            app.isGithub = true
          }
          if(provider === 'google'){
            app.isGoogle = true
          }
          if(provider === 'ethereum'){
            app.isEthereum = true
          }
          if(provider === 'twitter'){
            app.isTwitter = true
          }
          if(provider === 'linkedin'){
            app.isLinkedin = true
          }
          if(provider === 'email'){
            app.isEmail = true
          }
          if(provider === 'phone'){
            app.isPhone = true
          }
          if(provider === 'eid'){
            app.isEid = true
          }
        },
        sendEmail(){
          const app = this
          if(app.email !== ''){
            app.axios.post(app.backendURL + '/email/send', {email: app.email}).then(response => {
              if(response.data.success === true){
                app.showEmailVerification = true
              }
            })
          }else{
            alert('Write email first!')
          }
        },
        verifyEMail(){
          const app = this
          if(app.emailverification !== undefined){
            app.axios.post(app.backendURL + '/email/verify', {email: app.email, code: app.emailverification}).then(result => {
              if(result.data.status === 200){
                app.success = 'email'
                app.payload = result.data.success
              }else{
                alert('Code is invalid!')
              }
            })
          }else{
            alert('Write code first!')
          }
        },
        sendSMS(){
          const app = this
          if(app.phone !== ''){
            app.axios.post(app.backendURL + '/phone/send', {number: app.phone}).then(response => {
              if(response.data.success === true){
                app.showSmsVerification = true
              }
            })
          }else{
            alert('Write phone first!')
          }
        },
        verifySMS(){
          const app = this
          if(app.smsverification !== undefined){
            app.axios.post(app.backendURL + '/phone/verify', {number: app.phone, code: app.smsverification}).then(result => {
              if(result.data.status === 200){
                app.success = 'phone'
                app.payload = result.data.success
              }else{
                alert('Code is invalid!')
              }
            })
          }else{
            alert('Write code first!')
          }
        },
        submitVerification(){
          const app = this
          if(app.provider !== ''){
            document.getElementById("verificationForm").submit();
          }
        },
        async checkUser(){
          let user = await this.bdcash.returnDefaultIdentity()
          if (user) {
            let split = user.split(':')
            this.address = split[0];
            this.encrypted_wallet = user
            return true
          }
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
        async writeIdentity(){
          const app = this
          let balance = await app.bdcash.get('/balance/' + app.address)
          app.isWriting = true
          if(balance.balance > 1){
            app.$buefy.dialog.prompt({
              message: `Enter wallet password`,
              inputAttrs: {
                type: "password"
              },
              trapFocus: true,
              onConfirm: async password => {
                let sid = await app.bdcash.readKey(password, app.encrypted_wallet);
                if(sid !== false){
                  let private_key = sid.prv
                  app.workingmessage = 'Signing identity with private key...'
                  var toStore = {
                    identity: app.payload.identity,
                    fingerprint: app.payload.fingerprint
                  }
                  app.bdcash.signMessage(private_key, JSON.stringify(toStore)).then(async signed => {
                    if(sid.identity === undefined){
                      sid.identity = {}
                    }
                    sid.identity[app.success] = {}
                    sid.identity[app.success] = toStore

                    if(sid.identity[app.success] === toStore){
                        await app.bdcash.buildWallet(password, app.address, sid, true)
                        let newkey = await app.bdcash.returnIdentity(app.address)
                        let confirm = await app.bdcash.readKey(password, newkey.wallet)
                        if(confirm.identity[app.success].fingerprint === toStore.fingerprint){
                          app.encrypted_wallet = newkey.wallet
                          localStorage.setItem('SID', newkey.wallet)
                          let message = {
                            signature: signed.signature,
                            gateway: app.payload.gateway,
                            fingerprint: app.payload.fingerprint
                          }
                          app.workingmessage = 'Uploading data to the blockchain...'
                          app.bdcash.write(app.encrypted_wallet, password, JSON.stringify(message), '', app.success.toUpperCase() , 'I://').then(res => {
                            if(res.uuid !== undefined && res.txs.length >= 1 && res.txs[0] !== null){
                              app.isWriting = false
                              app.workingmessage = 'Data written correctly.'
                              app.payload = ''
                              app.decrypted_wallet = 'WALLET LOCKED'
                              app.updated = app.encrypted_wallet
                              setTimeout(function(){
                                sid.identity.address = app.address
                                sid.identity.key = sid.key
                                let compressed = zlib.deflateSync(JSON.stringify(sid.identity)).toString('base64')
                                var find = '/'
                                var re = new RegExp(find, 'g')
                                compressed = compressed.replace(re, '*')
                                app.shareURL = 'https://id.bdcashprotocol.com/#/share/' + compressed
                                app.public_qrcode = compressed
                              },30)
                            }else{
                              alert('There\'s an error in the upload, please retry!')
                              app.isWriting = false
                            }
                          }).catch(() => {
                            alert('There\'s an error in the upload, please retry!')
                            app.isWriting = false
                          })
                        }else{
                          alert('Something goes wrong, retry please!')
                          app.isWriting = false
                        }
                      }else{
                        alert('Something goes wrong, retry please!')
                        app.isWriting = false
                      }
                    })
                } else {
                  app.$buefy.toast.open({
                    message: "Wrong password!",
                    type: "is-danger"
                  });
                  app.isWriting = false
                }
              }
            })
          }else{
            app.$buefy.toast.open({
              message: "You need at least 1 BDCASH in your wallet!",
              type: "is-danger"
            })
          }
        },
        createEidPayload(){
          const app = this
          if(app.eidnumber !== ''){
            app.$buefy.dialog.prompt({
              message: `Enter wallet password`,
              inputAttrs: {
                type: "password"
              },
              trapFocus: true,
              onConfirm: async password => {
                let sid = await app.bdcash.readKey(password, app.encrypted_wallet);
                if(sid !== false){
                  let payload = await app.bdcash.signMessage(sid.prv, app.eidnumber)
                  var a = document.getElementById("downloadcid");
                  var file = new Blob(
                    [JSON.stringify(payload)],
                    { type: "cid" }
                  );
                  a.href = URL.createObjectURL(file);
                  a.download = this.address + ".cid";
                  var clickEvent = new MouseEvent("click", {
                    view: window,
                    bubbles: true,
                    cancelable: false
                  });
                  app.showEidVerification = true
                  a.dispatchEvent(clickEvent);
                }else{
                  app.$buefy.toast.open({
                    message: "Wrong password!",
                    type: "is-danger"
                  });
                }
              }
            })
          }else{
            alert('Write e-id card number first!')
          }
        },
        loadP7mFromFile(){
          const app = this;
          app.file = app.$refs.file.files[0];
          let formData = new FormData();
          formData.append('file', app.file);
          formData.append('address', app.address);
          formData.append('eidnumber', app.eidnumber);
          axios.post(app.backendURL + '/eid/verify',
            formData,
            {
              headers: {
                  'Content-Type': 'multipart/form-data'
              }
            }
          ).then(function(result){
            if(result.data.error === false && result.data.success.identity.payload.id_number === app.eidnumber){
              app.success = 'eid'
              app.payload = result.data.success
            }else if(result.data.error === true){
              alert(result.data.message)
            }
          })
          .catch(function(){
            alert('Something goes wrong with backend please retry.');
          });
        },
        signWithEthereum(){
          const app = this
          var from = web3.eth.accounts[0]
          if (!from) return app.ethConnect()

          var text = JSON.stringify({
            timestamp: new Date().getTime(),
            message: "ID BDCASH-ETH VERIFICATION",
            host: app.address,
            address: from
          })
          var msg = ethUtil.bufferToHex(new Buffer(text, 'utf8'))
          var params = [msg, from]
          var method = 'personal_sign'

          web3.currentProvider.sendAsync({
            method,
            params,
            from,
          }, function (err, result) {
            if (!err && !result.error){
              let proof = { data: msg }
              proof.sig = result.result
              const recheck = sigUtil.recoverPersonalSignature(proof)

              if (recheck === from ) {
                app.axios.post(app.backendURL + '/ethereum/verify', {proof: proof, address: from}).then(result => {
                  if(result.data.status === 200){
                    app.payload = result.data.success
                    app.success = 'ethereum'
                  }else{
                    alert('Something goes wrong, please retry!')
                  }
                })
              } else {
                alert('SigUtil Failed to verify signer when comparing ' + recheck.result + ' to ' + from)
              }}
            })
        },
        ethConnect(){
          if (typeof ethereum !== 'undefined') {
            ethereum.enable()
          }
        }
    }
}
</script>
<style>
  .home{
    padding: 20px;
  }
  .column{display:inline-block!important}
  .isGithub .is-github{background:#eee!important}
  .isGoogle .is-google{background:#eee!important}
  .isTwitter .is-twitter{background:#eee!important}
  .isLinkedin .is-linkedin{background:#eee!important}
  .isPhone .is-phone{background:#eee!important}
  .isEmail .is-email{background:#eee!important}
  .isEid .is-eid{background:#eee!important}
  .isEthereum .is-ethereum{background:#eee!important}
</style> 
