const express = require('express')
// const passport = require('passport')
// const axios = require('axios')
require('dotenv').config()
var router = express.Router()
// var twilio = require('twilio')
// const providers = require('../providers')
const sign = require('../libs/sign')
// var client = new twilio(providers.phone.token, providers.phone.secret);
const PouchDB = require('pouchdb')
var db = new PouchDB('phone');

router.post('/ethereum/verify', 
    function(req, res){
        ethID = {
            method: 'ethereum',
            username: req.fields.address,
            proof: req.fields.proof,
            created_at: Date.now()
        }
        sign.signWithKey(process.env.GATEWAY_PRV, JSON.stringify(ethID)).then(signature => {
            res.json({
                success: {
                    identity: ethID,
                    fingerprint: signature.signature,
                    gateway: signature.pubKey
                },
                status: 200
            })
        })
    }
)

module.exports = router;