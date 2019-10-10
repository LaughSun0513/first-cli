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

### commander的使用 -- 用于创建命令行
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

### inquirer的使用 -- 和用户交互提问并收集答案
```
inquirer.prompt([
  {},{},{}
])
```
```js
const inquirer = require('inquirer');
inquirer.prompt([
  {
    type:'input',
    name:'name', 
    message:'你叫什么名字', // 提问
    default:'小明', //用户不输入答案，默认值
    prefix:"您好",
    suffix:"感谢回答!"
  },
  {
    type:'input',
    name:'age',
    message:(e)=>{ // 可以是函数
      return `${e.name},请输入你的年龄？`
    },
    default:()=>{ // 可以是函数
      return 23
    }
  },
  {
    type: "list", // 列表
    message:'请选择性别',
    name: 'sex',
    default:'男',
    choices: ['男', '女']  // 用于设置选择的列
  },
  {
    type: "input",
    message:'请输入您的电话号码？',
    name: 'mobile',
    default:'13612341234',
    validate:(e)=>{ // 用来校验输入的答案是否符合要求
        if(e.match(/^[1][2,3,5,6,7,8][0-9]{9}$/)){return true}
        console.log('\n您输入的电话号码格式不对，请重新输入')
        return false;
    }
  },
  {
    type: "checkbox",
    message:'请选择衣服尺寸？',
    name: 'size',
    choices:['大', '小'],
    filter:(e)=>{ // 对输入的答案进行处理后返回新的答案
        let size = '';
        e == '大' ? size = 'big' : size = 'small';
        return size;
    }
  },
  {
    type: "list",
    message:(e)=>{ // 设定when的条件
      let currentSex = '';
      e.sex == '男' ? currentSex='女' : currentSex='男'
      return `请问你有${currentSex}盆友了吗？`
    },
    name: 'haveGirlFriend',
    choices:['有', '没有'],
  },
  {
    type: "input",
    message:'请问你们是怎么认识的？',
    name: 'place',
    when:(e)=>{ // 用来设定这个问题是否有必要被提问（Function），返回boolean,返回false表示忽略这个问题
     return e.haveGirlFriend === '有'
    },
    default:'菜场'
  }
]).then(answers=>{
  console.log(answers)
}).catch(err=>{
  console.log(err)
})
/* 
{ 
  name: '小明',
  age: 23,
  sex: '男',
  mobile: '13612341234',
  size: 'big',
  haveGirlFriend: '有',
  place: '菜场' 
}
*/
```

### download-git-repo的使用 -- 从网上拉仓库代码
```js
const download = require('download-git-repo');
download('direct:https://github.com/LaughSun0513/gulp-demo.git', 'download-dir/tmp', { clone: true }, function (err) {
  console.log(err ? 'Error' : 'Success')
});
```

### log-symbols -- 让日志更好看 不必须
```js
const logSymbols = require('log-symbols');

console.log(logSymbols.success,'success');
console.log(logSymbols.info,'info');
console.log(logSymbols.warning,'warning');
console.log(logSymbols.error,'error');

/*
  ✔ success
  ℹ info
  ⚠ warning
  ✖ error
*/
```

### ora -- 终端产生loading 不必须
```js
const ora = require('ora');

const loading = ora('菊花正在加载。。。。');
loading.start();

setTimeout(()=>{
  loading.text="菊花加载失败"
  loading.fail();
},2000)

setTimeout(()=>{
  loading.text="菊花加载成功"
  loading.succeed();
},3000)

```


