const express = require('express')
const passport = require('passport')
const axios = require('axios')
require('dotenv').config()
var router = express.Router();

/* Using lob.com API */

router.get('/address/:privkey', 
    function(req, res){
        console.log('Requested address authentication.')
        var privkey = req.params.privkey
        req.session.privkey = privkey
    }
);

module.exports = router;