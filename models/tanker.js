const frequency = require('../models/ownship')
const wingmans = require('./wingmans')

var currTanker





const getTankerFreq = ()=>{

   wingmans.get_freq(currTanker.callsign, currTanker.number, function (err, obj) {

    if (err == null) {
      response_tts_file(res, `Frequency of ${currTanker.callsign} ${currTanker.number} is ${obj.freq}.`)
    } else if (err =="not found") {
      response_tts_file(res, `No aircraft with call-sign ${currTanker.callsign} ${currTanker.number}.`)
    } else {
      response_error_file(res)
    }
  })
}


const setTanker = (netId)=>{
    currTanker = netId
    response_tts_file(res, `Set the tanker to be ${netId.callsign} ${netId.number}.`)
 }

exports.Tanker = currTanker