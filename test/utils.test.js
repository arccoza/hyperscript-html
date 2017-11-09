const test = require('tape')
const print = console.log.bind(console)
const tapDiff = require('tap-diff')
const {isEmpty, isDict, hyperflexible, flattened} = require('../lib/utils')


if(!module.parent) {
  test.createStream()
    .pipe(tapDiff())
    .pipe(process.stdout);
}


test(`isEmpty should be false when supplied any array, \
string or object with contents, and true otherwise.`, function (t) {
  t.comment(`['foo']`)
  t.notOk(isEmpty(['foo']))

  t.comment(`{foo: 'foo'}`)
  t.notOk(isEmpty({foo: 'foo'}))

  t.comment(`'foo'`)
  t.notOk(isEmpty('foo'))

  t.comment(`undefined`)
  t.ok(isEmpty(undefined))

  t.comment(`null`)
  t.ok(isEmpty(null))

  t.comment(`0`)
  t.ok(isEmpty(0))

  t.comment(`1`)
  t.ok(isEmpty(1))

  t.comment(`true`)
  t.ok(isEmpty(true))

  t.comment(`false`)
  t.ok(isEmpty(false))

  t.comment(`[]`)
  t.ok(isEmpty([]))

  t.comment(`''`)
  t.ok(isEmpty(''))

  t.comment(`{}`)
  t.ok(isEmpty({}))
  t.end()
})

test(`isDict should be true when supplied any object \
other than array or fn and false otherwise.`, function (t) {
  t.comment(`{}`)
  t.ok(isDict({}))

  t.comment(`new Date()`)
  t.ok(isDict(new Date()))

  t.comment(`Object()`)
  t.ok(isDict(Object()))

  t.comment(`Object([])`)
  t.notOk(isDict(Object([])))

  t.comment(`[]`)
  t.notOk(isDict([]))

  t.comment(`''`)
  t.notOk(isDict(``))

  t.comment(`0`)
  t.notOk(isDict(0))

  t.comment(`1`)
  t.notOk(isDict(1))

  t.comment(`true`)
  t.notOk(isDict(true))

  t.comment(`false`)
  t.notOk(isDict(false))

  t.comment(`function() {}`)
  t.notOk(isDict(function() {}))
  t.end()
})

test(`hyperflexible should take a variable number \
of args(1+), and insert a null at args[1] if args[1] \
is not an object/dict or null, and call the wrapped fn with (2+) args.`, function (t) {
  let f1 = (...args) => (t.comment(args.length + ': ' + JSON.stringify(args)) ,t.ok(args[1] == null))
  let f2 = (...args) => (t.comment(args.length + ': ' + JSON.stringify(args)) ,t.ok(args[1] != null))
  f1 = hyperflexible.bind(null, f1)
  f2 = hyperflexible.bind(null, f2)

  f1()
  f1('div')
  f1('div', 1, 2, 3)
  f2('div', {})
  f2('div', {}, 1, 2)
  t.end()
})

test(`flattened should take an array with any arrangement \
of values and nested arrays and call a fn with each item \
as if from a flat list.`, function (t) {
  let r = null
  f = (acc, arr) => (flattened(arr, (i, v) => acc.push(v)), acc)

  t.comment(JSON.stringify([1, 2, 3, [4, 5, [6, 7, [8]]]]))
  r = f([], [1, 2, 3, [4, 5, [6, 7, [8]]]])

  t.deepLooseEqual([1, 2, 3, 4, 5, 6, 7, 8], r)
  t.end()
})
