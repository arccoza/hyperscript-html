var print = console.log.bind(console)
var printd = console.dir.bind(console)
var {toStyleStr, fromStyleStr, shorthand, isEmpty, iter} = require('./util.js')
var hasOwnProperty = Object.prototype.hasOwnProperty


var special = ['area', 'base', 'br', 'col', 'command', 'embed', 'hr', 'img', 'input',
    'keygen', 'link', 'meta', 'param', 'source', 'track', 'wbr']

function HyperScript({tab='\t', nl='\n', attrsNl=true, devMode=true, tagFmt=null}={}) {
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
      var sh = shorthand(type)

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
    for (var [k, v] of iter(attrs)) {
      if ((k != 'style' && k != 'class') || !isEmpty(v)) {
        if (attrsNl) el.push(nl)
        el.push(` ${k}="${k == 'class' && !isEmpty(v) ? v.join('.') : k == 'style' && !isEmpty(v) ? toStyleStr(v) : v}"`)
      }
    }

    // End opening tag.
    el.push(`>${nl + tab}`)

    // Add children within element.
    if (!isEmpty(children)) {
      if (devMode) {
        // i: index, v: value, eol: end of loop.
        for(var i = 0, v, eol; eol = !(children.length - 1 - i), v = children[i]; i++)
          el.push(v.split(nl).join(nl + tab) + (eol ? '' : nl + tab))
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


if (require && require.main === module) {
  var h = HyperScript({devMode: true})

  // print(h('div', {hola: 'value'}, h('span', null, h('i', null, 'hello\ndear\nnana', 'oh yeah'))))

  // var start = process.hrtime()
  // for(var i = 0; i < 100000; i++)
  //   var html = h('div#bob.a.b.c[type=awe][style=background:red; color:green]', {hola: 'value', class: ['c'], style: {color: 'orange'}}, h('span', h('i', 'hello\ndear\nnana', 'oh yeah'), h('i', {'eh': true})))
  // print(process.hrtime(start))

  var html = h('div#bob.a.b.c[type=awe][style=background:red; color:green]', {hola: 'value', class: ['c'], style: {color: 'orange'}}, h('span', h('i', 'hello\ndear\nnana', 'oh yeah'), h('i', {'eh': true})))

  print(html)
}
