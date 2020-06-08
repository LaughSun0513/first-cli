const inquirer = require('inquirer');

/**
 {
  type: String, // 表示提问的类型
  name: String, // 在最后获取到的answers回答对象中，作为当前这个问题的键
  message: String|Function, // 打印出来的问题标题，如果为函数的话
  default: String|Number|Array|Function, // 用户不输入回答时，问题的默认值。或者使用函数来return一个默认值。假如为函数时，函数第一个参数为当前问题的输入答案。
  choices: Array|Function, // 给出一个选择的列表，假如是一个函数的话，第一个参数为当前问题的输入答案。为数组时，数组的每个元素可以为基本类型中的值。
  validate: Function, // 接受用户输入，并且当值合法时，函数返回true。当函数返回false时，一个默认的错误信息会被提供给用户。
  filter: Function, // 接受用户输入并且将值转化后返回填充入最后的answers对象内。
  when: Function|Boolean, // 接受当前用户输入的answers对象，并且通过返回true或者false来决定是否当前的问题应该去问。也可以是简单类型的值。
  pageSize: Number, // 改变渲染list,rawlist,expand或者checkbox时的行数的长度。
  prefix:给问题前面添加内容
}
 */
inquirer.prompt([
  {
    type:'input',
    name:'name', 
    message:'你叫什么名字', // 提问
    default:'小明', //用户不输入答案，默认值
    prefix:"您好",
    suffix:"感谢回答!"
  },
  {
    type:'input',
    name:'age',
    message:(e)=>{ // 可以是函数
      return `${e.name},请输入你的年龄？`
    },
    default:()=>{ // 可以是函数
      return 23
    }
  },
  {
    type: "list", // 列表
    message:'请选择性别',
    name: 'sex',
    default:'男',
    choices: ['男', '女']  // 用于设置选择的列
  },
  {
    type: "input",
    message:'请输入您的电话号码？',
    name: 'mobile',
    default:'13612341234',
    validate:(e)=>{ // 用来校验输入的答案是否符合要求
        if(e.match(/^[1][2,3,5,6,7,8][0-9]{9}$/)){return true}
        console.log('\n您输入的电话号码格式不对，请重新输入')
        return false;
    }
  },
  {
    type: "checkbox",
    message:'请选择衣服尺寸？',
    name: 'size',
    choices:['大', '小'],
    filter:(e)=>{ // 对输入的答案进行处理后返回新的答案
        let size = '';
        e == '大' ? size = 'big' : size = 'small';
        return size;
    }
  },
  {
    type: "list",
    message:(e)=>{ // 设定when的条件
      let currentSex = '';
      e.sex == '男' ? currentSex='女' : currentSex='男'
      return `请问你有${currentSex}盆友了吗？`
    },
    name: 'haveGirlFriend',
    choices:['有', '没有'],
  },
  {
    type: "input",
    message:'请问你们是怎么认识的？',
    name: 'place',
    when:(e)=>{ // 用来设定这个问题是否有必要被提问（Function），返回boolean,返回false表示忽略这个问题
     return e.haveGirlFriend === '有'
    },
    default:'菜场'
  }
]).then(answers=>{
  console.log(answers)
}).catch(err=>{
  console.log(err)
})
/* 
{ 
  name: '小明',
  age: 23,
  sex: '男',
  mobile: '13612341234',
  size: 'big',
  haveGirlFriend: '有',
  place: '菜场' 
}
*/


