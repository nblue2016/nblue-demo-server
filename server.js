const fs = require('fs')
const path = require('path')
const querystring = require('querystring')
const url = require('url')

const fake = require('nblue-core').fake
const FakedServer = fake.http

const staticFolders = ['/data', '/error/static']
const aq = require('nblue-core').aq

const getContentTypeByExtName = (ext) => {
  switch(ext) {
    case 'json':
      return 'application/json'
    case 'html':
    case 'htm':
      return 'text/html'
      case 'txt':
        return 'text/plain'
    default:
      return ''
  }
}

class server extends FakedServer
{
  constructor(...args)
  {
    super(args[0])
  }

  start()
  {
    console.log('start')
    super.start()
  }

  stop()
  {
    console.log('stop')
    super.stop()
  }

  process(req, res)
  {
    console.log(req.url)
    const u = url.parse(req.url)

    const pathname = u.pathname || '/'
    const path = u.path || '/'


    if (pathname === "/") {
      //process root folder
      res.writeHead(200, {"content-type":"text/plain"})
      res.write("This is a root")
      res.end()
      return
    }

    let paths = pathname.split('/').filter(s => s !== '')

    //catch satic files
    for(let folder of staticFolders) {

      if (pathname.startsWith(folder)) {

        (() => {

          //get file full name
          let dataFile = __dirname + pathname

          aq.call(null, fs.stat, dataFile)
            .then(err => dataFile)
            .then(data => aq.call(null, fs.readFile, data))
            .then(data => {
              res.writeHead(200, {'content-type': getContentTypeByExtName('json')})
              res.write(data)
            })
            .catch(err => {console.log('not found')})
            .finally(() => {
              res.end()
            })
        })()

        return
      }
    }
  }
}

module.exports = server
