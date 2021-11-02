const express = require('express')
const passport = require('passport')
const axios = require('axios')
require('dotenv').config()
const providers = require('../providers')
const sign = require('../libs/sign')
var GitHubStrategy = require('passport-github').Strategy;
var router = express.Router();

router.get('/auth/github', passport.authenticate('github'));
router.get('/auth/github/callback', 
    passport.authenticate('github', { failureRedirect: '/auth/error', session: false }),
    function(req, res) {
        if(req.session.github !== undefined){
            res.redirect('/?github=success')
        }else{
            res.redirect('/auth/error')
        }
    }
);
router.post(
    '/auth/github/session', 
    function(req, res){
        res.json(req.session.github)
    }
);

passport.use(new GitHubStrategy({
    clientID: providers.github.token,
    clientSecret: providers.github.secret,
    callbackURL: providers.github.callback,
    passReqToCallback: true
  },
  function(req, accessToken, refreshToken, profile, done) {
    let githubID = {
        method: 'github',
        username: profile.username,
        id: profile.id,
        token: accessToken,
        created_at: Date.now()
    }
    sign.signWithKey(process.env.GATEWAY_PRV, JSON.stringify(githubID)).then(signature => {
        req.session.github = {
            identity: githubID,
            fingerprint: signature.signature,
            gateway: signature.pubKey
        }
        return done(null, githubID)
    })
  }
));

router.get('/github/verify/:token', function(req, res){
    let token = req.params.token
    if(token !== undefined){
        axios.get('https://api.github.com/user', { params: {access_token: token }}).then(result => {
            res.json({verified: true, profile: result.data})
        }).catch(error => {
            res.json({verified: false})
        })
    }
})

module.exports = router;