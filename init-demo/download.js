const fs = require('fs');
const path = require('path');
const logSymbols = require('log-symbols');
const chalk = require('chalk');
const download = require('download-git-repo');
const inquirer = require('inquirer');
const ora = require('ora');

const downloadFunc = (name) => {
  if(!fs.existsSync(name)){ // 项目名不存在就直接下载
    inquirer.prompt([
      {
        name:'confirm',
        message:"你确定要下载模板吗？",
        default:"是的"
      }
    ]).then((answers)=>{
      const loading = ora('正从网上拉着呢。。。').start();
      download('direct:https://github.com/LaughSun0513/gulp-demo.git', '../src/download', { clone: true }, function (err) {
          if(err){
            loading.fail();
            const projectDir = path.dirname(process.cwd());
            const hasDownLoad = path.join(projectDir,'./src/download')
            if(hasDownLoad){
              console.log(logSymbols.error, chalk.red('已经从网上拉过一遍了,别再重新拉了')); 
              process.exit(1);
            }else{
              console.log(logSymbols.error, chalk.red(err));
              process.exit(1);
            }
          }else{
            loading.succeed();
            console.log(logSymbols.success, chalk.green('项目初始化完成'));
          }
      });
    })
  }else{
    console.log(logSymbols.error, chalk.red('项目已存在'));
    process.exit(1);
  }
}

module.exports = downloadFunc;