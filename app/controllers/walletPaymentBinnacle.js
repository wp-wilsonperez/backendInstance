
import moment from 'moment';

import WalletPaymentBinnacle from "../models/walletPaymentBinnacle";

import Bank from "../models/bank";
import Insurance from "../models/insurance";

let walletPaymentBinnacleController = function (app, control={auth, passport, acl}){

   function controller (req, res, next) {
      req.controller = "walletPaymentBinnacle";
      return next();
   }

   function findAction (callback){
      WalletPaymentBinnacle.find({}, function (err, docs) {
         if (!err) {
            
            callback(docs);
         }
      });
   }

   app.get('/walletPaymentBinnacle/list', [control.auth, controller, control.acl], (req, res) => {

      WalletPaymentBinnacle.find({}, function (err, docs) {
         if (typeof docs !== 'undefined') {
            res.send({msg: "OK", walletPaymentBinnacles: docs});
            
         } else {
            res.send({
               msg : 'ERR',
               err : err.code
            });
         }
      });

   });

   app.get('/walletPaymentBinnacle/view/:id', [control.auth, controller, control.acl], (req, res) => {

      WalletPaymentBinnacle.findById(req.params.id, function (err, doc) {
         if (!err) {
            res.send({msg: "OK", walletPaymentBinnacle: doc});
         } else {
            res.send({msg: 'ERR', err: err});
         }
      });

   });

   app.post('/walletPaymentBinnacle/add', [control.auth, controller, control.acl], (req, res) => {

      let walletPaymentBinnacle = new WalletPaymentBinnacle({
         idWalletPayment: req.body.idWalletPayment,
         walletPayment: req.body.idWalletPayment,
         detailsCall: req.body.detailsCall,
         callDate: req.body.callDate,
         dateCreate: moment(),
         userCreate: req.user.idUser,
         dateUpdate: moment(),
         userUpdate: req.user.idUser
      });

      walletPaymentBinnacle.save((err, doc) => {
         if(!err){
            findAction(function(docs){
               res.send({msg: "OK", update: docs});
            });
         } else {
            res.send({msg: 'ERR', err: err});
         }            
      });

   });

   app.post('/walletPaymentBinnacle/edit/:id', [control.auth, controller, control.acl], (req, res) => {

      let filter = {
         _id: req.params.id
      }

      let update = {
         idWalletPayment: req.body.idWalletPayment,
         walletPayment: req.body.idWalletPayment,
         detailsCall: req.body.detailsCall,
         callDate: req.body.callDate,
         dateUpdate: moment(),
         userUpdate: req.user.idUser
      };

      WalletPaymentBinnacle.findOneAndUpdate(filter, update, function (err, doc) {
         if (!err) {
            findAction(function(docs){
               res.send({msg: "OK", update: docs});
            });
         } else {
            res.send({msg: 'ERR', err: err});
         }
      });

   });

   app.delete('/walletPaymentBinnacle/delete/:id', [control.auth, controller, control.acl], (req, res) => {

      let filter = {
         _id: req.params.id
      }

      WalletPaymentBinnacle.findByIdAndRemove(filter, function (err, doc) {
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

export default walletPaymentBinnacleController