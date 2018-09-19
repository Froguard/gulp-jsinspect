let path = require('path');
let { readSync } = require('../../../lib/util');
let cssCode = readSync(path.join(__dirname, './highlight.css'));
let tplCode = readSync(path.join(__dirname, './tpl.html'));

let [begin, end] = tplCode.split('<!-- split -->');
begin = begin.replace(/<!-- css-code-here -->/, cssCode);

module.exports = {
    begin,
    end
};