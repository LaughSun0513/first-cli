# first-cli
### 修改package.json添加bin字段
```js
"bin": {
    "ycli": "./bin/ycli"
},
```
```js
#!/usr/bin/env node
require('../index')
```

### commander的使用
- commander.version 用于设置命令程序的版本号
- commander.option('-n, --name <name>', 'your name', 'GK')  
  - 第一个参数是选项定义，分为短定义和长定义。用|，,，连接。
  - 参数可以用<>或者[]修饰，前者意为必须参数，后者意为可选参数。
  - 第二个参数为选项描述
  - 第三个参数为选项参数默认值，可选。
- commander.command 可以接受三个参数，第一个为命令定义，第二个命令描述，第三个为命令辅助修饰对象
  - 第一个参数中可以使用<>或者[]修饰命令参数
  - 第二个参数可选。
  当没有第二个参数时，commander.js将返回Command对象，若有第二个参数，将返回原型对象。
  当带有第二个参数，并且没有显示调用action(fn)时，则将会使用子命令模式。
  所谓子命令模式即，./pm，./pm-install，./pm-search等。这些子命令跟主命令在不同的文件中。
  - 第三个参数一般不用，它可以设置是否显示的使用子命令模式。
- commander.description 用于设置命令的描述
- commander.action 用于设置命令执行的相关回调
- commander.alias  用于命令执行的别名

- commander.parse 一般是最后调用，用于解析process.argv

```js

#!/usr/bin/env node
const program = require('commander');
// const program = new program.Command();

program
 .version('0.0.1')
 .option('-d, --debug', 'output extra debugging')
 .command('setup')
   .alias('set')
   .description('run remote setup commands')
   .action(function(){
    console.log('setup');
   })

program.parse(process.argv)

```
```
# 执行命令
node ./demos/commander.js -d

node ./demos/commander.js setup
or
node ./demos/commander.js set
```
