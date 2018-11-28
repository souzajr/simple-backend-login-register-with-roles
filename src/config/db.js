const mongoose = require('mongoose')
require('dotenv').config()

module.exports = {
    openConn() {
        mongoose.connect(process.env.DB_HOST, { useNewUrlParser: true }).catch(e => {
            const msg = 'Error connecting to database!'
            console.log('\x1b[41m$s\x1b[37m', msg, '\x1b[0m')
        })
        require('../model/userModel')
        mongoose.set('useCreateIndex', true)
        mongoose.set('useFindAndModify', false)
    },

    closeConn() {
        mongoose.disconnect().catch(e => {
            const msg = 'Error disconnecting from database!'
            console.log('\x1b[41m$s\x1b[37m', msg, '\x1b[0m')
        })
    }
}