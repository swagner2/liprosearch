const mongoose = require('mongoose');
var Schema=mongoose.Schema;

// create User Schema
var SearchSchema = new Schema({
    provider_id :String,
    user_email  :String,
    user_name   :String,
    queryStrings:String,
    provider_name:String,

});

module.exports = mongoose.model('user_search', SearchSchema);
