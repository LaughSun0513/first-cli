### 第一步:初始化项目

```js
// 1.
npm init -y  --> 生成package.json

// 2.
"bin": {
    "ycli": "./bin/www.js"
}

// 3.www.js
#! /usr/bin/env node
require('../src/main');

// 4. src/main.js
console.log('1111')

// 5.
sudo npm link

// 6.
ycli --> 1111
```

### 第二步: 获取版本号

```js
// 1.
npm i commander

// 2.
const program = require('commander');
program.version('0.0.1').parse(process.argv);

// 3.
ycli -V --> 0.0.1
```

```js
// 动态获取package.json里的version
// 1.constants.js

const { version } = require('../package.json');
module.exports = {
    version
};

// 2.main.js
const program = require('commander');
const { version } = require('./constants');
program.version(version).parse(process.argv);

// 3.
ycli -V --> 1.0.0
```

### 第三步: 配置指令命令

```js
const program = require("commander");

// 1.写命令集合
const mapAction = {
  create: {
    alias: "c",
    description: "create a project",
    examples: ["ycli create <project name>"]
  },
  config: {
    alias: "conf",
    description: "config project variable",
    examples: ["ycli config set <key><value>", "ycli config get <key>"]
  },
  "*": {
    alias: "",
    description: "command not found",
    examples: []
  }
};
// 2.循环创建命令
// Reflect.ownKeys(mapAction) --> ["create", "config", "*"]

const createCommand = () => {
  Reflect.ownKeys(mapAction).forEach(action => {
    const curAction = mapAction[action];
    const { alias, description } = curAction; // 从mapAction里找到对应的命令

    program
      .command(action) // 配置命令名称
      .alias(alias) // 命令短名
      .description(description) // 命令对应的描述
      .action(() => {
        if (action === "*") {
          // 访问不到命令
          console.log(curAction.description);
        } else {
          // 打印当前输入的命令行 比如 ycli c --> create
          console.log(action);
        }
      })
      .on("--help", () => {
        // 3.监听用户 help事件
        console.log("\nExamples:");
        curAction.examples.forEach(example => {
          console.log(example);
        });
      });
  });
};

module.exports = {
  createCommand
};

// 4. ycli c --> create
```

### 第四步: 完善 create 命令

#### 拉仓库模板

```js
// ....
.action(() => {
    if (action === '*') {
        // 访问不到命令
        console.log(curAction.description)
    } else {
        // 打印当前输入的命令行 比如 ycli c --> create
        // console.log(action)
        const curPath = path.resolve(__dirname, action); // 获取create.js的绝对路径
        require(curPath)(...process.argv.slice(3)); // 调用create导出的函数，并将ycli create xxx -> 后面的xxx传入
    }
})
```

```js
// 拉取github里的模板
const axios = require("axios");
const ora = require("ora");
const inquirer = require("inquirer");

const fetchRepoList = async () => {
  const { data } = await axios.get("https://api.github.com/orgs/td-cli/repos");
  return data;
};

module.exports = async projectName => {
  const loading = ora("正在下载模版。。。。");

  loading.start();
  let repos = await fetchRepoList();

  loading.succeed();

  repos = repos.map(item => item.name);

  const { repo } = await inquirer.prompt({
    name: "repo",
    type: "list",
    message: "请选择模板版本",
    choices: repos
  });
  console.log(repo);
};
```

#### 获取模板仓库版本号

```js
const fetchReposTags = async repo => {
  try {
    const templateTagsURL = `https://api.github.com/repos/td-cli/${repo}/tags`;
    const { tags } = await axios.get(templateTagsURL);
    if (tags.length > 0) {
      return tags;
    }
  } catch (err) {
    console.log("mocks tags-->");
    return mocksTemplateTags;
  }
};

const chooseTags = async repo => {
  let tags = await fetchWithLoading(
    fetchReposTags,
    "正在获取模板版本号...."
  )(repo);
  tags = tags.map(item => item.name);
  const { tag } = await ask({
    name: "tag",
    type: "list",
    message: "请选择版本号",
    choices: tags
  });
  console.log(tag);
  return tag;
};
```

#### 拉取对应版本号的模板到本地 -- download-git-repo util

```js
// 判断系统版本 window还是Mac
const downloadPath = `${
  process.env[process.platform === "darwin" ? "HOME" : "USERPROFILE"]
}/.template`;

// npm i download-git-repo util
const { promisify } = require("util");
const downloadGitRepo = promisify(require("download-git-repo"));

// 获取和下载对应的模板到/Users/xxx/.template/
// 返回当前的下载目录
const downloadDest = async (repo, tag) => {
  const api = tag ? `td-cli/${repo}#${tag}` : `td-cli/${repo}`; // td-cli/vue-template#4.0
  const dest = `${downloadPath}/${repo}`; // /Users/xxx/.template/vue-template
  await downloadGitRepo(api, dest);
  return dest;
};

// 拉取对应版本号的模板到本地 /Users/xxx/.template/vue-template
const target = await fetchWithLoading(
  downloadDest,
  "正在下载对应版本号的模板代码"
)(repo, tag);
```

#### 从本地拷贝到项目目录 -- ncp

```js
// npm i ncp 拷贝文件目录工具
const path = require("path");
const ncp = promisify(require("ncp"));
// target 本地路径
await ncp(target, path.join(path.resolve(), projectName));
```
