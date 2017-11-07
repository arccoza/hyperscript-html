const test = require('tape')
const print = console.log.bind(console)
const tapDiff = require('tap-diff')
const {HyperScript} = require('../lib/index')


if(!module.parent) {
  test.createStream()
    .pipe(tapDiff())
    .pipe(process.stdout);
}

let fix = {
  props: {
    class: ['foo', 'bar'],
    className: ['bar', 'baz'],
    style: {
      position: 'absolute',
      backgroundColor: '#ff0000',
    },
    title: 'A title attribute',
  }
}

function Results() {
  let ret = []
  Object.defineProperty(ret, 'last', { get: function(v) { return this[this.length] } })
  return Object.defineProperty(ret, 'more', { set: function(v) { this.push(v) } })
}


test(`hyperscript should return a single tag when supplied with no \
  args, null args, or empty args.`, function (t) {
  let h = HyperScript()
  let r = Results(), results = r
  let expect =
`<p>
</p>`

  t.comment(expect)
  r.more = h('p')
  r.more = h('p', null, null)
  r.more = h('p', {}, [])

  for (let r of results)
    t.equal(r, expect)

  t.end()
})

test(`hyperscript should return a single tag with attrs, when supplied \
a properties object.`, function (t) {
  let h = HyperScript()
  let expect =
`<p
 class="foo bar bar baz"
 style="position:absolute; backgroundColor:#ff0000"
 title="A title attribute">
</p>`

  t.comment(expect)
  let result = h('p', fix.props)

  t.equal(result, expect)

  t.end()
})

test('Test flexible fn interface, should be equal with different child arg arrangements.', function (t) {
  let h = HyperScript()
  let r = Results(), results = r
  let expect =
`<div>
\tText A.
\tText B.
\tText C.
\tText D.
</div>`

  t.comment(expect)
  r.more = h('div', null, 'Text A.', 'Text B.', 'Text C.', 'Text D.')
  r.more = h('div', 'Text A.', 'Text B.', 'Text C.', 'Text D.')
  r.more = h('div', null, ['Text A.', 'Text B.', 'Text C.', 'Text D.'])
  r.more = h('div', ['Text A.', 'Text B.', 'Text C.', 'Text D.'])
  r.more = h('div', null, 'Text A.', ['Text B.', 'Text C.'], 'Text D.')
  r.more = h('div', 'Text A.', ['Text B.', 'Text C.'], 'Text D.')
  r.more = h('div', null, ['Text A.', ['Text B.', ['Text C.', ['Text D.']]]])
  r.more = h('div', ['Text A.', ['Text B.', ['Text C.', ['Text D.']]]])
  r.more = h('div', null, ['Text A.'], ['Text B.'], ['Text C.'], ['Text D.'])
  r.more = h('div', ['Text A.'], ['Text B.'], ['Text C.'], ['Text D.'])

  for (let r of results)
    t.equal(r, expect)

  t.end()
})
