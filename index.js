const express = require('express')
const path = require('path')
const PORT = process.env.PORT || 5000
const isDev = !process.env.PORT

express()
  .use((req, res, next) => {
    if (!isDev && req.protocol !== 'http') {
      return res.redirect(301, 'https://' + req.headers.host + req.originalUrl)
    }
    next()
  })
  .use((req, res, next) => {
    if (req.headers.host.slice(0, 4) === 'www.') {
      const newHost = req.headers.host.slice(4)
      return res.redirect(301, req.protocol + '://' + newHost + req.originalUrl)
    }
    next()
  })
  .use((req, res, next) => {
    const test = /\?[^]*\//.test(req.url)
    if (req.url.substr(-1) === '/' && req.url.length > 1 && !test) {
      return res.redirect(301, req.url.slice(0, -1))
    }
    next()
  })
  .use(express.static(path.join(__dirname, 'public')))
  .set('views', [path.join(__dirname, 'pages'), path.join(__dirname, 'components')])
  .set('view engine', 'ejs')
  .get('/', (req, res) => res.render('index'))
  .listen(PORT, () => console.log(`Listening on ${ PORT }`))
