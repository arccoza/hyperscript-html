[travis]:       https://travis-ci.org/arccoza/hyperscript-html
[travis-img]:   https://travis-ci.org/arccoza/hyperscript-html.svg

# hyperscript-html [![Travis Build Status][travis-img]][travis]
Hyperscript-html provides a simple, fast, and lightweight hyperscript function to generate HTML.

## Example

### Input
```js
var {HyperScript, wrap} = require('hyperscript-html')
// import {HyperScript, wrap} from 'hyperscript-html'  // If you're using es modules.

var h = HyperScript()

var html = 
h('div#id.cls.cls2[attr1=val1][style=background-color:#ff0000; position:relative]',
  h('h1', {class: ['title']}, 'The Title'),
  h('p.content', 'The content'),
)
```

### Input with wrapped elements
```js
var {HyperScript, wrap} = require('hyperscript-html')
// import {HyperScript, wrap} from 'hyperscript-html'  // If you're using es modules.

var {div, h1, p} = wrap({div: 'div', h1: 'h1', p: 'p'})

var html = 
div({id: 'id', class: ['cls', 'cls2'], style: {backgroundColor: '#ff0000', position: 'relative'}},
  h1({class: ['title']}, 'The Title'),
  p({class: ['content']}, 'The content'),
)
```

### Output
```html
<div
 class="cls cls2"
 style="background-color:#ff0000; position:relative;"
 id="id"
 attr1="val1">
	<h1
	 class="title">
		The Title
	</h1>
	<p
	 class="content">
		The content
	</p>
</div>
```

## API

### HyperScript([options])

The `hyperscript` constructor, takes optional options object argument, returns a `hyperscript` function.

```js
var h = HyperScript()

// or with options
var h = HyperScript({tab:'\t', nl:'\n', attrsNewLine:true, prettyPrint:true,
  flexibleArgs:true, voidElements:true, shortHand:true})
```

### hyperscript(tag[, attrs[, ...children]])

The `hyperscript` function returned from the `HyperScript` constructor, takes a required tag name (eg. `'div'`), and optional attributes object, and optional children. The children can be added as an array or multiple arguments, or a combination of arrays and arguments.

```js
// tag
h('div')

// tag and attributes
h('div', {id: 'id', class: ['cls']})

// If the `shortHand` option is `true` (default),
// you can supply a CSS selector like string for the tag
// and the values will be extracted to their respective attributes.
h('div#id.cls[attr1=val][attr2]')

// tag with child arguments
h('div', 'hello', h('b', 'world'))

// tag with child array
h('div', ['hello', h('b', 'world')])

// tag with attributes and child arguments
h('div', {class: ['cls']}, 'hello', h('b', 'world'))
```

### wrap(elements[, options])

The wrap function creates shorthand `hyperscript` functions. It takes an object of elements with mapping `function name : element tag` (eg. `{div: 'div', BOX: 'div}`), and an optional options object (the same options that `HyperScript` takes). It returns an object of bound shorthand hyperscript functions.

```js
var {box, h1, p} = wrap({box: 'div', h1: 'h1', p: 'p'})

box(
  h1('Title'),
  p('Content'),
)
```

### options object

**Option** | **Default value** | **Description**
---:|:---|:---
`tab` | `'\t'` | What to use as the tab.
`nl` | `'\n'` | What to use as the line break.
`prettyPrint` | `true` | Format the HTML output nicely with newlines and tabs, set to `false` for faster rendering.
`attrsNewLine` | `true` | Put attributes on a new line when `prettyPrint` is `true`.
`shortHand` | `true`, always `false` for `wrap` fn | Use CSS like selector syntax in tag names for shorthand id, class and attributes values. Set to `false` for faster rendering.
`voidElements` | `true` | Leave the closing tag off of empty void elements.
`flexibleArgs` | `true` | Make the hyperscript functions interface flexible, if `false` you must provide a value for attributes argument or `null` if you supply children (eg. `h('div', null, 'child text')`.
