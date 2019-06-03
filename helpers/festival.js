
const prod_dir = "/home/artium/Downloads/TTS/prod/"

exports.get_sys_err_path = function (cb) {
  cb(prod_dir + "static/error_in_tts.wav")
}

exports.get_sound_file_path = function (text, cb) {

  var timestamp = Date.now().toString();

  var fs = require("fs");

  var data = '(voice_cmu_us_clb_arctic_clunits )'
  data +=
    '(utt.save.wave (SayText "' + text + ' ") "' + timestamp + '.wav'+ '" \'riff)';
  
  var scriptFullPath = prod_dir + timestamp + '.scm'
  fs.writeFile(scriptFullPath, data, (err) => {
    if (err) console.log(err);
    console.log("Created file: " + scriptFullPath);
  });

  const
    { spawn } = require('child_process'),
    ls = spawn('festival', ['--batch', timestamp + '.scm'], { cwd: prod_dir });

  ls.stdout.on('data', data => {
    console.log(`stdout: ${data}`);
  });

  ls.stderr.on('data', data => {
    console.log(`stderr: ${data}`);
  });

  ls.on('close', code => {
    console.log(`child process exited with code ${code}`);

    if (code != 0) {
      Festival.get_sys_err_path(function(filepath) {
        cb(filepath)
      })
    } else {
      cb(prod_dir + timestamp + '.wav')
    }

  });
}
