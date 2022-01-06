<template>
  <div id="app">
    <div v-if="!isLogging && wallet && backup">
      <b-navbar>
        <template slot="brand">
          <b-navbar-item tag="router-link" :to="{ path: '/' }">
            <img src="/logo.png" />
          </b-navbar-item>
        </template>
        <template slot="start">
          <b-navbar-item href="/#/">Create Identity</b-navbar-item>
          <b-navbar-item href="/#/identities">My Identity</b-navbar-item>
          <b-navbar-item href="/#/check">Check Identity</b-navbar-item>
          <b-navbar-item href="/#/search">Search User</b-navbar-item>
        </template>

        <template slot="end">
          <b-navbar-item tag="div">
            <div class="buttons">
              <a v-on:click="logout" class="button login-btn is-warning">
                <strong>Logout</strong>
              </a>
            </div>
          </b-navbar-item>
        </template>
      </b-navbar>
      <router-view />
      <hr />BDCash Identity App is
      <a
        href="https://github.com/BdcashProtocol/bdcash-identity-framework"
        target="_blank"
      >open-source</a> powered by team
      <a href="https://bdcashprotocol.com" target="_blank">BDCash Protocol</a>.
      <br />
      <br />
    </div>

    <div v-if="!isLogging && wallet && !backup">
      <section class="hero">
        <div class="hero-body" style="padding: 0;">
          <div class="container" id="backup" style="margin-top:50px;">
            <div class="card">
              <div style="padding: 50px 20px;">
                <h1 class="title is-1">Please make a backup of your identity</h1><br><br><br>
                <p>In order to prevent any data loss you must download your .sid again.</p><br>
                <b-button v-on:click="downloadBackup" type="is-warning" size="is-large">CREATE BACKUP</b-button>
                <a id="downloadid" style="display:none"></a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>

    <div v-if="!wallet">
      <section class="hero">
        <div class="hero-body" style="padding: 0;">
          <div class="container" id="create" style="margin-top:50px;">
            <div class="card">
              <div style="padding: 50px 20px;">
                <img src="/logo.png" lass="img-responsive img-fluid"><br>
                <h1 class="title is-1">Identity Digital BDCash</h1><br><br>
                <p>
                  Identity Digital BDCash is an SSI (Self Sovereign Identity) service which enable you to safely store and share your digital identity with third parties.<br>This service will never store your personal informations so please download your authenticated .sid files and store them safely.
                </p>
                <br />
                <h2 class="subtitle">
                  <br />You need a basic BDCash Identity to enter the platform.<br>You can enter with an existing .sid file or create a new one.
                  <br />
                  <br />Use <a href="https://bdcashprotocol.com/download" target="_blank">BDCASH wallet Extension</a> or <a v-on:click="showCreate">create a new wallet</a>.
                  <br />
                  <br />
                  <b-upload v-model="file" v-on:input="loadWalletFromFile" drag-drop>
                    <section class="section">
                      <div class="content has-text-centered">
                        <p>Drag and drop your .sid here or click to upload</p>
                      </div>
                    </section>
                  </b-upload>
                </h2>
              </div>
            </div>
            <br />BDCash dApp Starter
            <a
              href="https://github.com/BdcashProtocol/bdcash-dapp-starter"
              target="_blank"
            >open-source</a>.
            <br />
            <br />
          </div>
        </div>
      </section>
    </div>
    <b-loading :is-full-page="true" :active.sync="isLogging" :can-cancel="false"></b-loading>
    <b-modal :active.sync="showCreateModal" has-modal-card trap-focus aria-role="dialog" aria-modal>
      <form action>
        <div class="modal-card" style="width: auto">
          <header class="modal-card-head">
            <p class="modal-card-title">Create new Identity</p>
          </header>
          <section class="modal-card-body">
            <b-field label="Insert Password">
              <b-input
                type="password"
                v-model="password"
                password-reveal
                placeholder="Your main password"
                required
              ></b-input>
            </b-field>

            <b-field v-if="!wallet" label="Repeat password">
              <b-input
                type="password"
                v-model="passwordrepeat"
                password-reveal
                placeholder="Repeat password"
                required
              ></b-input>
            </b-field>
          </section>
          <footer v-if="!isCreating && !isUpdating" class="modal-card-foot">
            <button
              v-if="!wallet"
              class="button is-warning"
              style="width:100%"
              v-on:click="createUser"
            >CREATE</button>
          </footer>
          <footer v-if="isCreating" class="modal-card-foot">
            <div style="text-align:center">Creating identity, please wait...</div>
          </footer>
        </div>
      </form>
    </b-modal>
  </div>
