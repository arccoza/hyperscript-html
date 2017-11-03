var prints = console.log.bind(console)
var printd = console.dir.bind(console)
import {isEmpty} from './utils.js'
import {toStyleStr, fromStyleStr, zenhand} from 'zenhand'


var special = ['area', 'base', 'br', 'col', 'command', 'embed', 'hr', 'img', 'input',
  'keygen', 'link', 'meta', 'param', 'source', 'track', 'wbr']

function hyperflexible(a, b, ...c) {

}

function HyperScript({tab='\t', nl='\n', attrsNl=true, devMode=true}={}) {
  tab = devMode ? tab : ''
  nl = devMode ? nl : ''  // nl: newline.

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
      var sh = zenhand(type)

      type = sh.tag

      if (!isEmpty(sh.attrs.class))
        attrs.class = [...new Set([...sh.attrs.class, ...attrs.class])]

      if (!isEmpty(sh.attrs.style))
        attrs.style = {...sh.attrs.style, ...attrs.style}

      attrs = {...sh.attrs, ...attrs}
    }

    var el = []

    // Start opening tag.
    el.push(`<${type}`)

    // Add attributes to tag.
    for (var i, k, v, keys = Object.keys(attrs); (k = keys[i++], v = attrs[k]);) {
      if ((k != 'style' && k != 'class') || !isEmpty(v)) {
        if (attrsNl) el.push(nl)
        el.push(` ${k}="${k == 'class' && !isEmpty(v) ? v.join('.') : k == 'style' && !isEmpty(v) ? toStyleStr(v) : v}"`)
      }
    }

    // End opening tag.
    el.push('>')

    // Add children within element.
    if (!isEmpty(children)) {
      if (devMode) {
        el.push(nl + tab)
        // i: index, c: child, eol: end of loop.
        for(var i = 0, c, eol; eol = !(children.length - 1 - i), c = children[i]; i++)
          el.push(c.split(nl).join(nl + tab) + (eol ? '' : nl + tab))
      }
      else {
        el.push(children.join(nl))
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
  var h = HyperScript({devMode: false})
  // var h = require('hyperscript')

  // prints(h('div', {hola: 'value'}, h('span', null, h('i', null, 'hello\ndear\nnana', 'oh yeah'))))

  var start = process.hrtime()
  for(var i = 0; i < 100000; i++)
    var html = h('div#bob.a.b.c[type=awe][style=background:red; color:green]', {hola: 'value', class: ['c'], style: {color: 'orange'}}, h('span', h('i', 'hello\ndear\nnana', 'oh yeah'), h('i', {'eh': true})))
  prints(process.hrtime(start))

  // var html = h('div#bob.a.b.c[type=awe][style=background:red; color:green]', {hola: 'value', class: ['c'], style: {color: 'orange'}}, h('span', h('i', 'hello\ndear\nnana', 'oh yeah'), h('i', {'eh': true})))

  prints(html)
  // prints(html.outerHTML)
}
