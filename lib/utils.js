'use strict';

exports.__esModule = true;
var print = console.log.bind(console);
var hasOwnProperty = Object.prototype.hasOwnProperty;

function isEmpty(obj) {
  if (obj) {
    if (obj.length || obj.size) return false;

    for (var k in obj) {
      return false;
    }
  }

  return true;
}

function isObject(obj) {
  return !Array.isArray(obj) && typeof obj != 'function' && obj === Object(obj);
}

// A wrapper function that provides a flexible arg interface for hyperscript.
function hyperflexible(fn, a, b) {
  for (var _len = arguments.length, c = Array(_len > 3 ? _len - 3 : 0), _key = 3; _key < _len; _key++) {
    c[_key - 3] = arguments[_key];
  }

  if (b == null || isObject(b)) return fn.apply(undefined, [a, b].concat(c));

  return fn.apply(undefined, [a, null, b].concat(c));
}

// A function to flatten the child items and arrays passed to hyperscript.
function flattened(arr, fn) {
  for (var i = 0, v; v = arr[i]; i++) {
    if (Array.isArray(v)) flattened(v, fn);else fn(i, v);
  }
}

exports.isEmpty = isEmpty;
exports.isObject = isObject;
exports.hyperflexible = hyperflexible;
exports.flattened = flattened;