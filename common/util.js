'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var print = console.log.bind(console);
var hasOwnProperty = Object.prototype.hasOwnProperty;

function toStyleStr(obj) {
  var ks = Object.keys(obj),
      vs = Object.values(obj);

  return ks.map((e, i) => [e, vs[i]].join(':')).join('; ');
}

function fromStyleStr(str) {
  var k, v;
  return str.split(/\s*;\s*/).filter(e => e).reduce((acc, cur) => ([k, v] = cur.split(':'), _extends({}, acc, { [k]: v })), {});
}

function shorthand(tag) {
  var ret = { tag: 'div', attrs: { class: [], style: '' } };

  tag = tag.replace(/(?:[#\.\[]|^).*?(?=$|[#\.\[])|\]/g, m => {
    switch (m[0]) {
      case '#':
        ret.attrs.id = m.slice(1);
        break;
      case '.':
        ret.attrs.class.push(m.slice(1));
        break;
      case '[':
        var [key, val] = m.slice(1, -1).split('=');

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

    for (const k in obj) return false;
  }

  return true;
}

function* iter(obj) {
  var k;
  for (k in obj) {
    if (hasOwnProperty.call(obj, k)) yield [k, obj[k]];
  }
}

exports.toStyleStr = toStyleStr;
exports.fromStyleStr = fromStyleStr;
exports.shorthand = shorthand;
exports.isEmpty = isEmpty;
exports.iter = iter;