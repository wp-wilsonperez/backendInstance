
import moment from 'moment';

import Billing from "../models/billing";

let billingController = function (app, control={auth, passport, acl}){

   function controller (req, res, next) {
      req.controller = "billing";
      return next();
   }

   function findAction (callback){
      Billing.find({}, function (err, docs) {
         if (!err) {
            callback(docs);
         }
      });
   }

   app.get('/billing/list', [control.auth, controller, control.acl], (req, res) => {

      Billing.find({}, function (err, docs) {
         if (typeof docs !== 'undefined') {

            res.send({msg: "OK", billings: docs});
            
         } else {
            res.send({
               msg : 'ERR',
               err : err.code
            });
         }
      });

   });

   app.get('/billing/view/:id', [control.auth, controller, control.acl], (req, res) => {

      Billing.findById(req.params.id, function (err, doc) {
         if (!err) {
            res.send({msg: "OK", billing: doc});
         } else {
            res.send({msg: 'ERR', err: err});
         }
      });

   });

   app.post('/billing/add', [control.auth, controller, control.acl], (req, res) => {

      let billing = new Billing({
         typeBilling: req.body.typeBilling,
         idClient: req.body.idClient,
         detailClient: req.body.detailClient,
         idBusiness: req.body.idBusiness,
         detailBusiness: req.body.detailBusiness,
         idInsurance: req.body.idInsurance,
         detailInsurance: req.body.detailInsurance,
         idInsuraceCom: req.body.idInsuraceCom,
         nameInsuranceCom: req.body.nameInsuranceCom,
         billingNumber: req.body.billingNumber,
         billingDate: req.body.billingDate,
         firstPaymentDate: req.body.firstPaymentDate,
         paymentType: req.body.paymentType,
         initialPayment: req.body.initialPayment,
         equalPayments: req.body.equalPayments,
         valueEqualPayments: req.body.valueEqualPayments,
         observationsBilling: req.body.observationsBilling,
         totalPrimaValue: req.body.totalPrimaValue,
         totalIVAValue: req.body.totalIVAValue,
         totalBillingValue: req.body.totalBillingValue,
         dateCreate: moment(),
         userCreate: req.user.idUser,
         dateUpdate: moment(),
         userUpdate: req.user.idUser
      });

      billing.save((err, doc) => {
         if(!err){
            findAction(function(docs){
               res.send({msg: "OK", update: docs});
            });
         } else {
            res.send({msg: 'ERR', err: err});
         }            
      });

   });

   app.post('/billing/edit/:id', [control.auth, controller, control.acl], (req, res) => {

      let filter = {
         _id: req.params.id
      }

      let update = {
         typeBilling: req.body.typeBilling,
         idClient: req.body.idClient,
         detailClient: req.body.detailClient,
         idBusiness: req.body.idBusiness,
         detailBusiness: req.body.detailBusiness,
         idInsurance: req.body.idInsurance,
         detailInsurance: req.body.detailInsurance,
         idInsuraceCom: req.body.idInsuraceCom,
         nameInsuranceCom: req.body.nameInsuranceCom,
         billingNumber: req.body.billingNumber,
         billingDate: req.body.billingDate,
         firstPaymentDate: req.body.firstPaymentDate,
         paymentType: req.body.paymentType,
         initialPayment: req.body.initialPayment,
         equalPayments: req.body.equalPayments,
         valueEqualPayments: req.body.valueEqualPayments,
         observationsBilling: req.body.observationsBilling,
         totalPrimaValue: req.body.totalPrimaValue,
         totalIVAValue: req.body.totalIVAValue,
         totalBillingValue: req.body.totalBillingValue,
         dateUpdate: moment(),
         userUpdate: req.user.idUser
      };

      Billing.findOneAndUpdate(filter, update, function (err, doc) {
         if (!err) {
            findAction(function(docs){
               res.send({msg: "OK", update: docs});
            });
         } else {
            res.send({msg: 'ERR', err: err});
         }
      });

   });

   app.delete('/billing/delete/:id', [control.auth, controller, control.acl], (req, res) => {

      let filter = {
         _id: req.params.id
      }

      Billing.findByIdAndRemove(filter, function (err, doc) {
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

export default billingController
