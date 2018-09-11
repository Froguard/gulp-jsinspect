let oldReporters = require('jsinspect').reporters;
let chalk = require('chalk');
let MdReporter = require('./markdown.js');

chalk.enabled = false;

function prettyLineNum(index, start, end) {
    let res = `${start + index}`;
    let ln = res.length;
    let le = `${end}`.length;
    let i = le -ln;
    while (i--) {res += ' ';}
    return res;
}

let orgReporters = Object.assign({}, oldReporters, {
    markdown: MdReporter
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