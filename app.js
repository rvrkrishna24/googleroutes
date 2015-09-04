var debug = require('debug')('GoogleRouteApp:server');
var http = require('http');

var express = require('express'),
    path = require('path'),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose');
fs = require('fs');


var routeModel = require('./models/routes.js'),
    routes = require('./routes/index'),
    app = express();

/**
 * Get port from environment and store in Express.
 */

var port = normalizePort(process.env.PORT || '2000');
app.set('port', port);

/**
 * Create HTTP server.
 */

var server = http.createServer(app);

/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port);
server.on('error', onError);
server.on('listening', onListening);
console.log('server has started');
/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
    var port = parseInt(val, 10);

    if (isNaN(port)) {
        // named pipe
        return val;
    }

    if (port >= 0) {
        // port number
        return port;
    }

    return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
    if (error.syscall !== 'listen') {
        throw error;
    }

    var bind = typeof port === 'string'
        ? 'Pipe ' + port
        : 'Port ' + port;

    // handle specific listen errors with friendly messages
    switch (error.code) {
        case 'EACCES':
            console.error(bind + ' requires elevated privileges');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(bind + ' is already in use');
            process.exit(1);
            break;
        default:
            throw error;
    }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
    var addr = server.address();
    var bind = typeof addr === 'string'
        ? 'pipe ' + addr
        : 'port ' + addr.port;
    debug('Listening on ' + bind);
}


app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);

mongoose.connect('mongodb://localhost/driverDetails');

app.use(function (req, res, next) {
    res.status(404).sendFile(__dirname + '/images/404.png');
});
app.use(function (err, req, res, next) {
    res.status(500).sendFile(__dirname + '/images/500.png');
});

//deleting previous user entry on restart of node
routeModel.find({}).remove().exec();

//init add a user details read from a file
fs.readFile('./route.json', 'utf8', function (err, data) {
    if (err) {
        console.log(err);
        return;
    }
    dataJson = new routeModel(JSON.parse(data));
    dataJson.save(function (err, result) {
        if (err) {
            console.log(err);
            return
        }
        else {
            console.log('Json file is saved into mongodb');
        }
    });
});


module.exports = app;
