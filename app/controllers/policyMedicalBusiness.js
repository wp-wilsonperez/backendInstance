
import moment from 'moment';

import PolicyMedicalBusiness from "../models/policyMedicalBusiness";

import Insurance from "../models/insurance";
import User from "../models/user";

let policyMedicalBusinessController = function (app, control={auth, passport, acl}){

   function controller (req, res, next) {
      req.controller = "policyMedicalBusiness";
      return next();
   }

   function findAction (callback){
      PolicyMedicalBusiness.find({}, function (err, docs) {
         if (!err) {
            
            Insurance.populate(docs, {path: "insurance"},function(err, docs){
               User.populate(docs, {path: "user"},function(err, docs){
                  callback(docs);
               });
            });
         }
      });
   }

   app.get('/policyMedicalBusiness/filter',[control.auth, controller], (req, res) => {
      let $filter =  global.filter(req.query.filter);
      PolicyMedicalBusiness.find($filter, function (err, docs) {
         if (typeof docs !== 'undefined') {

            Insurance.populate(docs, {path: "insurance"},function(err, docs){
               User.populate(docs, {path: "user"},function(err, docs){
                  res.send({msg: "OK", bankInsurances: docs});
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

   app.get('/policyMedicalBusiness/list', [control.auth, controller, control.acl], (req, res) => {

      PolicyMedicalBusiness.find({}, function (err, docs) {
         if (typeof docs !== 'undefined') {

            Insurance.populate(docs, {path: "insurance"},function(err, docs){
               User.populate(docs, {path: "user"},function(err, docs){
                  res.send({msg: "OK", bankInsurances: docs});
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

   app.get('/policyMedicalBusiness/view/:id', [control.auth, controller, control.acl], (req, res) => {

      PolicyMedicalBusiness.findById(req.params.id, function (err, doc) {
         if (!err) {
            res.send({msg: "OK", policyMedicalBusiness: doc});
         } else {
            res.send({msg: 'ERR', err: err});
         }
      });

   });

   app.post('/policyMedicalBusiness/add', [control.auth, controller, control.acl], (req, res) => {

      let policyMedicalBusiness = new PolicyMedicalBusiness({
         policyNumber: req.body.policyNumber,
         idInsurance: req.body.idInsurance,
         insurance: req.body.idInsurance,
         porcentajeRamo: req.body.porcentajeRamo,
         idUser: req.body.idUser,
         user: req.body.idUser,
         idBusiness: req.body.idBusiness,
         business: req.body.idBusiness,
         idDeductible: req.body.idDeductible,
         deductible: req.body.idDeductible,
         deductibleEdited: req.body.deductibleEdited,
         insured: req.body.insured,
         startDate: req.body.startDate,
         finishDate: req.body.finishDate,
         daysofValidity: req.body.daysofValidity,
         idPolicyType: req.body.idPolicyType,
         policyType: req.body.policyType,
         idFrequencyPayment: req.body.idFrequencyPayment,
         frequencyPayment: req.body.idFrequencyPayment,
         idCity: req.body.idCity,
         city: req.body.idCity,
         dateAdmission: req.body.dateAdmission,
         dateCancellation: req.body.dateCancellation,
         dateCreate: moment(),
         userCreate: req.user.idUser,
         dateUpdate: moment(),
         userUpdate: req.user.idUser
      });

      policyMedicalBusiness.save((err, doc) => {
         if(!err){
            findAction(function(docs){
               res.send({msg: "OK", update: docs});
            });
         } else {
            res.send({msg: 'ERR', err: err});
         }            
      });

   });

   app.post('/policyMedicalBusiness/edit/:id', [control.auth, controller, control.acl], (req, res) => {

      let filter = {
         _id: req.params.id
      }

      let update = {
         policyNumber: req.body.policyNumber,
         idInsurance: req.body.idInsurance,
         insurance: req.body.idInsurance,
         porcentajeRamo: req.body.porcentajeRamo,
         idUser: req.body.idUser,
         user: req.body.idUser,
         idBusiness: req.body.idBusiness,
         business: req.body.idBusiness,
         idDeductible: req.body.idDeductible,
         deductible: req.body.idDeductible,
         deductibleEdited: req.body.deductibleEdited,
         insured: req.body.insured,
         startDate: req.body.startDate,
         finishDate: req.body.finishDate,
         daysofValidity: req.body.daysofValidity,
         idPolicyType: req.body.idPolicyType,
         policyType: req.body.policyType,
         idFrequencyPayment: req.body.idFrequencyPayment,
         frequencyPayment: req.body.idFrequencyPayment,
         idCity: req.body.idCity,
         city: req.body.idCity,
         dateAdmission: req.body.dateAdmission,
         dateCancellation: req.body.dateCancellation,
         dateUpdate: moment(),
         userUpdate: req.user.idUser
      };

      PolicyMedicalBusiness.findOneAndUpdate(filter, update, function (err, doc) {
         if (!err) {
            findAction(function(docs){
               res.send({msg: "OK", update: docs});
            });
         } else {
            res.send({msg: 'ERR', err: err});
         }
      });

   });

   app.delete('/policyMedicalBusiness/delete/:id', [control.auth, controller, control.acl], (req, res) => {

      let filter = {
         _id: req.params.id
      }

      PolicyMedicalBusiness.findByIdAndRemove(filter, function (err, doc) {
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

export default policyMedicalBusinessController
