const fs = require('fs-extra');

// async / await
async function copyTest(){
  try {
      await fs.copy('./dir1/','./dir2'); // 拷贝文件目录
      console.log('success');
  }catch(e){
    console.log(e)
  }
}
copyTest();

// promise写法
fs.copy('./dir1/', './dir3')
.then(() => {
  console.log('success!')
})
.catch(err => {
  console.error(err)
});

// callback写法
fs.copy('./dir1/', './dir4', err => {
  if (err) return console.error(err)

  console.log('success!')
}) 