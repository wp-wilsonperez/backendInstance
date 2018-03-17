
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
      let $filter =  global.filter(null);
      PlanAssociation.find($filter, function (err, docs) {
         if (!err) {
            
            Plan.populate(docs, {path: "plan"},function(err, docs){
               Ramo.populate(docs, {path: "ramo"},function(err, docs){
                  Insurance.populate(docs, {path: "insurance"},function(err, docs){
                     callback(docs);
                  });
               });
            });
         }
      });
   }

   app.post('/planAssociation/filter',[control.auth, controller], (req, res) => {
    let filter =  req.body.filter;
      PlanAssociation.find(filter, function (err, docs) {
         if (typeof docs !== 'undefined') {
            control.log(req.route.path, req.user);
            Ramo.populate(docs, {path: "ramo"},function(err, docs){
               Insurance.populate(docs, {path: "insurance"},function(err, docs){
                  res.send({msg: "OK", planAssociations: docs});
               });
            });
         } else {
            let error=global.error(err, 0, req.controller);
            res.send({msg: 'ERROR', err: error});
         }
      });

   });

   app.get('/planAssociation/list', [control.auth, controller, control.acl], (req, res) => {
      let $filter =  global.filter(null);
      PlanAssociation.find($filter, function (err, docs) {
         if (typeof docs !== 'undefined') {
            control.log(req.route.path, req.user);

            Plan.populate(docs, {path: "plan"},function(err, docs){
               Ramo.populate(docs, {path: "ramo"},function(err, docs){
                  Insurance.populate(docs, {path: "insurance"},function(err, docs){
                     res.send({msg: "OK", planAssociations: docs});
                  });
               });
            });
            
         } else {
            let error=global.error(err, 0, req.controller);
            res.send({msg: 'ERROR', err: error});
         }
      });

   });

   app.get('/planAssociation/view/:id', [control.auth, controller, control.acl], (req, res) => {

      PlanAssociation.findById(req.params.id, function (err, doc) {
         if (!err) {
            control.log(req.route.path, req.user);
            res.send({msg: "OK", planAssociation: doc});
         } else {
            let error=global.error(err, 0, req.controller);
            res.send({msg: 'ERROR', err: error});
         }
      });

   });

   app.post('/planAssociation/add', [control.auth, controller, control.acl], (req, res) => {

      let planAssociation = new PlanAssociation({
         name: req.body.name,
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
               control.log(req.route.path, req.user);
               res.send({msg: "OK", update: docs});
            });
         } else {
            let error=global.error(err, 0, req.controller);
            res.send({msg: 'ERROR', err: error});
         }            
      });

   });

   app.post('/planAssociation/edit/:id', [control.auth, controller, control.acl], (req, res) => {

      let filter = {
         _id: req.params.id
      }

      let update = {
         name: req.body.name,
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
               control.log(req.route.path, req.user);
               res.send({msg: "OK", update: docs});
            });
         } else {
            let error=global.error(err, 0, req.controller);
            res.send({msg: 'ERROR', err: error});
         }
      });

   });

   app.delete('/planAssociation/delete/:id', [control.auth, controller, control.acl], (req, res) => {

      let filter = {
         _id: req.params.id
      }

      let update = {
         dateDelete: moment()
      };

      PlanAssociation.findOneAndUpdate(filter, update, function (err, doc) {
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

      PlanAssociation.findByIdAndRemove(filter, function (err, doc) {
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

export default planAssociationController
