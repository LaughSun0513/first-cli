const path = require("path");
const fs = require('fs');
const axios = require("axios");
const ora = require("ora");
const inquirer = require("inquirer");
const mocksTemplateName = require("../../mocks");
const mocksTemplateTags = require("../../mocks/tags");
const { downloadPath } = require("../constants");
const { promisify } = require("util");
const downloadGitRepo = promisify(require("download-git-repo")); // promisfy 下载工具
const ncp = promisify(require("ncp")); // promisify 文件拷贝工具

// 渲染复杂模板 -- 根据aks.js填充package.json
const MetalSmith = require('metalSmith');
let { render } = require('consolidate').ejs;
render = promisify(render); // promisify 渲染方法
const rm = require('rimraf').sync;


// 封装高阶函数 请求过程加loading
const fetchWithLoading = (fetchFn, loadingMessage) => async (...fetchArgs) => {
	const loading = ora(loadingMessage);
	loading.start();
	try {
		let fetchResult = await fetchFn(...fetchArgs); // 请求
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
	// 拿到当前仓库里有几个项目库
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
	// 拿到项目的版本号
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
	console.log('dest===>', dest);
	await downloadGitRepo(api, dest);
	return dest;
};

const downlodTemplateByEjs = async (inputProPath, projectName) => {
	return new Promise((resolve, reject) => {
		const outputProPath = path.resolve(projectName);
		const askFile = path.join(inputProPath, 'ask.js');
		MetalSmith(__dirname)
			.source(inputProPath) //模板文件 path
			.destination(outputProPath) //最终编译好的文件存放位置
			.use(async (files, metal, done) => {
				// console.log('files==>', files);
				// files==> {'ask.js': { contents:  <Buffer 6d 6f 64 75 6c 65 2e... >, mode: '0644'}}
				// console.log('metal==>', metal);
				const askDetails = require(askFile); // 找到模板里的ask.js文件
				const answers = await ask(askDetails); // 获取用户提交的数据
				// console.log('answers==>', answers)
				const meta = metal.metadata();
				const packageJsonData = Object.assign(answers, meta); // 合并用户提交的答案信息和原数据 传递给下一个use()方法的metadata
				delete files['ask.js']; // 下载到本地的模板里不需要ask.js，需要删除

				// 遍历文件 通过 ejs + 读取用户提交的数据 + buffer读取contents生成最终的项目到本地
				Reflect.ownKeys(files).forEach(async (file) => {
					// files==> {'ask.js': { contents:  <Buffer 6d 6f 64 75 6c 65 2e... >, mode: '0644'}}
					if (file.includes('js') || file.includes('json')) {
						let content = files[file].contents.toString();
						if (content.includes("<%")) {
							// console.log('content===>', content)
							// 通过 ejs填充变量
							content = await render(content, packageJsonData);
							files[file].contents = Buffer.from(content);
						}
					}
				});
				done();
			})
			.build(err => {
				rm(inputProPath); // 删除临时目录
				if (err) {
					console.log(err);
					return reject(err)
				} else {
					return resolve()
				}
			})
	})
}
module.exports = async projectName => {
	try {
		const repo = await chooseTemplateRepos();
		const tag = await chooseTags(repo);
		// 3. 拉取对应版本号的模板到本地 /Users/xxx/.template/vue-template
		const target = await fetchWithLoading(
			downloadDest,
			"正在下载对应版本号的模板代码"
		)(repo, tag);

		// 通过判断模板项目里有没有ask.js来判断是否是复杂模板
		hasAskFile = fs.existsSync(path.join(target, 'ask.js'));
		if (!hasAskFile) {
			// 4. 复制本地/Users/xxx/.template/vue-template到当前你的项目路径下
			await ncp(target, path.join(path.resolve(), projectName));
		} else {
			await downlodTemplateByEjs(target, projectName);
		}

	} catch (err) {
		console.log("拉取模板失败" + err);
	}
};