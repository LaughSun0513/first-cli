const fs = require('fs-extra')

const file = './dir1/file.txt'

// 写文件
// With a callback:
fs.ensureFile(file, err => {
  console.log(err) // => null
  // file has now been created, including the directory it is to be placed in
})

// With Promises:
fs.ensureFile(file)
.then(() => {
  console.log('success!')
})
.catch(err => {
  console.error(err)
})

// With async/await:
async function example (f) {
  try {
    await fs.ensureFile(f)
    console.log('success!')
  } catch (err) {
    console.error(err)
  }
}

example(file)