
import moment from 'moment';

import PolicyAnnex from "../models/policyAnnex";

import Policy from "../models/policy";

let policyAnnexController = function (app, control={auth, passport, acl}){

   function controller (req, res, next) {
      req.controller = "policyAnnex";
      return next();
   }

   function findAction (callback){
      PolicyAnnex.find({}, function (err, docs) {
         if (!err) {
            
            Policy.populate(docs, {path: "policy"},function(err, docs){
               callback(docs);
            });
         }
      });
   }

   app.get('/policyAnnex/list', [control.auth, controller, control.acl], (req, res) => {

      PolicyAnnex.find({}, function (err, docs) {
         if (typeof docs !== 'undefined') {

            Policy.populate(docs, {path: "policy"},function(err, docs){
               res.send({msg: "OK", policyAnnexes: docs});
            });
            
         } else {
            res.send({
               msg : 'ERR',
               err : err.code
            });
         }
      });

   });

   app.get('/policyAnnex/view/:id', [control.auth, controller, control.acl], (req, res) => {

      PolicyAnnex.findById(req.params.id, function (err, doc) {
         if (!err) {
            res.send({msg: "OK", policyAnnex: doc});
         } else {
            res.send({msg: 'ERR', err: err});
         }
      });

   });

   app.post('/policyAnnex/add', [control.auth, controller, control.acl], (req, res) => {

      let policyAnnex = new PolicyAnnex({
         name: req.body.name,
         idBank: req.body.idBank,
         bank: req.body.idBank,
         idInsurance: req.body.idInsurance,
         insurance: req.body.idInsurance,
         monthWithoutInterest: req.body.monthWithoutInterest,
         interest: req.body.interest,
         monthWithInterest: req.body.monthWithInterest,
         dateCreate: moment(),
         userCreate: req.user.idUser,
         dateUpdate: moment(),
         userUpdate: req.user.idUser
      });

      policyAnnex.save((err, doc) => {
         if(!err){
            findAction(function(docs){
               res.send({msg: "OK", update: docs});
            });
         } else {
            res.send({msg: 'ERR', err: err});
         }            
      });

   });

   app.post('/policyAnnex/edit/:id', [control.auth, controller, control.acl], (req, res) => {

      let filter = {
         _id: req.params.id
      }

      let update = {
         name: req.body.name,
         idBank: req.body.idBank,
         bank: req.body.idBank,
         idInsurance: req.body.idInsurance,
         insurance: req.body.idInsurance,
         monthWithoutInterest: req.body.monthWithoutInterest,
         interest: req.body.interest,
         monthWithInterest: req.body.monthWithInterest,
         dateUpdate: moment(),
         userUpdate: req.user.idUser
      };

      PolicyAnnex.findOneAndUpdate(filter, update, function (err, doc) {
         if (!err) {
            findAction(function(docs){
               res.send({msg: "OK", update: docs});
            });
         } else {
            res.send({msg: 'ERR', err: err});
         }
      });

   });

   app.delete('/policyAnnex/delete/:id', [control.auth, controller, control.acl], (req, res) => {

      let filter = {
         _id: req.params.id
      }

      PolicyAnnex.findByIdAndRemove(filter, function (err, doc) {
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

export default policyAnnexController
