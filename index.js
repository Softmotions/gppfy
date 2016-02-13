///////////////////////////////////////////////////////////////////////////
//           GPP preprocessor integrated into Browserify                 //
///////////////////////////////////////////////////////////////////////////


var through = require('through2'),
        fs = require('fs'),
        concat = require('concat-stream'),
        spawn = require('child_process').spawn;

module.exports = function (file, opts) {
    opts = opts || {};
    var testHtml = /\.html$/;
    var testJs = /\.js$/;
    var gppArgs = ['-n', '--nostdinc'];

    console.error('file=' + file + ' opts=' + JSON.stringify(opts));
    if (testJs.test(file)) {
        gppArgs = gppArgs.concat([
            '-U', '', '', '(', ',', ')', '(', ')', '#', '',
            '-M', '//#', '\\n', ' ', ' ', '\\n', '', ''
        ]);
    } else if (testHtml.test(file)) {
        gppArgs = gppArgs.concat([
            '-U', '', '', '(', ',', ')', '(', ')', '#', '',
            '-M', '<!--#', '\\w-->', ' ', ' ', '\\w-->', '', ''
        ])
    } else {
        return (through());
    }

    var inc = opts['i'];
    var defs = opts['D'];


    if (typeof inc === 'string') {
        inc = [inc];
    }
    if (Array.isArray(inc)) {
        inc.forEach(function (f) {
            gppArgs.push('--include');
            gppArgs.push(f);
        });
    }

    if (typeof  defs === 'string') {
        defs = [defs];
    }
    if (Array.isArray(defs)) {
        defs.forEach(function (d) {
            gppArgs.push('-D' + d);
        });
    }

    if (opts['d']) {
        console.error('gpp args: ' + JSON.stringify(gppArgs));
    }

    return through(function (buf, enc, next) {
        var self = this,
                end = false,
                exit = false,
                child = spawn('gpp', gppArgs);

        child.stdout.pipe(concat(function (buf) {
            if (buf instanceof Buffer) {
                self.push(buf);
            }
            end = true;
            if (exit) {
                next();
            }
        }));

        // stderr
        child.stderr.pipe(fs.createWriteStream('gpp.log', {flags: 'a'}));

        // exit code
        child.on('exit', function (code, signal) {
            if (code) {
                var err = new Error('Exit code is not zero. See gpp.log file.');
                err.name = 'ChildProcessError';
                err.code = code;
                err.signal = signal;
                self.emit('error', err);
            }
            exit = true;
            if (end) {
                next();
            }
        });

        // stdin
        child.stdin.end(buf);
    });
};


