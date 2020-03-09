var express = require('express');
var morgan = require('morgan');

module.exports = ({Logger, App, Auth, API/*, AuthMiddleware*/}) => {
    App.set('views', 'view');
    App.set('view engine', 'ejs');
    if(process.env.NODE_ENV !== 'development') {
        App.set('view cache', true);
    }

    let buildDir = './client/build';

    App.use(express.static(buildDir));
    App.get('/', (req, res) => res.sendFile(`${buildDir}/index.html`));

    App.use('/api', API);

    Auth.setup(App);
    Auth.routes(App);

    App.use((req, res, next) => {
        res.locals.user = req.isAuthenticated() ? req.user.toJSON() : null;
        // res.locals.config = ClientConfig;
        next();
    });

    App.use(morgan('dev'));

    App.use('/api', API);

    // App.get('/offline', (req, res) => res.render('offline'));
    // App.get('*', AuthMiddleware, (req, res) => res.render('webapp'));

    process.nextTick(() => {
        App.use((err, req, res, next) => {
            Logger.error(err.stack || err);
            res.render('error', {
                error: err,
                status: res.statusCode,
            });
        });
    });
};