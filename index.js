var print = console.log.bind(console)
var printd = console.dir.bind(console)


function h(type, attrs, ...children) {
  children = Array.isArray(children[0]) ? children[0] : children
  var el = []

  el.push(`<${type}`)

  for (let [k, v] of iter(attrs))
    el.push(` ${k}="${v}"`)

  el.push('>\n\t')

  // for (let i of children)
  //   el.push(i.split('\n').join('\n\t') + '\n\t')

  for(let i = 0, v, eol; eol = !(children.length - 1 - i), v = children[i]; i++)
    el.push(v.split('\n').join('\n\t') + (eol ? '' : '\n\t'))

  el.push(`\n</${type}>`)

  return el.join('')
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

// print(h('div', {hola: 'value'}, h('span', null, h('i', null, 'hello\ndear\nnana', 'oh yeah'))))

var start = process.hrtime()
for(let i = 0; i < 100000; i++)
  var html = h('div', {hola: 'value'}, h('span', null, h('i', null, 'hello\ndear\nnana', 'oh yeah')))
print(process.hrtime(start))

// var html = h('div', {hola: 'value'}, h('span', null, h('i', null, 'hello\ndear\nnana', 'oh yeah')))

print(html)
