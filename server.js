
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

import jsonLogs from './app/configs/logs';

import Config from './app/configs/app';


const port = process.env.PORT || 3001;
const app = express();

mongoose.connect(Config.mongoose);
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

         var dataUser = {
            token:generatedToken,
            idUser: doc._id,
            name: doc.name,
           lastName: doc.lastName,
           cedula: doc.cedula,
           mail: doc.mail,
           phone: doc.phone,
           idRole: doc.idRole,
           idBranch: doc.idBranch,
           dateCreate: doc.dateCreate,
           userCreate: doc.userCreate,
           dateUpdate: doc.dateUpdate,
           userUpdate: doc.userUpdate,
           userImg: doc.userImg
         };

         token.save((err, doc) => {
            console.log("has been created a access token");
            return done(null, dataUser);
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
         /*console.log("-------------------");
         console.log(doc);*/
         if (!doc) { return cb(null, false); }
         User.findOne({_id: doc.idUser}, (err, docUser) => {
          var dataUser = {
              token: token,
              idUser: docUser._id+'',
              name: docUser.name,
              lastName: docUser.lastName,
              cedula: docUser.cedula,
              mail: docUser.mail,
              phone: docUser.phone,
              idRole: docUser.idRole,
              idBranch: docUser.idBranch,
              dateCreate: docUser.dateCreate,
              userCreate: docUser.userCreate,
              dateUpdate: docUser.dateUpdate,
              userUpdate: docUser.userUpdate,
              userImg: docUser.userImg
            };
            return cb(null, dataUser);
         })
      });
   });

passport.use(localStrategy);
passport.use(bearerStrategy);
passport.serializeUser((user, done) => { done(null, user) });
passport.deserializeUser((user, done) => { done(null, user) });


import pickupController from './app/controllers/pickup';
pickupController(app, {passport: passport, auth: passport.authenticate('bearer', { session: false }), acl: ensureACL, log: logAction});

import sendingController from './app/controllers/sending';
sendingController(app, {passport: passport, auth: passport.authenticate('bearer', { session: false }), acl: ensureACL, log: logAction});

import deprecationController from './app/controllers/deprecation';
deprecationController(app, {passport: passport, auth: passport.authenticate('bearer', { session: false }), acl: ensureACL, log: logAction});

import uploadController from './app/controllers/upload';
uploadController(app, {passport: passport, auth: passport.authenticate('bearer', { session: false }), acl: ensureACL, log: logAction});

import authorizationTimeController from './app/controllers/authorizationTime';
authorizationTimeController(app, {passport: passport, auth: passport.authenticate('bearer', { session: false }), acl: ensureACL, log: logAction});

import sinisterGeneralDocumentationController from './app/controllers/sinisterGeneralDocumentation';
sinisterGeneralDocumentationController(app, {passport: passport, auth: passport.authenticate('bearer', { session: false }), acl: ensureACL, log: logAction});

import sinisterGeneralController from './app/controllers/sinisterGeneral';
sinisterGeneralController(app, {passport: passport, auth: passport.authenticate('bearer', { session: false }), acl: ensureACL, log: logAction});

import letterDocxController from './app/controllers/letterDocx';
letterDocxController(app, {passport: passport, auth: passport.authenticate('bearer', { session: false }), log: logAction});

import binnacleExpirationDateController from './app/controllers/binnacleExpirationDate';
binnacleExpirationDateController(app, {passport: passport, auth: passport.authenticate('bearer', { session: false }), acl: ensureACL, log: logAction});

import clearanceTimeController from './app/controllers/clearanceTime';
clearanceTimeController(app, {passport: passport, auth: passport.authenticate('bearer', { session: false }), acl: ensureACL, log: logAction});

import renewalController from './app/controllers/renewal';
renewalController(app, {passport: passport, auth: passport.authenticate('bearer', { session: false }), acl: ensureACL, log: logAction});

