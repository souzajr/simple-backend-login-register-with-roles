const admin = require('./admin')

module.exports = app => {
    app.post('/signup', app.src.api.user.save)
    app.post('/signin', app.src.api.auth.signin)
    app.post('/validateToken', app.src.api.auth.validateToken)

    app.route('/users')
        .all(app.src.config.passport.authenticate())
        .get(app.src.api.user.getAll)
        .post(admin(app.src.api.user.save))

    app.route('/users/:id')
        .all(app.src.config.passport.authenticate())
        .put(admin(app.src.api.user.save))
        .delete(admin(app.src.api.user.remove))
        .get(app.src.api.user.get)
}