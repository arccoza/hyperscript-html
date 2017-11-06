var prints = console.log.bind(console)
var printd = console.dir.bind(console)
import {isEmpty, hyperflexible, flattened} from './utils.js'
import {toStyleStr, zenhand} from 'zenhand'


var special = ['area', 'base', 'br', 'col', 'command', 'embed', 'hr', 'img', 'input',
  'keygen', 'link', 'meta', 'param', 'source', 'track', 'wbr']

function HyperScript({tab='\t', nl='\n', attrsNewLine=true, devMode=true, flexibleArgs=true}={}) {
  tab = devMode ? tab : ''
  nl = devMode ? nl : ''  // nl: newline.

  return flexibleArgs ? hyperflexible.bind(null, hyperscript) : hyperscript

  function hyperscript(type, attrs, ...children) {
    // Prep args, make defaults.
    attrs = attrs || {}
    attrs.class = attrs.class || []
    attrs.className = attrs.className || []
    attrs.style = attrs.style || {}

    // Merge all attrs from selector str and 2nd arg obj.
    if (typeof type === 'string') {
      var sh = zenhand(type)
      sh.attrs.className = sh.attrs.className || []

      type = sh.tag

      if (!isEmpty(sh.attrs.class))
        attrs.class = [...sh.attrs.class, ...sh.attrs.className, ...attrs.class, ...attrs.className]

      if (!isEmpty(sh.attrs.style))
        attrs.style = {...sh.attrs.style, ...attrs.style}

      attrs = {...sh.attrs, ...attrs, className: null}
    }

    var el = []

    // Start opening tag.
    el.push(`<${type}`)

    // Add attributes to tag.
    for (var i = 0, k, v, keys = Object.keys(attrs); (k = keys[i++], v = attrs[k]);) {
      if ((k != 'style' && k != 'class' && k != 'className') || !isEmpty(v)) {
        if (attrsNewLine) el.push(nl)
        el.push(` ${k}="${k == 'class' && !isEmpty(v) ? v.join(' ') : k == 'style' && !isEmpty(v) ? toStyleStr(v) : v}"`)
      }
    }

    // End opening tag.
    el.push('>')

    // Add children within element.
    if (!isEmpty(children)) {
      if (devMode) {
        el.push(nl + tab)
        // i: index, c: child, depth: nested depth, end: end of loop.
        flattened(children, (i, c, depth, end) => {
          el.push(c.split(nl).join(nl + tab) + (end ? '' : nl + tab))
        })
      }
      else {
        flattened(children, (i, c) => el.push(c))
      }
    }

    // Add closing tag.
    // Check for empty void-elements, and leave off the closing tag.
    if (!isEmpty(children) || special.indexOf(type) == -1)
      el.push(`${nl}</${type}>`)

    return el.join('')
  }
}

export {HyperScript}


if (require && require.main === module) {
  var h = HyperScript({devMode: false, flexibleArgs: true})
  // var h = require('hyperscript')

  // prints(h('div', {hola: 'value'}, h('span', null, h('i', null, 'hello\ndear\nnana', 'oh yeah'))))

  var start = process.hrtime()
  for(var i = 0; i < 100000; i++)
    var html = h('div#bob.a.b.c[type=awe][style=background:red; color:green]', {hola: 'value', className: ['c'], style: {color: 'orange'}}, h('span', h('i', 'hello\ndear\nnana', 'oh yeah'), h('i', {'eh': true})))
  prints(process.hrtime(start))

  // var html = h('div#bob.a.b.c[type=awe][style=background:red; color:green]', {hola: 'value', class: ['c'], style: {color: 'orange'}}, h('span', h('i', 'hello\ndear\nnana', 'oh yeah'), h('i', {'eh': true})))

  prints(html)
  // prints(html.outerHTML)
}
