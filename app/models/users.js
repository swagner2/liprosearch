const mongoose  = require('mongoose');
var Schema      = mongoose.Schema;

// create User Schema
var User = new Schema({
    name: String,
    provider_id: String,
    email: String,
    first_name:String,
    last_name:String,
    provider_name:String
});

module.exports = mongoose.model('users', User);
