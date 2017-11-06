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

            } else {

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
