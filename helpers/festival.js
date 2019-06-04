
const path = require("path")

const prod_dir = "/tmp/"

exports.get_sys_err_path = function (cb) {
  cb(prod_dir + "static/error_in_tts.wav")
}

exports.get_sound_file_path = function (text, cb) {

  var timestamp = Date.now().toString();

  var fs = require("fs");

  // TODO: Receive voice from UI
  var voice = "cmu_us_fem_cg" //"cmu_us_clb_arctic_clunits"
  
  // Important: must call vocie BEFORE custom require
  var data = `(voice_${voice})` 
  // Notice: path delimiter might not be good for Windows
  data += `(require "${path.resolve(".")}/custom")`
  data += `(set! utt1 (Utterance Text "${text}"))`
  data += '(utt.synth utt1)'
  data += `(utt.save.wave utt1 "${timestamp}.wav" 'riff)`

  console.log(data)

  //data +=
  //  '(utt.save.wave (SayText "' + text + ' ") "' + timestamp + '.wav'+ '" \'riff)';
  
  var scriptFullPath = prod_dir + timestamp + '.scm'
  fs.writeFile(scriptFullPath, data, (err) => {
    if (err) console.log(err);
    console.log("Created file: " + scriptFullPath);
  });

  // Need to make sure festival is in $PATH
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
