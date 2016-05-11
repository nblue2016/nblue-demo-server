const core = require('nblue-core')
const Server = require('./server')

const server = new Server(1093)
server.start()

fetch('http://localhost:1093/')
  .then(res => (res.ok) ? res.text() : 0)
  .then(data => console.log(data))
  .then(() => console.log('Test OK!'))
  .done()

const f0 = aq.rest.bind(aq, 'http://localhost:1093/')
const f1 = aq.rest.bind(aq, 'http://localhost:1093/data/test.json')
const f2 = aq.rest.bind(aq, 'http://localhost:1093/data/test2.json')
const f3 = aq.rest.bind(aq, 'http://localhost:1093/data/error.json')

Promise.race([f2(), f1(), f0()])
  .then(data => console.log(data))

/*
aq.parallel([f0(), f1(), f2()])
  .then(data => console.log(data))
  .catch(err => console.log(err))
  */

aq.series([f2(), f0(), f1()])
  .then(data => console.log(data))

f3()
  .catch(err => console.log(err.status))
