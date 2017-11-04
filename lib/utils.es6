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

// A wrapper function that provides a flexible arg interface for hyperscript.
function hyperflexible(fn, a, b, ...c) {
  if(b == null || (!Array.isArray(b) && b === Object(b)))
    return fn(a, b, ...c)

  return fn(a, null, b, ...c)
}

// A function to flatten the child items and arrays passed to hyperscript.
function flattened(arr, fn, depth=0) {
  for (var i = 0, v, end; end = !(arr.length - 1 - i), v = arr[i]; i++) {
    if (Array.isArray(v))
      flattened(v, fn, depth + 1, end)
    else
      fn(i, v, depth, end)
  }
}

function* iter(obj) {
  var k
  for (k in obj) {
    if (hasOwnProperty.call(obj, k))
      yield [k, obj[k]];
  }
}

export {isEmpty, hyperflexible, flattened}
