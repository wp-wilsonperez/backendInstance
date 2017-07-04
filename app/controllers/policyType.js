
import moment from 'moment';

import PolicyType from "../models/policyType";

let policyTypeController = function (app, control={auth, passport, acl}){

   function controller (req, res, next) {
      req.controller = "policyType";
      return next();
   }

   function findAction (callback){
      PolicyType.find({}, function (err, docs) {
         if (!err) {
            callback(docs)
         }
      });
   }

   app.get('/policyType/list', [control.auth, controller, control.acl], (req, res) => {

      PolicyType.find({}, function (err, docs) {
         if (typeof docs !== 'undefined') {
            res.send({msg: "OK", policyTypes: docs});
         } else {
            res.send({
               msg : 'ERR',
               err : err.code
            });
         }
      });

   });

   app.get('/policyType/view/:id', [control.auth, controller, control.acl], (req, res) => {

      PolicyType.findById(req.params.id, function (err, doc) {
         if (!err) {
            res.send({msg: "OK", policyType: doc});
         } else {
            res.send({msg: 'ERR', err: err});
         }
      });

   });

   app.post('/policyType/add', [control.auth, controller, control.acl], (req, res) => {

      let policyType = new PolicyType({
         name: req.body.name,
         dateCreate: moment(),
         userCreate: req.user.idUser,
         dateUpdate: moment(),
         userUpdate: req.user.idUser
      });

      PolicyType.save((err, doc) => {
         if(!err){
            res.send({msg: "OK", doc: doc});
         } else {
            res.send({msg: 'ERR', err: err});
         }            
      });

   });

   app.post('/policyType/edit/:id', [control.auth, controller, control.acl], (req, res) => {

      let filter = {
         _id: req.params.id
      }

      let update = {
         name: req.body.name,
         dateUpdate: moment(),
         userUpdate: req.user.idUser
      };

      PolicyType.findOneAndUpdate(filter, update, function (err, doc) {
         if (!err) {
            findAction(function(docs){
               res.send({msg: "OK", update: docs});
            });
         } else {
            res.send({msg: 'ERR', err: err});
         }
      });

   });

   app.delete('/policyType/delete/:id', [control.auth, controller, control.acl], (req, res) => {

      let filter = {
         _id: req.params.id
      }

      PolicyType.findByIdAndRemove(filter, function (err, doc) {
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

export default policyTypeController
