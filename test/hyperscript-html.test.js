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

var h = HyperScript()

var fix = {
  props: {
    title: 'A title attribute',
    style: {
      position: 'absolute',
      backgroundColor: '#ff0000',
    }
  }
}


test('Test flexible fn interface, should be equal with different child arg arrangements.', function (t) {
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
