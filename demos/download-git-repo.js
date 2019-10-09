const download = require('download-git-repo');

// 将下载的东西放到download-dir/tmp目录
/* 
download('flipxfx/download-git-repo-fixture', 'download-dir/tmp', function (err) {
   console.log(err ? 'Error' : 'Success')
})
*/

download('direct:https://github.com/LaughSun0513/gulp-demo.git', 'download-dir/tmp', { clone: true }, function (err) {
  console.log(err ? 'Error' : 'Success')
});
// 会在当前目录下创建 download-dir/tmp 拉下来的代码文件夹会在此
download('direct:https://github.com/brucelc/bru-cli.git', 'download-dir/cli-learning', { clone: true }, function (err) {
  console.log(err ? 'Error' : 'Success')
});
download('direct:https://github.com/closertb/create-doddle.git', 'download-dir/soeasy-cli-learning', { clone: true }, function (err) {
  console.log(err ? 'Error' : 'Success')
});
download('direct:https://github.com/imaoda/gen-tpl.git', 'download-dir/15m-cli-learning/gen-tpl', { clone: true }, function (err) {
  console.log(err ? 'Error' : 'Success')
});
download('direct:https://github.com/imaoda/cli-tpl.git', 'download-dir/15m-cli-learning/cli-tpl', { clone: true }, function (err) {
  console.log(err ? 'Error' : 'Success')
});
