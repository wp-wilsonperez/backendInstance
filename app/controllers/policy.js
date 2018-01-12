
import mongoose from 'mongoose';
import moment from 'moment';

import Policy from "../models/policy";
import PolicyAnnex from "../models/policyAnnex";
import Insurance from "../models/insurance";
import Ramo from "../models/ramo";
import User from "../models/user";

import JSZip from 'jszip';
import Docxtemplater from 'docxtemplater';
import excelbuilder from 'msexcel-builder';
import fs from 'fs';
import path from 'path';

const pathRender = `download`;
const pathDownload = `./public/${pathRender}`;

if (!fs.existsSync(pathDownload)){
    fs.mkdirSync(pathDownload);
}

let policyController = function (app, control={auth, passport, acl}){

   function controller (req, res, next) {
      req.controller = "policy";
      return next();
   }

   function findAction (callback){
      Policy.find({}, function (err, docs) {
         if (!err) {
            Insurance.populate(docs, {path: "insurance"},function(err, docs){
               Ramo.populate(docs, {path: "ramo"},function(err, docs){
                  callback(docs)
               });
            });
         }
      });
   }

   app.get('/policy/filter',[control.auth, controller], (req, res) => {
      let $filter =  global.filter(req.query.filter);
      Policy.find($filter, function (err, docs) {
         if (typeof docs !== 'undefined') {
            control.log(req.route.path, req.user);
            Insurance.populate(docs, {path: "insurance"},function(err, docs){
               Ramo.populate(docs, {path: "ramo"},function(err, docs){
                  res.send({msg: "OK", policies: docs});
               });
            });
         } else {
            let error=global.error(err, 0, req.controller);
            res.send({msg: 'ERROR', err: error});
         }
      });

   });

   app.get('/policy/list', [control.auth, controller, control.acl], (req, res) => {

      let typeList = app.locals.typeList;
      let filter = {};
      if(typeList=="99097f2c1f"){
         filter = {"userCreate": req.user.idUser};
      } else if(typeList=="99097f2c1c"){
         filter = {"branchCreate": req.user.idBranch};
      } else {
         filter = {};
      }

      Policy.find(filter, function (err, docs) {
         if (typeof docs !== 'undefined') {
            control.log(req.route.path, req.user);
            Insurance.populate(docs, {path: "insurance"},function(err, docs){
               Ramo.populate(docs, {path: "ramo"},function(err, docs){
                  res.send({msg: "OK", policies: docs});
               });
            });
         } else {
            let error=global.error(err, 0, req.controller);
            res.send({msg: 'ERROR', err: error});
         }
      });

   });

   app.get('/policy/view/:id', [control.auth, controller, control.acl], (req, res) => {

      Policy.findById(req.params.id, function (err, doc) {
         if (!err) {
            control.log(req.route.path, req.user);
            res.send({msg: "OK", policy: doc});
         } else {
            let error=global.error(err, 0, req.controller);
            res.send({msg: 'ERROR', err: error});
         }
      });

   });

   app.post('/policy/add', [control.auth, controller, control.acl], (req, res) => {

      if(req.body.policy){
         let $data = req.body.policy;
         let $policy = $data;
         let $policyAnnex = $data.policyAnnex;
         let $moment = moment();
         delete($policy.policyAnnex);
         $policy["dateCreate"] = $moment;
         $policy["userCreate"] = req.user.idUser;
         $policy["branchCreate"] = req.user.idBranch;
         $policy["dateUpdate"] = $moment;
         $policy["userUpdate"] = req.user.idUser;
         let policy = new Policy($policy);

         policy.save((err, docPolicy) => {
            if(!err){
               $policyAnnex["idPolicy"] = docPolicy._id;
               $policyAnnex["policy"] = docPolicy._id;
               $policyAnnex["dateCreate"] = $moment;
               $policyAnnex["userCreate"] = req.user.idUser;
               $policyAnnex["dateUpdate"] = $moment;
               $policyAnnex["userUpdate"] = req.user.idUser;
               let policyAnnex = new PolicyAnnex($policyAnnex);

               policyAnnex.save((err, docPolicyAnnex) => {
                  if(!err){
                     findAction(function(docs){
                        res.send({msg: "OK", update: docs});
                     });
                  } else {
                     let error=global.error(err, 0, req.controller);
                     res.send({msg: 'ERROR', err: error});
                  }
               });
            } else {
               let error=global.error(err, 0, req.controller);
               res.send({msg: 'ERROR', err: error});
            }            
         });

      } else {
         let policy = new Policy({
            policyNumber: req.body.policyNumber,
            annexedNumber: req.body.annexedNumber,
            certificateNumber: req.body.certificateNumber,
            idInsurance: req.body.idInsurance,
            insurance: req.body.idInsurance,
            idRamo: req.body.idRamo,
            ramo: req.body.idRamo,
            idPlan: req.body.idPlan,
            typeRecipient: req.body.typeRecipient,
            idRecipient: req.body.idRecipient,
            recipient: req.body.recipient,
            idDeductible: req.body.idDeductible,
            deductible: req.body.idDeductible,
            insured: req.body.insured,
            startDate: req.body.startDate,
            finishDate: req.body.finishDate,
            daysofValidity: req.body.daysofValidity,
            idPolicyType: req.body.idPolicyType,
            idPaymentType: req.body.idPaymentType,
            policyType: req.body.idPolicyType,
            idFrequencyPayment: req.body.idFrequencyPayment,
            frequencyPayment: req.body.idFrequencyPayment,
            idCity: req.body.idCity,
            city: req.body.idCity,
            idRamo: req.body.idRamo,
            dateAdmission: req.body.dateAdmission,
            dateCancellation: req.body.dateCancellation,
            dateCreate: moment(),
            userCreate: req.user.idUser,
            branchCreate: req.user.idBranch,
            dateUpdate: moment(),
            userUpdate: req.user.idUser
           
         });

         policy.save((err, doc) => {
            if(!err){
               control.log(req.route.path, req.user);
               res.send({msg: "OK", doc: doc});
            } else {
               let error=global.error(err, 0, req.controller);
               res.send({msg: 'ERROR', err: error});
            }            
         });

      }
   });

   app.get('/policy/clone/:id', [control.auth, controller, control.acl], (req, res) => {

      let $moment = moment();
      /*$policy["dateCreate"] = $moment;
      $policy["userCreate"] = req.user.idUser;
      $policy["dateUpdate"] = $moment;
      $policy["userUpdate"] = req.user.idUser;*/

      Policy.findById(req.params.id, function (err, docPolicy) {
         if (!err) {
            let docPolicyId = docPolicy._id;
            docPolicy._id = mongoose.Types.ObjectId();
            //mongoose.Schema.ObjectId
            docPolicy.isNew = true;
            policy.save((err, docPolicyClone) => {
               if(!err){
                  PolicyAnnex.find({"_id": docPolicyId}, function (err, docsPolicyAnnex) {
                     if (typeof docs !== 'undefined') {
                        for (var i=0 ; i>$docsPolicyAnnex.length; i++) {
                           let $policyAnnex = $docsPolicyAnnex[0];
                        }
                     } else {
                        let error=global.error(err, 0, req.controller);
                        return res.send({msg: 'ERROR', err: error});
                     }
                  });
               }           
            });
            //control.log(req.route.path, req.user);
            res.send({msg: "OK", policy: docPolicy});
         } else {
            let error=global.error(err, 0, req.controller);
            res.send({msg: 'ERROR', err: error});
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
         typeRecipient: req.body.typeRecipient,
         idRecipient: req.body.idRecipient,
         recipient: req.body.recipient,
         idDeductible: req.body.idDeductible,
         deductible: req.body.idDeductible,
         insured: req.body.insured,
         startDate: req.body.startDate,
         finishDate: req.body.finishDate,
         daysofValidity: req.body.daysofValidity,
         idPolicyType: req.body.idPolicyType,
         idPaymentType: req.body.idPaymentType,
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
               control.log(req.route.path, req.user);
               res.send({msg: "OK", update: docs});
            });
         } else {
            let error=global.error(err, 0, req.controller);
            res.send({msg: 'ERROR', err: error});
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
               control.log(req.route.path, req.user);
               res.send({msg: "OK", update: docs});
            });
         } else {
            let error=global.error(err, 0, req.controller);
            res.send({msg: 'ERROR', err: error});
         }            
      });

   });

   app.post('/policy/report', [controller], (req, res) => {

      let $filter =  global.filter(req.body.filter);
      Policy.find($filter, function (err, docs) {
         if (typeof docs !== 'undefined') {

            var file = 'policy.xlsx';
            var outPutFile = moment().format('YYYY-MM-DD-h:mm:ss') + file;
            var pathDownload = __dirname+'/../../public/download/';

            var workbook = excelbuilder.createWorkbook(pathDownload, outPutFile)

            var sheet1 = workbook.createSheet('sheet1', 10, 12);

            var cols = [2,3,4,5,6,7,8,9,10];
            var rowIni = 2;
            sheet1.set(cols[0], rowIni, 'Agencia');
            sheet1.set(cols[1], rowIni, 'Cuenta');
            sheet1.set(cols[2], rowIni, 'Nº Vehiculos');
            sheet1.set(cols[3], rowIni, 'Cliente');
            sheet1.set(cols[4], rowIni, 'Póliza Vencida');
            sheet1.set(cols[5], rowIni, 'Póliza Renovada');
            sheet1.set(cols[6], rowIni, 'Estado');
            sheet1.set(cols[7], rowIni, 'Nº Renovados');
            sheet1.set(cols[8], rowIni, 'Fecha Vencimiento');

            console.log(docs);
            let $length = docs.length;
            for (var i = 0; i < $length; i++) {
               rowIni++;
               sheet1.set(cols[0], rowIni, docs[i]);
            }

            workbook.save(function(err1, resp1){
               if (!err1){
                  console.log('congratulations, your workbook created');
                  res.send({msg: "OK", doc_name: outPutFile, resp: resp1});
               }
               else{ 
                  workbook.cancel();
                  res.send({msg: "ERROR", err: err1});
               }
            });

         } else {
            let error=global.error(err, 0, req.controller);
            res.send({msg: 'ERROR', err: error});
         }
      });

   });

}

export default policyController
