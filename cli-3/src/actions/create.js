const path = require("path");
const axios = require("axios");
const ora = require("ora");
const inquirer = require("inquirer");
const mocksTemplateName = require("../../mocks");
const mocksTemplateTags = require("../../mocks/tags");
const { downloadPath } = require("../constants");
const { promisify } = require("util");
const downloadGitRepo = promisify(require("download-git-repo")); // promisfy 下载工具
const ncp = promisify(require("ncp")); // promisify 文件拷贝工具

// 封装高阶函数 请求过程加loading
const fetchWithLoading = (fetchFn, loadingMessage) => async (...fetchArgs) => {
  const loading = ora(loadingMessage);
  loading.start();
  try {
    let fetchResult = await fetchFn(...fetchArgs);
    loading.succeed();
    return fetchResult;
  } catch (err) {
    console.log(err);
    loading.fail();
    return;
  }
};
// 请求总仓库里有多少模板仓库
const fetchRepoList = async () => {
  const templatesURL = "https://api.github.com/orgs/td-cli/repos";
  try {
    const { data } = await axios.get(templatesURL);
    if (data.length > 0) {
      return data;
    }
  } catch (err) {
    console.log("mocks template-->");
    return mocksTemplateName;
  }
};

// 请求当前模板仓库有多少版本号
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

const ask = aksConfig => {
  return inquirer.prompt(aksConfig);
};

// 1. 拉取项目模板仓库
const chooseTemplateRepos = async () => {
  let repos = await fetchWithLoading(
    fetchRepoList,
    "正在下载模版仓库......."
  )();
  repos = repos.map(item => item.name);

  const { repo } = await ask({
    name: "repo",
    type: "list",
    message: "请选择模板版本",
    choices: repos
  });

  console.log(repo);
  return repo;
};

// 2. 获取模板仓库版本号
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

// 获取和下载对应的模板到/Users/xxx/.template/
// 返回当前的下载目录
const downloadDest = async (repo, tag) => {
  const api = tag ? `td-cli/${repo}#${tag}` : `td-cli/${repo}`; // td-cli/vue-template#4.0
  const dest = `${downloadPath}/${repo}`; // /Users/xxx/.template/vue-template
  await downloadGitRepo(api, dest);
  return dest;
};

module.exports = async projectName => {
  try {
    const repo = await chooseTemplateRepos();
    const tag = await chooseTags(repo);
    // 3. 拉取对应版本号的模板到本地 /Users/xxx/.template/vue-template
    const target = await fetchWithLoading(
      downloadDest,
      "正在下载对应版本号的模板代码"
    )(repo, tag);
    // 4. 复制本地/Users/xxx/.template/vue-template到项目路径下
    await ncp(target, path.join(path.resolve(), projectName));
  } catch (err) {
    console.log("=====");
  }
};
