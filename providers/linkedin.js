const express = require('express')
const passport = require('passport')
const axios = require('axios')
require('dotenv').config()
const providers = require('../providers')
const sign = require('../libs/sign')

var LinkedinStrategy = require('passport-linkedin-oauth2').Strategy;
var router = express.Router();

router.get('/auth/linkedin', passport.authenticate('linkedin'));
router.get('/auth/linkedin/callback', 
    passport.authenticate('linkedin'),
    function(req, res) {
        res.redirect('/?linkedin=success')
    }
);

router.post(
    '/auth/linkedin/session', 
    function(req, res){
        res.json(req.session.linkedin)
    }
);

passport.use(new LinkedinStrategy({
    clientID:  providers.linkedin.token,
    clientSecret:  providers.linkedin.secret,
    callbackURL:  providers.linkedin.callback,
    passReqToCallback: true,
    scope: ['r_liteprofile']
  },
  function(req, accessToken, refreshToken, profile, done) {
    let linkedinID = {
        method: 'linkedin',
        username: profile.displayName,
        id: profile.id,
        token: accessToken,
        created_at: Date.now()
    }
    sign.signWithKey(process.env.GATEWAY_PRV, JSON.stringify(linkedinID)).then(signature => {
        req.session.linkedin = {
            identity: linkedinID,
            fingerprint: signature.signature,
            gateway: signature.pubKey
        }
        return done(null, linkedinID)
    })
  }
));
passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(user, done) {
    done(null, user);
});
router.get('/linkedin/verify/:token', function(req, res){
    let token = req.params.token
    if(token !== undefined){
        //TODO
    }
})

module.exports = router;