</template>

<script>
let BDCashCore = require("@bdcash-protocol/core");

export default {
  data() {
    return {
      bdcash: new BDCashCore(true),
      address: "",
      wallet: "",
      isLogging: true,
      file: [],
      isCreating: false,
      isUpdating: false,
      showCreateModal: false,
      password: "",
      backup: false,
      passwordrepeat: ""
    };
  },
  async mounted() {
    const app = this;
    app.wallet = await app.bdcash.importBrowserSID();
    app.wallet = await app.bdcash.returnDefaultIdentity();
    if (app.wallet.length > 0) {
      let SIDS = app.wallet.split(":");
      app.address = SIDS[0];
      let identity = await app.bdcash.returnIdentity(app.address);
      app.wallet = identity;
      let check_backup = localStorage.getItem('sid_backup')
      if(check_backup !== null && check_backup !== undefined && check_backup === app.address){
        app.backup = true
      }
      app.isLogging = false;
    } else {
      app.isLogging = false;
    }
  },
  methods: {
    loadWalletFromFile() {
      const app = this;
      const file = app.file;
      const reader = new FileReader();
      reader.onload = function() {
        var dataKey = reader.result;

        app.$buefy.dialog.prompt({
          message: `Enter wallet password`,
          inputAttrs: {
            type: "password"
          },
          trapFocus: true,
          onConfirm: async password => {
            let key = await app.bdcash.readKey(password, dataKey);
            if (key !== false) {
              let SIDS = dataKey.split(':')
              app.bdcash.importPrivateKey(key.prv, password);
              localStorage.setItem("SID", dataKey);
              localStorage.setItem('sid_backup', SIDS[0])
              location.reload();
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
    },
    showCreate() {
      const app = this;
      app.showCreateModal = true;
    },
    downloadBackup(){
      const app = this
      app.$buefy.dialog.prompt({
        message: `Enter wallet password`,
        inputAttrs: {
          type: "password"
        },
        trapFocus: true,
        onConfirm: async password => {
          let SID = localStorage.getItem('SID')
          let key = await app.bdcash.readKey(password, SID);
          if (key !== false) {
            var a = document.getElementById("downloadid");
            app.backup = true
            localStorage.setItem('sid_backup', app.address)
            var file = new Blob(
              [SID],
              { type: "sid" }
            );
            a.href = URL.createObjectURL(file);
            a.download = app.address + ".sid";
            var clickEvent = new MouseEvent("click", {
              view: window,
              bubbles: true,
              cancelable: false
            });
            a.dispatchEvent(clickEvent);
          }else{
            app.$buefy.toast.open({
              message: "Wrong password!",
              type: "is-danger"
            });
          }
        }
      })
    },
    logout() {
      localStorage.setItem("SID", "");
      location.reload();
    },
    async createUser() {
      const app = this;
      if (app.password !== "") {
        if (app.passwordrepeat === app.password) {
          app.isCreating = true;
          setTimeout(async function() {
            let id = await app.bdcash.createAddress(app.password, true);
            let identity = await app.bdcash.returnIdentity(id.pub);
            app.address = id.pub;
            app.wallet = identity;
            localStorage.setItem("SID", id.walletstore);
            app.showCreateModal = false;
            app.password = "";
            app.passwordrepeat = "";
            let tx = await app.bdcash.post("/init", {
              address: id.pub,
              airdrop: true
            });
            if (tx.airdrop_tx === false) {
              app.$buefy.toast.open({
                message: "Sorry, airdrop was not successful!",
                type: "is-danger"
              });
            }
            app.isCreating = false;
          }, 500);
        } else {
          app.$buefy.toast.open({
            message: "Passwords doesn't matches.",
            type: "is-danger"
          });
        }
      } else {
        app.$buefy.toast.open({
          message: "Write a password first!",
          type: "is-danger"
        });
      }
    }
  }
};
</script>

<style>
  #app {
    font-family: "Sen";
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #000000;
  }
  h1{ margin-bottom: -20px!important; padding-bottom: 0!important;}
  #nav {
    padding: 30px;
    background: rgb(228, 149, 4);
  }

  #nav a {
    font-weight: bold;
    color: #fff;
  }

  #nav a.router-link-exact-active {
    color: #ecb00b;
  }
  @media screen and (max-width: 1024px){
    .login-btn{
      width: 100%!important;
    }
    .card-footer-item{
      font-size:12px!important;
    }
  }
</style>
