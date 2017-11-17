# liprosearch

# ![Node/Express/Heroku/mLab MongoDB App]

# Getting started

To get the Node server running locally or on heroku server:

- Clone this repo
- `npm install` to install all required dependencies
- Setup Heroku with your git repo ([instructions](https://devcenter.heroku.com/articles/git))
- Setup mLab MongoDB with your heroku app ([instructions](https://devcenter.heroku.com/articles/mongolab))
- Setup FB Oauth and get your ```facebook_clientID``` and ```facebook_clientSecret```. Also set ```redirect_uri``` as ```http://(your heroku app link)/auth/facebook/callback```
- Setup Linkedin Oauth and get your ```linkedin_clientID``` and ```linkedin_clientSecret```. Also set ```linkedin_callbackURL``` as ```http://(your heroku app link)/auth/linkedin/callback```
- Setup Google Oauth and get your ```google_clientID``` and ```google_clientSecret```. Also set ```google_callbackURL``` as ```http://(your heroku app link)/auth/google/callback```
- Register with Drip and get your ```drip_accessToken```, ```drip_account_ID```, ```drip_workflow_ID```,```drip_subscriber_tags```
- Set all above mentioned credentials to your heroku app environment variables
- If you want to work with local environment then all callback url's should be ```http://localhost:3000/auth/``` not as mentioned above. 
- To run the local server run in your terminal ```node server.js```

# Code Overview

## Dependencies

- [expressjs](https://github.com/expressjs/express) - The server for handling and routing HTTP requests
- [express-jwt](https://github.com/auth0/express-jwt) - Middleware for validating JWTs for authentication
- [jsonwebtoken](https://github.com/auth0/node-jsonwebtoken) - For generating JWTs used by authentication
- [mongoose](https://github.com/Automattic/mongoose) - For modeling and mapping MongoDB data to javascript 
- [mongoose-unique-validator](https://github.com/blakehaswell/mongoose-unique-validator) - For handling unique validation errors in Mongoose. Mongoose only handles validation at the document level, so a unique index across a collection will throw an exception at the driver level. The `mongoose-unique-validator` plugin helps us by formatting the error like a normal mongoose `ValidationError`.
- [passport](https://github.com/jaredhanson/passport) - For handling user authentication
- [slug](https://github.com/dodo/node-slug) - For encoding titles into a URL-friendly format

## Application Structure

- `server.js` - The entry point to our application. This file defines our express server and connects it to MongoDB using mongoose. It also requires the routes and models we'll be using in the application.
- `config/` - This folder contains configuration for passport as well as a central location for configuration/environment variables.
- `routes/` - This folder contains the route definitions for our API.
- `models/` - This folder contains the schema definitions for our Mongoose models.

## Authentication

Requests are authenticated with oauth token from FB or Linkedin or Google depending upon your login oauth process.