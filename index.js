var print = console.log.bind(console)
var printd = console.dir.bind(console)
var {toStyleStr, fromStyleStr, shorthand, isEmpty, genr, iter} = require('./util.js')


var special = ['area', 'base', 'br', 'col', 'command', 'embed', 'hr', 'img', 'input',
    'keygen', 'link', 'meta', 'param', 'source', 'track', 'wbr']

function HyperScript({tab='\t', tagFmt=null}={}) {
  return function hyperscript(type, attrs, ...children) {
    // Prep args, make positions flexible.
    children = Array.isArray(children[0]) ? children[0] : children
    if (typeof attrs == 'string')
      [attrs, children] = [{}, [attrs, ...children]]
    else if(Array.isArray(attrs))
      [attrs, children] = [{}, attrs]
    else
      attrs = attrs || {}
    attrs.class = attrs.class || []
    attrs.style = attrs.style || {}

    // Merge all attrs from selector str and 2nd arg obj.
    if (typeof type === 'string') {
      var sh = shorthand(type)

      type = sh.tag

      if (!isEmpty(sh.attrs.class))
        attrs.class = [...new Set([...sh.attrs.class, ...attrs.class])]

      if (!isEmpty(sh.attrs.style))
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

    if (!isEmpty(children)) {
      // i: index, v: value, eol: end of loop.
      for(let i = 0, v, eol; eol = !(children.length - 1 - i), v = children[i]; i++)
        el.push(v.split('\n').join(`\n${tab}`) + (eol ? '' : `\n${tab}`))
    }

    // Check for empty void-elements, and leave off the closing tag.
    if (!isEmpty(children) || special.indexOf(type) == -1)
      el.push(`\n</${type}>`)

    return el.join('')
  }
}


var h = HyperScript()

// print(h('div', {hola: 'value'}, h('span', null, h('i', null, 'hello\ndear\nnana', 'oh yeah'))))

// var start = process.hrtime()
// for(let i = 0; i < 100000; i++)
//   var html = h('div#bob.a.b.c[type=awe][style=background:red; color:green]', {hola: 'value', class: ['c'], style: {color: 'orange'}}, h('span', null, h('i', null, 'hello\ndear\nnana', 'oh yeah')))
// print(process.hrtime(start))

var html = h('div#bob.a.b.c[type=awe][style=background:red; color:green]', {hola: 'value', class: ['c'], style: {color: 'orange'}}, h('span', h('i', 'hello\ndear\nnana', 'oh yeah'), h('i', {'eh': true})))

print(html)
