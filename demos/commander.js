#!/usr/bin/env node
const program = require('commander');
// const program = new program.Command();

program
 .version('0.0.1','-v, --version')
 .option('-d, --debug', 'output extra debugging')
 .command('setup')
   .alias('set')
   .description('run remote setup commands')
   .action(function(){
    console.log('setup');
   })

program.parse(process.argv)


