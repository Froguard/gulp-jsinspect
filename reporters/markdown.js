let chalk = require('chalk');
let BaseReporter = require('jsinspect/lib/reporters/base');
let { getTotalLines } = require('../lib/util');

class MdReporter extends BaseReporter {

    constructor(inspector, opts) {
        opts = opts || {};
        super(inspector, opts);

        const enabled = chalk.enabled;

        inspector.on('start', () => {
            // close color
            chalk.enabled = false;
            this._writableStream.write('\n## Check report (via [Jsinspect](https://github.com/danielstjules/jsinspect))\n\n');
        });

        inspector.on('end', () => {
            chalk.enabled = enabled;
            this._writableStream.write('\n');
        });
    }

    _getOutput(match) {
        let output = (this._found > 1) ? '\n' : '';
        let codeFragment = '';
        let instances = match.instances;
        let totalLines = getTotalLines(match);

        output += `#### ID: *${match.hash}*,  Duplicate-Lines: ${totalLines}\n\n`;
        instances.forEach(instance => output += `- ${instance.filename}: ${instance.start.line}\n`);

        output += '\n```js';
        let lastIndex = instances.length - 1;
        instances.forEach((instance, index) => {
            let location = this._getFormattedLocation(instance);
            let lines = this._getLines(instance);
            codeFragment += `\n// ${location}\n${lines}${index === lastIndex ? '' : '\n'}`;
        });
        output += `${codeFragment}\n\`\`\`\n\n---\n\n`;

        return output;
    }
}

module.exports = MdReporter;