import noRenewalRamoController from './app/controllers/noRenewalRamo';
noRenewalRamoController(app, {passport: passport, auth: passport.authenticate('bearer', { session: false }), acl: ensureACL, log: logAction});

import noRenewalController from './app/controllers/noRenewal';
noRenewalController(app, {passport: passport, auth: passport.authenticate('bearer', { session: false }), acl: ensureACL, log: logAction});

import apiClientController from './app/controllers/apiClient';
apiClientController(app, {passport: passport, auth: passport.authenticate('bearer', { session: false }), log: logAction});

import subItemAnnexController from './app/controllers/subItemAnnex';
subItemAnnexController(app, {passport: passport, auth: passport.authenticate('bearer', { session: false }), acl: ensureACL, log: logAction});

import itemAnnexController from './app/controllers/itemAnnex';
itemAnnexController(app, {passport: passport, auth: passport.authenticate('bearer', { session: false }), acl: ensureACL, log: logAction});

import creditNoteController from './app/controllers/creditNote';
creditNoteController(app, {passport: passport, auth: passport.authenticate('bearer', { session: false }), acl: ensureACL, log: logAction});

import sinisterMedicalDocumentationController from './app/controllers/sinisterMedicalDocumentation';
sinisterMedicalDocumentationController(app, {passport: passport, auth: passport.authenticate('bearer', { session: false }), acl: ensureACL, log: logAction});

import sinisterMedicalController from './app/controllers/sinisterMedical';
sinisterMedicalController(app, {passport: passport, auth: passport.authenticate('bearer', { session: false }), acl: ensureACL, log: logAction});

import annexMedicalBusinessItemController from './app/controllers/annexMedicalBusinessItem';
annexMedicalBusinessItemController(app, {passport: passport, auth: passport.authenticate('bearer', { session: false }), acl: ensureACL, log: logAction});

import annexMedicalBusinessController from './app/controllers/annexMedicalBusiness';
annexMedicalBusinessController(app, {passport: passport, auth: passport.authenticate('bearer', { session: false }), acl: ensureACL, log: logAction});

import policyMedicalBusinessController from './app/controllers/policyMedicalBusiness';
policyMedicalBusinessController(app, {passport: passport, auth: passport.authenticate('bearer', { session: false }), acl: ensureACL, log: logAction});

import businessClientController from './app/controllers/businessClient';
businessClientController(app, {passport: passport, auth: passport.authenticate('bearer', { session: false }), acl: ensureACL, log: logAction});

import planAlternativeController from './app/controllers/planAlternative';
planAlternativeController(app, {passport: passport, auth: passport.authenticate('bearer', { session: false }), acl: ensureACL, log: logAction});

import alternativeController from './app/controllers/alternative';
alternativeController(app, {passport: passport, auth: passport.authenticate('bearer', { session: false }), acl: ensureACL, log: logAction});

import planAssociationController from './app/controllers/planAssociation';
planAssociationController(app, {passport: passport, auth: passport.authenticate('bearer', { session: false }), acl: ensureACL, log: logAction});

import planController from './app/controllers/plan';
planController(app, {passport: passport, auth: passport.authenticate('bearer', { session: false }), acl: ensureACL, log: logAction});

import dependentController from './app/controllers/dependent';
dependentController(app, {passport: passport, auth: passport.authenticate('bearer', { session: false }), acl: ensureACL, log: logAction});

import sinisterCarDocumentationController from './app/controllers/sinisterCarDocumentation';
sinisterCarDocumentationController(app, {passport: passport, auth: passport.authenticate('bearer', { session: false }), acl: ensureACL, log: logAction});

import sinisterCarController from './app/controllers/sinisterCar';
sinisterCarController(app, {passport: passport, auth: passport.authenticate('bearer', { session: false }), acl: ensureACL, log: logAction});

import sinisterController from './app/controllers/sinister';
sinisterController(app, {passport: passport, auth: passport.authenticate('bearer', { session: false }), acl: ensureACL, log: logAction});

