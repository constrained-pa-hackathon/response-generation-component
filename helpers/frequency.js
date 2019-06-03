exports.is_valid = function(freq) {

    var regex = RegExp('[0-9][0-9][0-9][.][0-9][0-9]');

    if (regex.test(freq) == false) {
        return false
    } else {
        if (parseFloat(freq) < 300.0 || parseFloat(freq) >= 600.0) {
            return false
        } else {
            return true
        }
    }
}