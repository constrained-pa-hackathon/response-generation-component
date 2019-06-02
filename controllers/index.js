var express = require('express')
  , router = express.Router()
Ownship = require('../models/ownship')
Wingmans = require('../models/wingmans')
Festival = require('../helpers/festival')

var fs = require("fs");

/**
 * Synthesize text into speech and send the generated file to via response object.
 * @param {*} res Response object
 * @param {*} text Text to synthesize
 */
function response_tts_file(res, text) {

  Festival.get_sound_file_path(text, function (filepath) {
    console.log(`Sending file ${filepath}...`)

    fs.exists(filepath, function (exists) {
      if (exists == false) {
        response_error_file(res)
      } else {

        res.download(filepath);
      }
    });
  })
}


function response_error_file(res) {
  Festival.get_sys_err_path(function(filepath) {
    res.download(filepath)
  })
}

router.get('/', function (req, res) {
  Ownship.get_freq(function (err, ownship_freq) {
    Wingmans.get_all_data(function (err, ac_db) {
      res.render('index', { ownship_freq: ownship_freq, ac_db: ac_db })
    })
  })
})

/********************
 * A P I   P A R T  *
 ********************/

router.post('/set/frequency', function (req, res) {

  Ownship.set_freq(req.query.freq, function (err, freq) {
    if (err == null) {
      response_tts_file(res, `Frequency was set to ${freq}.`)
    } else if (err == "invalid frequency") {
      response_tts_file(res, `Invalid frequency.`)
    } else {
      response_error_file(res)
    }
  })
})

router.post('/read/frequency', function (req, res) {

  callsign = req.query.callsign

  Wingmans.get_freq(req.query.callsign, req.query.number, function (err, obj) {

    if (err == null) {
      response_tts_file(res, `Frequency of ${req.query.callsign} ${req.query.number} is ${obj.freq}.`)
    } else if (err =="not found") {
      response_tts_file(res, `No aircraft with call-sign ${req.query.callsign} ${req.query.number}.`)
    } else {
      response_error_file(res)
    }
  })
})

module.exports = router