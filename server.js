const url = require('url')
const fs = require('fs')
const path = require('path')
const http = require('http')

const core = require('nblue-core')

const fake = core.fake
const FakedServer = fake.http

const defaultFolders = ['data', 'error/static']

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

  constructor(...args) {
    super(args[0])

    this.staticFolders = []
  }

  get StaticFolders() {
    return this.staticFolders
  }

  createServer() {
    const server = http.createServer(this.process)

    server.ctx = this

    return server
  }

  process(req, res) {
    const ctx = (this && this.ctx) ? this.ctx : {}

    const u = url.parse(req.url)
    const pathname = u.pathname || '/'

    if (pathname === "/") {
      // process root folder
      res.writeHead(200, {"content-type":"text/plain"})
      res.write("This is a root")
      res.end()

      return
    }

    const staticFolders
      = ctx.StaticFolders && ctx.StaticFolders.length > 0 || defaultFolders

    //catch satic files
    for(let folder of staticFolders) {

      if (pathname.startsWith('/' + folder)) {
        (() => {
          //get file full name
          const dataFile = String.format("%s/%s", __dirname, pathname)

          aq.
            call(null, fs.stat, dataFile).
            then((data) => {
              const contentType = getContentTypeByExtName(path.extname(dataFile))

              res.writeHead(200, {'content-type': contentType})
              fs.createReadStream(dataFile).pipe(res)
            }).
            catch((err) => {
              console.log('request file failed')

              res.writeHead(404, {'content-type': 'text/plain'})
              res.write('not found')
              res.end()
            })
            .done()
        })()

        return
      }
    }

    console.log('request file failed')
    res.writeHead(404, {'content-type': 'text/plain'})
    res.write(String.format("not found: %s", pathname))
    res.end()
  }

}

module.exports = Server
