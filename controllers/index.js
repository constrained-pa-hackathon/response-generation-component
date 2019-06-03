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

/**
 * Response with a pre recorded error file
 * saying about text to speech error.
 * @param {*} res 
 */
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

/**
 * Generate a response.
 * 
 * Currently owr whole business logic is stored here.
 */
router.post('/response', function (req, res) {
  obj = req.body

  resJson = {"text" : "Unknown command."}

  if (obj.action == "set") {
    if(obj.subject == "frequency") {

      freq = obj.params.freq
      console.log(freq)

      Ownship.set_freq(freq, function (err, freq) {
        if (err == null) {
          resJson = {"text" : `Frequency was set to ${freq}.`}
        } else if (err == "invalid frequency") {
          resJson = {"text" : "Bad frequency" }
        } else {
          resJson = {"text" : "Simulation model error." }
        }
      })
    }

  } else if (obj.action == "get") {
    if (obj.subject == "frequency") {

      callsign = obj.params.callsign
      number = obj.params.number

      Wingmans.get_freq(callsign, number, function (err, obj) {
        if (err == null) {
          resJson = {"text" : `Frequency of ${callsign} ${number} is ${obj.freq}.`}
        } else if (err =="not found") {
          resJson = {"text" : `No aircraft with call-sign ${callsign} ${number}.`}
        } else {
          resJson = {"text" : "Simulation model error." }
        }
      })
    }
  }

  console.log(resJson)
  res.set("Content-Type", "application/json");
  res.set(200);
  res.send(JSON.stringify(resJson));
  res.end();

})

/**
 * Synthesize text into speech
 */
router.post('/synth', function (req, res) {
  text = req.query.text
  response_tts_file(res, text)
})


module.exports = router