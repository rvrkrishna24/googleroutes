var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var routeSch = new Schema({
    name: String,
    userId: Number,
    route: [{
        lat: Number,
        lng: Number,
        ts: Number
    }]
}, {collection: 'route'});

module.exports = mongoose.model("routeSch", routeSch);