import sinisterDocumentationRamoController from './app/controllers/sinisterDocumentationRamo';
sinisterDocumentationRamoController(app, {passport: passport, auth: passport.authenticate('bearer', { session: false }), acl: ensureACL, log: logAction});

import sinisterDocumentationController from './app/controllers/sinisterDocumentation';
sinisterDocumentationController(app, {passport: passport, auth: passport.authenticate('bearer', { session: false }), acl: ensureACL, log: logAction});

import walletPaymentBinnacleController from './app/controllers/walletPaymentBinnacle';
walletPaymentBinnacleController(app, {passport: passport, auth: passport.authenticate('bearer', { session: false }), acl: ensureACL, log: logAction});

import walletPaymentController from './app/controllers/walletPayment';
walletPaymentController(app, {passport: passport, auth: passport.authenticate('bearer', { session: false }), acl: ensureACL, log: logAction});

import walletController from './app/controllers/wallet';
walletController(app, {passport: passport, auth: passport.authenticate('bearer', { session: false }), acl: ensureACL, log: logAction});

import billingPolicyController from './app/controllers/billingPolicy';
billingPolicyController(app, {passport: passport, auth: passport.authenticate('bearer', { session: false }), acl: ensureACL, log: logAction});

import billingController from './app/controllers/billing';
billingController(app, {passport: passport, auth: passport.authenticate('bearer', { session: false }), acl: ensureACL, log: logAction});

import itemAnnexExtraController from './app/controllers/itemAnnexExtra';
itemAnnexExtraController(app, {passport: passport, auth: passport.authenticate('bearer', { session: false }), acl: ensureACL, log: logAction});

import itemAnnexCarController from './app/controllers/itemAnnexCar';
itemAnnexCarController(app, {passport: passport, auth: passport.authenticate('bearer', { session: false }), acl: ensureACL, log: logAction});

import policyAnnexController from './app/controllers/policyAnnex';
policyAnnexController(app, {passport: passport, auth: passport.authenticate('bearer', { session: false }), acl: ensureACL, log: logAction});

import bankInsuranceController from './app/controllers/bankInsurance';
bankInsuranceController(app, {passport: passport, auth: passport.authenticate('bearer', { session: false }), acl: ensureACL, log: logAction});

import routeController from './app/controllers/route';
routeController(app, {passport: passport, auth: passport.authenticate('bearer', { session: false }), acl: ensureACL, log: logAction});

import incomeController from './app/controllers/income';
incomeController(app, {passport: passport, auth: passport.authenticate('bearer', { session: false }), acl: ensureACL, log: logAction});

import policyController from './app/controllers/policy';
policyController(app, {passport: passport, auth: passport.authenticate('bearer', { session: false }), acl: ensureACL, log: logAction});

import frequencyPaymentController from './app/controllers/frequencyPayment';
frequencyPaymentController(app, {passport: passport, auth: passport.authenticate('bearer', { session: false }), acl: ensureACL, log: logAction});

import policyTypeController from './app/controllers/policyType';
policyTypeController(app, {passport: passport, auth: passport.authenticate('bearer', { session: false }), acl: ensureACL, log: logAction});

import carController from './app/controllers/car';
carController(app, {passport: passport, auth: passport.authenticate('bearer', { session: false }), acl: ensureACL, log: logAction});

import carModelController from './app/controllers/carModel';
carModelController(app, {passport: passport, auth: passport.authenticate('bearer', { session: false }), acl: ensureACL, log: logAction});

import carColorController from './app/controllers/carColor';
carColorController(app, {passport: passport, auth: passport.authenticate('bearer', { session: false }), acl: ensureACL, log: logAction});

import countryController from './app/controllers/country';
countryController(app, {passport: passport, auth: passport.authenticate('bearer', { session: false }), acl: ensureACL, log: logAction});

import carBrandController from './app/controllers/carBrand';
carBrandController(app, {passport: passport, auth: passport.authenticate('bearer', { session: false }), acl: ensureACL, log: logAction});

