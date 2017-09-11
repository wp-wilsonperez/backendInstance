
import moment from 'moment';

import Income from "../models/income";

import Client from "../models/client";
import Business from "../models/business";
import Insurance from "../models/insurance";
import User from "../models/user";

let incomeController = function (app, control={auth, passport, acl}){

   function controller (req, res, next) {
      req.controller = "income";
      return next();
   }

   function findAction (callback){
      Income.find({}, function (err, docs) {
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

   app.get('/income/filter',[control.auth, controller], (req, res) => {
      let $filter =  global.filter(req.query.filter);
      Income.find($filter, function (err, docs) {
         if (typeof docs !== 'undefined') {
            control.log(req.route.path, req.user);
            Client.populate(docs, {path: "client"},function(err, docs){
               Business.populate(docs, {path: "business"},function(err, docs){
                  Insurance.populate(docs, {path: "insarance"},function(err, docs){
                     User.populate(docs, {path: "user"},function(err, docs){
                        res.send({msg: "OK", incomes: docs});
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

   app.get('/income/list', [control.auth, controller, control.acl], (req, res) => {

      Income.find({}, function (err, docs) {
         if (typeof docs !== 'undefined') {
            control.log(req.route.path, req.user);
            Client.populate(docs, {path: "client"},function(err, docs){
               Business.populate(docs, {path: "business"},function(err, docs){
                  Insurance.populate(docs, {path: "insarance"},function(err, docs){
                     User.populate(docs, {path: "user"},function(err, docs){
                        res.send({msg: "OK", incomes: docs});
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

   app.get('/income/view/:id', [control.auth, controller, control.acl], (req, res) => {

      Income.findById(req.params.id, function (err, doc) {
         if (!err) {
            control.log(req.route.path, req.user);
            res.send({msg: "OK", income: doc});
         } else {
            res.send({msg: 'ERR', err: err});
         }
      });

   });

   app.post('/income/add', [control.auth, controller, control.acl], (req, res) => {

      let income = new Income({
         name: req.body.name,
         month: req.body.month,
         interest: req.body.interest,
         totalMonths: req.body.totalMonths,
         dateCreate: moment(),
         userCreate: req.user.idUser,
         dateUpdate: moment(),
         userUpdate: req.user.idUser
      });

      income.save((err, doc) => {
         if(!err){
            control.log(req.route.path, req.user);
            res.send({msg: "OK", doc: doc});
         } else {
            res.send({msg: 'ERR', err: err});
         }            
      });

   });

   app.post('/income/edit/:id', [control.auth, controller, control.acl], (req, res) => {

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

      Income.findOneAndUpdate(filter, update, function (err, doc) {
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

   app.delete('/income/delete/:id', [control.auth, controller, control.acl], (req, res) => {

      let filter = {
         _id: req.params.id
      }

      Income.findByIdAndRemove(filter, function (err, doc) {
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

export default incomeController
