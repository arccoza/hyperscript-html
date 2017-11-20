'use strict';

exports.__esModule = true;
exports.wrap = exports.HyperScript = undefined;

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
      _ref$prettyPrint = _ref.prettyPrint,
      prettyPrint = _ref$prettyPrint === undefined ? true : _ref$prettyPrint,
      _ref$flexibleArgs = _ref.flexibleArgs,
      flexibleArgs = _ref$flexibleArgs === undefined ? true : _ref$flexibleArgs,
      _ref$voidElements = _ref.voidElements,
      voidElements = _ref$voidElements === undefined ? true : _ref$voidElements,
      _ref$shortHand = _ref.shortHand,
      shortHand = _ref$shortHand === undefined ? true : _ref$shortHand;

  tab = prettyPrint ? tab : '';
  nl = prettyPrint ? nl : ''; // nl: newline.

  return flexibleArgs ? _utils.hyperflexible.bind(null, hyperscript) : hyperscript;

  function hyperscript(type, attrs) {
    // Prep args, make defaults.
    attrs = !attrs ? {} : _extends({}, attrs);
    attrs.class = [].concat(attrs.class || [], attrs.className || []);
    attrs.className = null;
    attrs.style = !attrs.style ? {} : _extends({}, attrs.style);

    // Merge all attrs from selector str and 2nd arg obj.
    if (shortHand && typeof type === 'string') {
      var sh = (0, _zenhand.zenhand)(type, { changeStyleCase: true });

      type = sh.tag;

      if (!(0, _utils.isEmpty)(sh.attrs.class)) attrs.class = [].concat(sh.attrs.class, attrs.class);

      if (!(0, _utils.isEmpty)(sh.attrs.style)) attrs.style = _extends({}, sh.attrs.style, attrs.style);

      attrs = _extends({}, sh.attrs, attrs);
    }

    // Start opening tag.
    var el = '<' + type;

    // Add attributes to tag.
    for (var i = 0, k, v, keys = Object.keys(attrs); k = keys[i++], v = attrs[k], k;) {
      if ((0, _utils.isEmpty)(v)) continue;
      el += (attrsNewLine ? nl : '') + ' ' + k + '="' + (k == 'class' ? v.join(' ') : k == 'style' ? (0, _zenhand.toStyleStr)(v, 'camel', 'kebab') : v) + '"';
    }

    // End opening tag.
    el += '>';

    // Add children within element.

    for (var _len = arguments.length, children = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
      children[_key - 2] = arguments[_key];
    }

    if (!(0, _utils.isEmpty)(children)) {
      if (prettyPrint) {
        // i: index, c: child.
        (0, _utils.flattened)(children, function (i, c) {
          el += '' + nl + tab + c.split(nl).join(nl + tab);
        });
      } else {
        (0, _utils.flattened)(children, function (i, c) {
          return el += c;
        });
      }
    }

    // Add closing tag.
    // Check for empty void-elements, and leave off the closing tag.
    // if option `voidElements=true`.
    if (!(0, _utils.isEmpty)(children) || !voidElements || special.indexOf(type) == -1) el += nl + '</' + type + '>';

    return el;
  }
}

function wrap(elements) {
  var opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  if (!elements || (0, _utils.isEmpty)(elements)) return;

  var h = HyperScript(_extends({}, opts, { shortHand: false }));
  var wrapped = {};

  for (var k in elements) {
    if (elements.hasOwnProperty(k)) {
      wrapped[k] = h.bind(null, elements[k]);
    }
  }

  return wrapped;
}

exports.HyperScript = HyperScript;
exports.wrap = wrap;