var print = console.log.bind(console)
var printd = console.dir.bind(console)


function HyperScript({tab='\t', tagFmt=null}={}) {
  return function hyperscript(type, attrs, ...children) {
    attrs = attrs || {}
    attrs.class = attrs.class || []
    children = Array.isArray(children[0]) ? children[0] : children

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

    for (let [k, v] of iter(attrs))
      el.push(` ${k}="${k == 'class' ? v.join('.') : k == 'style' ? toStyleStr(v) : v}"`)

    el.push(`>\n${tab}`)

    // i: index, v: value, eol: end of loop.
    for(let i = 0, v, eol; eol = !(children.length - 1 - i), v = children[i]; i++)
      el.push(v.split('\n').join(`\n${tab}`) + (eol ? '' : `\n${tab}`))

    el.push(`\n</${type}>`)

    return el.join('')
  }
}

function toStyleStr(obj) {
  var ks = Object.keys(obj), vs = Object.values(obj)

  return ks.map((e, i) => [e, vs[i]].join(':')).join('; ')
}

function fromStyleStr(str) {
  return str.split(/\s*;\s*/)
  .filter(e => e)
  .reduce((acc, cur) => ([k, v] = cur.split(':'), {...acc, [k]: v}), {})
}

function shorthand(tag) {
  var ret = {tag: 'div', attrs: {class: [], style: ''}}

  tag = tag.replace(/(?:[#\.\[]|^).*?(?=$|[#\.\[])|\]/g, m => {
    switch (m[0]) {
      case '#':
        ret.attrs.id = m.slice(1)
        break
      case '.':
        ret.attrs.class.push(m.slice(1))
        break
      case '[':
        var [key, val] = m.slice(1, -1).split('=')

        // Process style string into obj.
        if (key.toLowerCase() == 'style')
          val = fromStyleStr(val)

        ret.attrs[key] = val || true
        break
      default:
        ret.tag = m
    }
  })

  return ret
}

function genr(obj) {
  return function*() {
    for (var k in obj) {
      if (obj.hasOwnProperty(k))
        yield [k, obj[k]];
    }
  }
}

function iter(obj) {
  return genr(obj)()
}


var h = HyperScript()

// print(h('div', {hola: 'value'}, h('span', null, h('i', null, 'hello\ndear\nnana', 'oh yeah'))))

// var start = process.hrtime()
// for(let i = 0; i < 100000; i++)
//   var html = h('div', {hola: 'value'}, h('span', null, h('i', null, 'hello\ndear\nnana', 'oh yeah')))
// print(process.hrtime(start))

var html = h('div#bob.a.b.c[type=awe][style=background:red; color:green]', {hola: 'value', class: ['c'], style: {color: 'orange'}}, h('span', null, h('i', null, 'hello\ndear\nnana', 'oh yeah')))

print(html)