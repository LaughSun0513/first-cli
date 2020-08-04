const program = require('commander');
const path = require('path');

const mapAction = {
    create: {
        alias: 'c',
        description: 'create a project',
        examples: [
            'ycli create <project name>'
        ]
    },
    config: {
        alias: 'conf',
        description: 'config project variable',
        examples: [
            'ycli config set <key><value>',
            'ycli config get <key>'
        ]
    },
    "*": {
        alias: '',
        description: 'command not found',
        examples: []
    }
}
// 循环创建命令
// Reflect.ownKeys(mapAction) --> ["create", "config", "*"]

const createCommand = () => { 
    Reflect.ownKeys(mapAction).forEach(action => {
        const curAction = mapAction[action];
        const { alias, description } = curAction; // 从mapAction里找到对应的命令
        program.command(action) // 配置命令名称
            .alias(alias) // 命令短名
            .description(description) // 命令对应的描述
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
            .on('--help', () => {
                // 监听用户 help事件
                console.log('\nExamples:')
                curAction.examples.forEach(example => { 
                    console.log(example);
                })
            });
    });
}

module.exports = {
    createCommand
}


