'use strict';

exports.__esModule = true;
exports.HyperScript = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _utils = require('./utils.js');

var _zenhand = require('zenhand');

var print = console.log.bind(console);
var printd = console.dir.bind(console);


var special = ['area', 'base', 'br', 'col', 'command', 'embed', 'hr', 'img', 'input', 'keygen', 'link', 'meta', 'param', 'source', 'track', 'wbr'];

function HyperScript() {
  var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
      _ref$tab = _ref.tab,
      tab = _ref$tab === undefined ? '\t' : _ref$tab,
      _ref$nl = _ref.nl,
      nl = _ref$nl === undefined ? '\n' : _ref$nl,
      _ref$attrsNewLine = _ref.attrsNewLine,
      attrsNewLine = _ref$attrsNewLine === undefined ? true : _ref$attrsNewLine,
      _ref$devMode = _ref.devMode,
      devMode = _ref$devMode === undefined ? true : _ref$devMode,
      _ref$flexibleArgs = _ref.flexibleArgs,
      flexibleArgs = _ref$flexibleArgs === undefined ? true : _ref$flexibleArgs,
      _ref$voidElements = _ref.voidElements,
      voidElements = _ref$voidElements === undefined ? true : _ref$voidElements;

  tab = devMode ? tab : '';
  nl = devMode ? nl : ''; // nl: newline.

  return flexibleArgs ? _utils.hyperflexible.bind(null, hyperscript) : hyperscript;

  function hyperscript(type, attrs) {
    // Prep args, make defaults.
    attrs = !attrs ? {} : _extends({}, attrs);
    attrs.class = [].concat(attrs.class || [], attrs.className || []);
    attrs.style = !attrs.style ? {} : _extends({}, attrs.style);

    // Merge all attrs from selector str and 2nd arg obj.
    if (typeof type === 'string') {
      var sh = (0, _zenhand.zenhand)(type);

      type = sh.tag;

      if (!(0, _utils.isEmpty)(sh.attrs.class)) attrs.class = [].concat(sh.attrs.class, attrs.class);

      if (!(0, _utils.isEmpty)(sh.attrs.style)) attrs.style = _extends({}, sh.attrs.style, attrs.style);

      attrs = _extends({}, sh.attrs, attrs, { className: null });
    }

    var el = [];

    // Start opening tag.
    el.push('<' + type);

    // Add attributes to tag.
    for (var i = 0, k, v, keys = Object.keys(attrs); k = keys[i++], v = attrs[k], k;) {
      if (!(0, _utils.isEmpty)(v)) {
        if (attrsNewLine) el.push(nl);
        el.push(' ' + k + '="' + (k == 'class' ? v.join(' ') : k == 'style' ? (0, _zenhand.toStyleStr)(v) : v) + '"');
      }
    }

    // End opening tag.
    el.push('>');

    // Add children within element.

    for (var _len = arguments.length, children = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
      children[_key - 2] = arguments[_key];
    }

    if (!(0, _utils.isEmpty)(children)) {
      if (devMode) {
        // i: index, c: child.
        (0, _utils.flattened)(children, function (i, c) {
          el.push(nl + tab);
          el.push(c.split(nl).join(nl + tab));
        });
      } else {
        (0, _utils.flattened)(children, function (i, c) {
          return el.push(c);
        });
      }
    }

    // Add closing tag.
    // Check for empty void-elements, and leave off the closing tag.
    // if option `voidElements=true`.
    if (!(0, _utils.isEmpty)(children) || !voidElements || special.indexOf(type) == -1) el.push(nl + '</' + type + '>');

    return el.join('');
  }
}

exports.HyperScript = HyperScript;


if (require && require.main === module) {
  var h = HyperScript({ devMode: true, flexibleArgs: true, voidElements: true });
  // var h = require('hyperscript')

  var start = process.hrtime();
  for (var i = 0; i < 100000; i++) {
    var html = h('div#bob.a.b.c[type=awe][style=background:red; color:green]', { hola: 'value', class: ['c', 'foo', 'bar'], className: ['bar', 'baz'], style: { color: 'orange' } }, h('span', h('i', 'she\nsells\nsea', 'shells by the sea shore'), h('br'), h('i', { 'eh': true })));
  }print(process.hrtime(start));

  print(html);
  // print(html.outerHTML)
}