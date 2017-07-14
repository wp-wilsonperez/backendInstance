
import moment from 'moment';

import BankInsurance from "../models/bankInsurance";

import Bank from "../models/bank";
import Insurance from "../models/insurance";

let bankInsuranceController = function (app, control={auth, passport, acl}){

   function controller (req, res, next) {
      req.controller = "bankInsurance";
      return next();
   }

   function findAction (callback){
      BankInsurance.find({}, function (err, docs) {
         if (!err) {
            
            Bank.populate(docs, {path: "bank"},function(err, docs){
               Insurance.populate(docs, {path: "insurance"},function(err, docs){
                  callback(docs);
               });
            });
         }
      });
   }

   app.get('/bankInsurance/list', [control.auth, controller, control.acl], (req, res) => {

      BankInsurance.find({}, function (err, docs) {
         if (typeof docs !== 'undefined') {

            Bank.populate(docs, {path: "bank"},function(err, docs){
               Insurance.populate(docs, {path: "insurance"},function(err, docs){
                  res.send({msg: "OK", bankInsurances: docs});
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

   app.get('/bankInsurance/view/:id', [control.auth, controller, control.acl], (req, res) => {

      BankInsurance.findById(req.params.id, function (err, doc) {
         if (!err) {
            res.send({msg: "OK", bankInsurance: doc});
         } else {
            res.send({msg: 'ERR', err: err});
         }
      });

   });

   app.post('/bankInsurance/add', [control.auth, controller, control.acl], (req, res) => {

      let bankInsurance = new BankInsurance({
         name: req.body.name,
         idBank: req.body.idBank,
         bank: req.body.idBank,
         idInsurance: req.body.idInsurance,
         insurance: req.body.idInsurance,
         monthWithoutInterest: req.body.monthWithoutInterest,
         interest: req.body.interest,
         monthWithInterest: req.body.monthWithInterest,
         dateCreate: moment(),
         userCreate: req.user.idUser,
         dateUpdate: moment(),
         userUpdate: req.user.idUser
      });

      bankInsurance.save((err, doc) => {
         if(!err){
            findAction(function(docs){
               res.send({msg: "OK", update: docs});
            });
         } else {
            res.send({msg: 'ERR', err: err});
         }            
      });

   });

   app.post('/bankInsurance/edit/:id', [control.auth, controller, control.acl], (req, res) => {

      let filter = {
         _id: req.params.id
      }

      let update = {
         name: req.body.name,
         idBank: req.body.idBank,
         bank: req.body.idBank,
         idInsurance: req.body.idInsurance,
         insurance: req.body.idInsurance,
         monthWithoutInterest: req.body.monthWithoutInterest,
         interest: req.body.interest,
         monthWithInterest: req.body.monthWithInterest,
         dateUpdate: moment(),
         userUpdate: req.user.idUser
      };

      BankInsurance.findOneAndUpdate(filter, update, function (err, doc) {
         if (!err) {
            findAction(function(docs){
               res.send({msg: "OK", update: docs});
            });
         } else {
            res.send({msg: 'ERR', err: err});
         }
      });

   });

   app.delete('/bankInsurance/delete/:id', [control.auth, controller, control.acl], (req, res) => {

      let filter = {
         _id: req.params.id
      }

      BankInsurance.findByIdAndRemove(filter, function (err, doc) {
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

export default bankInsuranceController
