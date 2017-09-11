
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

   app.get('/policyAnnex/filter',[control.auth, controller], (req, res) => {
      let $filter =  global.filter(req.query.filter);
      PolicyAnnex.find($filter, function (err, docs) {
         if (typeof docs !== 'undefined') {
            control.log(req.route.path, req.user);

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

   app.get('/policyAnnex/list', [control.auth, controller, control.acl], (req, res) => {

      PolicyAnnex.find({}, function (err, docs) {
         if (typeof docs !== 'undefined') {
            control.log(req.route.path, req.user);

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

    app.get('/policyAnnex/param/:idPolicy', [control.auth, controller, control.acl], (req, res) => {

      PolicyAnnex.find({idPolicy: req.params.idPolicy}, function (err, doc) {
         if (!err) {
            //control.log(req.route.path, req.user);
            res.send({msg: "OK", policyAnnex: doc});
         } else {
            res.send({msg: 'ERR', err: err});
         }
      });

   });


   app.get('/policyAnnex/view/:id', [control.auth, controller, control.acl], (req, res) => {

      PolicyAnnex.findById(req.params.id, function (err, doc) {
         if (!err) {
            control.log(req.route.path, req.user);
            res.send({msg: "OK", policyAnnex: doc});
         } else {
            res.send({msg: 'ERR', err: err});
         }
      });

   });


   app.post('/policyAnnex/add', [control.auth, controller, control.acl], (req, res) => {

      let policyAnnex = new PolicyAnnex({
         idPolicy: req.body.idPolicy,
         policy: req.body.idPolicy,
         annexNumber: req.body.annexNumber,
         certificateNumber: req.body.certificateNumber,
         totalPrima: req.body.totalPrima,
         detailsAnnex: req.body.detailsAnnex,
         superBank: req.body.superBank,
         iva: req.body.iva,
         segCamp: req.body.segCamp,
         valueIssue: req.body.valueIssue,
         totalValue: req.body.totalValue,
         dateCreate: moment(),
         userCreate: req.user.idUser,
         dateUpdate: moment(),
         userUpdate: req.user.idUser
      });

      policyAnnex.save((err, doc) => {
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

   app.post('/policyAnnex/edit/:id', [control.auth, controller, control.acl], (req, res) => {

      let filter = {
         _id: req.params.id
      }

      let update = {
         idPolicy: req.body.idPolicy,
         policy: req.body.idPolicy,
         annexNumber: req.body.annexNumber,
         certificateNumber: req.body.certificateNumber,
         totalPrima: req.body.totalPrima,
         detailsAnnex: req.body.detailsAnnex,
         superBank: req.body.superBank,
         iva: req.body.iva,
         segCamp: req.body.segCamp,
         valueIssue: req.body.valueIssue,
         totalValue: req.body.totalValue,
         dateUpdate: moment(),
         userUpdate: req.user.idUser
      };

      PolicyAnnex.findOneAndUpdate(filter, update, function (err, doc) {
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

   app.delete('/policyAnnex/delete/:id', [control.auth, controller, control.acl], (req, res) => {

      let filter = {
         _id: req.params.id
      }

      PolicyAnnex.findByIdAndRemove(filter, function (err, doc) {
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

export default policyAnnexController
