[travis]:       https://travis-ci.org/arccoza/hyperscript-html
[travis-img]:   https://img.shields.io/travis/arccoza/hyperscript-html.svg

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
