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


test('Test flexible fn interface, should be equal with different args.', function (t) {
  let expect =
`<div>
\tText A.
\tText B.
</div>`

  let
    a = h('div', null, 'Text A.', 'Text B.'),
    b = h('div', 'Text A.', 'Text B.'),
    c = h('div', null, ['Text A.', 'Text B.']),
    d = h('div', ['Text A.', 'Text B.']),
    results = [a, b, c, d]

  print(h('div', null, ['Text A.', 'Text B.'], 'Text C.'))

  for (let r of results)
    t.equal(r, expect)

  t.end()
})