import carTypeController from './app/controllers/carType';
carTypeController(app, {passport: passport, auth: passport.authenticate('bearer', { session: false }), acl: ensureACL, log: logAction});

import clientController from './app/controllers/client';
clientController(app, {passport: passport, auth: passport.authenticate('bearer', { session: false }), acl: ensureACL, log: logAction});

import issueController from './app/controllers/issue';
issueController(app, {passport: passport, auth: passport.authenticate('bearer', { session: false }), acl: ensureACL, log: logAction});

import quoteController from './app/controllers/quote';
quoteController(app, {passport: passport, auth: passport.authenticate('bearer', { session: false }), acl: ensureACL, log: logAction});

import paymentTypeController from './app/controllers/paymentType';
paymentTypeController(app, {passport: passport, auth: passport.authenticate('bearer', { session: false }), acl: ensureACL, log: logAction});

import letterAccidentController from './app/controllers/letterAccident';
letterAccidentController(app, {passport: passport, auth: passport.authenticate('bearer', { session: false }), acl: ensureACL, log: logAction});

import tasaController from './app/controllers/tasa';
tasaController(app, {passport: passport, auth: passport.authenticate('bearer', { session: false }), acl: ensureACL, log: logAction});

import paramController from './app/controllers/param';
paramController(app, {passport: passport});

import bankController from './app/controllers/bank';
bankController(app, {passport: passport, auth: passport.authenticate('bearer', { session: false }), acl: ensureACL, log: logAction});

import helpLinkController from './app/controllers/helpLink';
helpLinkController(app, {passport: passport, auth: passport.authenticate('bearer', { session: false }), acl: ensureACL, log: logAction});

import businessController from './app/controllers/business';
businessController(app, {passport: passport, auth: passport.authenticate('bearer', { session: false }), acl: ensureACL, log: logAction});

import percentageRamoController from './app/controllers/percentageRamo';
percentageRamoController(app, {passport: passport, auth: passport.authenticate('bearer', { session: false }), acl: ensureACL, log: logAction});

import deductibleController from './app/controllers/deductible';
deductibleController(app, {passport: passport, auth: passport.authenticate('bearer', { session: false }), acl: ensureACL, log: logAction});

import insuranceController from './app/controllers/insurance';
insuranceController(app, {passport: passport, auth: passport.authenticate('bearer', { session: false }), acl: ensureACL, log: logAction});

import ramoController from './app/controllers/ramo';
ramoController(app, {passport: passport, auth: passport.authenticate('bearer', { session: false }), acl: ensureACL, log: logAction});

import typeClientController from './app/controllers/typeClient';
typeClientController(app, {passport: passport, auth: passport.authenticate('bearer', { session: false }), acl: ensureACL, log: logAction});

import maritalStatusController from './app/controllers/maritalStatus';
maritalStatusController(app, {passport: passport, auth: passport.authenticate('bearer', { session: false }), acl: ensureACL, log: logAction});

import logController from './app/controllers/log';
logController(app, {passport: passport, auth: passport.authenticate('bearer', { session: false }), acl: ensureACL, log: logAction});

import accountController from './app/controllers/account';
accountController(app, {passport: passport, auth: passport.authenticate('bearer', { session: false }), acl: ensureACL, log: logAction});

import settingController from './app/controllers/setting';
settingController(app, {passport: passport, auth: passport.authenticate('bearer', { session: false }), acl: ensureACL, log: logAction});

import branchController from './app/controllers/branch';
branchController(app, {passport: passport, auth: passport.authenticate('bearer', { session: false }), acl: ensureACL, log: logAction});

import cityController from './app/controllers/city';
cityController(app, {passport: passport, auth: passport.authenticate('bearer', { session: false }), acl: ensureACL, log: logAction});

import roleController from './app/controllers/role';
roleController(app, {passport: passport, auth: passport.authenticate('bearer', { session: false }), acl: ensureACL, log: logAction});

