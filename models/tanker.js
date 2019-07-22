const frequency = require('../models/ownship')
const wingmans = require('./wingmans')

var currTanker = {callsign: "pirates",
                  number:"1"}





const getTankerFreq = ()=>{
let freq
      wingmans.get_freq(currTanker.callsign, currTanker.number, function (err, obj) {

    if (err === null) {
     return  freq =  obj.freq
    } else if (err ==="not found") {
      return freq = "not found"
    } else {
      return freq = "someErr"
    }
  })
  return {callsign:currTanker.callsign, number:currTanker.number,freq: freq}
}


const setTanker = (netId)=>{
    currTanker = netId
    console.log(currTanker)
   return `Set the tanker to be ${netId.callsign} ${netId.number}.`
 }

exports.Tanker = ()=>{console.log(currTanker);return currTanker}
exports.getTankerFreq = getTankerFreq
exports.setTanker = setTanker