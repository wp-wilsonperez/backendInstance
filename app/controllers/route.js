
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

   app.get('/route/list', [control.auth, controller, control.acl], (req, res) => {

      Route.find({}, function (err, docs) {
         if (typeof docs !== 'undefined') {
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
            res.send({msg: "OK", route: doc});
         } else {
            res.send({msg: 'ERR', err: err});
         }
      });

   });

   app.post('/route/add', [control.auth, controller, control.acl], (req, res) => {

      let route = new Route({
         name: req.body.name,
         month: req.body.month,
         interest: req.body.interest,
         totalMonths: req.body.totalMonths,
         dateCreate: moment(),
         userCreate: req.user.idUser,
         dateUpdate: moment(),
         userUpdate: req.user.idUser
      });

      route.save((err, doc) => {
         if(!err){
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
         name: req.body.name,
         month: req.body.month,
         interest: req.body.interest,
         totalMonths: req.body.totalMonths,
         dateUpdate: moment(),
         userUpdate: req.user.idUser
      };

      Route.findOneAndUpdate(filter, update, function (err, doc) {
         if (!err) {
            findAction(function(docs){
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
               res.send({msg: "OK", update: docs});
            });
         } else {
            res.send({msg: 'ERR', err: err});
         }            
      });

   });

}

export default routeController
