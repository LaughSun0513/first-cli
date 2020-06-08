const inquirer = require('inquirer');
const Rx = require('rxjs');
const prompts = new Rx.Subject();
inquirer.prompt(prompts);

prompts.next({
  type: "string",
  message:'这是迭代器模式，你知道吗',
  name: 'gengerator',
});
prompts.next({
  type: "string",
  message:'请输入您的学校',
  name: 'school',
});

prompts.complete()
