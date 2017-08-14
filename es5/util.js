'use strict';

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _marked = [iter].map(_regenerator2.default.mark);

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var print = console.log.bind(console);
var hasOwnProperty = Object.prototype.hasOwnProperty;

function toStyleStr(obj) {
  var ks = Object.keys(obj),
      vs = Object.values(obj);

  return ks.map(function (e, i) {
    return [e, vs[i]].join(':');
  }).join('; ');
}

function fromStyleStr(str) {
  var k, v;
  return str.split(/\s*;\s*/).filter(function (e) {
    return e;
  }).reduce(function (acc, cur) {
    var _cur$split, _cur$split2;

    return (_cur$split = cur.split(':'), _cur$split2 = _slicedToArray(_cur$split, 2), k = _cur$split2[0], v = _cur$split2[1], _cur$split), _extends({}, acc, _defineProperty({}, k, v));
  }, {});
}

function shorthand(tag) {
  var ret = { tag: 'div', attrs: { class: [], style: '' } };

  tag = tag.replace(/(?:[#\.\[]|^).*?(?=$|[#\.\[])|\]/g, function (m) {
    switch (m[0]) {
      case '#':
        ret.attrs.id = m.slice(1);
        break;
      case '.':
        ret.attrs.class.push(m.slice(1));
        break;
      case '[':
        var _m$slice$split = m.slice(1, -1).split('='),
            _m$slice$split2 = _slicedToArray(_m$slice$split, 2),
            key = _m$slice$split2[0],
            val = _m$slice$split2[1];

        // Process style string into obj.


        if (key.toLowerCase() == 'style') val = fromStyleStr(val);

        ret.attrs[key] = val || true;
        break;
      default:
        ret.tag = m;
    }
  });

  return ret;
}

function isEmpty(obj) {
  if (obj) {
    if (obj.length || obj.size) return false;

    for (var k in obj) {
      return false;
    }
  }

  return true;
}

function iter(obj) {
  var k;
  return _regenerator2.default.wrap(function iter$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.t0 = _regenerator2.default.keys(obj);

        case 1:
          if ((_context.t1 = _context.t0()).done) {
            _context.next = 8;
            break;
          }

          k = _context.t1.value;

          if (!hasOwnProperty.call(obj, k)) {
            _context.next = 6;
            break;
          }

          _context.next = 6;
          return [k, obj[k]];

        case 6:
          _context.next = 1;
          break;

        case 8:
        case 'end':
          return _context.stop();
      }
    }
  }, _marked[0], this);
}

module.exports = { toStyleStr: toStyleStr, fromStyleStr: fromStyleStr, shorthand: shorthand, isEmpty: isEmpty, iter: iter };