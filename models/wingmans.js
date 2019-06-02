
ac_data = [
    { callsign: "pirates", number: "1", freq : "330.50" },
    { callsign: "pirates", number: "2", freq : "330.50" },
    { callsign: "armenia", number: "1", freq : "777.00" }
] 

/*exports.set_freq = function(callsign, number, freq, cb) {

  for (var it in ac_data) {
    if(it.callsign == callsign && it.number == number) {
      
      it.freq = freq
      cb(null,  {callsign:callsign, number:number, freq:it.freq})
      return
    }
  }

  // New in db
  ac_data.push({ callsign: callsign, number: number, freq: freq })
  cb(null, { callsign: callsign, number: number, freq: freq })

}*/

exports.get_all_data = function(cb) {
  cb(null, ac_data)
}


exports.get_freq = function(callsign, number, cb) {

  for (var i in ac_data) {
    it = ac_data[i]
    if(it.callsign == callsign && it.number == number) {
      console.log("Model: Freq of " + callsign + " " + number + " is " + it.freq)
      cb(null, {callsign:callsign, number:number, freq:it.freq})
      return
    }
  }

  console.log("Model: Not found " + callsign + " " + number)
  cb("not found", {callsign:callsign, number:number})
}

