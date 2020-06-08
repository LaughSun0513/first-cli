const fs = require('fs-extra');

// 清空当前目录下的文件 callback写法
fs.emptyDir('./dir1/',(err)=>{
  if(err){return console.log(err)};
  console.log('success!')
});


fs.emptyDir('./dir2/')
.then(() => {
  console.log('success!')
})
.catch(err => {
  console.error(err)
});

// async / await
async function clearTest(){
  try {
      await fs.emptyDir('./dir3/');
      console.log('success');
  }catch(e){
    console.log(e)
  }
}
clearTest();