var session = require('express-session');
var MongoStore = require('connect-mongo')(session);

var passport = require('passport');

module.exports = ({Database, UserModel, Config, AuthRegistry}) => {

    passport.serializeUser((user, done) => done(null, user.id));
    passport.deserializeUser((id, done) => UserModel.findById(id, done));

    var sessionMiddleware = session({
        store: new MongoStore({mongooseConnection: Database}),
        resave: false,
        saveUninitialized: false,
        secret: Config.session.secret,
    });

    for(var key of Object.keys(AuthRegistry)) {
        var config = Object.assign({
            callback: `https://${Config.server.domain}/login/${key}`,
        }, Config.provider[key]);

        var strategy = AuthRegistry[key](config);
        passport.use(key, strategy);
    }

    var ident = m => m;
    return {
        setup(app, wrap = ident) {
            app.use(wrap(sessionMiddleware));
            app.use(wrap(passport.initialize()));
            app.use(wrap(passport.session()));
        },
        routes(app) {
            app.get('/login', (req, res) => res.redirect('/login/google'));
            app.get('/logout', (req, res) => {
                req.logout();
                res.redirect('/');
            });

            for(var key of Object.keys(AuthRegistry)) {
                app.get(`/login/${key}`, passport.authenticate(key, {
                    successRedirect: '/',
                }));
            }
        },
    };
};