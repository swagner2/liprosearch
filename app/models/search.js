const mongoose = require('mongoose');
var Schema=mongoose.Schema;

// create User Schema
var SearchSchema = new Schema({
    provider_id :String,
    user_email  :String,
    queryStrings:String

});

module.exports = mongoose.model('user_search', SearchSchema);
