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

