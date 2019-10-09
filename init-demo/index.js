const program  = require('commander');

program
  .command('create-mycli-app <type> [fileType] [projectName]')
  .alias('mycli')
  .description('init a new project')
  .action(callback)

function callback(type,fileType,projectName){
  console.log(type,fileType,projectName)
  switch(type) {
      case 'download':
        // 从仓库下载模版文件 mycli download [component|route] projectName
        // node index.js mycli download component myDownload
        const downloadFunc = require('./download.js');
        downloadFunc(fileType);
        break;

      case 'create':
        // 命令行创建模板文件 mycli create [component|route] projectName
        // node index.js create-mycli-app create component myapp 创建方法1
        // node index.js mycli create component myapp 创建方法2
        const createFunc = require('./create.js');
        createFunc(fileType,projectName);
        break;

      default: 
        return false;
    }
}

program.parse(process.argv);