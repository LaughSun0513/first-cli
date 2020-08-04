const program = require('commander');
const { version } = require('./constants');
const { createCommand } = require('./actions');

// program.version('0.0.1').parse(process.argv);
createCommand();
program.version(version).parse(process.argv);