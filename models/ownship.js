ownship_freq = "300.00"


// Change ownship's frequency
exports.set_freq = function(freq, cb) {
  ownship_freq = freq
  console.log("Model: new ownship frequency is " + ownship_freq )
  cb(null, freq)
}

// Get ownship's frequency
exports.get_freq = function(cb) {
  cb(null, ownship_freq)
}

