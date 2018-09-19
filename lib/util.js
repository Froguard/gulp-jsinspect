let fs = require('fs');
let highlighjs = require('highlight.js');
let marked = require('marked');

function prettyLineNum(index, start, end) {
    let res = `${start + index}`;
    let ln = res.length;
    let le = `${end}`.length;
    let i = le -ln;
    while (i--) {res = ` ${res}`;}
    return res;
}

function getTotalLines(match) {
    return match.instances.reduce((res, curr) => (res + curr.end.line - curr.start.line + 1), 0);
}

function getFileExt(instance) {
    let filename = instance.filename || '';
    let chk = filename.match(/\.(.+)$/) || [];
    return chk[1] || 'js';
}

function readSync(src, encode = 'utf-8') {
    return src ? fs.readFileSync(src, encode) : '';
}


function md2html(mdStr){
    let options = {
        highlight: function(code) {
            return highlighjs.highlightAuto(code).value;
        },
        pedantic: false,
        gfm: true,
        tables: true,
        breaks: false,
        sanitize: false,
        smartLists: true,
        smartypants: false,
        xhtml: false
    };
    return marked(mdStr, options);
}

module.exports = {
    prettyLineNum,
    getTotalLines,
    getFileExt,
    readSync,
    md2html
};