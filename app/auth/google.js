var passport = require('passport');
var GoogleStrategy = require('passport-google-oauth2').Strategy;

var User = require('../models/users');
var init = require('./init');


passport.use(new GoogleStrategy({
        clientID: process.env.google_clientID,
        clientSecret: process.env.google_clientSecret,
        callbackURL: process.env.google_callbackURL,
        passReqToCallback   : true
    },
    function(request,accessToken, refreshToken, profile, done) {
        var searchQuery = {
            email: profile.emails[0].value
        };
        var updates = {
            name: profile.displayName,
            provider_id: profile.id,
            email: profile.emails[0].value
        };

        var options = {
            upsert: true
        };

        User.find({email: profile.emails[0].value}).then(function(user){
            // update the user if s/he exists or add a new user
            if (user.length===0){
                var newuser = new User();
                newuser.name= profile.displayName;
                newuser.provider_id= profile.id;
                newuser.email= profile.emails[0].value;

                newuser.save(function(err,user){
                    if(err) {
                        return done(err);
                    } else {
                        return done(null, user);
                    }
                })

            }else {
                User.findOneAndUpdate(searchQuery, updates, options, function(err, user) {
                    if(err) {
                        return done(err);
                    } else {
                        return done(null, user);
                    }
                });
            }

        }).catch(function(err){

            return done(err);
        });

    }

));

// serialize user into the session
init();


module.exports = passport;
