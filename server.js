const url = require('url')
const fs = require('fs')
const path = require('path')
const http = require('http')

const core = require('nblue-core')
const FakedServer = core.fake.http

const staticFolders = ['/data', '/error/static']

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

class Server extends FakedServer
{
  constructor(...args)
  {
    super(args[0])

    //this.server = null
  }

  createServer()
  {
    const server = http.createServer(this.process)

    server.ctx = this

    return server
  }

  process(req, res)
  {
    const that = (this && this.ctx) ? this.ctx : {}

    console.log(req.headers)

    const u = url.parse(req.url)
    const pathname = u.pathname || '/'

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
          const dataFile = __dirname + pathname

          aq.call(null, fs.stat, dataFile)
            .then(data => {

              const contentType = getContentTypeByExtName(path.extname(dataFile))

              res.writeHead(200, {'content-type': contentType})
              fs.createReadStream(dataFile).pipe(res)
            })
            .catch(err => {
              res.writeHead(404, {'content-type': 'text/plain'})
              res.write('not found')
              res.end()
            })
            .done()
        })()

        return
      }
    }

    FakedServer.process(req, res)
  }
}

module.exports = Server
