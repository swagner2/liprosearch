var passport = require('passport');
var FacebookStrategy = require('passport-facebook').Strategy;

var User = require('../models/users');
var init = require('./init');


passport.use(new FacebookStrategy({
        clientID: process.env.facebook_clientID,
        clientSecret: process.env.facebook_clientSecret,
        callbackURL: process.env.facebook_callbackURL,
        profileFields: ['id','displayName','emails']
    },
    function(accessToken, refreshToken, profile, done) {
        //console.log(profile);
        var searchQuery = {
            provider_id: profile.id
        };

        var updates = {
            name: profile.displayName,
            provider_id: profile.id,
            email: profile.emails[0].value
        };

        var options = {
            upsert: true
        };
        // update the user if s/he exists or add a new user
        User.findOneAndUpdate(searchQuery, updates, options, function(err, user) {
            if(err) {
                return done(err);
            } else {
                return done(null, user);
            }
        });
    }

));

// serialize user into the session
init();


module.exports = passport;
