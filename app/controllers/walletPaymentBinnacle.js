
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
      let $filter =  global.filter(null);
      WalletPaymentBinnacle.find($filter, function (err, docs) {
         if (!err) {
            
            callback(docs);
         }
      });
   }

   app.post('/walletPaymentBinnacle/filter',[control.auth, controller], (req, res) => {
      let $filter =  global.filter(req.body.filter);
      WalletPaymentBinnacle.find($filter, function (err, docs) {
         if (typeof docs !== 'undefined') {
            control.log(req.route.path, req.user);
            res.send({msg: "OK", walletPaymentBinnacles: docs});
            
         } else {
            let error=global.error(err, 0, req.controller);
            res.send({msg: 'ERROR', err: error});
         }
      });

   });

   app.get('/walletPaymentBinnacle/list', [control.auth, controller, control.acl], (req, res) => {
      let $filter =  global.filter(null);
      WalletPaymentBinnacle.find($filter, function (err, docs) {
         if (typeof docs !== 'undefined') {
            control.log(req.route.path, req.user);
            res.send({msg: "OK", walletPaymentBinnacles: docs});
            
         } else {
            let error=global.error(err, 0, req.controller);
            res.send({msg: 'ERROR', err: error});
         }
      });

   });

   app.get('/walletPaymentBinnacle/view/:id', [control.auth, controller, control.acl], (req, res) => {

      WalletPaymentBinnacle.findById(req.params.id, function (err, doc) {
         if (!err) {
            control.log(req.route.path, req.user);
            res.send({msg: "OK", walletPaymentBinnacle: doc});
         } else {
            let error=global.error(err, 0, req.controller);
            res.send({msg: 'ERROR', err: error});
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
               control.log(req.route.path, req.user);
               res.send({msg: "OK", update: docs});
            });
         } else {
            let error=global.error(err, 0, req.controller);
            res.send({msg: 'ERROR', err: error});
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
               control.log(req.route.path, req.user);
               res.send({msg: "OK", update: docs});
            });
         } else {
            let error=global.error(err, 0, req.controller);
            res.send({msg: 'ERROR', err: error});
         }
      });

   });

   app.delete('/walletPaymentBinnacle/delete/:id', [control.auth, controller, control.acl], (req, res) => {

      let filter = {
         _id: req.params.id
      }

      let update = {
         dateDelete: moment()
      };

      WalletPaymentBinnacle.findOneAndUpdate(filter, update, function (err, doc) {
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

      WalletPaymentBinnacle.findByIdAndRemove(filter, function (err, doc) {
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

export default walletPaymentBinnacleController
