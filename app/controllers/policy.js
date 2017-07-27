
import moment from 'moment';

import Policy from "../models/policy";
import PercentageRamo from "../models/percentageRamo";

let policyController = function (app, control={auth, passport, acl}){

   function controller (req, res, next) {
      req.controller = "policy";
      return next();
   }

   function findAction (callback){
      Policy.find({}, function (err, docs) {
         if (!err) {
            callback(docs)
         }
      });
   }

   app.get('/policy/list', [control.auth, controller, control.acl], (req, res) => {

      Policy.find({}, function (err, docs) {
         if (typeof docs !== 'undefined') {
            res.send({msg: "OK", policies: docs});
         } else {
            res.send({
               msg : 'ERR',
               err : err.code
            });
         }
      });

   });

   app.get('/policy/view/:id', [control.auth, controller, control.acl], (req, res) => {

      Policy.findById(req.params.id, function (err, doc) {
         if (!err) {
            res.send({msg: "OK", policy: doc});
         } else {
            res.send({msg: 'ERR', err: err});
         }
      });

   });

   app.post('/policy/add', [control.auth, controller, control.acl], (req, res) => {

      let policy = new Policy({
         policyNumber: req.body.policyNumber,
         annexedNumber: req.body.annexedNumber,
         certificateNumber: req.body.certificateNumber,
         idInsurance: req.body.idInsurance,
         insurance: req.body.idInsurance,
         idRamo: req.body.idRamo,
         ramo: req.body.idRamo,
         idUser: req.body.idUser,
         user: req.body.idUser,
         idDeductible: req.body.idDeductible,
         deductible: req.body.idDeductible,
         insured: req.body.insured,
         startDate: req.body.startDate,
         finishDate: req.body.finishDate,
         daysofValidity: req.body.daysofValidity,
         idPolicyType: req.body.idPolicyType,
         policyType: req.body.idPolicyType,
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

      policy.save((err, doc) => {
         if(!err){
            res.send({msg: "OK", doc: doc});
         } else {
            res.send({msg: 'ERR', err: err});
         }            
      });

   });

   app.post('/policy/edit/:id', [control.auth, controller, control.acl], (req, res) => {

      let filter = {
         _id: req.params.id
      }

      let update = {
         policyNumber: req.body.policyNumber,
         annexedNumber: req.body.annexedNumber,
         certificateNumber: req.body.certificateNumber,
         idInsurance: req.body.idInsurance,
         insurance: req.body.idInsurance,
         idRamo: req.body.idRamo,
         ramo: req.body.idRamo,
         idUser: req.body.idUser,
         user: req.body.idUser,
         idDeductible: req.body.idDeductible,
         deductible: req.body.idDeductible,
         insured: req.body.insured,
         startDate: req.body.startDate,
         finishDate: req.body.finishDate,
         daysofValidity: req.body.daysofValidity,
         idPolicyType: req.body.idPolicyType,
         policyType: req.body.idPolicyType,
         idFrequencyPayment: req.body.idFrequencyPayment,
         frequencyPayment: req.body.idFrequencyPayment,
         idCity: req.body.idCity,
         city: req.body.idCity,
         dateAdmission: req.body.dateAdmission,
         dateCancellation: req.body.dateCancellation,
         dateUpdate: moment(),
         userUpdate: req.user.idUser
      };

      Policy.findOneAndUpdate(filter, update, function (err, doc) {
         if (!err) {
            findAction(function(docs){
               res.send({msg: "OK", update: docs});
            });
         } else {
            res.send({msg: 'ERR', err: err});
         }
      });

   });

   app.delete('/policy/delete/:id', [control.auth, controller, control.acl], (req, res) => {

      let filter = {
         _id: req.params.id
      }

      Policy.findByIdAndRemove(filter, function (err, doc) {
         if(!err){
            findAction(function(docs){
               res.send({msg: "OK", update: docs});
            });
         } else {
            res.send({msg: 'ERR', err: err});
         }            
      });

   });

   //get ramo porcentage value

    app.get('/policy/ramoPercentageValue', [control.auth, controller, control.acl], (req, res) => {

      let filter = {
         idInsurance: req.query.idInsurance,
         idRamo: req.query.idRamo,
      }

      PercentageRamo.findOne(filter, function (err, doc) {
         if (!err) {
            if(doc)
               return res.send({msg: "OK", value: doc.value});
            res.send({msg: "OK", value: null});
         } else {
            res.send({msg: 'ERR', err: err});
         }
      });

   });

}

export default policyController
