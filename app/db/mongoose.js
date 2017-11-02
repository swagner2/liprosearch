var mongoose = require('mongoose');

mongoose.Promise = global.Promise;
//mongoose.connect(process.env.MONGODB_URI);
mongoose.connect(process.env.MONGODB_URI, {
    useMongoClient: true,
    /* other options */
}).then(function(db){
    console.log("Connected to the database");
}).catch(function(err){
    console.log("Error when connecting to db", err);
})

module.exports = {mongoose};
