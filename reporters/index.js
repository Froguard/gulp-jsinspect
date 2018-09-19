let oldReporters = require('jsinspect').reporters;
let chalk = require('chalk');
let MdReporter = require('./markdown.js');
let HtmlReporter = require('./html/index');
let { prettyLineNum } = require('../lib/util');
chalk.enabled = false;

let orgReporters = Object.assign({}, oldReporters, {
    markdown: MdReporter,
    html: HtmlReporter
});
let orgRptrNames = Object.keys(orgReporters);

let reporters = {};
orgRptrNames.forEach((className) => {
    reporters[className] = class extends orgReporters[className]{
        constructor(inspector, opts){
            opts = opts || {};
            super(inspector, opts);
            this._lineNumber = !!opts.lineNumber;
        }
        _getLines(instance) {
            let lines = instance.lines.split('\n');
            let start = instance.start.line;
            let end = instance.end.line;
            if (this._lineNumber) {
                lines = lines.map((l, i) => `${prettyLineNum(i, start, end)} | ${l}`);
            }
            if (this._truncate) {
                lines = lines.slice(0, this._truncate);
            }
            return lines.join('\n');
        }
    };
});

reporters.md = reporters.markdown;

module.exports = reporters;
