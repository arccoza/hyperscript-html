'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _util = require('./util.js');

var print = console.log.bind(console);
var printd = console.dir.bind(console);
// var {toStyleStr, fromStyleStr, shorthand, isEmpty, iter} = require('./util.js')


var special = ['area', 'base', 'br', 'col', 'command', 'embed', 'hr', 'img', 'input', 'keygen', 'link', 'meta', 'param', 'source', 'track', 'wbr'];

function HyperScript({ tab = '\t', nl = '\n', attrsNl = true, devMode = true } = {}) {
  tab = devMode ? tab : '';
  nl = devMode ? nl : ''; // nl: newline.

  return function hyperscript(type, attrs, ...children) {
    // Prep args, make positions flexible.
    children = Array.isArray(children[0]) ? children[0] : children;
    if (typeof attrs == 'string') [attrs, children] = [{}, [attrs, ...children]];else if (Array.isArray(attrs)) [attrs, children] = [{}, attrs];else attrs = attrs || {};
    attrs.class = attrs.class || [];
    attrs.style = attrs.style || {};

    // Merge all attrs from selector str and 2nd arg obj.
    if (typeof type === 'string') {
      var sh = (0, _util.shorthand)(type);

      type = sh.tag;

      if (!(0, _util.isEmpty)(sh.attrs.class)) attrs.class = [...new Set([...sh.attrs.class, ...attrs.class])];

      if (!(0, _util.isEmpty)(sh.attrs.style)) attrs.style = _extends({}, sh.attrs.style, attrs.style);

      attrs = _extends({}, sh.attrs, attrs);
    }

    var el = [];

    // Start opening tag.
    el.push(`<${type}`);

    // Add attributes to tag.
    for (var [k, v] of (0, _util.iter)(attrs)) {
      if (k != 'style' && k != 'class' || !(0, _util.isEmpty)(v)) {
        if (attrsNl) el.push(nl);
        el.push(` ${k}="${k == 'class' && !(0, _util.isEmpty)(v) ? v.join('.') : k == 'style' && !(0, _util.isEmpty)(v) ? (0, _util.toStyleStr)(v) : v}"`);
      }
    }

    // End opening tag.
    el.push('>');

    // Add children within element.
    if (!(0, _util.isEmpty)(children)) {
      if (devMode) {
        el.push(nl + tab);
        // i: index, c: child, eol: end of loop.
        for (var i = 0, c, eol; eol = !(children.length - 1 - i), c = children[i]; i++) el.push(c.split(nl).join(nl + tab) + (eol ? '' : nl + tab));
      } else {
        el.push(children.join(nl));
      }
    }

    // Add closing tag.
    // Check for empty void-elements, and leave off the closing tag.
    if (!(0, _util.isEmpty)(children) || special.indexOf(type) == -1) el.push(`${nl}</${type}>`);

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