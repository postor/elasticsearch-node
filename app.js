const express = require('express')
require('express-async-errors')
const next = require('next')
const { init, router } = require('./api')

const port = parseInt(process.env.PORT, 10) || 3000
const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()

  ; (async () => {
    await app.prepare()
    await init()

    const server = express()
    server.use('/api', router)

    server.get('*', (req, res) => {
      return handle(req, res)
    })

    server.listen(port, err => {
      if (err) throw err
      console.log(`> Ready on http://localhost:${port}`)
    })
  })()
