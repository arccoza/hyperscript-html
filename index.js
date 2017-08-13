var print = console.log.bind(console)
var printd = console.dir.bind(console)
var {toStyleStr, fromStyleStr, shorthand, isEmpty, genr, iter} = require('./util.js')


function HyperScript({tab='\t', tagFmt=null}={}) {
  return function hyperscript(type, attrs, ...children) {
    attrs = attrs || {}
    attrs.class = attrs.class || []
    children = Array.isArray(children[0]) ? children[0] : children

    // Merge all attrs from selector str and 2nd arg obj.
    if (typeof type === 'string') {
      var sh = shorthand(type)

      type = sh.tag

      if (sh.attrs.class)
        attrs.class = [...new Set([...sh.attrs.class, ...attrs.class])]

      if (sh.attrs.style)
        attrs.style = {...sh.attrs.style, ...attrs.style}

      attrs = {...sh.attrs, ...attrs}
    }

    var el = []

    el.push(`<${type}`)

    for (let [k, v] of iter(attrs)) {
      if(k && !isEmpty(v))
        el.push(` ${k}="${k == 'class' ? v.join('.') : k == 'style' ? toStyleStr(v) : v}"`)
    }

    el.push(`>\n${tab}`)

    // i: index, v: value, eol: end of loop.
    for(let i = 0, v, eol; eol = !(children.length - 1 - i), v = children[i]; i++)
      el.push(v.split('\n').join(`\n${tab}`) + (eol ? '' : `\n${tab}`))

    el.push(`\n</${type}>`)

    return el.join('')
  }
}


var h = HyperScript()

// print(h('div', {hola: 'value'}, h('span', null, h('i', null, 'hello\ndear\nnana', 'oh yeah'))))

// var start = process.hrtime()
// for(let i = 0; i < 100000; i++)
//   var html = h('div', {hola: 'value'}, h('span', null, h('i', null, 'hello\ndear\nnana', 'oh yeah')))
// print(process.hrtime(start))

var html = h('div#bob.a.b.c[type=awe][style=background:red; color:green]', {hola: 'value', class: ['c'], style: {color: 'orange'}}, h('span', null, h('i', null, 'hello\ndear\nnana', 'oh yeah')))

print(html)
