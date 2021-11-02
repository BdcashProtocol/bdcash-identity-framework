const express = require('express')
const passport = require('passport')
const axios = require('axios')
require('dotenv').config()
const providers = require('../providers')
const sign = require('../libs/sign')

var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var router = express.Router();

router.get('/auth/google', passport.authenticate('google', { scope: ['https://www.googleapis.com/auth/plus.login'] }));
router.get('/auth/google/callback', 
    passport.authenticate('google', { failureRedirect: '/auth/error', session: false }),
    function(req, res) {
        res.redirect('/?google=success')
    }
);

router.post(
    '/auth/google/session', 
    function(req, res){
        res.json(req.session.google)
    }
);

passport.use(new GoogleStrategy({
    clientID:  providers.google.token,
    clientSecret:  providers.google.secret,
    callbackURL:  providers.google.callback,
    passReqToCallback: true
  },
  function(req, accessToken, refreshToken, profile, done) {
    let googleID = {
        method: 'google',
        username: profile.displayName,
        id: profile.id,
        token: accessToken,
        created_at: Date.now()
    }
    sign.signWithKey(process.env.GATEWAY_PRV, JSON.stringify(googleID)).then(signature => {
        req.session.google = {
            identity: googleID,
            fingerprint: signature.signature,
            gateway: signature.pubKey
        }
        return done(null, googleID)
    })
  }
));

router.get('/google/verify/:token', function(req, res){
    let token = req.params.token
    if(token !== undefined){
        //TODO
    }
})

module.exports = router;