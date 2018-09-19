let chalk = require('chalk');
let BaseReporter = require('jsinspect/lib/reporters/base');
let tpl = require('./tpl/index');

let { prettyLineNum, getTotalLines, getFileExt, md2html } = require('../../lib/util');

class HtmlReporter extends BaseReporter {

    constructor(inspector, opts) {
        opts = opts || {};
        super(inspector, opts);

        const enabled = chalk.enabled;

        inspector.on('start', () => {
            // close color
            chalk.enabled = false;
            let link = 'https://github.com/danielstjules/jsinspect';
            let head = `${tpl.begin}\n<h2>Check report (via gulp-<a class="u-link" target="_blank" href="${link}">Jsinspect</a>y)</h2>\n\n`;
            this._writableStream.write(head);
        });

        inspector.on('end', () => {
            chalk.enabled = enabled;
            this._writableStream.write(`\n${tpl.end}`);
        });
    }

    _getOutput(match) {
        let found = this._found;
        let output = (found > 1) ? '<hr>\n' : '';
        let instances = match.instances;
        let totalLines = getTotalLines(match);

        output += `<h4 id="M${found}" data-hash="${match.hash}">`
            + `<a class="u-link" href="#M${found}">Index: ${found} , Duplicate-Lines: ${totalLines}</a></h4>\n`;

        if (instances.length){
            output += '<ul>\n';
            instances.forEach((ins, i) => {
                let id = `M${found}N${i}`;
                output += `\t<li><a class="u-link" href="#${id}">- ${this._getFormattedLocation(ins)}</a></li>\n`
            });
            output += '</ul>\n';
        }


        let codeFragment = '';
        instances.forEach((ins, i) => {
            let id = `M${found}N${i}`;
            codeFragment += `<div id="${id}" class="con-code">\n${this.__getHtmlLines(ins, i, found)}</div>\n`
        });
        output += codeFragment;

        return output;
    }

    __getHtmlLines(instance, index, found) {
        let start = instance.start.line;
        let end = instance.end.line;


        let srcCode = instance.lines || '';
        let location = this._getFormattedLocation(instance);
        let fileExt = getFileExt(instance);

        let source = `\`\`\`${fileExt||'js'}\n/* ${location} */ \n${srcCode}\n\`\`\``;

        let htmlCode = md2html(source);


        let lines = htmlCode.split('\n');
        if (this._truncate) {
            lines = lines.slice(0, this._truncate + 1);
        }
        if (this._lineNumber) {
            if (lines.length) {
                let last = lines.length - 1;
                lines = lines.map((l, i) => {
                    let lineNum = prettyLineNum(i-1, start, end);
                    let ln = `${lineNum}`.trim();
                    let id = `M${found}N${index}L${ln}`;
                    return `${(0<i&&i<last)?(`<a id="${id}" href="#${id}" class="line-num" data-num="${lineNum}"></a> `):''}${l}`;
                });
            }

        }
        return lines.join('\n');
    }
}

module.exports = HtmlReporter;