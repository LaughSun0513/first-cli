const program  =require('commander');

program
  .command('create-mycli-app <type> [projectName] [otherParams]')
  .alias('mycli')
  .description('init a new project')
  .action(callback)

function callback(type,projectName,otherParams){
  console.log('type', type, projectName, otherParams);
  switch(type) {
      case 'download':
        // 从仓库下载模版文件
        const downloadFunc = require('./download.js');
        downloadFunc(projectName);
        break;

      case 'create':
        // 命令行创建模板文件 mycli create 
        const createFunc = require('./create.js');
        createFunc(projectName, otherParams);
        break;

      default: 
        return false;
    }
}

program.parse(process.argv);