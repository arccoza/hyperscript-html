'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

// require("babel-polyfill")
var print = console.log.bind(console);
var printd = console.dir.bind(console);

var _require = require('./util.js'),
    toStyleStr = _require.toStyleStr,
    fromStyleStr = _require.fromStyleStr,
    shorthand = _require.shorthand,
    isEmpty = _require.isEmpty,
    iter = _require.iter;

var special = ['area', 'base', 'br', 'col', 'command', 'embed', 'hr', 'img', 'input', 'keygen', 'link', 'meta', 'param', 'source', 'track', 'wbr'];

function HyperScript() {
  var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
      _ref$tab = _ref.tab,
      tab = _ref$tab === undefined ? '\t' : _ref$tab,
      _ref$nl = _ref.nl,
      nl = _ref$nl === undefined ? '\n' : _ref$nl,
      _ref$attrsNl = _ref.attrsNl,
      attrsNl = _ref$attrsNl === undefined ? true : _ref$attrsNl,
      _ref$devMode = _ref.devMode,
      devMode = _ref$devMode === undefined ? true : _ref$devMode;

  tab = devMode ? tab : '';
  nl = devMode ? nl : ''; // nl: newline.

  return function hyperscript(type, attrs) {
    for (var _len = arguments.length, children = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
      children[_key - 2] = arguments[_key];
    }

    // Prep args, make positions flexible.
    children = Array.isArray(children[0]) ? children[0] : children;
    if (typeof attrs == 'string') {
      ;
      var _ref2 = [{}, [attrs, ...children]];
      attrs = _ref2[0];
      children = _ref2[1];
    } else if (Array.isArray(attrs)) {
      ;
      var _ref3 = [{}, attrs];
      attrs = _ref3[0];
      children = _ref3[1];
    } else attrs = attrs || {};
    attrs.class = attrs.class || [];
    attrs.style = attrs.style || {};

    // Merge all attrs from selector str and 2nd arg obj.
    if (typeof type === 'string') {
      var sh = shorthand(type);

      type = sh.tag;

      if (!isEmpty(sh.attrs.class)) attrs.class = [].concat(_toConsumableArray(new Set([].concat(_toConsumableArray(sh.attrs.class), _toConsumableArray(attrs.class)))));

      if (!isEmpty(sh.attrs.style)) attrs.style = _extends({}, sh.attrs.style, attrs.style);

      attrs = _extends({}, sh.attrs, attrs);
    }

    var el = [];

    // Start opening tag.
    el.push('<' + type);

    // Add attributes to tag.
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = iter(attrs)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var _ref4 = _step.value;

        var _ref5 = _slicedToArray(_ref4, 2);

        var k = _ref5[0];
        var v = _ref5[1];

        if (k != 'style' && k != 'class' || !isEmpty(v)) {
          if (attrsNl) el.push(nl);
          el.push(' ' + k + '="' + (k == 'class' && !isEmpty(v) ? v.join('.') : k == 'style' && !isEmpty(v) ? toStyleStr(v) : v) + '"');
        }
      }

      // End opening tag.
    } catch (err) {
      _didIteratorError = true;
      _iteratorError = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion && _iterator.return) {
          _iterator.return();
        }
      } finally {
        if (_didIteratorError) {
          throw _iteratorError;
        }
      }
    }

    el.push('>');

    // Add children within element.
    if (!isEmpty(children)) {
      if (devMode) {
        el.push(nl + tab);
        // i: index, c: child, eol: end of loop.
        for (var i = 0, c, eol; eol = !(children.length - 1 - i), c = children[i]; i++) {
          el.push(c.split(nl).join(nl + tab) + (eol ? '' : nl + tab));
        }
      } else {
        el.push(children.join(nl));
      }
    }

    // Add closing tag.
    // Check for empty void-elements, and leave off the closing tag.
    if (!isEmpty(children) || special.indexOf(type) == -1) el.push(nl + '</' + type + '>');

    return el.join('');
  };
}

if (require && require.main === module) {
  var h = HyperScript({ devMode: true });

  // print(h('div', {hola: 'value'}, h('span', null, h('i', null, 'hello\ndear\nnana', 'oh yeah'))))

  // var start = process.hrtime()
  // for(var i = 0; i < 300000; i++)
  //   var html = h('div#bob.a.b.c[type=awe][style=background:red; color:green]', {hola: 'value', class: ['c'], style: {color: 'orange'}}, h('span', h('i', 'hello\ndear\nnana', 'oh yeah'), h('i', {'eh': true})))
  // print(process.hrtime(start))

  var html = h('div#bob.a.b.c[type=awe][style=background:red; color:green]', { hola: 'value', class: ['c'], style: { color: 'orange' } }, h('span', h('i', 'hello\ndear\nnana', 'oh yeah'), h('i', { 'eh': true })));

  print(html);
}