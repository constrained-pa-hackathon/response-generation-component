const express = require('express')
  , router = express.Router()
ownship = require('../models/ownship')
wingmans = require('../models/wingmans')
festival = require('../helpers/festival')
tanker = require('../models/tanker')


var fs = require("fs");


/**
 * Synthesize text into speech and send the generated file via response object.
 * @param {*} res Response object
 * @param {*} text Text to synthesize
 */
function response_tts_file(res, text) {
  festival.get_sound_file_path(text, function (filepath) {
    console.log(`Sending file ${filepath}...`)

    fs.exists(filepath, function (exists) {
      if (exists) {
        res.download(filepath);
      } else {
        response_error_file(res)
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
  festival.get_sys_err_path(function(filepath) {
    res.download(filepath)
    // TODO: Send 503 if file does not exist
  })
}

router.get('/', function (req, res) {
  ownship.get_freq(function (err, ownship_freq) {
    wingmans.get_all_data(function (err, ac_db) {
      res.render('index', { ownship_freq: ownship_freq, ac_db: ac_db })
    })
  })
})

/********************
 * A P I   P A R T  *
 ********************/

/**
 * Generate a response.
 * 
 * Currently our whole business logic is stored here.
 */
router.post('/response', function (req, res) {
  obj = req.body

  resJson = {"text" : "Unknown command."}
  switch(obj.action){
    case "set":
      if(obj.object === "frequency") {
        query = obj.value
        if( obj.value.callsign === "tanker" && obj.value.number ==="" ){
        var currTankerData=  tanker.getTankerFreq()
            obj.value.callsign = currTankerData.callsign
            obj.value.number = currTankerData.number
            obj.value.freq = currTankerData.freq
        }
        console.log(obj)
        query = obj.value
        ownship.set_freq(query, function (err, freq) {
        if (err === null) {
          resJson = {"text" : `Frequency was set to ${freq}.`}
        } else{
          console.error(err.errMessage)
          resJson = {"text" : err.errMessage }
        }
        })

      } else if (obj.object === "tanker"){

            resJson = {"text":tanker.setTanker({callsign : obj.value.callsign,
                              number : obj.value.number})}
      }
      break;
    case "get":
        if (obj.object === "frequency") {
            callsign = obj.value.callsign
            number = obj.value.number

            wingmans.get_freq(callsign, number, function (err, obj) {
                if (err === null) {
                    resJson = {"text" : `Frequency of ${callsign} ${number} is ${obj.freq}.`}
                } else if (err ==="not found") {
                    resJson = {"text" : `No aircraft with call-sign ${callsign} ${number}.`}
                } else {
                    resJson = {"text" : "Simulation model error." }
                }
            })
        }else if (obj.object === "tanker"){
            let currTankerData = tanker.getTankerFreq()

            if("callsign" in currTankerData && "number" in currTankerData){
                resJson = {"text": `The tanker is ${currTankerData.callsign} ${currTankerData.number} it's frequency is ${currTankerData.freq}`}
            }
            else{
                resJson = {"text": `No tanker was set`}
            }
        }
        break
    case "undo":
        freq = ownship.undo_frequency()
        resJson = {"text" : `Frequency was set to ${freq}.`}
        break
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


/**
 * Synthesize text into speech
 */
router.post('/set/tanker', function (req, res) {
  text = req.query.text
  response_tts_file(res, text)
})


module.exports = router
