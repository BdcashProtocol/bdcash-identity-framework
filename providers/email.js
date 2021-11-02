const express = require('express')
const passport = require('passport')
const axios = require('axios')
require('dotenv').config()
var router = express.Router()
const providers = require('../providers')
var api_key = providers.email.token;
var domain =  providers.email.domain;
var mailgun = require('mailgun-js')({apiKey: api_key, domain: domain});
 
const sign = require('../libs/sign')
const PouchDB = require('pouchdb')
var db = new PouchDB('email');

router.post('/email/send', 
    function(req, res){
        console.log('Requested E-Mail authentication.')
        let low = 0
        let high = 9999999
        let code = parseInt(Math.random() * (high - low) + low)
        
        if(req.fields.email !== undefined){

            var data = {
                from: providers.email.name +' <'+providers.email.email+'>',
                to: req.fields.email,
                subject: 'Verify your e-mail with BDCashID',
                text: 'Please insert this verification code: ' + code
            };
            
            mailgun.messages().send(data, function (error, body) {
                if (error){
                    console.log(error)
                    res.json({success: false, error: error, status: 500})
                }else{
                    let toStore = {
                        code: code,
                        _id: req.fields.email
                    }
                    db.get(req.fields.email).catch(function (err) {
                        db.put(toStore)
                    }).then(function (stored) {
                        if(stored !== undefined){
                            db.remove(stored)
                        }
                        db.put(toStore)
                    })
                    res.json({success: true, status: 200})
                }
            })
        }else{
            res.json({success: false, status: 401})
        }
    }
)

router.post('/email/verify', 
    function(req, res){
        if(req.fields.email !== undefined && req.fields.code !== undefined){
            db.get(req.fields.email).catch(function (err) {
                //console.log(err)
            }).then(function (stored) {
                if(req.fields.email === stored._id && parseInt(req.fields.code) === parseInt(stored.code)){
                    let emailID = {
                        method: 'email',
                        username: stored._id,
                        created_at: Date.now()
                    }
                    db.remove(stored)
                    sign.signWithKey(process.env.GATEWAY_PRV, JSON.stringify(emailID)).then(signature => {
                        res.json({
                            success: {
                                identity: emailID,
                                fingerprint: signature.signature,
                                gateway: signature.pubKey
                            },
                            status: 200
                        })
                    })
                }else{
                    res.json({success: false, status: 401})
                }
            }).catch(function (err) {
                res.json({success: false, status: 401})
            });  
        }else{
            res.json({success: false, status: 401})
        }
    }
)

module.exports = router;