const Taskr = require('taskr');
const print = console.log.bind(console)

const src = {
  module: 'lib/**/*.es6'
}

exports.clean = function*(task) {
  yield task.clear(['./lib/**/*.js']);
}

exports.esm2cjs = function*(task) {
  yield task
    .source(src.module)
    .babel()
    .rename((file) => {
      file.dirname = ''
      file.extname = '.js'
    })
    .target('./lib')
}

exports.default = function*(task) {
  yield task.serial(['esm2cjs'])
}

if (require && require.main === module) {
  const taskr = new Taskr({
    tasks: module.exports,
    plugins: [
      require('@taskr/clear'),
      require('@taskr/babel'),
      require('fly-rename')
    ]
  })

  taskr.start('esm2cjs')
}
