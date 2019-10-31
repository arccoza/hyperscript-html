'use strict'

var hasOwnProperty = Object.prototype.hasOwnProperty


function isEmpty(obj) {
  if (obj) {
    let len = obj.length
    len = len == null ? obj.size : len

    if (len)
      return false
    else if (len === 0)
      return true

    for (var k in obj)
      return false
  }

  return true
}

var isArray = Array.isArray

function isObject(obj) {
  return obj != null && typeof obj === 'object'
}

function isDict(obj) {
  return obj != null && !isArray(obj) && typeof obj === 'object'
}

var isMap = isDict

// A wrapper function that provides a flexible arg interface for hyperscript.
function hyperflexible(fn, a, b, ...c) {
  if(b == null || isDict(b))
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

module.exports = {isEmpty, isArray, isObject, isDict, isMap, hyperflexible, flattened}
