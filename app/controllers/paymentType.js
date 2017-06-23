
import moment from 'moment';

import PaymentType from "../models/paymentType";

let paymentTypeController = function (app, control={auth, passport, acl}){

   function controller (req, res, next) {
      req.controller = "paymentType";
      return next();
   }

   function findAction (callback){
      PaymentType.find({}, function (err, docs) {
         if (!err) {
            callback(docs)
         }
      });
   }

   app.get('/paymentType/list', [control.auth, controller, control.acl], (req, res) => {

      PaymentType.find({}, function (err, docs) {
         if (typeof docs !== 'undefined') {
            res.send({msg: "OK", paymentTypes: docs});
         } else {
            res.send({
               msg : 'ERR',
               err : err.code
            });
         }
      });

   });

   app.get('/paymentType/view/:id', [control.auth, controller, control.acl], (req, res) => {

      PaymentType.findById(req.params.id, function (err, doc) {
         if (!err) {
            res.send({msg: "OK", paymentType: doc});
         } else {
            res.send({msg: 'ERR', err: err});
         }
      });

   });

   app.post('/paymentType/add', [control.auth, controller, control.acl], (req, res) => {

      let paymentType = new PaymentType({
         name: req.body.name,
         initialPayment: req.body.initialPayment,
         equalPayments: req.body.equalPayments,
         dateCreate: moment(),
         userCreate: req.user.idUser,
         dateUpdate: moment(),
         userUpdate: req.user.idUser
      });

      paymentType.save((err, doc) => {
         if(!err){
            res.send({msg: "OK", doc: doc});
         } else {
            res.send({msg: 'ERR', err: err});
         }            
      });

   });

   app.post('/paymentType/edit/:id', [control.auth, controller, control.acl], (req, res) => {

      let filter = {
         _id: req.params.id
      }

      let update = {
         name: req.body.name,
         initialPayment: req.body.initialPayment,
         equalPayments: req.body.equalPayments,
         dateUpdate: moment(),
         userUpdate: req.user.idUser
      };

      PaymentType.findOneAndUpdate(filter, update, function (err, doc) {
         if (!err) {
            findAction(function(docs){
               res.send({msg: "OK", update: docs});
            });
         } else {
            res.send({msg: 'ERR', err: err});
         }
      });

   });

   app.delete('/paymentType/delete/:id', [control.auth, controller, control.acl], (req, res) => {

      let filter = {
         _id: req.params.id
      }

      PaymentType.findByIdAndRemove(filter, function (err, doc) {
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

export default paymentTypeController
