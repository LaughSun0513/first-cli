const os = require('os');
const fs = require('fs-extra');
const path = require('path');
const { message } = require('./utils');

// 首字母大写
const firstToUppercase = (str) => {
  return `${str.charAt(0).toUpperCase()}${str.slice(1)}`
}
const createComponent = (currentDir,params)=>{
  const appName = params.name;
  const sep = os.platform() === 'win32' ? '\\' : '/'; //找到复合系统的分割符
  const appNameToUpperCase = firstToUppercase(appName);
  const finalDir = `${currentDir}${sep}${appNameToUpperCase}`; // 生成的项目目录
  const fileName = 'index.js';

  // 拉取模板文件，生成，完事儿
  if(fs.existsSync(finalDir)){
    message.error(`${appName}已经存在了`);
    process.exit();
  }
  fs.ensureDir(finalDir).then(()=>{
    let fromPath = path.join(__dirname,'./tpl/index.st');
    let toPath = `${finalDir}/${fileName}`;
    let renderData = {
      name:appName,
      content:'my first template Component'
    }
    createTemplate(fromPath,toPath,renderData);
  }).catch(err=>{
    console.log(err);
    process.exit(1);
  })
}
const createTemplate = (fromPath,toPath,renderData) => {
  const originTpl = fs.readFileSync(fromPath,'utf-8');
  if(renderData){
    const a = originTpl.split(/[/s/S]*?\<\%\s*(\w+)\s*\%\>[/s/S]*?/im);
    /** 
      [ 'import * as React from \'react\';\n\nfunction ',
        'name',
        ' (props) {\n  return <div>\n    ',
        'content',
        '\n  </div>;\n}\n\nexport default ',
        'name',
        ';\n' 
      ]
    */
    const b = a.map(key=>{
      return renderData[key] || key
    });
    /**  替换成了渲染数据
     [ 'import * as React from \'react\';\n\nfunction ',
        'myapp5',
        ' (props) {\n  return <div>\n    ',
        'my first template Component',
        '\n  </div>;\n}\n\nexport default ',
        'myapp5',
        ';\n' 
      ]
    */
    const finalTplStr = b.join(''); // 拼接成最终的模板
    fs.writeFileSync(toPath,finalTplStr); // 写入本地
  }else{
    fs.writeFileSync(toPath,originTpl); // 否则 直接将模板写入
  }
}
module.exports = {
  createComponent
}