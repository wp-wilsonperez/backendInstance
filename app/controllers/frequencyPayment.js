
import moment from 'moment';

import FrequencyPayment from "../models/frequencyPayment";

let frequencyPaymentController = function (app, control={auth, passport, acl}){

   function controller (req, res, next) {
      req.controller = "frequencyPayment";
      return next();
   }

   function findAction (callback){
      FrequencyPayment.find({}, function (err, docs) {
         if (!err) {
            callback(docs)
         }
      });
   }

   app.get('/frequencyPayment/list', [control.auth, controller, control.acl], (req, res) => {

      FrequencyPayment.find({}, function (err, docs) {
         if (typeof docs !== 'undefined') {
            res.send({msg: "OK", frequencyPayments: docs});
         } else {
            res.send({
               msg : 'ERR',
               err : err.code
            });
         }
      });

   });

   app.get('/frequencyPayment/view/:id', [control.auth, controller, control.acl], (req, res) => {

      FrequencyPayment.findById(req.params.id, function (err, doc) {
         if (!err) {
            res.send({msg: "OK", frequencyPayment: doc});
         } else {
            res.send({msg: 'ERR', err: err});
         }
      });

   });

   app.post('/frequencyPayment/add', [control.auth, controller, control.acl], (req, res) => {

      let frequencyPayment = new FrequencyPayment({
         name: req.body.name,
         dateCreate: moment(),
         userCreate: req.user.idUser,
         dateUpdate: moment(),
         userUpdate: req.user.idUser
      });

      frequencyPayment.save((err, doc) => {
         if(!err){
            res.send({msg: "OK", doc: doc});
         } else {
            res.send({msg: 'ERR', err: err});
         }            
      });

   });

   app.post('/frequencyPayment/edit/:id', [control.auth, controller, control.acl], (req, res) => {

      let filter = {
         _id: req.params.id
      }

      let update = {
         name: req.body.name,
         dateUpdate: moment(),
         userUpdate: req.user.idUser
      };

      FrequencyPayment.findOneAndUpdate(filter, update, function (err, doc) {
         if (!err) {
            findAction(function(docs){
               res.send({msg: "OK", update: docs});
            });
         } else {
            res.send({msg: 'ERR', err: err});
         }
      });

   });

   app.delete('/frequencyPayment/delete/:id', [control.auth, controller, control.acl], (req, res) => {

      let filter = {
         _id: req.params.id
      }

      FrequencyPayment.findByIdAndRemove(filter, function (err, doc) {
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

export default frequencyPaymentController
