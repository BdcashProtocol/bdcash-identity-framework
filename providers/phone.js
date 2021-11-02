const express = require('express')
const passport = require('passport')
const axios = require('axios')
require('dotenv').config()
var router = express.Router()
var twilio = require('twilio')
const providers = require('../providers')
const sign = require('../libs/sign')
var client = new twilio(providers.phone.token, providers.phone.secret);
const PouchDB = require('pouchdb')
var db = new PouchDB('phone');

router.post('/phone/send', 
    function(req, res){
        console.log('Requested SMS authentication.')
        let low = 0
        let high = 9999999
        let code = parseInt(Math.random() * (high - low) + low)
        
        if(req.fields.number !== undefined){
            client.messages.create({
                to: req.fields.number,
                from: providers.phone.name,
                body: 'Please insert this verification code: ' + code
            }, function(error, message) {
                if (!error) {
                    let toStore = {
                        code: code,
                        message: message.sid,
                        _id: req.fields.number
                    }
                    db.get(req.fields.number).catch(function (err) {
                        db.put(toStore)
                    }).then(function (stored) {
                        if(stored !== undefined){
                            db.remove(stored)
                        }
                        db.put(toStore)
                    })
                    res.json({success: true, status: 200})
                } else {
                    res.json({success: false, error: error, status: 500})
                }
            })
        }else{
            res.json({success: false, status: 401})
        }
    }
)

router.post('/phone/verify', 
    function(req, res){
        if(req.fields.number !== undefined && req.fields.code !== undefined){
            db.get(req.fields.number).catch(function (err) {
                //console.log(err)
            }).then(function (stored) {
                if(req.fields.number === stored._id && parseInt(req.fields.code) === parseInt(stored.code)){
                    let phoneID = {
                        method: 'phone',
                        username: stored._id,
                        created_at: Date.now()
                    }
                    db.remove(stored)
                    sign.signWithKey(process.env.GATEWAY_PRV, JSON.stringify(phoneID)).then(signature => {
                        res.json({
                            success: {
                                identity: phoneID,
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