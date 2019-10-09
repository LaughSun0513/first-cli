
const fs = require('fs-extra'); // fs的加强版本 https://www.npmjs.com/package/fs-extra
const path = require('path');
const {createComponent} = require('./template');
const { message } = require('./utils');

// 判断是否存在package.json并返回当前项目的路径 其实就是找到跟package.json同一级别的目录
// process.cwd() -->'/Users/xxx/Desktop/first-cli/init-demo'
// path.sep 在 POSIX 上 'foo/bar/baz'.split(path.sep)  --> ['foo', 'bar', 'baz']
// path.sep 在 Windows 上 'foo\\bar\\baz'.split(path.sep) -->['foo', 'bar', 'baz']
const hasPackageJSON = (currentDir)=>{
    if(currentDir.split(path.sep).length === 2){ //按照\分隔符切割
        return ''
    }
    const pkg = path.join(currentDir,'./package.json');
    let pkgPath = '';
    try{
      if(fs.existsSync(pkg)){
        return currentDir
      }else{
        // 找不到package.json就向上递归找当前path的目录，直到找到为止
        // path.dirname--> '/Users/xxx/Desktop/first-cli/init-demo' --> '/Users/xxx/Desktop/first-cli'
        pkgPath = hasPackageJSON(path.dirname(currentDir))
      }
    }catch(e){
      log(e);
      process.exit(1)
    }
    return pkgPath;
}

const createFunc = (fileType,name) => {
   console.log(fileType,name);
   const fileTypeList=['component','route']
   if(!fileTypeList.includes(fileType)){
    message.light('请你创建component|route 二选一类型的文件');
    process.exit(); // 结束
   }
   // 根据type类型创建对应的文件
   // 先判断是否存在package.json 其实就是找到跟package.json同一级别的目录
   const pkgPath = hasPackageJSON(process.cwd());
   if(!pkgPath){
      message.error(' 没找到 \'package.json\' ')
      process.exit()
   }
   
   const currentDir = path.join(pkgPath,`src/${fileType}s`); // 在当前项目 创建模板目录
   const params = {}; //这个params可以扩展，传递给模板
   params.name = name || 'example';

   fs.ensureDir(currentDir).then(()=>{ // 当项目目录存在之后，根据文件类型拉取对应的模板
      if(fileType==='component'){
          console.log('is component');
          createComponent(currentDir,params);
      }else if(fileType==='route'){
          console.log('is route');
      }
   }).catch(err=>{
      log(err);
      process.exit(1)
   })
}
module.exports = createFunc;