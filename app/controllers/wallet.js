
import moment from 'moment';

import Wallet from "../models/wallet";

import Policy from "../models/policy";
import PolicyAnnex from "../models/policyAnnex";
import Billing from "../models/billing";

let walletController = function (app, control={auth, passport, acl}){

   function controller (req, res, next) {
      req.controller = "wallet";
      return next();
   }

   function findAction (callback){
      Wallet.find({}, function (err, docs) {
         if (!err) {
            
            Policy.populate(docs, {path: "policy"},function(err, docs){
               PolicyAnnex.populate(docs, {path: "policyAnnex"},function(err, docs){
                  Billing.populate(docs, {path: "billing"},function(err, docs){
                     callback(docs);
                  });
               });
            });
         }
      });
   }

   app.get('/wallet/list', [control.auth, controller, control.acl], (req, res) => {

      Wallet.find({}, function (err, docs) {
         if (typeof docs !== 'undefined') {

            Policy.populate(docs, {path: "policy"},function(err, docs){
               PolicyAnnex.populate(docs, {path: "policyAnnex"},function(err, docs){
                  Billing.populate(docs, {path: "billing"},function(err, docs){
                     res.send({msg: "OK", wallets: docs});
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

   app.get('/wallet/view/:id', [control.auth, controller, control.acl], (req, res) => {

      Wallet.findById(req.params.id, function (err, doc) {
         if (!err) {
            res.send({msg: "OK", wallet: doc});
         } else {
            res.send({msg: 'ERR', err: err});
         }
      });

   });

   app.post('/wallet/add', [control.auth, controller, control.acl], (req, res) => {

      let wallet = new Wallet({
         idPolicy: req.body.idPolicy,
         policy: req.body.idPolicy,
         idPolicyAnnex: req.body.idPolicyAnnex,
         policyAnnex: req.body.idPolicyAnnex,
         idBilling: req.body.idBilling,
         billing: req.body.idBilling,
         DetailsBillingData: req.body.DetailsBillingData,
         expirationDate: req.body.expirationDate,
         paymentValue: req.body.paymentValue,
         detailsWallet: req.body.detailsWallet,
         dateCreate: moment(),
         userCreate: req.user.idUser,
         dateUpdate: moment(),
         userUpdate: req.user.idUser
      });

      wallet.save((err, doc) => {
         if(!err){
            findAction(function(docs){
               res.send({msg: "OK", update: docs});
            });
         } else {
            res.send({msg: 'ERR', err: err});
         }            
      });

   });

   app.post('/wallet/edit/:id', [control.auth, controller, control.acl], (req, res) => {

      let filter = {
         _id: req.params.id
      }

      let update = {
         dPolicy: req.body.idPolicy,
         policy: req.body.idPolicy,
         idPolicyAnnex: req.body.idPolicyAnnex,
         policyAnnex: req.body.idPolicyAnnex,
         idBilling: req.body.idBilling,
         billing: req.body.idBilling,
         DetailsBillingData: req.body.DetailsBillingData,
         expirationDate: req.body.expirationDate,
         paymentValue: req.body.paymentValue,
         detailsWallet: req.body.detailsWallet,
         dateUpdate: moment(),
         userUpdate: req.user.idUser
      };

      Wallet.findOneAndUpdate(filter, update, function (err, doc) {
         if (!err) {
            findAction(function(docs){
               res.send({msg: "OK", update: docs});
            });
         } else {
            res.send({msg: 'ERR', err: err});
         }
      });

   });

   app.delete('/wallet/delete/:id', [control.auth, controller, control.acl], (req, res) => {

      let filter = {
         _id: req.params.id
      }

      Wallet.findByIdAndRemove(filter, function (err, doc) {
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

export default walletController
