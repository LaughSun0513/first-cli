const minimist = require('minimist');

const args = minimist(process.argv);

console.log(args);
//  1 node minimist.js --hello
/*
{ _:
  [ '/usr/local/bin/node',
    '/Users/xxx/Desktop/first-cli/cli-2/utils-demos/minimist.js' ],
 hello: true }
 */

 // 2 node minimist.js --hello=world
 // 2 node minimist.js --hello world
 /*
 { _:
   [ '/usr/local/bin/node',
     '/Users/xxx/Desktop/first-cli/cli-2/utils-demos/minimist.js' ],
  hello: 'world' }
 */

 // node minimist.js --hello world -a -b
 /*
{ _:
   [ '/usr/local/bin/node',
     '/Users/xxx/Desktop/first-cli/cli-2/utils-demos/minimist.js' ],
  hello: 'world',
  a: true,
  b: true }
  */

// node minimist.js --hello world -a 1 -b 2 c d e
 /*
{ _:
   [ '/usr/local/bin/node',
     '/Users/yuxiaoyang03/Desktop/first-cli/cli-2/utils-demos/minimist.js',
     'c',
     'd',
     'e' ],
  hello: 'world',
  a: 1,
  b: 2 }
  */