const app = require('express')()
const consign = require('consign')
const db = require('./src/config/db')

db.openConn()
consign()
    .include('./src/config/passport.js')
    .then('./src/config/middlewares.js')
    .then('./src/api/validation.js')
    .then('./src/api')
    .then('./src/config/routes.js')
    .into(app)

const port = 3000
app.listen(port, () => {
    console.log(`Server running on port ${port}`)
})