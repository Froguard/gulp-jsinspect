'use strict';
let fs = require('fs');
let path = require('path');
let gutil = require('gulp-util');
let through2 = require('through2');
let Vinyl = require('vinyl');
let Inspector = require('jsinspect').Inspector;
let Reporters = require('./reporters/index.js');
let PluginError = gutil.PluginError;

const PLUGIN_NAME = 'gulp-jsinspecty';
const CWD = process.cwd();
const rcPath = path.resolve(CWD, './.jsinspectrc');
let jsinspectRc = {};

if (fs.existsSync(rcPath) && fs.lstatSync(rcPath).isFile()) {
    let rcContent = fs.readFileSync(rcPath, 'utf-8');
    try {
        jsinspectRc = JSON.parse(rcContent);
    } catch(e) {
        jsinspectRc = new Function(`return (${rcContent})`)();
    }
}

let rptFileExtMap = {
    markdown: '.md',
    md: '.md',
    pmd: '.xml',
    json: '.json'
};

let defOpts = {
    threshold: 15,
    noDiff: false,
    identifiers: false,
    suppress: 100,
    color: false,
    failOnMatch: false,
    reportFilename: 'jsinspect-report'
};

let fakeWriteableStream = {};
['cork', 'destroy', 'on', 'pipe', 'setDefaultEncoding', 'uncork'].forEach(k => fakeWriteableStream[k] = () => {});

function gulpJsinspecty(option = {}) {
    let filePaths = [], contents = [];
    option = Object.assign({}, defOpts, jsinspectRc, option || {});

    let transformFn = (file, enc, cb) => ((file.isNull() ? 0 : filePaths.push(file.path)) && cb());

    function flushFn(cb){
        if (filePaths.length === 0) {
            return cb();
        }
        let self = this;
        let reportFilename = option.reportFilename || defOpts.reportFilename;
        let reportFileExt = rptFileExtMap[option.reporter] || '.txt';
        reportFilename = /\..+$/.test(reportFilename) ? reportFilename : `${reportFilename}${reportFileExt}`;

        fakeWriteableStream.end = () => {
			self.push(new Vinyl({
				cwd: CWD,
				path: path.join(CWD, reportFilename),
				contents: Buffer.from(contents, 'utf-8')
			}));
			cb();
		};

		fakeWriteableStream.write = data => (contents += data) || !0;

        let inspector = new Inspector(filePaths, {
            threshold: option.threshold,
            identifiers: option.identifiers,
            literals: option.literals,
            minInstances: option.minInstances
        });

        let ReporterClass = Reporters[option.reporter] || Reporters.default;
        new ReporterClass(inspector, {
            suppress: option.suppress,
            truncate: option.truncate,
            writableStream: fakeWriteableStream,
            lineNumber: option.lineNumber
        });

        inspector.on('error', err => this.emit('error', new PluginError(PLUGIN_NAME, err.message)));

        if (option.failOnMatch) {
            inspector.on('match', () => this.emit('error', new PluginError(PLUGIN_NAME, 'jsinspect exit by matched')));
        }

        inspector.run();
    }

    return through2.obj(transformFn, flushFn);
}

module.exports = gulpJsinspecty;