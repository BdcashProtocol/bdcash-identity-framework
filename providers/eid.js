const { exec } = require('child_process');
const fs = require('fs')
const BDCashCore = require('@bdcash-protocol/core')
const bdcash = new BDCashCore
const express = require('express')
const axios = require('axios')
require('dotenv').config()
var router = express.Router()
var sha256File = require('sha256-file')
const sign = require('../libs/sign')

router.post('/eid/verify',
    function (req, res) {
        let p7mfile = req.files.file
        let address = req.fields.address
        exec('openssl pkcs7 -inform DER -in ' + p7mfile.path + ' -print_certs -out ./temp/' + address + '.pem', async (error, stdout, stderr) => {

            if (error) {
                console.error(`exec error: ${error}`);
                return;
            }

            let cert = fs.readFileSync('./temp/' + address + '.pem').toString().split(',')

            for (let k in cert) {
                let parse = cert[k]
                if (parse.indexOf('subject=CN = ') !== -1) {
                    var CF = parse.replace('subject=CN = ', '')
                }
                if (parse.indexOf(' serialNumber = ') !== -1) {
                    var CID = parse.replace(' serialNumber = ', '').replace('IDCIT-', '')
                }
                if (parse.indexOf(' GN = ') !== -1) {
                    var name = parse.replace(' GN = ', '')
                }
                if (parse.indexOf(' SN = ') !== -1) {
                    var surname = parse.replace(' SN = ', '')
                }
                if (parse.indexOf(' OU = ') !== -1) {
                    var issuer = parse.replace(' OU = ', '')
                }
                if (parse.indexOf(' O = ') !== -1) {
                    var office = parse.replace(' O = ', '')
                }
                if (parse.indexOf(' C = ') !== -1) {
                    let cc = parse.replace(' C = ', '').split("\n")
                    var country = cc[0]
                }
            }

            try {
                let p7mhash = sha256File(p7mfile.path)
                let p7m = fs.readFileSync(p7mfile.path).toString()
                let init = p7m.indexOf('message') - 1
                let end = p7m.indexOf(address)
                let lend = end - init + 35
                let json = "{" + p7m.substr(init, lend) + "}"
                let bdcashID = JSON.parse(json)

                // REMOVING TEMP FILES
                fs.unlink('./temp/' + address + '.pem', (err) => {
                    if (err) {
                        console.log(err)
                    }
                })
                fs.unlink(p7mfile.path, (err) => {
                    if (err) {
                        console.log(err)
                    }
                })

                if (bdcashID.pubkey !== undefined && bdcashID.signature !== undefined && bdcashID.message !== undefined) {
                    let verify = await bdcash.verifyMessage(bdcashID.pubkey, bdcashID.signature, bdcashID.message)
                    if (verify !== false) {
                        if (CF !== undefined && CID !== undefined && name !== undefined && surname !== undefined && issuer !== undefined && office !== undefined && country !== undefined) {
                            if (bdcashID.message === CID && req.fields.eidnumber === CID) {
                                let eID = {
                                    method: 'eid',
                                    payload: {
                                        subject: CF,
                                        id_number: CID,
                                        name: name,
                                        surname: surname,
                                        issuer: issuer,
                                        office: office,
                                        country: country,
                                        p7mhash: p7mhash
                                    },
                                    created_at: Date.now()
                                }
                                sign.signWithKey(process.env.GATEWAY_PRV, JSON.stringify(eID)).then(signature => {
                                    res.json({
                                        success: {
                                            identity: eID,
                                            fingerprint: signature.signature,
                                            gateway: signature.pubKey
                                        },
                                        status: 200,
                                        error: false
                                    })
                                })
                            }else{
                                res.json({ error: true, message: "Blockchain signature doesn't match eID number"})
                            }
                        } else {
                            res.json({ error: true, message: "Can't extract data from eID" })
                        }
                    } else {
                        res.json({ error: true, message: "Blockchain signature isn't valid" })
                    }
                } else {
                    res.json({ error: true, message: "Blockchain signature isn't valid" })
                }

            } catch (e) {
                res.json({ error: true, message: "Can't verify eID" })
            }
        });
    }
)

module.exports = router;