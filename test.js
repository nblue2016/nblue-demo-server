const co = require('co')
const core = require('nblue-core')

const f = aq(function* () {

  const a = aq.Q(1)
  const b = aq.Q(2)
  const c = aq.Q(3)

  const r1 = yield [a, b, c]

  return r1
})
.catch(err => console.log(err))

f.then( data => {
  console.log('a1')
  console.log(data)
})
