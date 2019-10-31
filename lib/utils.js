'use strict';

exports.__esModule = true;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var print = console.log.bind(console);
var hasOwnProperty = Object.prototype.hasOwnProperty;

function isEmpty(obj) {
  if (obj) {
    var len = obj.length;
    len = len == null ? obj.size : len;

    if (len) return false;else if (len === 0) return true;

    for (var k in obj) {
      return false;
    }
  }

  return true;
}

var isArray = Array.isArray;

function isObject(obj) {
  return obj != null && (typeof obj === 'undefined' ? 'undefined' : _typeof(obj)) === 'object';
}

function isDict(obj) {
  return obj != null && !isArray(obj) && (typeof obj === 'undefined' ? 'undefined' : _typeof(obj)) === 'object';
}

var isMap = isDict;

// A wrapper function that provides a flexible arg interface for hyperscript.
function hyperflexible(fn, a, b) {
  for (var _len = arguments.length, c = Array(_len > 3 ? _len - 3 : 0), _key = 3; _key < _len; _key++) {
    c[_key - 3] = arguments[_key];
  }

  if (b == null || isDict(b)) return fn.apply(undefined, [a, b].concat(c));

  return fn.apply(undefined, [a, null, b].concat(c));
}

// A function to flatten the child items and arrays passed to hyperscript.
function flattened(arr, fn) {
  for (var i = 0, v; v = arr[i]; i++) {
    if (Array.isArray(v)) flattened(v, fn);else fn(i, v);
  }
}

exports.isEmpty = isEmpty;
exports.isArray = isArray;
exports.isObject = isObject;
exports.isDict = isDict;
exports.isMap = isMap;
exports.hyperflexible = hyperflexible;
exports.flattened = flattened;