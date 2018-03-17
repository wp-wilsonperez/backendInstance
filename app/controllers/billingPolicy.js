
import moment from 'moment';

import BillingPolicy from "../models/billingPolicy";

import Billing from "../models/billing";
import PolicyAnnex from "../models/policyAnnex";

let billingPolicyController = function (app, control={auth, passport, acl}){

   function controller (req, res, next) {
      req.controller = "billingPolicy";
      return next();
   }

   function findAction (callback){
      let $filter =  global.filter(null);
      BillingPolicy.find($filter, function (err, docs) {
         if (!err) {
            
            Billing.populate(docs, {path: "billing"},function(err, docs){
               callback(docs);
            });
         }
      });
   }

   app.post('/billingPolicy/filter',[control.auth, controller], (req, res) => {
    let filter =  req.body.filter;
        BillingPolicy.find(filter, function (err, docs) {
            if (typeof docs !== 'undefined') {
            control.log(req.route.path, req.user);
            Billing.populate(docs, {path: "billing"},function(err, docs){
                res.send({msg: "OK", billingPolicies: docs});
            });
            } else {
            let error=global.error(err, 0, req.controller);
            res.send({msg: 'ERROR', err: error});
            }
        });
    
    });

   app.get('/billingPolicy/list', [control.auth, controller, control.acl], (req, res) => {
      let $filter =  global.filter(null);
      BillingPolicy.find($filter, function (err, docs) {
         if (typeof docs !== 'undefined') {
            control.log(req.route.path, req.user);

            Billing.populate(docs, {path: "billing"},function(err, docs){
               res.send({msg: "OK", billingPolicies: docs});
            });
            
         } else {
            let error=global.error(err, 0, req.controller);
            res.send({msg: 'ERROR', err: error});
         }
      });

   });

   app.get('/billingPolicy/view/:id', [control.auth, controller, control.acl], (req, res) => {

      BillingPolicy.findById(req.params.id, function (err, doc) {
         if (!err) {
            control.log(req.route.path, req.user);
            res.send({msg: "OK", billingPolicy: doc});
         } else {
            let error=global.error(err, 0, req.controller);
            res.send({msg: 'ERROR', err: error});
         }
      });

   });

   app.post('/billingPolicy/add', [control.auth, controller, control.acl], (req, res) => {

      let billingPolicy = new BillingPolicy({
         idBilling: req.body.idBilling,
         billing: req.body.idBilling,
         idPolicy: req.body.idPolicy,
         policy: req.body.idPolicy,
         policyNumber: req.body.policyNumber,
         idRamo: req.body.idRamo,
         ramo: req.body.ramo,
         annexNumber: req.body.annexNumber,
         refNumber: req.body.refNumber,
         prima: req.body.prima,
         otherWithIVA1: req.body.otherWithIVA1,
         superBank: req.body.superBank,
         segCamp: req.body.segCamp,
         issue: req.body.issue,
         otherWithIVA2: req.body.otherWithIVA2,
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
            let filter = {
               idPolicy: req.body.idPolicy
            }
            let update = {
               isBilling: true,
            };
            PolicyAnnex.findOneAndUpdate(filter, update, function (err, doc) {
               if (!err) {
                  //control.log(req.route.path, req.user);
               }
            });
            
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

   app.post('/billingPolicy/edit/:id', [control.auth, controller, control.acl], (req, res) => {

      let filter = {
         _id: req.params.id
      }

      let update = {
         idBilling: req.body.idBilling,
         billing: req.body.idBilling,
         idPolicy: req.body.idPolicy,
         policy: req.body.idPolicy,
         policyNumber: req.body.policyNumber,
         idRamo: req.body.idRamo,
         ramo: req.body.ramo,
         annexNumber: req.body.annexNumber,
         refNumber: req.body.refNumber,
         prima: req.body.prima,
         otherWithIVA1: req.body.otherWithIVA1,
         superBank: req.body.superBank,
         segCamp: req.body.segCamp,
         issue: req.body.issue,
         otherWithIVA2: req.body.otherWithIVA2,
         IVA: req.body.IVA,
         others: req.body.others,
         totalValue: req.body.totalValue,
         dateUpdate: moment(),
         userUpdate: req.user.idUser
      };

      BillingPolicy.findOneAndUpdate(filter, update, function (err, doc) {
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

   app.delete('/billingPolicy/delete/:id', [control.auth, controller, control.acl], (req, res) => {

      let filter = {
         _id: req.params.id
      }

      let update = {
         dateDelete: moment()
      };

      BillingPolicy.findOneAndUpdate(filter, update, function (err, doc) {
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

      BillingPolicy.findByIdAndRemove(filter, function (err, doc) {
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

export default billingPolicyController
