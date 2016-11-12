require('nblue')

const fs = require('fs')
const Server = require('./server')

// parse server config file
const configFile = String.format("%s/server.yaml", __dirname)
const config = ConfigMap.parseYAML(fs.readFileSync(configFile, 'utf-8')) || {}

// get settings from config file
const port = config.get('port') || 8088
const staticFolders = config.get('staticFolders') || []

// create new instance of server and start
const server = new Server(port)
staticFolders.forEach(folder => server.staticFolders.push(folder))

server.start()
console.log(String.format("server started on port: %s", port))
