'use strict'
const {isEmpty, hyperflexible, flattened} = require('./utils.js')
const {toStyleStr, zenhand} = require('zenhand')


const special = {
  'area': true, 'base': true, 'br': true, 'col': true, 'command': true, 'embed': true, 'hr': true, 'img': true, 'input': true,
  'keygen': true, 'link': true, 'meta': true, 'param': true, 'source': true, 'track': true, 'wbr': true
}

function HyperScript({tab='\t', nl='\n', attrsNewLine=true, prettyPrint=true,
  flexibleArgs=true, voidElements=true, shortHand=true}={}) {
  tab = prettyPrint ? tab : ''
  nl = prettyPrint ? nl : ''  // nl: newline.

  return flexibleArgs ? hyperflexible.bind(null, hyperscript) : hyperscript

  function hyperscript(type, attrs, ...children) {
    // Prep args, make defaults.
    attrs = !attrs ? {} : {...attrs}
    attrs.class = [...(attrs.class || []), ...(attrs.className || [])]
    attrs.className = null
    attrs.style = !attrs.style ? {} : {...attrs.style}

    // Merge all attrs from selector str and 2nd arg obj.
    if (shortHand && typeof type === 'string') {
      var sh = zenhand(type, {changeStyleCase:true})

      type = sh.tag

      if (!isEmpty(sh.attrs.class))
        attrs.class = [...sh.attrs.class, ...attrs.class]

      if (!isEmpty(sh.attrs.style))
        attrs.style = {...sh.attrs.style, ...attrs.style}

      attrs = {...sh.attrs, ...attrs}
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
    // Check for empty void-elements, and leave off the closing tag.
    else if (voidElements && special[type]) {
      return el
    }

    // Add closing tag.
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

module.exports = {HyperScript, wrap}
