
import moment from 'moment';

import Sinester from "../models/sinester";

import Ramo from "../models/ramo";

let sinesterController = function (app, control={auth, passport, acl}){

   function controller (req, res, next) {
      req.controller = "sinester";
      return next();
   }

   function findAction (callback){
      Sinester.find({}, function (err, docs) {
         if (!err) {
            
            Ramo.populate(docs, {path: "ramo"},function(err, docs){
               callback(docs);
            });
         }
      });
   }

   app.get('/sinester/list', [control.auth, controller, control.acl], (req, res) => {

      Sinester.find({}, function (err, docs) {
         if (typeof docs !== 'undefined') {

            Ramo.populate(docs, {path: "ramo"},function(err, docs){
               res.send({msg: "OK", sinesters: docs});
            });
            
         } else {
            res.send({
               msg : 'ERR',
               err : err.code
            });
         }
      });

   });

   app.get('/sinester/view/:id', [control.auth, controller, control.acl], (req, res) => {

      Sinester.findById(req.params.id, function (err, doc) {
         if (!err) {
            res.send({msg: "OK", sinester: doc});
         } else {
            res.send({msg: 'ERR', err: err});
         }
      });

   });

   app.post('/sinester/add', [control.auth, controller, control.acl], (req, res) => {

      let sinester = new Sinester({
         idPolicy: req.body.idPolicy,
         policyData: req.body.policyData,
         idPolicyAnnex: req.body.idPolicyAnnex,
         annexData: req.body.annexData,
         idClient: req.body.idClient,
         clientData: req.body.clientData,
         compName: req.body.compName,
         clientInsured: req.body.clientInsured,
         beneficiary: req.body.beneficiary,
         dateSinester: req.body.dateSinester,
         dateNotification: req.body.dateNotification,
         beneficiary: req.body.beneficiary,
         idRamo: req.body.idRamo,
         ramo: req.body.idRamo,
         sinisterState: req.body.sinisterState,
         dateCreate: moment(),
         userCreate: req.user.idUser,
         dateUpdate: moment(),
         userUpdate: req.user.idUser
      });

      sinester.save((err, doc) => {
         if(!err){
            findAction(function(docs){
               res.send({msg: "OK", update: docs});
            });
         } else {
            res.send({msg: 'ERR', err: err});
         }            
      });

   });

   app.post('/sinester/edit/:id', [control.auth, controller, control.acl], (req, res) => {

      let filter = {
         _id: req.params.id
      }

      let update = {
         idPolicy: req.body.idPolicy,
         policyData: req.body.policyData,
         idPolicyAnnex: req.body.idPolicyAnnex,
         annexData: req.body.annexData,
         idClient: req.body.idClient,
         clientData: req.body.clientData,
         compName: req.body.compName,
         clientInsured: req.body.clientInsured,
         beneficiary: req.body.beneficiary,
         dateSinester: req.body.dateSinester,
         dateNotification: req.body.dateNotification,
         beneficiary: req.body.beneficiary,
         idRamo: req.body.idRamo,
         ramo: req.body.idRamo,
         sinisterState: req.body.sinisterState,
         dateUpdate: moment(),
         userUpdate: req.user.idUser
      };

      Sinester.findOneAndUpdate(filter, update, function (err, doc) {
         if (!err) {
            findAction(function(docs){
               res.send({msg: "OK", update: docs});
            });
         } else {
            res.send({msg: 'ERR', err: err});
         }
      });

   });

   app.delete('/sinester/delete/:id', [control.auth, controller, control.acl], (req, res) => {

      let filter = {
         _id: req.params.id
      }

      Sinester.findByIdAndRemove(filter, function (err, doc) {
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

export default sinesterController
