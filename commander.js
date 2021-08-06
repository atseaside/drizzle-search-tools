const program = require('commander');

const packageJSON = require('./package.json');

program.version(packageJSON.version);

program.option('-v, --version', '查看当前版本号').action(function (cmd, options) {});

program.parse(process.argv);
