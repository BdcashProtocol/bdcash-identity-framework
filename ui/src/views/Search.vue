<template>
  <div class="home">
    <div class="login-7 tab-box">
      <b-loading :is-full-page="true" :active.sync="isSearching" :can-cancel="false"></b-loading>
      <div v-if="Object.keys(identities).length === 0 && !$route.params.address">
        <h1>Search an user's identity</h1><br>
        <p>Use this function to scan the blockchain and search for public identies.<br>If you need to know all the informations you've to ask directly to the user.</p><br><br>
        <b-field label="Insert BDCash Address">
          <b-input style="text-align:center" v-model="address"></b-input>
        </b-field>
        <b-button size="is-large" v-on:click="searchIdentities" type="is-primary">SEARCH</b-button>
      </div>
      <div v-if="Object.keys(identities).length > 0">
        <h1>Digital identities of<div style="font-size:14px;">{{ address }}</div></h1>
        <br>These are your <b>public</b> informations:
        <div style="border:1px solid #ccc; text-align:left; color:#000; border-radius:5px; margin-top:20px; font-size:12px; padding:15px">
            <v-gravatar :email="address" style="float:left; height:55px; margin-right:10px;" />
            <strong>BDCASH ADDRESS</strong><br>
            Created at block <strong>{{ first_tx.blockheight }}</strong><br>
            {{ address.substr(0,6) }}...{{ address.substr(-6) }}<br>
        </div>
        <div v-for="id in identities" v-bind:key="id.refID">
            <a :href="'https://proof.bdcashprotocol.com/#/uuid/' + id.uuid" target="_blank">
              <div style="border:1px solid #ccc; text-align:left; color:#000; border-radius:5px; margin-top:20px; font-size:12px; padding:15px">
                  <img :src = "'/' + id.refID.toLowerCase() + '.png'" style="float:left; height:55px; margin-right:10px;" />
                  <strong>{{ id.refID }}</strong><br>
                  Written at block <strong>{{ id.block }}</strong><br>
                  {{ id.data.signature.substr(0,6) }} ... {{ id.data.signature.substr(-6) }}
              </div>
            </a>
        </div>
      </div>
      <div v-if="Object.keys(identities).length === 0 && $route.params.address">
        <br><br>We're sorry, but there's nothing linked.
      </div>
    </div>
  </div>
</template>

<script>
const BDCashCore = require('@bdcash-protocol/core')
const axios = require('axios')

export default {
  name: 'Home',
  data() {
    return {
        bdcash: new BDCashCore(true),
        backendURL: '',
        address: '',
        first_tx: {},
        linked: '',
        updated: '',
        axios: axios,
        identities: {},
        isSearching: false
      }
    },
    mounted(){
      const app = this
      app.bdcash.staticnodes = true
      if(app.$route.params.address !== undefined){
        app.isSearching = true
        app.address = app.$route.params.address
        app.searchIdentities()
      }
    },
    methods: {
        async searchIdentities(){
          const app = this
          if(app.address.length === 34){
            app.isSearching = true
            let transactions = await app.bdcash.get('/transactions/' + app.address)
            let last = transactions.data.length - 1
            app.first_tx = transactions.data[last]
            app.bdcash.post('/read', {
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
              app.isSearching = false
              app.identities = identities
            })
          }else{
            app.$buefy.toast.open({
              message: "Write an address first!",
              type: "is-danger"
            });
          }
        }
    }
}
</script>
<style>
  .home{
    padding: 20px;
  }
</style> 