import userController from './app/controllers/user';
userController(app, {passport: passport, auth: passport.authenticate('bearer', { session: false }), acl: ensureACL, log: logAction});

import homeController from './app/controllers/home';
homeController(app, {auth: passport.authenticate('bearer', { error: "wrong token" })});

app.use(function (req, res, next) {
  console.log("END");
  next();
})


function logAction (path, user){

   let $controller = path.split("/")[1];
   let $action = path.split("/")[2];
   /*console.log(jsonLogs);
   console.log($controller);
   console.log($action);*/
   
   let $msg = "";
   if(jsonLogs[$controller]){
      if(jsonLogs[$controller][$action]){
         $msg = jsonLogs[$controller][$action].log;
      }
   }

   let log = new Log({
      log: $msg,
      user: user,
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

global.filter = function(query, session){
   /*
      req.param.filter
      [
        {'condition': "=", 'field': 'name_field', 'value': 'value_of_field'},
        {'condition': "or", fields:
          [{'field': 'name_field', 'value': 'value_of_field'}] min length of array is "2"
        }
      ]
   */
   //console.log("PARAMS");
   let $params = query ? query : [];
   let $filter={};
   $params.forEach(function (item, index) {
      if(item.condition == "="){
        $filter[item.field] = item.value;
      }else if(item.condition == "<="){
        $filter[item.field] = {"$lte": item.value};
      }else if(item.condition == ">="){
        $filter[item.field] = {"$gte": item.value};
      }else if(item.condition == "or"){
        let filterOR = [];
        $item.fields.forEach(function (item2, index2) {
          $filterOR[index2][item2.field] = item2.value;
        });
        $filter["$or"] = $filterOR;
      }else if(item.condition == "between"){
        $filter[item.field] = {"$gte": item.values[0], "$lte": item.values[1]};
      }
   });
   console.log(app.locals);
    if(app.locals.typeList){
      let typeList=app.locals.typeList;
      if(typeList=="99097f2c1f"){
         $filter["userCreate"] = app.locals.session.idUser;
      } else if(typeList=="99097f2c1c"){
         $filter["branchCreate"] = app.locals.session.idBranch;
      }
    }
   $filter['dateDelete']={ '$exists': false };
   console.log($filter);
   return $filter;
}

global.error = function(error, type, controller){
  if(type == 0){
    if(controller=='business'){
      console.log(error);
      if(error.name && error.name=='ValidationError' && error.errors.ruc){
        return 'El ruc ya esta registrado';
      }
    }
    return error;
  }
  else if(type==1)
    return "Error de duplicado";
  else if(type==2){
    if(controller=='clearanceTime'){
      console.log(error);
      if(error.duplicated && error.duplicated==3){
        return 'El Ramo, La Aseguradora y La Sucursal ya estan registradas';
      }
    }else if(controller=='authorizationTime'){
      console.log(error);
      if(error.duplicated && error.duplicated==3){
        return 'El Ramo, La Aseguradora y La Sucursal ya estan registradas';
      }
    }
  }
   let $params = type=100 ? type : [];
   let $filter={};
   $params.forEach(function (item, index) {
      if(item.condition == "="){
         $filter[item.field] = item.value;
      }
   });
   $msg="mensaje altertativo";
   console.log($filter);
   return $msg;
}

function ensureACL (req, res, next){
   /*console.log("**********REQ_USER**********");
   console.log(req.user);
   console.log("**********++++++**********");*/
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
      },
      "percentageRamo": {
         "value": true
      },
      "dependent": {
         "adddependentImg": true,
         "deletedependentImg": true
      },
      "policyAnnex": {
         "addpolicyAnnexImg": true,
         "deletepolicyAnnexImg": true
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
              app.locals.typeList = null;
              app.locals.session = null;

              if($grant[$controller]['typeList']){
                req.typeList = null;
                app.locals.typeList = $grant[$controller]['typeList'];
                app.locals.session = {"idUser": req.user.idUser, "idBranch": req.user.idBranch};
              }
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
