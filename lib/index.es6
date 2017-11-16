'use strict'
var print = console.log.bind(console)
var printd = console.dir.bind(console)
import {isEmpty, hyperflexible, flattened} from './utils.js'
import {toStyleStr, zenhand} from 'zenhand'


var special = ['area', 'base', 'br', 'col', 'command', 'embed', 'hr', 'img', 'input',
  'keygen', 'link', 'meta', 'param', 'source', 'track', 'wbr']

function HyperScript({tab='\t', nl='\n', attrsNewLine=true, prettyPrint=true,
  flexibleArgs=true, voidElements=true, shortHand=true}={}) {
  tab = prettyPrint ? tab : ''
  nl = prettyPrint ? nl : ''  // nl: newline.

  return flexibleArgs ? hyperflexible.bind(null, hyperscript) : hyperscript

  function hyperscript(type, attrs, ...children) {
    // Prep args, make defaults.
    attrs = !attrs ? {} : {...attrs}
    attrs.class = [...(attrs.class || []), ...(attrs.className || [])]
    attrs.style = !attrs.style ? {} : {...attrs.style}

    // Merge all attrs from selector str and 2nd arg obj.
    if (shortHand && typeof type === 'string') {
      var sh = zenhand(type, {changeStyleCase:true})

      type = sh.tag

      if (!isEmpty(sh.attrs.class))
        attrs.class = [...sh.attrs.class, ...attrs.class]

      if (!isEmpty(sh.attrs.style))
        attrs.style = {...sh.attrs.style, ...attrs.style}

      attrs = {...sh.attrs, ...attrs, className: null}
    }

    // Start opening tag.
    var el = `<${type}`

    // Add attributes to tag.
    for (var i = 0, k, v, keys = Object.keys(attrs); k = keys[i++], v = attrs[k], k;) {
      if (isEmpty(v)) continue
      el += `${attrsNewLine ? nl : ''} ${k}="${k == 'class' ? v.join(' ') : k == 'style' ? toStyleStr(v, 'camel', 'kebab') : v}"`
    }

    // End opening tag.
    el += '>'

    // Add children within element.
    if (!isEmpty(children)) {
      if (prettyPrint) {
        // i: index, c: child.
        flattened(children, (i, c) => {
          el += `${nl}${tab}${c.split(nl).join(nl + tab)}`
        })
      }
      else {
        flattened(children, (i, c) => el += c)
      }
    }

    // Add closing tag.
    // Check for empty void-elements, and leave off the closing tag.
    // if option `voidElements=true`.
    if (!isEmpty(children) || (!voidElements || special.indexOf(type) == -1))
      el += `${nl}</${type}>`

    return el
  }
}

function wrap(elements, opts={}) {
  if (!elements || isEmpty(elements))
    return

  let h = HyperScript({...opts, shortHand: false})
  let wrapped = {}

  for (let k in elements) {
    if (elements.hasOwnProperty(k)) {
      wrapped[k] = h.bind(null, elements[k])
    }
  }

  return wrapped
}

export {HyperScript, wrap}
