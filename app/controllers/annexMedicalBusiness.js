
import moment from 'moment';

import AnnexMedicalBusiness from "../models/annexMedicalBusiness";

import PolicyMedicalBusiness from "../models/policyMedicalBusiness";
import PlanAssociation from "../models/planAssociation";

let annexMedicalBusinessController = function (app, control={auth, passport, acl}){

   function controller (req, res, next) {
      req.controller = "annexMedicalBusiness";
      return next();
   }

   function findAction (callback){
      let $filter =  global.filter(null);
      AnnexMedicalBusiness.find($filter, function (err, docs) {
         if (!err) {
            
            PolicyMedicalBusiness.populate(docs, {path: "policyMedicalBusiness"},function(err, docs){
               PlanAssociation.populate(docs, {path: "planAssociation"},function(err, docs){
                  callback(docs);
               });
            });
         }
      });
   }

   app.post('/annexMedicalBusiness/filter',[control.auth, controller], (req, res) => {
      let $filter =  global.filter(req.body.filter);
      AnnexMedicalBusiness.find($filter, function (err, docs) {
         if (typeof docs !== 'undefined') {
            control.log(req.route.path, req.user);

            PolicyMedicalBusiness.populate(docs, {path: "policyMedicalBusiness"},function(err, docs){
               PlanAssociation.populate(docs, {path: "planAssociation"},function(err, docs){
                  res.send({msg: "OK", annexMedicalBusinesses: docs});
               });
            });
            
         } else {
            let error=global.error(err, 0, req.controller);
            res.send({msg: 'ERROR', err: error});
         }
      });

   });

   app.get('/annexMedicalBusiness/list', [control.auth, controller, control.acl], (req, res) => {
      let $filter =  global.filter(null);
      AnnexMedicalBusiness.find($filter, function (err, docs) {
         if (typeof docs !== 'undefined') {
            control.log(req.route.path, req.user);

            PolicyMedicalBusiness.populate(docs, {path: "policyMedicalBusiness"},function(err, docs){
               PlanAssociation.populate(docs, {path: "planAssociation"},function(err, docs){
                  res.send({msg: "OK", annexMedicalBusinesses: docs});
               });
            });
            
         } else {
            let error=global.error(err, 0, req.controller);
            res.send({msg: 'ERROR', err: error});
         }
      });

   });

   app.get('/annexMedicalBusiness/view/:id', [control.auth, controller, control.acl], (req, res) => {

      AnnexMedicalBusiness.findById(req.params.id, function (err, doc) {
         if (!err) {
            control.log(req.route.path, req.user);
            res.send({msg: "OK", annexMedicalBusiness: doc});
         } else {
            let error=global.error(err, 0, req.controller);
            res.send({msg: 'ERROR', err: error});
         }
      });

   });

   app.post('/annexMedicalBusiness/add', [control.auth, controller, control.acl], (req, res) => {

      let annexMedicalBusiness = new AnnexMedicalBusiness({
         idPolicyMedicalBusiness: req.body.idPolicyMedicalBusiness,
         policyMedicalBusiness: req.body.idPolicyMedicalBusiness,
         idPlanAssociation: req.body.idPlanAssociation,
         planAssociation: req.body.idPlanAssociation,
         annexNumber: req.body.annexNumber,
         certificateNumber: req.body.certificateNumber,
         valueIssue: req.body.valueIssue,
         iva: req.body.iva,
         others1: req.body.others1,
         others2: req.body.others2,
         others3: req.body.others3,
         observation: req.body.observation,
         tasa: req.body.tasa,
         totalPrima: req.body.totalPrima,
         TotalValue: req.body.TotalValue,
         alertInclucion: req.body.alertInclucion,
         hasBilling: req.body.hasBilling,
         isBilling: req.body.isBilling,
         dateCreate: moment(),
         userCreate: req.user.idUser,
         dateUpdate: moment(),
         userUpdate: req.user.idUser
      });

      annexMedicalBusiness.save((err, doc) => {
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

   app.post('/annexMedicalBusiness/edit/:id', [control.auth, controller, control.acl], (req, res) => {

      let filter = {
         _id: req.params.id
      }

      let update = {
         idPolicyMedicalBusiness: req.body.idPolicyMedicalBusiness,
         policyMedicalBusiness: req.body.idPolicyMedicalBusiness,
         idPlanAssociation: req.body.idPlanAssociation,
         planAssociation: req.body.idPlanAssociation,
         annexNumber: req.body.annexNumber,
         certificateNumber: req.body.certificateNumber,
         valueIssue: req.body.valueIssue,
         iva: req.body.iva,
         others1: req.body.others1,
         others2: req.body.others2,
         others3: req.body.others3,
         observation: req.body.observation,
         tasa: req.body.tasa,
         totalPrima: req.body.totalPrima,
         TotalValue: req.body.TotalValue,
         alertInclucion: req.body.alertInclucion,
         hasBilling: req.body.hasBilling,
         isBilling: req.body.isBilling,
         dateUpdate: moment(),
         userUpdate: req.user.idUser
      };

      AnnexMedicalBusiness.findOneAndUpdate(filter, update, function (err, doc) {
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

   app.delete('/annexMedicalBusiness/delete/:id', [control.auth, controller, control.acl], (req, res) => {

      let filter = {
         _id: req.params.id
      }

      let update = {
         dateDelete: moment()
      };

      AnnexMedicalBusiness.findOneAndUpdate(filter, update, function (err, doc) {
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

      AnnexMedicalBusiness.findByIdAndRemove(filter, function (err, doc) {
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

export default annexMedicalBusinessController
