const express = require('express')
const passport = require('passport')
const axios = require('axios')
require('dotenv').config()
const providers = require('../providers')
const sign = require('../libs/sign')

var TwitterStrategy = require('passport-twitter').Strategy;
var router = express.Router();

router.get('/auth/twitter', passport.authenticate('twitter'));
router.get('/auth/twitter/callback', 
    passport.authenticate('twitter', { failureRedirect: '/auth/error', session: false }),
    function(req, res) {
        res.redirect('/?twitter=success')
    }
);

router.post(
    '/auth/twitter/session', 
    function(req, res){
        res.json(req.session.twitter)
    }
);

passport.use(new TwitterStrategy({
    consumerKey:  providers.twitter.token,
    consumerSecret:  providers.twitter.secret,
    callbackURL:  providers.twitter.callback,
    passReqToCallback: true
  },
  function(req, accessToken, refreshToken, profile, done) {
    let twitterID = {
        method: 'twitter',
        username: profile.displayName,
        id: profile.id,
        token: accessToken,
        created_at: Date.now()
    }
    sign.signWithKey(process.env.GATEWAY_PRV, JSON.stringify(twitterID)).then(signature => {
        req.session.twitter = {
            identity: twitterID,
            fingerprint: signature.signature,
            gateway: signature.pubKey
        }
        return done(null, twitterID)
    })
  }
));

router.get('/twitter/verify/:token', function(req, res){
    let token = req.params.token
    if(token !== undefined){
        //TODO
    }
})

module.exports = router;