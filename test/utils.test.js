const test = require('tape')
const print = console.log.bind(console)
const tapDiff = require('tap-diff')
const {isEmpty, isObject, hyperflexible, flattened} = require('../lib/utils')


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

test(`isObject should be true when supplied any object \
other than array or fn and false otherwise.`, function (t) {
  t.comment('{}')
  t.ok(isObject({}))

  t.comment('new Date()')
  t.ok(isObject(new Date()))

  t.comment('Object()')
  t.ok(isObject(Object()))

  t.comment('Object([])')
  t.notOk(isObject(Object([])))

  t.comment('[]')
  t.notOk(isObject([]))

  t.comment("''")
  t.notOk(isObject(''))

  t.comment('0')
  t.notOk(isObject(0))

  t.comment('1')
  t.notOk(isObject(1))

  t.comment('true')
  t.notOk(isObject(true))

  t.comment('false')
  t.notOk(isObject(false))

  t.comment('function() {}')
  t.notOk(isObject(function() {}))
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
