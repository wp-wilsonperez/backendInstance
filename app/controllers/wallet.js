
import moment from 'moment';

import Wallet from "../models/wallet";

let walletController = function (app, control={auth, passport, acl}){

   function controller (req, res, next) {
      req.controller = "wallet";
      return next();
   }

   function findAction (callback){
      Wallet.find({}, function (err, docs) {
         if (!err) {

            callback(docs);
         }
      });
   }

   app.get('/wallet/filter',[control.auth, controller], (req, res) => {
      let $filter =  global.filter(req.query.filter);
      Wallet.find($filter, function (err, docs) {
         if (typeof docs !== 'undefined') {

            res.send({msg: "OK", wallets: docs});
         } else {
            res.send({
               msg : 'ERR',
               err : err.code
            });
         }
      });

   });

   app.get('/wallet/list', [control.auth, controller, control.acl], (req, res) => {

      Wallet.find({}, function (err, docs) {
         if (typeof docs !== 'undefined') {

            res.send({msg: "OK", wallets: docs});
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
         idBilling: req.body.idBilling,
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
         idBilling: req.body.idBilling,
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
