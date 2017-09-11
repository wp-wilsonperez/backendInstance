
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

   app.get('/planAlternative/filter',[control.auth, controller], (req, res) => {
      let $filter =  global.filter(req.query.filter);
      PlanAlternative.find($filter, function (err, docs) {
         if (typeof docs !== 'undefined') {
            control.log(req.route.path, req.user);

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

   app.get('/planAlternative/list', [control.auth, controller, control.acl], (req, res) => {

      PlanAlternative.find({}, function (err, docs) {
         if (typeof docs !== 'undefined') {
            control.log(req.route.path, req.user);

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
            control.log(req.route.path, req.user);
            res.send({msg: "OK", planAlternative: doc});
         } else {
            res.send({msg: 'ERR', err: err});
         }
      });

   });

   app.post('/planAlternative/add', [control.auth, controller, control.acl], (req, res) => {

      let planAlternative = new PlanAlternative({
         idAlternative: req.body.idAlternative,
         idPlanAssociation: req.body.idPlanAssociation,
         value: req.body.value,
         dateCreate: moment(),
         userCreate: req.user.idUser,
         dateUpdate: moment(),
         userUpdate: req.user.idUser
      });

      planAlternative.save((err, doc) => {
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

   app.post('/planAlternative/edit/:id', [control.auth, controller, control.acl], (req, res) => {

      let filter = {
         _id: req.params.id
      }

      let update = {
         idAlternative: req.body.idAlternative,
         idPlanAssociation: req.body.idPlanAssociation,
         value: req.body.value,
         dateUpdate: moment(),
         userUpdate: req.user.idUser
      };

      PlanAlternative.findOneAndUpdate(filter, update, function (err, doc) {
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

   app.delete('/planAlternative/delete/:id', [control.auth, controller, control.acl], (req, res) => {

      let filter = {
         _id: req.params.id
      }

      PlanAlternative.findByIdAndRemove(filter, function (err, doc) {
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

export default planAlternativeController
