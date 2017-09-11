
import moment from 'moment';

import Route from "../models/route";

import Client from "../models/client";
import Business from "../models/business";
import Insurance from "../models/insurance";
import User from "../models/user";

let routeController = function (app, control={auth, passport, acl}){

   function controller (req, res, next) {
      req.controller = "route";
      return next();
   }

   function findAction (callback){
      Route.find({}, function (err, docs) {
         if (!err) {

            Client.populate(docs, {path: "client"},function(err, docs){
               Business.populate(docs, {path: "business"},function(err, docs){
                  Insurance.populate(docs, {path: "insarance"},function(err, docs){
                     User.populate(docs, {path: "user"},function(err, docs){
                        callback(docs);
                     });
                  });
               });
            });
         }
      });
   }

   app.get('/route/filter',[control.auth, controller], (req, res) => {
      let $filter =  global.filter(req.query.filter);
      Route.find($filter, function (err, docs) {
         if (typeof docs !== 'undefined') {
            control.log(req.route.path, req.user);
            Client.populate(docs, {path: "client"},function(err, docs){
               Business.populate(docs, {path: "business"},function(err, docs){
                  Insurance.populate(docs, {path: "insarance"},function(err, docs){
                     User.populate(docs, {path: "user"},function(err, docs){
                        res.send({msg: "OK", routes: docs});
                     });
                  });
               });
            });
         } else {
            res.send({
               msg : 'ERR',
               err : err.code
            });
         }
      });

   });

   app.get('/route/list', [control.auth, controller, control.acl], (req, res) => {

      Route.find({}, function (err, docs) {
         if (typeof docs !== 'undefined') {
            control.log(req.route.path, req.user);
            Client.populate(docs, {path: "client"},function(err, docs){
               Business.populate(docs, {path: "business"},function(err, docs){
                  Insurance.populate(docs, {path: "insarance"},function(err, docs){
                     User.populate(docs, {path: "user"},function(err, docs){
                        res.send({msg: "OK", routes: docs});
                     });
                  });
               });
            });
         } else {
            res.send({
               msg : 'ERR',
               err : err.code
            });
         }
      });

   });

   app.get('/route/view/:id', [control.auth, controller, control.acl], (req, res) => {

      Route.findById(req.params.id, function (err, doc) {
         if (!err) {
            control.log(req.route.path, req.user);
            res.send({msg: "OK", route: doc});
         } else {
            res.send({msg: 'ERR', err: err});
         }
      });

   });

   app.post('/route/add', [control.auth, controller, control.acl], (req, res) => {

      let route = new Route({
         typeReception: req.body.typeReception,
         idUserSend: req.body.idUserSend,
         userSend: req.body.idUserSend,
         idClientRecipient: req.body.idClientRecipient,
         clientRecipient: req.body.idClientRecipient,
         idBusinessRecipent: req.body.idBusinessRecipent,
         businessRecipent: req.body.idBusinessRecipent,
         idInsuranceRecipent: req.body.idInsuranceRecipent,
         insuranceRecipent: req.body.idInsuranceRecipent,
         dateRoute: req.body.dateRoute,
         dateReception: req.body.dateReception,
         dateMessenger: req.body.dateMessenger,
         dateReEntry: req.body.dateReEntry,
         dateReturn: req.body.dateReturn,
         details: req.body.details,
         observations: req.body.observations,
         dateCreate: moment(),
         userCreate: req.user.idUser,
         dateUpdate: moment(),
         userUpdate: req.user.idUser
      });

      route.save((err, doc) => {
         if(!err){
            control.log(req.route.path, req.user);
            res.send({msg: "OK", doc: doc});
         } else {
            res.send({msg: 'ERR', err: err});
         }            
      });

   });

   app.post('/route/edit/:id', [control.auth, controller, control.acl], (req, res) => {

      let filter = {
         _id: req.params.id
      }

      let update = {
         typeReception: req.body.typeReception,
         idUserSend: req.body.idUserSend,
         userSend: req.body.idUserSend,
         idClientRecipient: req.body.idClientRecipient,
         clientRecipient: req.body.idClientRecipient,
         idBusinessRecipent: req.body.idBusinessRecipent,
         businessRecipent: req.body.idBusinessRecipent,
         idInsuranceRecipent: req.body.idInsuranceRecipent,
         insuranceRecipent: req.body.idInsuranceRecipent,
         dateRoute: req.body.dateRoute,
         dateReception: req.body.dateReception,
         dateMessenger: req.body.dateMessenger,
         dateReEntry: req.body.dateReEntry,
         dateReturn: req.body.dateReturn,
         details: req.body.details,
         observations: req.body.observations,
         dateUpdate: moment(),
         userUpdate: req.user.idUser
      };

      Route.findOneAndUpdate(filter, update, function (err, doc) {
         if (!err) {
            findAction(function(docs){
               control.log(req.route.path, req.user);
               res.send({msg: "OK", update: docs});
            });
         } else {
            res.send({msg: 'ERR', err: err});
         }
      });

   });

   app.delete('/route/delete/:id', [control.auth, controller, control.acl], (req, res) => {

      let filter = {
         _id: req.params.id
      }

      Route.findByIdAndRemove(filter, function (err, doc) {
         if(!err){
            findAction(function(docs){
               control.log(req.route.path, req.user);
               res.send({msg: "OK", update: docs});
            });
         } else {
            res.send({msg: 'ERR', err: err});
         }            
      });

   });

}

export default routeController
