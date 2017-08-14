const Taskr = require('taskr');
const babel = require('rollup-plugin-babel')
const nodeResolve = require('rollup-plugin-node-resolve')
const commonjs = require('rollup-plugin-commonjs')
const json = require('rollup-plugin-json')
const replace = require('rollup-plugin-replace')
const print = console.log.bind(console)

const env = process.env.NODE_ENV
const src = {
  js: 'src/**/*.js'
}

exports.clean = function*(task) {
    yield task.clear([dest]);
}

exports.js2 = function*(task) {
    yield task
      .source(src.js)
      .babel()
      .target('es5')
}

exports.js = function*(task) {
  yield task.source(src.js).rollup({
    rollup: {
      plugins: [
        nodeResolve({
          jsnext: true, main: true, browser: true, preferBuiltins: true
        }),
        babel({
          exclude: [
            'node_modules/**',
            '*.json'
          ],
        }),
        // REF: https://github.com/rollup/rollup/issues/487
        replace({
          'process.env.NODE_ENV': JSON.stringify(env)
        }),
        commonjs({
          include: 'node_modules/**'
        }),
        json()
      ]
    },
    bundle: {
      format: 'cjs',
      sourceMap: true,
      moduleName: 'window'
    }
  }).target('es5')
}

exports.default = function*(task) {
  yield task.serial(['js'])
}

if (require && require.main === module) {
  const taskr = new Taskr({
    tasks: module.exports,
    plugins: [
      require('fly-rollup'),
      require('@taskr/clear'),
      require('@taskr/babel')
    ]
  })

  taskr.start('js2')
}
