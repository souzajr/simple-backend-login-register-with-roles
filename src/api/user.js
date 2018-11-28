const bcrypt = require('bcrypt-nodejs')
const db = require('../config/db')
const mongoose = require('mongoose')
const User = mongoose.model('User')

module.exports = app => {
    const { existOrError, notExistOrError, equalsOrError } = app.src.api.validation

    const encryptPassword = password => {
        const salt = bcrypt.genSaltSync(10)
        return bcrypt.hashSync(password, salt)
    }

    const save = async (req, res) => {
        const user = { ...req.body }
        if(req.params.id) user.id = req.params.id

        if(!req.originalUrl.startsWith('/users')) user.admin = false
        if(!req.user || !req.user.admin) user.admin = false
        
        try {
            existOrError(user.name, 'Name not set')
            existOrError(user.email, 'E-mail not set')
            existOrError(user.password, 'Senha not set')
            existOrError(user.confirmPassword, 'Password confirmation is invalid')
            equalsOrError(user.password, user.confirmPassword, "Passwords don't match")
            db.openConn()
            const userFromDB = await User.findOne({ email: user.email })
            db.closeConn()
            if(!user.id) notExistOrError(userFromDB, 'User already registered')
        } catch(msg) {
            return res.status(400).send(msg)
        }

        user.password = encryptPassword(req.body.password)
        delete user.confirmPassword
        
        if(user.id) {
            db.openConn()
            await User.findOneAndUpdate({ _id: user.id, deletedAt: { $exists: false }}, user).then(_ => res.status(204).send()).catch(err => res.status(500).send(err))
            db.closeConn()
        } else {
            db.openConn()
            await User.create(user).then(_ => res.status(204).send()).catch(err => res.status(500).send(err))
            db.closeConn()
        }
    }

    const getAll = async (req, res) => {
        db.openConn()
        await User.find({ deletedAt: { $exists: false }}, {
            "_id": 1,
            "name": 1,
            "email": 1,
            "admin": 1,
            "createdAt": 1
        }).then(users => res.json(users)).catch(err => res.status(500).send(err))
        db.closeConn()
    }

    const remove = async (req, res) => {
        db.openConn()
        await User.findByIdAndUpdate({ _id: req.params.id }, { deletedAt: new Date()}).then(_ => res.status(204).send()).catch(err => res.status(500).send(err))
        db.closeConn()
    }

    const get = async (req, res) => {
        db.openConn()
        await User.findOne({ _id: req.params.id, deletedAt: { $exists: false }}, {
            "_id": 1,
            "name": 1,
            "email": 1,
            "admin": 1,
            "createdAt": 1
        }).then(user => res.json(user)).catch(err => res.status(500).send(err))
        db.closeConn()
    }

    return { save, getAll, remove, get }
}