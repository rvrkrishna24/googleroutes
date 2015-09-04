var express = require('express'),
    router = express.Router(),
    fs = require('fs'),
    mongoose = require('mongoose');

var route = require('../models/routes.js');

router.get('/', function (req, res, next) {
    console.log('user requested HomePage');
    res.render('index');
});

router.get('/user/:id/:index', function (req, res, next) {
    var id = req.params['id'],
        inx = Number(req.params['index']);
    console.log('Request for user with Id: ' + id + ' and array index: ' + inx + '.');

    route.find({userId: id}, {route: {$slice: [inx, 1]}}, function (err, data) {
        if (err) {
            console.log(err);
            res.send('Unknown db error')
        }
        else {
            if (data[0]) {
                readDb = data[0];
                console.log(readDb.name);
                res.json({userId: readDb.userId, name: readDb.name, route: readDb.route[0]});
            } else {
                console.log('User with Id: ' + id + ' not found');
                res.status(400).send('User not found');
            }
        }
    });
});

module.exports = router;
