const core = require('nblue-core')
const Server = require('./server')
const port = 1033


const baseUrl = String.format("http://localhost:%s", port)
const staticFiles = ['data/test.json', 'data/test2.json', 'data/error.json']

console.log(String.format("base url: %s", baseUrl))

const server = new Server(port)

server.start()
console.log('start')

try {

  const f0 = aq.rest.bind(aq, String.format("%s/", baseUrl))
  const f1 = aq.rest.bind(aq, String.format("%s/%s", baseUrl, staticFiles[0]))
  const f2 = aq.rest.bind(aq, String.format("%s/%s", baseUrl, staticFiles[1]))
  const f3 = aq.rest.bind(aq, String.format("%s/%s", baseUrl, staticFiles[2]))

  aq.Q(1)
    .then(data => {
      console.log('ready')
      return f0()
    })
    .then(data => {
      console.log('get result from f0:')
      console.log(data)
      return f1()
    })
    .then(data => {
      console.log('get result from f1:')
      console.log(data)
      return f2()
    })
    .then(data => {
      console.log('get result from f2:')
      console.log(data)
      return aq.parallel([f1(), f2(), f0()])
    })
    .then(data => {
      console.log('get result from parallel mode:')
      console.log(data)
      return f3()
    })
    .catch(err => {
      console.log('get error from f3:')
      console.log(String.format("Test failed: %s", err.message))
    })
    .finally(() => {
      server.stop()
      console.log('end')
    })
}
catch(err) {
  console.log('failed')
  console.log(String.format("Test failed: %s", err.message))
}
