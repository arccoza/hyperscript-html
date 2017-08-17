const Taskr = require('taskr');
const print = console.log.bind(console)

const env = process.env.NODE_ENV
const src = {
  module: 'module/**/*.js'
}

exports.clean = function*(task) {
    yield task.clear(['./common']);
}

exports.esm2cjs = function*(task) {
    yield task
      .source(src.module)
      .babel()
      .target('./common')
}

exports.default = function*(task) {
  yield task.serial(['esm2cjs'])
}

if (require && require.main === module) {
  const taskr = new Taskr({
    tasks: module.exports,
    plugins: [
      require('@taskr/clear'),
      require('@taskr/babel')
    ]
  })

  taskr.start('esm2cjs')
}
