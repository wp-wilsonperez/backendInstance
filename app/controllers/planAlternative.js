
import moment from 'moment';

import PlanAlternative from "../models/planAlternative";

import PlanAssociation from "../models/planAssociation";
import Alternative from "../models/alternative";

let planAlternativeController = function (app, control={auth, passport, acl}){

   function controller (req, res, next) {
      req.controller = "planAlternative";
      return next();
   }

   function findAction (callback){
      PlanAlternative.find({}, function (err, docs) {
         if (!err) {
            
            PlanAssociation.populate(docs, {path: "planAssociation"},function(err, docs){
               Alternative.populate(docs, {path: "alternative"},function(err, docs){
                  callback(docs);
               });
            });
         }
      });
   }

   app.get('/planAlternative/list', [control.auth, controller, control.acl], (req, res) => {

      PlanAlternative.find({}, function (err, docs) {
         if (typeof docs !== 'undefined') {

            PlanAssociation.populate(docs, {path: "planAssociation"},function(err, docs){
               Alternative.populate(docs, {path: "alternative"},function(err, docs){
                  res.send({msg: "OK", planAlternatives: docs});
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

   app.get('/planAlternative/view/:id', [control.auth, controller, control.acl], (req, res) => {

      PlanAlternative.findById(req.params.id, function (err, doc) {
         if (!err) {
            res.send({msg: "OK", planAlternative: doc});
         } else {
            res.send({msg: 'ERR', err: err});
         }
      });

   });

   app.post('/planAlternative/add', [control.auth, controller, control.acl], (req, res) => {

      let planAlternative = new PlanAlternative({
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

      planAlternative.save((err, doc) => {
         if(!err){
            findAction(function(docs){
               res.send({msg: "OK", update: docs});
            });
         } else {
            res.send({msg: 'ERR', err: err});
         }            
      });

   });

   app.post('/planAlternative/edit/:id', [control.auth, controller, control.acl], (req, res) => {

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

      PlanAlternative.findOneAndUpdate(filter, update, function (err, doc) {
         if (!err) {
            findAction(function(docs){
               res.send({msg: "OK", update: docs});
            });
         } else {
            res.send({msg: 'ERR', err: err});
         }
      });

   });

   app.delete('/planAlternative/delete/:id', [control.auth, controller, control.acl], (req, res) => {

      let filter = {
         _id: req.params.id
      }

      PlanAlternative.findByIdAndRemove(filter, function (err, doc) {
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

export default planAlternativeController