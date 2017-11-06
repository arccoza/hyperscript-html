var print = console.log.bind(console)
var hasOwnProperty = Object.prototype.hasOwnProperty


function isEmpty(obj) {
  if (obj) {
    if (obj.length || obj.size)
      return false

    for (var k in obj)
      return false
  }

  return true
}

function isObject(obj) {
  return !Array.isArray(obj) && obj === Object(obj)
}

// A wrapper function that provides a flexible arg interface for hyperscript.
function hyperflexible(fn, a, b, ...c) {
  if(b == null || isObject(b))
    return fn(a, b, ...c)

  return fn(a, null, b, ...c)
}

// A function to flatten the child items and arrays passed to hyperscript.
function flattened(arr, fn) {
  for (var i = 0, v; v = arr[i]; i++) {
    if (Array.isArray(v))
      flattened(v, fn)
    else
      fn(i, v)
  }
}

export {isEmpty, isObject, hyperflexible, flattened}
