var prints = console.log.bind(console)
var printd = console.dir.bind(console)
import {isEmpty, hyperflexible, flattened} from './utils.js'
import {toStyleStr, zenhand} from 'zenhand'


var special = ['area', 'base', 'br', 'col', 'command', 'embed', 'hr', 'img', 'input',
  'keygen', 'link', 'meta', 'param', 'source', 'track', 'wbr']

function HyperScript({tab='\t', nl='\n', attrsNewLine=true, devMode=true, flexibleArgs=true, voidElements=true}={}) {
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
    for (var i = 0, k, v, keys = Object.keys(attrs); k = keys[i++], v = attrs[k], k;) {
      if (!isEmpty(v)) {
        if (attrsNewLine) el.push(nl)
        el.push(` ${k}="${k == 'class' ? v.join(' ') : k == 'style' ? toStyleStr(v) : v}"`)
      }
    }

    // End opening tag.
    el.push('>')

    // Add children within element.
    if (!isEmpty(children)) {
      if (devMode) {
        // i: index, c: child.
        flattened(children, (i, c) => {
          el.push(nl + tab)
          el.push(c.split(nl).join(nl + tab))
        })
      }
      else {
        flattened(children, (i, c) => el.push(c))
      }
    }

    // Add closing tag.
    // Check for empty void-elements, and leave off the closing tag.
    // if option `voidElements=true`.
    if (!isEmpty(children) || (!voidElements || special.indexOf(type) == -1))
      el.push(`${nl}</${type}>`)

    return el.join('')
  }
}

export {HyperScript}


if (require && require.main === module) {
  var h = HyperScript({devMode: true, flexibleArgs: true, voidElements: true})
  // var h = require('hyperscript')

  var start = process.hrtime()
  for(var i = 0; i < 100000; i++)
    var html = h('div#bob.a.b.c[type=awe][style=background:red; color:green]', {hola: 'value', className: ['c'], style: {color: 'orange'}}, h('span', h('i', 'she\nsells\nsea', 'shells by the sea shore'), h('br'), h('i', {'eh': true})))
  prints(process.hrtime(start))

  prints(html)
  // prints(html.outerHTML)
}
