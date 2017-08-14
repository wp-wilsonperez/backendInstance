
import moment from 'moment';

import PlanAssociation from "../models/planAssociation";

import Plan from "../models/plan";
import Ramo from "../models/ramo";
import Insurance from "../models/insurance";

let planAssociationController = function (app, control={auth, passport, acl}){

   function controller (req, res, next) {
      req.controller = "planAssociation";
      return next();
   }

   function findAction (callback){
      PlanAssociation.find({}, function (err, docs) {
         if (!err) {
            
            Bank.populate(docs, {path: "bank"},function(err, docs){
               Insurance.populate(docs, {path: "insurance"},function(err, docs){
                  callback(docs);
               });
            });
         }
      });
   }

   app.get('/planAssociation/list', [control.auth, controller, control.acl], (req, res) => {

      PlanAssociation.find({}, function (err, docs) {
         if (typeof docs !== 'undefined') {

            Bank.populate(docs, {path: "bank"},function(err, docs){
               Insurance.populate(docs, {path: "insurance"},function(err, docs){
                  res.send({msg: "OK", planAssociations: docs});
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

   app.get('/planAssociation/view/:id', [control.auth, controller, control.acl], (req, res) => {

      PlanAssociation.findById(req.params.id, function (err, doc) {
         if (!err) {
            res.send({msg: "OK", planAssociation: doc});
         } else {
            res.send({msg: 'ERR', err: err});
         }
      });

   });

   app.post('/planAssociation/add', [control.auth, controller, control.acl], (req, res) => {

      let planAssociation = new PlanAssociation({
         idPlan: req.body.idPlan,
         plan: req.body.idPlan,
         idRamo: req.body.idRamo,
         ramo: req.body.idRamo,
         idInsurance: req.body.idInsurance,
         insurance: req.body.idInsurance,
         dateCreate: moment(),
         userCreate: req.user.idUser,
         dateUpdate: moment(),
         userUpdate: req.user.idUser
      });

      planAssociation.save((err, doc) => {
         if(!err){
            findAction(function(docs){
               res.send({msg: "OK", update: docs});
            });
         } else {
            res.send({msg: 'ERR', err: err});
         }            
      });

   });

   app.post('/planAssociation/edit/:id', [control.auth, controller, control.acl], (req, res) => {

      let filter = {
         _id: req.params.id
      }

      let update = {
         idPlan: req.body.idPlan,
         plan: req.body.idPlan,
         idRamo: req.body.idRamo,
         ramo: req.body.idRamo,
         idInsurance: req.body.idInsurance,
         insurance: req.body.idInsurance,
         dateUpdate: moment(),
         userUpdate: req.user.idUser
      };

      PlanAssociation.findOneAndUpdate(filter, update, function (err, doc) {
         if (!err) {
            findAction(function(docs){
               res.send({msg: "OK", update: docs});
            });
         } else {
            res.send({msg: 'ERR', err: err});
         }
      });

   });

   app.delete('/planAssociation/delete/:id', [control.auth, controller, control.acl], (req, res) => {

      let filter = {
         _id: req.params.id
      }

      PlanAssociation.findByIdAndRemove(filter, function (err, doc) {
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

export default planAssociationController
