var {HyperScript, wrap} = require('./lib/index')
var print = console.log.bind(console)


if (require && require.main === module) {
  var h = HyperScript({devMode: true, flexibleArgs: true, voidElements: true})
  // var h = require('hyperscript')

  var start = process.hrtime()
  for(var i = 0; i < 100000; i++)
    var html = h('div#bob.a.b.c[type=awe][style=background:red; color:green]', {hola: 'value', class: ['c', 'foo', 'bar'], className: ['bar', 'baz'], style: {color: 'orange'}}, h('span', h('i', 'she\nsells\nsea', 'shells by the sea shore'), h('br'), h('i', {'eh': true})))
  print(process.hrtime(start))

  print(html)
  // print(html.outerHTML)
}
