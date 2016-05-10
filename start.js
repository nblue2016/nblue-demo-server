const Server = require('./server')
const q = require('nblue-core').aq

//create new instance of server with port
const server = new Server(1093)

server.start()

q.rest('http://localhost:1093/')
  .then(data => {
    console.log(data)
    return q.rest('http://localhost:1093/data/test.json')
  })
  .then(data => {
    console.log(data)
    return q.rest('http://localhost:1093/data/test2.json')
  })
  .then(data => {
    console.log(data)
    return q.rest('http://localhost:1093/data/non.json')
  })
  .catch(err => {
    console.log(err)
  })
