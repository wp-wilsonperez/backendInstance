
import http from 'http';
import favicon from 'serve-favicon';

import express from 'express';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import expressSession from 'express-session';
import passport from 'passport';
import mongoose from 'mongoose';
import sha1 from 'sha1';
import cors from 'cors';
import crypto from 'crypto';
import moment from 'moment';
import {Strategy as LocalStrategy} from 'passport-local';
import {Strategy as BearerStrategy} from 'passport-http-bearer';


const port = process.env.PORT || 3001;
const app = express();

mongoose.connect('mongodb://localhost/instance1');
app.set('views', __dirname + '/app/views');
app.set('view engine', 'ejs');
app.use(favicon(__dirname + '/public/images/favicon.ico'));
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(expressSession({
   secret: 'SECRET-KEY',
   resave: false,
   saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use('/', express.static(__dirname + '/public'));

app.get('/test', function (req, res, next) {
  res.json({msg: 'Enviado desde el Servidor'})
})

import User from './app/models/user';
import Token from './app/models/token';
import Role from './app/models/role';
import Log from './app/models/log';

let localStrategy = new LocalStrategy({
      usernameField: 'cedula',
      passwordField: 'password',
      session: false
      }, (username, password, done) => {
         //console.log(sha1(password));
   User.findOne({cedula: username, password: sha1(password)}, (err, doc) => {
      if(err) {
         done(null, false, {
            message: 'Error'
         });
      }
      if(doc) {
         let generatedToken = crypto.randomBytes(32).toString('hex');
         let token = new Token({
            token: generatedToken,
            idUser: doc._id,
            idRole: doc.idRole,
            idBranch: doc.idBranch,
            created: moment(),
            expiration: moment()
         });

         token.save((err, doc) => { console.log("has been created a access token");});
         return done(null, {
            _id: doc._id,
            cedula: doc.cedula,
            name: doc.name,
            lastName: doc.lastName,
            userImg: doc.userImg,
            idBranch: doc.idBranch,
            token: generatedToken
         });
      }else {
         done(null, false, {
            message: 'Unkown user'
         });
      }      
   });
});

let bearerStrategy = new BearerStrategy(
   function(token, cb) {
      Token.findOne({token: token}, function(err, doc) {
         if (err) { return cb(err); }
         //console.log(doc);
         if (!doc) { return cb(null, false); }
         return cb(null, doc);
      });
   });

passport.use(localStrategy);
passport.use(bearerStrategy);
passport.serializeUser((user, done) => { done(null, user) });
passport.deserializeUser((user, done) => { done(null, user) });


import carModelController from './app/controllers/carModel';
carModelController(app, {passport: passport, auth: passport.authenticate('bearer', { session: false }), acl: ensureACL});

import carColorController from './app/controllers/carColor';
carColorController(app, {passport: passport, auth: passport.authenticate('bearer', { session: false }), acl: ensureACL});

import countryController from './app/controllers/country';
countryController(app, {passport: passport, auth: passport.authenticate('bearer', { session: false }), acl: ensureACL});

import carBrandController from './app/controllers/carBrand';
carBrandController(app, {passport: passport, auth: passport.authenticate('bearer', { session: false }), acl: ensureACL});

import carTypeController from './app/controllers/carType';
carTypeController(app, {passport: passport, auth: passport.authenticate('bearer', { session: false }), acl: ensureACL});

import clientController from './app/controllers/client';
clientController(app, {passport: passport, auth: passport.authenticate('bearer', { session: false }), acl: ensureACL});

import issueController from './app/controllers/issue';
issueController(app, {passport: passport, auth: passport.authenticate('bearer', { session: false }), acl: ensureACL});

import quoteController from './app/controllers/quote';
quoteController(app, {passport: passport, auth: passport.authenticate('bearer', { session: false }), acl: ensureACL});

import paymentTypeController from './app/controllers/paymentType';
paymentTypeController(app, {passport: passport, auth: passport.authenticate('bearer', { session: false }), acl: ensureACL});

import letterAccidentController from './app/controllers/letterAccident';
letterAccidentController(app, {passport: passport, auth: passport.authenticate('bearer', { session: false }), acl: ensureACL});

import tasaController from './app/controllers/tasa';
tasaController(app, {passport: passport, auth: passport.authenticate('bearer', { session: false }), acl: ensureACL});

import paramController from './app/controllers/param';
paramController(app, {passport: passport});

import bankController from './app/controllers/bank';
bankController(app, {passport: passport, auth: passport.authenticate('bearer', { session: false }), acl: ensureACL});

import helpLinkController from './app/controllers/helpLink';
helpLinkController(app, {passport: passport, auth: passport.authenticate('bearer', { session: false }), acl: ensureACL});

import businessController from './app/controllers/business';
businessController(app, {passport: passport, auth: passport.authenticate('bearer', { session: false }), acl: ensureACL});

import percentageRamoController from './app/controllers/percentageRamo';
percentageRamoController(app, {passport: passport, auth: passport.authenticate('bearer', { session: false }), acl: ensureACL});

import deductibleController from './app/controllers/deductible';
deductibleController(app, {passport: passport, auth: passport.authenticate('bearer', { session: false }), acl: ensureACL});

import insuranceController from './app/controllers/insurance';
insuranceController(app, {passport: passport, auth: passport.authenticate('bearer', { session: false }), acl: ensureACL});

import ramoController from './app/controllers/ramo';
ramoController(app, {passport: passport, auth: passport.authenticate('bearer', { session: false }), acl: ensureACL});

import typeClientController from './app/controllers/typeClient';
typeClientController(app, {passport: passport, auth: passport.authenticate('bearer', { session: false }), acl: ensureACL});

import maritalStatusController from './app/controllers/maritalStatus';
maritalStatusController(app, {passport: passport, auth: passport.authenticate('bearer', { session: false }), acl: ensureACL});

import logController from './app/controllers/log';
logController(app, {passport: passport, auth: passport.authenticate('bearer', { session: false }), acl: ensureACL});

import accountController from './app/controllers/account';
accountController(app, {passport: passport, auth: passport.authenticate('bearer', { session: false }), acl: ensureACL});

import settingController from './app/controllers/setting';
settingController(app, {passport: passport, auth: passport.authenticate('bearer', { session: false }), acl: ensureACL});

import branchController from './app/controllers/branch';
branchController(app, {passport: passport, auth: passport.authenticate('bearer', { session: false }), acl: ensureACL});

import cityController from './app/controllers/city';
cityController(app, {passport: passport, auth: passport.authenticate('bearer', { session: false }), acl: ensureACL});

import roleController from './app/controllers/role';
roleController(app, {passport: passport, auth: passport.authenticate('bearer', { session: false }), acl: ensureACL});

import userController from './app/controllers/user';
userController(app, {passport: passport, auth: passport.authenticate('bearer', { session: false }), acl: ensureACL, log: logAction});

import homeController from './app/controllers/home';
homeController(app, {auth: passport.authenticate('bearer', { error: "wrong token" })});


function logAction (msg, idUser){

   let log = new Log({
      log: msg,
      user: {
         id: idUser,
         cedula: "cedula",
         username: "username"
      },
      dateLog: moment()
   });

   log.save((err, doc) => {
      if(!err){
         console.log("log saved");
      } else {
         console.log("log doesnt save");
      }            
   });
}

function ensureAuth (req, res, next){

   passport.authenticate('bearer', { session: false })
}

function ensureACL (req, res, next){
   let $moduleAllow = {
      "user": {
         "adduserImg": true,
         "deleteuserImg": true
      },
      "account": {
         "addaccountImg": true,
         "deleteaccountImg": true
      },
      "account": {
         "addinsuranceImg": true,
         "deleteinsuranceImg": true
      },
      "letterAccident": {
         "addletterAccidentFile": true,
         "deleteletterAccidentFile": true
      },
      "client": {
         "addclientImg": true,
         "deleteclientImg": true
      },
      "tasa": {
         "value": true
      },
      "issue": {
         "value": true
      }
   };
   let $controller = req.route.path.split("/")[1];
   let $action = req.route.path.split("/")[2];
   Role.findById(req.user.idRole, function (err, doc) {
      if (!err) {
         if(!doc){return res.send({msg: 'ERR', err: "No assigned privileges"});}
         let $grant = doc.grant != "" ? JSON.parse(doc.grant) : {};
         if($moduleAllow[$controller]){
            if($moduleAllow[$controller][$action]){
               return next();
            }
         }
         if($grant[$controller]){
            if($grant[$controller][$action]){
               return next();
            }
         }
         //console.log($grant);
         return res.send({msg: 'ERR', err: "No privileges"});
      } else {
         return res.send({msg: 'ERR', err: err});
      }
   });
}


let server = http.createServer(app).listen(port, () => {
   console.log(`El servidor esta levantado en el puerto ${port}`);
});
