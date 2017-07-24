
import moment from 'moment';

import WalletPayment from "../models/walletPayment";

import Bank from "../models/bank";
import Insurance from "../models/insurance";

let walletPaymentController = function (app, control={auth, passport, acl}){

   function controller (req, res, next) {
      req.controller = "walletPayment";
      return next();
   }

   function findAction (callback){
      WalletPayment.find({}, function (err, docs) {
         if (!err) {
            
            Bank.populate(docs, {path: "bank"},function(err, docs){
               Insurance.populate(docs, {path: "insurance"},function(err, docs){
                  callback(docs);
               });
            });
         }
      });
   }

   app.get('/walletPayment/list', [control.auth, controller, control.acl], (req, res) => {

      WalletPayment.find({}, function (err, docs) {
         if (typeof docs !== 'undefined') {

            Bank.populate(docs, {path: "bank"},function(err, docs){
               Insurance.populate(docs, {path: "insurance"},function(err, docs){
                  res.send({msg: "OK", walletPayments: docs});
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

   app.get('/walletPayment/view/:id', [control.auth, controller, control.acl], (req, res) => {

      WalletPayment.findById(req.params.id, function (err, doc) {
         if (!err) {
            res.send({msg: "OK", walletPayment: doc});
         } else {
            res.send({msg: 'ERR', err: err});
         }
      });

   });

   app.post('/walletPayment/add', [control.auth, controller, control.acl], (req, res) => {

      let walletPayment = new WalletPayment({
         idWallet: req.body.idWallet,
         wallet: req.body.idWallet,
         idBank: req.body.idBank,
         bank: req.body.idBank,
         moneyType: req.body.moneyType,
         document: req.body.document,
         details: req.body.details,
         ctaCteNumber: req.body.ctaCteNumber,
         expirationDate: req.body.expirationDate,
         paymentValue: req.body.paymentValue,
         balance: req.body.balance,
         paymentDate: req.body.paymentDate,
         moneyObservation: req.body.moneyObservation,
         dateCreate: moment(),
         userCreate: req.user.idUser,
         dateUpdate: moment(),
         userUpdate: req.user.idUser
      });

      walletPayment.save((err, doc) => {
         if(!err){
            findAction(function(docs){
               res.send({msg: "OK", update: docs});
            });
         } else {
            res.send({msg: 'ERR', err: err});
         }            
      });

   });

   app.post('/walletPayment/edit/:id', [control.auth, controller, control.acl], (req, res) => {

      let filter = {
         _id: req.params.id
      }

      let update = {
         idWallet: req.body.idWallet,
         wallet: req.body.idWallet,
         idBank: req.body.idBank,
         bank: req.body.idBank,
         moneyType: req.body.moneyType,
         document: req.body.document,
         details: req.body.details,
         ctaCteNumber: req.body.ctaCteNumber,
         expirationDate: req.body.expirationDate,
         paymentValue: req.body.paymentValue,
         balance: req.body.balance,
         paymentDate: req.body.paymentDate,
         moneyObservation: req.body.moneyObservation,
         dateUpdate: moment(),
         userUpdate: req.user.idUser
      };

      WalletPayment.findOneAndUpdate(filter, update, function (err, doc) {
         if (!err) {
            findAction(function(docs){
               res.send({msg: "OK", update: docs});
            });
         } else {
            res.send({msg: 'ERR', err: err});
         }
      });

   });

   app.delete('/walletPayment/delete/:id', [control.auth, controller, control.acl], (req, res) => {

      let filter = {
         _id: req.params.id
      }

      WalletPayment.findByIdAndRemove(filter, function (err, doc) {
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

export default walletPaymentController
