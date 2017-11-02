var passport = require('passport');
var LinkedInStrategy = require('passport-linkedin-oauth2').Strategy;

var User = require('../models/users');
var init = require('./init');


passport.use(new LinkedInStrategy({
        clientID: process.env.linkedin_clientID,
        clientSecret: process.env.linkedin_clientSecret,
        callbackURL: process.env.linkedin_callbackURL,
        scope: ['r_emailaddress', 'r_basicprofile'],
    },
    function(accessToken, refreshToken, profile, done) {
         process.nextTick(function () {
            // To keep the example simple, the user's LinkedIn profile is returned to
            // represent the logged-in user. In a typical application, you would want
            // to associate the LinkedIn account with a user record in your database,
            // and return that user instead.
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
        })
    }

));

// serialize user into the session
init();


module.exports = passport;
