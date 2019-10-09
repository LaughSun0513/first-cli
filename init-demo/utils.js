const chalk = require('chalk');

const log = console.log;
// 封装打印日志颜色
const message = {
  success (text) {
    log(chalk.green.bold(text));
  },
  error (text) {
    log(chalk.red.bold(text));
  },
  info (text) {
    log(chalk.blue.bold(text));
  },
  light (text) {
    log(chalk.yellow.bold(text));
  }
};

module.exports = {
  message
}