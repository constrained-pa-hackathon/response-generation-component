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
    let isTankerInWingmans = false
    if(wingmans.get_all_data((err,ac_data)=>{
        for (let i in ac_data) {
    let it = ac_data[i]
    if(it.callsign === netId.callsign && it.number === netId.number) {
        currTanker = netId
           isTankerInWingmans = true}}
    }))


        console.log("I don't like to program with callbacks")
        console.log("Add delay")
        console.log("Add delay")

        if(isTankerInWingmans){
         return `Set the tanker to be ${netId.callsign} ${netId.number}.`
        }else{
         return `err . cant find tanker in wingmans`
        }

 }

exports.Tanker = ()=>{console.log(currTanker);return currTanker}
exports.getTankerFreq = getTankerFreq
exports.setTanker = setTanker
