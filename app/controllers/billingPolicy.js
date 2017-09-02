
import moment from 'moment';

import BillingPolicy from "../models/billingPolicy";

import Billing from "../models/billing";

let billingPolicyController = function (app, control={auth, passport, acl}){

   function controller (req, res, next) {
      req.controller = "billingPolicy";
      return next();
   }

   function findAction (callback){
      BillingPolicy.find({}, function (err, docs) {
         if (!err) {
            
            Billing.populate(docs, {path: "billing"},function(err, docs){
               callback(docs);
            });
         }
      });
   }

   app.get('/billingPolicy/filter',[control.auth, controller], (req, res) => {
      let $filter =  global.filter(req.query.filter);
      BillingPolicy.find($filter, function (err, docs) {
         if (typeof docs !== 'undefined') {

            Billing.populate(docs, {path: "billing"},function(err, docs){
               res.send({msg: "OK", billingPolicies: docs});
            });
            
         } else {
            res.send({
               msg : 'ERR',
               err : err.code
            });
         }
      });

   });

   app.get('/billingPolicy/list', [control.auth, controller, control.acl], (req, res) => {

      BillingPolicy.find({}, function (err, docs) {
         if (typeof docs !== 'undefined') {

            Billing.populate(docs, {path: "billing"},function(err, docs){
               res.send({msg: "OK", billingPolicies: docs});
            });
            
         } else {
            res.send({
               msg : 'ERR',
               err : err.code
            });
         }
      });

   });

   app.get('/billingPolicy/view/:id', [control.auth, controller, control.acl], (req, res) => {

      BillingPolicy.findById(req.params.id, function (err, doc) {
         if (!err) {
            res.send({msg: "OK", billingPolicy: doc});
         } else {
            res.send({msg: 'ERR', err: err});
         }
      });

   });

   app.post('/billingPolicy/add', [control.auth, controller, control.acl], (req, res) => {

      let billingPolicy = new BillingPolicy({
         idBilling: req.body.idBilling,
         billing: req.body.idBilling,
         idRamo: req.body.idRamo,
         ramo: req.body.ramo,
         annexNumber: req.body.annexNumber,
         refNumber: req.body.refNumber,
         prima: req.body.prima,
         otherWithIVA1: req.body.otherWithIVA1,
         superBank: req.body.superBank,
         segCamp: req.body.segCamp,
         issue: req.body.issue,
         IVA: req.body.IVA,
         others: req.body.others,
         totalValue: req.body.totalValue,
         dateCreate: moment(),
         userCreate: req.user.idUser,
         dateUpdate: moment(),
         userUpdate: req.user.idUser
      });

      billingPolicy.save((err, doc) => {
         if(!err){
            findAction(function(docs){
               res.send({msg: "OK", update: docs});
            });
         } else {
            res.send({msg: 'ERR', err: err});
         }            
      });

   });

   app.post('/billingPolicy/edit/:id', [control.auth, controller, control.acl], (req, res) => {

      let filter = {
         _id: req.params.id
      }

      let update = {
         idBilling: req.body.idBilling,
         billing: req.body.idBilling,
         idRamo: req.body.idRamo,
         ramo: req.body.ramo,
         annexNumber: req.body.annexNumber,
         refNumber: req.body.refNumber,
         prima: req.body.prima,
         otherWithIVA1: req.body.otherWithIVA1,
         superBank: req.body.superBank,
         segCamp: req.body.segCamp,
         issue: req.body.issue,
         IVA: req.body.IVA,
         others: req.body.others,
         totalValue: req.body.totalValue,
         dateUpdate: moment(),
         userUpdate: req.user.idUser
      };

      BillingPolicy.findOneAndUpdate(filter, update, function (err, doc) {
         if (!err) {
            findAction(function(docs){
               res.send({msg: "OK", update: docs});
            });
         } else {
            res.send({msg: 'ERR', err: err});
         }
      });

   });

   app.delete('/billingPolicy/delete/:id', [control.auth, controller, control.acl], (req, res) => {

      let filter = {
         _id: req.params.id
      }

      BillingPolicy.findByIdAndRemove(filter, function (err, doc) {
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

export default billingPolicyController
