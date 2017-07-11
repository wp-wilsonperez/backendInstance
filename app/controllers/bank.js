
import moment from 'moment';

import Bank from "../models/bank";
import Insurance from "../models/insurance";

let bankController = function (app, control={auth, passport, acl}){

   function controller (req, res, next) {
      req.controller = "bank";
      return next();
   }

   function findAction (callback){
      Bank.find({}, function (err, docs) {
         if (!err) {
            Insurance.populate(docs, {path: "insurance"},function(err, docs){
               callback(docs);
            });
         }
      });
   }

   app.get('/bank/list', [control.auth, controller, control.acl], (req, res) => {

      Bank.find({}, function (err, docs) {
         if (typeof docs !== 'undefined') {
            Insurance.populate(docs, {path: "insurance"},function(err, docs){
               res.send({msg: "OK", banks: docs});
            });
         } else {
            res.send({
               msg : 'ERR',
               err : err.code
            });
         }
      });

   });

   app.get('/bank/view/:id', [control.auth, controller, control.acl], (req, res) => {

      Bank.findById(req.params.id, function (err, doc) {
         if (!err) {
            res.send({msg: "OK", bank: doc});
         } else {
            res.send({msg: 'ERR', err: err});
         }
      });

   });

   app.post('/bank/add', [control.auth, controller, control.acl], (req, res) => {

      let bank = new Bank({
         name: req.body.name,
         month: req.body.month,
         interest: req.body.interest,
         totalMonths: req.body.totalMonths,
         idInsurance: req.body.idInsurance,
         insurance: req.body.idInsurance,
         dateCreate: moment(),
         userCreate: req.user.idUser,
         dateUpdate: moment(),
         userUpdate: req.user.idUser
      });

      bank.save((err, doc) => {
         if(!err){
            res.send({msg: "OK", doc: doc});
         } else {
            res.send({msg: 'ERR', err: err});
         }            
      });

   });

   app.post('/bank/edit/:id', [control.auth, controller, control.acl], (req, res) => {

      let filter = {
         _id: req.params.id
      }

      let update = {
         name: req.body.name,
         month: req.body.month,
         interest: req.body.interest,
         totalMonths: req.body.totalMonths,
         idInsurance: req.body.idInsurance,
         insurance: req.body.idInsurance,
         dateUpdate: moment(),
         userUpdate: req.user.idUser
      };

      Bank.findOneAndUpdate(filter, update, function (err, doc) {
         if (!err) {
            findAction(function(docs){
               res.send({msg: "OK", update: docs});
            });
         } else {
            res.send({msg: 'ERR', err: err});
         }
      });

   });

   app.delete('/bank/delete/:id', [control.auth, controller, control.acl], (req, res) => {

      let filter = {
         _id: req.params.id
      }

      Bank.findByIdAndRemove(filter, function (err, doc) {
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

export default bankController
