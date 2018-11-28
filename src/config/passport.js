const db = require('../config/db')
const mongoose = require('mongoose')
const User = mongoose.model('User')
const passport = require('passport')
const passportJwt = require('passport-jwt')
const { Strategy, ExtractJwt } = passportJwt
require('dotenv').config()

module.exports = app => {
    const params = {
        secretOrKey: process.env.AUTH_SECRET,
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
    }

    const strategy = new Strategy(params, (payload, done) => {
        db.openConn()
        User.findOne({ _id: payload.id }).then(user => done(null, user ? { ...payload } : false)).catch(err => done(err, false))
        db.closeConn()
    })

    passport.use(strategy)

    return {
        authenticate: () => passport.authenticate('jwt', { session: false })
    }
}