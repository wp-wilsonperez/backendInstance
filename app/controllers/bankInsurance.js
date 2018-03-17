
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
      let $filter =  global.filter(req.body.filter);
      BankInsurance.find($filter, function (err, docs) {
            
            Bank.populate(docs, {path: "bank"},function(err, docs){
               Insurance.populate(docs, {path: "insurance"},function(err, docs){
                  callback(docs);
               });
            });
      });
   }

   app.post('/bankInsurance/filter',[control.auth, controller], (req, res) => {
      let $filter =  global.filter(req.body.filter);
      BankInsurance.find($filter, function (err, docs) {
         if (typeof docs !== 'undefined') {
            control.log(req.route.path, req.user);

            Bank.populate(docs, {path: "bank"},function(err, docs){
               Insurance.populate(docs, {path: "insurance"},function(err, docs){
                  res.send({msg: "OK", bankInsurances: docs});
               });
            });
            
         } else {
            let error=global.error(err, 0, req.controller);
            res.send({msg: 'ERROR', err: error});
         }
      });

   });

   app.get('/bankInsurance/list', [control.auth, controller, control.acl], (req, res) => {
      let $filter =  global.filter(null);
      BankInsurance.find($filter, function (err, docs) {
         if (typeof docs !== 'undefined') {
            control.log(req.route.path, req.user);

            Bank.populate(docs, {path: "bank"},function(err, docs){
               Insurance.populate(docs, {path: "insurance"},function(err, docs){
                  res.send({msg: "OK", bankInsurances: docs});
               });
            });
            
         } else {
            let error=global.error(err, 0, req.controller);
            res.send({msg: 'ERROR', err: error});
         }
      });

   });

   app.get('/bankInsurance/view/:id', [control.auth, controller, control.acl], (req, res) => {

      BankInsurance.findById(req.params.id, function (err, doc) {
         if (!err) {
            control.log(req.route.path, req.user);
            res.send({msg: "OK", bankInsurance: doc});
         } else {
            let error=global.error(err, 0, req.controller);
            res.send({msg: 'ERROR', err: error});
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
               control.log(req.route.path, req.user);
               res.send({msg: "OK", update: docs});
            });
         } else {
            let error=global.error(err, 0, req.controller);
            res.send({msg: 'ERROR', err: error});
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
               control.log(req.route.path, req.user);
               res.send({msg: "OK", update: docs});
            });
         } else {
            let error=global.error(err, 0, req.controller);
            res.send({msg: 'ERROR', err: error});
         }
      });

   });

   app.delete('/bankInsurance/delete/:id', [control.auth, controller, control.acl], (req, res) => {

      let filter = {
         _id: req.params.id
      }

      let update = {
         dateDelete: moment()
      };

      BankInsurance.findOneAndUpdate(filter, update, function (err, doc) {
         if (!err) {
            findAction(function(docs){
               control.log(req.route.path, req.user);
               res.send({msg: "OK", update: docs});
            });
         } else {
            let error=global.error(err, 0, req.controller);
            res.send({msg: 'ERROR', err: error});
         }
      });

      /*let filter = {
         _id: req.params.id
      }

      BankInsurance.findByIdAndRemove(filter, function (err, doc) {
         if(!err){
            findAction(function(docs){
               control.log(req.route.path, req.user);
               res.send({msg: "OK", update: docs});
            });
         } else {
            let error=global.error(err, 0, req.controller);
            res.send({msg: 'ERROR', err: error});
         }            
      });*/

   });

}

export default bankInsuranceController
