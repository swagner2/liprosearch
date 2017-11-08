var passport = require('passport');
var GoogleStrategy = require('passport-google-oauth2').Strategy;

var User = require('../models/users');
var init = require('./init');

// drip config
var dripClient = require('drip-nodejs')({ token:process.env.drip_accessToken });
var workflowId = process.env.drip_workflow_ID; // drip workflow id which is used for automation
var accountId  = process.env.drip_account_ID;
var dripSubscriberTag = process.env.drip_subscriber_tags;

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

                        var payload={
                            "subscribers": [{
                                "email": user.email,
                                "time_zone": "America/Los_Angeles",
                                "custom_fields": {
                                    "name": user.name
                                },
                                "tags":dripSubscriberTag,
                            }]
                        };

                        // send user to subscribe to the workflow of a drip account
                        dripClient.startOnWorkflow(accountId, workflowId, payload,function(error, response, body){
                            if (error){

                                return done(null, error);

                            } else {

                                return done(null, user);
                            }
                        })
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
