const mongoose  = require('mongoose');
var Schema      = mongoose.Schema;

// create User Schema
var User = new Schema({
    name: String,
    provider_id: String,
    email: String
});

module.exports = mongoose.model('users', User);
