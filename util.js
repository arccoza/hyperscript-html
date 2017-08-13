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

function isEmpty(obj) {
  if (obj) {
    if (obj.length || obj.size)
      return false

    for (const k in obj)
      return false
  }

  return true
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

module.exports = {toStyleStr, fromStyleStr, shorthand, isEmpty, genr, iter}