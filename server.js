//require('./app/config/config');

const express 		= require ('express');
const morgan 		= require('morgan');
const bodyParser 	= require('body-parser');
const path 			= require('path');
const port			= process.env.PORT || 8000;
var cors			= require('cors')


var app			= express();
var router		= express.Router();
var appRoutes	= require('./app/routes/api')(router);
var {mongoose}  = require('./app/db/mongoose');

var passport = require('passport');
var session = require('express-session');
var cookieParser = require('cookie-parser');

// middle ware
	app.use(morgan('dev'));
	app.use(cors());
	app.use(bodyParser.json());
	app.use(bodyParser.urlencoded({extended : true}));
	app.use(express.static(__dirname + '/src'));

	app.use(cookieParser());
	app.use(session({
		secret: 'keyboard cat',
		resave: true,
		saveUninitialized: true
	}));
	app.use(passport.initialize());
	app.use(passport.session());



// api router
  app.use('/',appRoutes);


// path for the static content or web
  app.get('/',function(req,res){
      res.sendFile(path.join(__dirname + '/src/index.html'))
  });


// server is listening
  app.listen(port,function  () {
      console.log('Running on port '+ port);
  });

