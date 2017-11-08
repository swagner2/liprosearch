
var passportFacebook = require('../auth/facebook');
var passportLinkedIn = require('../auth/linkedin');
var passportGoogle   = require('../auth/google');
var jwt              = require('jsonwebtoken');
var Search           = require('../models/search');
var moment           = require('moment');

module.exports = function(router) {

    router.get('/auth/facebook', passportFacebook.authenticate('facebook',{ scope: [ 'email' ] }));
    
    router.get('/auth/facebook/callback',
        passportFacebook.authenticate('facebook', { failureRedirect: '/' }),
        function(req, res) {
            // Successful authentication, redirect home.
            //console.log(req.user);
            var fullUrl = req.protocol + '://' + req.get('host')
            var user=req.user
            var token = jwt.sign({id:user.provider_id,email:user.email},process.env.JWT_SECRET,{ algorithm: 'HS256', expiresIn: 60*60*24 });
            res.redirect(fullUrl + '/#/auth/' +token);

        });

    router.get('/auth/linkedin', passportLinkedIn.authenticate('linkedin', { state: 'SOME STATE'  }),
        function(req, res){
            // The request will be redirected to LinkedIn for authentication, so this
            // function will not be called.
        });

    router.get('/auth/linkedin/callback', passportLinkedIn.authenticate('linkedin', {failureRedirect: '/'}),function(req,res){

        var user=req.user;
        var fullUrl = req.protocol + '://' + req.get('host');
        var token = jwt.sign({id:user.provider_id,email:user.email}, process.env.JWT_SECRET,{ algorithm: 'HS256', expiresIn: 60*60*24 });
        res.redirect(fullUrl+'/#/auth/' +token);

    });

    router.get('/auth/google',
        passportGoogle.authenticate('google', { scope:
            [ 'https://www.googleapis.com/auth/plus.login',
                'https://www.googleapis.com/auth/plus.profile.emails.read' ] }
        ));

    router.get('/auth/google/callback', passportGoogle.authenticate('google', {failureRedirect: '/'}),function(req,res){

        var user=req.user;
        var fullUrl = req.protocol + '://' + req.get('host');

        // generating authentication token
        var token = jwt.sign({id:user.provider_id,email:user.email},process.env.JWT_SECRET,{ algorithm: 'HS256', expiresIn: 60*60*24 });
        res.redirect(fullUrl+'/#/auth/' +token);
    });

    // route to add users search into the database
    router.post('/search',function(req,res){

        var token = req.body.token || req.query.token || req.headers['Authorization'] || req.headers.token;

        // token validation
        jwt.verify(token, process.env.JWT_SECRET, function(err, decoded) {

            if (err) {

                console.log(err);
                return res.status(403).json({code: 403, message: 'unauthorized'});

            } else {

                // if everything is good, save to request for use in other routes
                var search = new Search();
                search.provider_id = decoded.id;
                search.user_email=decoded.email;
                search.queryStrings=req.body.query

                search.save(function (err) {
                    if (err){

                        res.status(400).json({message:'Error',error:err});
                    } else {

                        res.status(200).json({message: 'String saved'});
                    }
                })

            }
        })


    });

    // route to get users search from the database
    router.post('/getAll',function(req,res){

        var fullUrl = req.protocol + '://' + req.get('host')
        var token = req.body.token || req.query.token || req.headers['Authorization'] || req.headers.token;

        // token validation
        jwt.verify(token, process.env.JWT_SECRET, function(err, decoded) {
            if (err) {

                console.log(err);
                return res.status(403).json({code: 403, message: 'unauthorized'});

            } else {
                // if everything is good, save to request for use in other routes
                //console.log(decoded);
                Search.find({user_email:decoded.email}, function(err, data) {

                    if (err) {

                        res.status(400).json({

                            message: 'Whoops Something Went Wong!',
                            success: false
                        });

                    } else {

                        res.status(200).json({

                            data: data,
                            success: true
                        });

                    }

                })

            }
        })

    });

    // route to delete users search from the database
    router.post('/delete/result',function(req,res){

        var fullUrl = req.protocol + '://' + req.get('host');
        var token = req.body.token || req.query.token || req.headers['Authorization'] || req.headers.token;

        jwt.verify(token, process.env.JWT_SECRET , function(err, decoded) {
            if (err) {
                console.log(err);
                return res.status(403).json({code: 403, message: 'unauthorized'});
            } else {
                // if everything is good, save to request for use in other routes
                // console.log(req.body.id);
                Search.remove({_id:req.body.id}, function(err, data) {

                    if (err) {

                        res.status(400).json({
                            message: 'Whoops Something Went Wong!',
                            success: false
                        });

                    } else {

                        res.status(200).json({
                            message: 'Record deleted successfuly!',
                            success: true
                        });

                    };
                });

            }
        })

    });

    // route to logot users
    router.get('/logout', function(req, res){
        req.logout();
        res.status(200).json({message:"ok"})
    });

    return router;
}


