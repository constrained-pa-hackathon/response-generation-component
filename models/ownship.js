var Frequency = require('../helpers/frequency')
var Wingmans = require('./wingmans')

var ownship_freq = "300.00" // Initial value
var last_ownship = ownship_freq

exports.ownship_freq = ownship_freq

// Change ownship's frequency
exports.set_freq = function(obj, cb) {
  if ('freq' in obj){
     if (Frequency.is_valid(freq) == false) {
       console.log("Model: invalid frequency " + freq )
       cb("invalid frequency", null)
     } else {
       last_ownship = ownship_freq
       ownship_freq = freq
       console.log("Model: new ownship frequency is " + ownship_freq )
       cb(null, freq)
     }
  }
  else if('callsign' in obj && 'number' in obj){
      Wingmans.get_freq(obj['callsign'], obj['number'], function (err, obj) {
          if(err == null){
            last_ownship = ownship_freq
            ownship_freq = obj.freq
            console.log("Model: new ownship frequency is " + ownship_freq )
            cb(null, obj.freq)
          }
      })
  }
}

exports.undo_frequency = function(){
    let temp_freq = ownship_freq
    ownship_freq = last_ownship
    last_ownship = temp_freq
    return ownship_freq
}

// Get ownship's frequency
exports.get_freq = function(cb) {
  cb(null, ownship_freq)
}

