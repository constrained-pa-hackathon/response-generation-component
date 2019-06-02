Frequency = require('../helpers/frequency')
 
ownship_freq = "300.00" // Initial value


// Change ownship's frequency
exports.set_freq = function(freq, cb) {

  if (Frequency.is_valid(freq) == false) {
    console.log("Model: invalid frequency " + freq )
    cb("invalid frequency", null)
  } else {
    ownship_freq = freq
    console.log("Model: new ownship frequency is " + ownship_freq )
    cb(null, freq)
  }
}

// Get ownship's frequency
exports.get_freq = function(cb) {
  cb(null, ownship_freq)
}

