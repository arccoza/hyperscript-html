var print = console.log.bind(console)
var printd = console.dir.bind(console)


function HyperScript({tab='\t', tagFmt=null}={}) {
  return function hyperscript(type, attrs, ...children) {
    shorthand(type)
    children = Array.isArray(children[0]) ? children[0] : children
    var el = []

    el.push(`<${type}`)

    for (let [k, v] of iter(attrs))
      el.push(` ${k}="${v}"`)

    el.push(`>\n${tab}`)

    // i: index, v: value, eol: end of loop.
    for(let i = 0, v, eol; eol = !(children.length - 1 - i), v = children[i]; i++)
      el.push(v.split('\n').join(`\n${tab}`) + (eol ? '' : `\n${tab}`))

    el.push(`\n</${type}>`)

    return el.join('')
  }
}

function shorthand(tag) {
  // print(tag.split(/[#\.]/))
  var ret = {tag: 'div', attrs: {style: {}}, class: []}

  tag = tag.replace(/(?:[#\.\[]|^).*?(?=$|[#\.\[])|\]/g, m => {
    switch (m[0]) {
      case '#':
        ret.id = m.slice(1)
        break
      case '.':
        ret.class.push(m.slice(1))
        break
      case '[':
        var pair = m.slice(1, -1).split('=')
        ret.attrs[pair[0]] = pair[1] || true
        break
      default:
        ret.tag = m
    }

    return ''
  })

  print(tag, '\n', ret)
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

var html = h('div#bob.a.b.c[type=awe][style=background:red;]', {hola: 'value'}, h('span', null, h('i', null, 'hello\ndear\nnana', 'oh yeah')))

print(html)
