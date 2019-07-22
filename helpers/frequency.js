exports.is_valid = function(freq, message) {
    var regex = RegExp('[0-9][0-9][0-9][.][0-9][0-9]');

    if (regex.test(freq) == false) {
        message.msg = "Bad frequency format"
     
        return false
    } else { 
        if (parseFloat(freq) < 300.0){
            message.msg ="The frequency is too low"
            return false
        } else if (parseFloat(freq) >= 600.0){
            message.msg ="The frequency is too high"
            return false
        } else{
            return true
        }
    }
}