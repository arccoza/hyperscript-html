var {HyperScript, wrap} = require('./lib/index')
var print = console.log.bind(console)


if (require && require.main === module) {
  var h = HyperScript({prettyPrint: true, flexibleArgs: true, voidElements: true, shortHand: true})
  // var h = require('hyperscript')

  var start = process.hrtime()
  for(var i = 0; i < 100000; i++)
    var html = h('div#bob.a.b.c[type=awe][style=background-color:red; color:green]', {hola: 'value', class: ['c', 'foo', 'bar'], className: ['bar', 'baz'], style: {backgroundColor: 'purple', color: 'orange'}}, h('span', h('i', 'she\nsells\nsea', 'shells by the sea shore'), h('br'), h('i', {'eh': true})))
  print(process.hrtime(start))

  print(html)
  // print(html.outerHTML)

  var {div, h1, p, i} = wrap({'div': 'div', 'h1': 'h1', 'p': 'p', 'i': 'i'}, {prettyPrint: true})
  var start = process.hrtime()
  for(var j = 0; j < 100000; j++)
    var html = div(h1('Title'), p('sdfklsjfaksld jjf lksdjfkl', i(' greets '), 'asdf sddf'))
  print(process.hrtime(start))
  print(html)

  print(process.memoryUsage())
}
