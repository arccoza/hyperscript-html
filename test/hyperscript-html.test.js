const test = require('tape')
const print = console.log.bind(console)
const tapDiff = require('tap-diff')
const {HyperScript} = require('../lib/index')


if(!module.parent) {
  test.createStream()
    // .pipe(tapSpec())
    // .pipe(tapNotify())
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


test('Test the most basic, single tag with no attrs or children, should be equal.', function (t) {
  let h = HyperScript()
  let expect =
`<p>
</p>`

  let
    a = h('p'),
    b = h('p', null, null),
    c = h('p', {}, []),
    results = [a, b, c]

  for (let r of results)
    t.equal(r, expect)

  t.end()
})

test('Test attrs handling, should be equal.', function (t) {
  let h = HyperScript()
  let expect =
`<p
 class="foo bar bar baz"
 style="position:absolute; backgroundColor:#ff0000"
 title="A title attribute">
</p>`

  let result = h('p', fix.props)

  t.equal(result, expect)

  t.end()
})

test('Test flexible fn interface, should be equal with different child arg arrangements.', function (t) {
  let h = HyperScript()
  let expect =
`<div>
\tText A.
\tText B.
\tText C.
\tText D.
</div>`

  let
    a = h('div', null, 'Text A.', 'Text B.', 'Text C.', 'Text D.'),
    b = h('div', 'Text A.', 'Text B.', 'Text C.', 'Text D.'),
    c = h('div', null, ['Text A.', 'Text B.', 'Text C.', 'Text D.']),
    d = h('div', ['Text A.', 'Text B.', 'Text C.', 'Text D.']),
    e = h('div', null, 'Text A.', ['Text B.', 'Text C.'], 'Text D.'),
    f = h('div', 'Text A.', ['Text B.', 'Text C.'], 'Text D.'),
    g = h('div', null, ['Text A.', ['Text B.', ['Text C.', ['Text D.']]]]),
    i = h('div', ['Text A.', ['Text B.', ['Text C.', ['Text D.']]]]),
    j = h('div', null, ['Text A.'], ['Text B.'], ['Text C.'], ['Text D.']),
    k = h('div', ['Text A.'], ['Text B.'], ['Text C.'], ['Text D.']),
    results = [a, b, c, d, e, f, g, i, j, k]

  // print(k)

  for (let r of results)
    t.equal(r, expect)

  t.end()
})
