const test = require('tape')
const print = console.log.bind(console)
const tapDiff = require('tap-diff')
const {isEmpty, isObject, hyperflexible, flattened} = require('../lib/utils')


if(!module.parent) {
  test.createStream()
    .pipe(tapDiff())
    .pipe(process.stdout);
}


test('isEmpty should be true when supplied an empty object, array or string or any other primitive.', function (t) {
  t.ok(isEmpty(undefined))
  t.ok(isEmpty(null))
  t.ok(isEmpty(0))
  t.ok(isEmpty(1))
  t.ok(isEmpty(true))
  t.ok(isEmpty(false))
  t.ok(isEmpty([]))
  t.ok(isEmpty(''))
  t.ok(isEmpty({}))
  t.end()
})

test('isEmpty should be false when supplied any array, string or object with contents.', function (t) {
  t.notOk(isEmpty(['foo']))
  t.notOk(isEmpty({foo: 'foo'}))
  t.notOk(isEmpty('foo'))
  t.end()
})


test('isObject should be true when supplied any object other than array or fn and false otherwise.', function (t) {
  t.ok(isObject({}))
  t.ok(isObject(new Date()))
  t.ok(isObject(Object()))
  t.notOk(isObject(Object([])))
  t.notOk(isObject([]))
  t.notOk(isObject(''))
  t.notOk(isObject(0))
  t.notOk(isObject(1))
  t.notOk(isObject(true))
  t.notOk(isObject(false))
  t.notOk(isObject(function() {}))
  t.end()
})
