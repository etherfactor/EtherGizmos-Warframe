const superconsole = require('../../scripts/logging/superconsole');

const express = require('express');
const fs = require('fs');
const path = require('path');

const websocket = require('./modules/websocket');

const Modules = [];

/** @type {import('express').Express} */
var app;

/**
 * Initialize this web app; setup function calls steps that need to be performed before any other settings are set
 * @param {function(app)} setupFunction 
 */
function Initialize(setupFunction)
{
    //Create the app if it doesn't exist
    app = app || express();
    //Call the first setup steps
    setupFunction(app);

    var folderPath = path.join(__dirname, './modules');
    fs.readdirSync(folderPath).forEach(file => {
        var filePath = path.join(folderPath, file);
        if (fs.lstatSync(filePath).isDirectory())
            return;

        var module = require(filePath);
        module.Initialize(app);
        Modules.push(module);
    });

    const routerProperties = {
        App: app.get('app-name'),
        WebsocketHttp: app.get('websocket-http'),
        WebsocketHttps: app.get('websocket-https')
    };

    //Load all the router objects
    //TODO: Make this automatically pull all router objects in the directory
    const indexRouter = require('./routes/index');
    const simulatorRouter = require('./routes/simulator');
    const arsenalRouter = require('./routes/arsenal');
    const dataRouter = require('./routes/data');
    const apiRouter = require('./routes/api');
    const redirectRouter = require('./routes/redirect');

    indexRouter.SetProperties(routerProperties);
    simulatorRouter.SetProperties(routerProperties);
    arsenalRouter.SetProperties(routerProperties);
    dataRouter.SetProperties(routerProperties);
    apiRouter.SetProperties(routerProperties);
    redirectRouter.SetProperties(routerProperties);

    //Set views (HTML page snippets)
    app.set('views', path.join(__dirname, './views'));
    app.set('view engine', 'ejs');

    //Expose styles, scripts, and images directories
    app.use('/styles', express.static(path.join(__dirname, './styles')));
    app.use('/scripts', express.static(path.join(__dirname, './scripts/public')));
    app.use('/images', express.static(path.join(__dirname, '../../images')));
    app.use('/directives', express.static(path.join(__dirname, './views/partial/directives')));

    //Set the sub-URL that each router will handle
    app.use('/', indexRouter.Router);
    app.use('/simulator', simulatorRouter.Router);
    app.use('/arsenal', arsenalRouter.Router);
    app.use('/data', dataRouter.Router);
    app.use('/api', apiRouter.Router);
    app.use('/r', redirectRouter.Router);

    //If it fails all routers, the handler will land here
    //Catch Error 404 and forward to error handler
    app.use(function(req, res, next) {
        var err = new Error('Not Found');
        err.status = 404;
        next(err);
    });

    //Error handlers

    //Development error handler
    //Will print stacktrace
    //TODO: Ensure that the full website can never hit here.
    if (app.get('env') === 'development') {
        app.use(function(err, req, res, next) {
            res.status(err.status || 500);
            res.render('pages/error', {
                message: err.message,
                error: err
            });
        });
    }

    //Production error handler
    //No stacktraces leaked to user
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('pages/error', {
            message: err.message,
            error: {}
        });
    });

    return app;
}
//Export the initialization function
module.exports.Initialize = Initialize;