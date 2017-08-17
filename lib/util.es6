var print = console.log.bind(console)
var hasOwnProperty = Object.prototype.hasOwnProperty


function isEmpty(obj) {
  if (obj) {
    if (obj.length || obj.size)
      return false

    for (const k in obj)
      return false
  }

  return true
}

function* iter(obj) {
  var k
  for (k in obj) {
    if (hasOwnProperty.call(obj, k))
      yield [k, obj[k]];
  }
}

export {isEmpty, iter}
