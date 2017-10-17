
import moment from 'moment';

import ExpirationDate from "../models/expirationDate";


let expirationDateController = function (app, control={auth, passport, acl}){

   function controller (req, res, next) {
      req.controller = "expirationDate";
      return next();
   }

   function findAction (callback){
      ExpirationDate.find({}, function (err, docs) {
         if (!err) {
            
            callback(docs);
         }
      });
   }

   app.get('/expirationDate/filter',[control.auth, controller], (req, res) => {
      let $filter =  global.filter(req.query.filter);
      ExpirationDate.find($filter, function (err, docs) {
         if (typeof docs !== 'undefined') {
            control.log(req.route.path, req.user);
            res.send({msg: "OK", expirationDates: docs});
         } else {
            res.send({
               msg : 'ERR',
               err : err.code
            });
         }
      });

   });

   app.get('/expirationDate/list', [control.auth, controller, control.acl], (req, res) => {

      ExpirationDate.find({}, function (err, docs) {
         if (typeof docs !== 'undefined') {
            control.log(req.route.path, req.user);
            res.send({msg: "OK", expirationDates: docs});
         } else {
            res.send({
               msg : 'ERR',
               err : err.code
            });
         }
      });

   });

   app.get('/expirationDate/view/:id', [control.auth, controller, control.acl], (req, res) => {

      ExpirationDate.findById(req.params.id, function (err, doc) {
         if (!err) {
            control.log(req.route.path, req.user);
            res.send({msg: "OK", expirationDate: doc});
         } else {
            res.send({msg: 'ERR', err: err});
         }
      });

   });

   app.post('/expirationDate/add', [control.auth, controller, control.acl], (req, res) => {

      let expirationDate = new ExpirationDate({
         idPolicy: req.body.idPolicy,
         policy: req.body.idPolicy,
         numberPolicyOverdue: req.body.numberPolicyOverdue,
         numberRenewedPolicy: req.body.numberRenewedPolicy,
         dateNewTerm: req.body.dateNewTerm,
         sellerComments: req.body.sellerComments,
         typePolicy: req.body.typePolicy,
         dateCreate: moment(),
         userCreate: req.user.idUser,
         dateUpdate: moment(),
         userUpdate: req.user.idUser
      });

      expirationDate.save((err, doc) => {
         if(!err){
            findAction(function(docs){
               control.log(req.route.path, req.user);
               res.send({msg: "OK", update: docs});
            });
         } else {
            res.send({msg: 'ERR', err: err});
         }            
      });

   });

   app.post('/expirationDate/edit/:id', [control.auth, controller, control.acl], (req, res) => {

      let filter = {
         _id: req.params.id
      }

      let update = {
         idPolicy: req.body.idPolicy,
         policy: req.body.idPolicy,
         numberPolicyOverdue: req.body.numberPolicyOverdue,
         numberRenewedPolicy: req.body.numberRenewedPolicy,
         dateNewTerm: req.body.dateNewTerm,
         sellerComments: req.body.sellerComments,
         typePolicy: req.body.typePolicy,
         dateUpdate: moment(),
         userUpdate: req.user.idUser
      };

      ExpirationDate.findOneAndUpdate(filter, update, function (err, doc) {
         if (!err) {
            findAction(function(docs){
               control.log(req.route.path, req.user);
               res.send({msg: "OK", update: docs});
            });
         } else {
            res.send({msg: 'ERR', err: err});
         }
      });

   });

   app.delete('/expirationDate/delete/:id', [control.auth, controller, control.acl], (req, res) => {

      let filter = {
         _id: req.params.id
      }

      ExpirationDate.findByIdAndRemove(filter, function (err, doc) {
         if(!err){
            findAction(function(docs){
               control.log(req.route.path, req.user);
               res.send({msg: "OK", update: docs});
            });
         } else {
            res.send({msg: 'ERR', err: err});
         }            
      });

   });

}

export default expirationDateController
