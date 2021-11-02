const express = require('express')
const passport = require('passport')
require('dotenv').config()
var app = express()
var cors = require('cors')
const formidableMiddleware = require('express-formidable')
app.use(require('serve-static')(__dirname + '/public'))
app.use(require('cookie-parser')())
app.use(require('body-parser').urlencoded({ extended: true }))
app.use(passport.initialize())
app.use(cors())
const port = process.env.ENGINE_PORT
var session = require('express-session')
app.set('trust proxy', 1)
const providers = require('./providers')
const fs = require('fs')
var availables = []

// app.use(session({
//     secret: process.env.SESSION_SECRET,  
//     resave: false,
//     saveUninitialized: true
// }))
app.use(express.static('public'))
app.use(formidableMiddleware());

app.get('/', 
    function(req, res){
        fs.readFile('index.html', {encoding: 'utf-8'}, function(err,data){
            res.send(data)
        })
    }
)

var eid = require('./providers/eid');
app.use('/', eid);
availables.push('eid')

if(providers.github !== undefined){
    var github = require('./providers/github');
    app.use('/', github);
    availables.push('github')
}

if(providers.google !== undefined){
    var google = require('./providers/google');
    app.use('/', google);
    availables.push('google')
}

if(providers.twitter !== undefined){
    var twitter = require('./providers/twitter');
    app.use('/', twitter);
    availables.push('twitter')
}

if(providers.linkedin !== undefined){
    var linkedin = require('./providers/linkedin');
    app.use('/', linkedin);
    availables.push('linkedin')
}

// if(providers.phone !== undefined){
//     var phone = require('./providers/phone');
//     app.use('/', phone);
//     availables.push('phone')
// }

if(providers.email !== undefined){
    var email = require('./providers/email');
    app.use('/', email);
    availables.push('email')
}

var ethereum = require('./providers/ethereum');
app.use('/', ethereum);
availables.push('ethereum')

app.get('/auth/error', function (req, res) {
    res.json({message: 'Authentication failed', status: 401})
})

app.get('/providers', function (req, res) {
    res.json({providers: availables, status: 200})
})

app.listen(port, () => console.log(`BDCash identity framework listening on port ${port}!`))
