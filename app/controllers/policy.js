
import mongoose from 'mongoose';
import moment from 'moment';

import Policy from "../models/policy";
import PolicyAnnex from "../models/policyAnnex";
import Insurance from "../models/insurance";
import Ramo from "../models/ramo";
import User from "../models/user";
import Branch from "../models/branch";
import City from "../models/city";
import PolicyType from "../models/policyType";
import PercentageRamo from "../models/percentageRamo";

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
      let $filter =  global.filter(null);
      Policy.find($filter, function (err, docs) {
         if (!err) {
            Insurance.populate(docs, {path: "insurance"},function(err, docs){
               Ramo.populate(docs, {path: "ramo"},function(err, docs){
                  callback(docs)
               });
            });
         }
      });
   }

   app.post('/policy/filter',[control.auth, controller], (req, res) => {
      let $filter =  global.filter(req.body.filter);
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
      let $filter =  global.filter(null);
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
            futureYears: req.body.futureYears,
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
         futureYears: req.body.futureYears,
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

      let update = {
         dateDelete: moment()
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

      /*let filter = {
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
      });*/

   });

   app.post('/policy/report', [control.auth, controller, control.acl], (req, res) => {

      let $filter =  global.filter(req.body.filter);
      let $excel =  req.body.excel;
      Policy.find($filter, function (err, docs) {
         if (typeof docs !== 'undefined') {

         Ramo.populate(docs, {path: "ramo"},function(err, docs){
         City.populate(docs, {path: "city"},function(err, docs){
         Branch.populate(docs, {path: "branchCreate"},function(err, docs){
         PolicyType.populate(docs, {path: "policyType"},function(err, docs){

            if($excel==false){
               return res.send({msg: "OK", policies: docs});
            }

            var file = 'policy.xlsx';
            var outPutFile = moment().format('YYYY-MM-DD-h:mm:ss') + file;
            var pathDownload = __dirname+'/../../public/download/';
            var workbook = excelbuilder.createWorkbook(pathDownload, outPutFile)
            var sheet1 = workbook.createSheet('sheet1', 10, 12);

            var cols = [2,3,4,5,6,7,8,9];
            var rowIni = 2;
            sheet1.set(cols[0], rowIni, 'Agencia');
            sheet1.set(cols[1], rowIni, 'Ciudad');
            sheet1.set(cols[2], rowIni, 'Nombre Cliente');
            sheet1.set(cols[3], rowIni, 'Numero de Poliza');
            sheet1.set(cols[4], rowIni, 'Nombre Ramo');
            sheet1.set(cols[5], rowIni, 'Estado de Poliza');
            sheet1.set(cols[6], rowIni, 'Fecha de Inicio de Vigencia');
            sheet1.set(cols[7], rowIni, 'Fecha de fin de Vigencia');

            console.log(docs);
            let $length = docs.length;
            for (var i = 0; i < $length; i++) {
               rowIni++;
               let $cliente = '';
                  if(docs[i].typeRecipient == 'CLIENTE'){
                     $cliente = docs[i].recipient.name+' '+docs[i].recipient.lastName
                  }
               sheet1.set(cols[0], rowIni, docs[i].branchCreate.name);
               sheet1.set(cols[1], rowIni, docs[i].city.name);
               sheet1.set(cols[2], rowIni, $cliente);
               sheet1.set(cols[3], rowIni, docs[i].policyNumber);
               sheet1.set(cols[4], rowIni, docs[i].ramo.name);
               sheet1.set(cols[5], rowIni, docs[i].policyType.name);
               sheet1.set(cols[6], rowIni, docs[i].startDate);
               sheet1.set(cols[7], rowIni, docs[i].finishDate);
            }

            workbook.save(function(err1, resp1){
               if (!err1){
                  console.log('congratulations, your workbook created');
                  res.send({msg: "OK", doc_name: outPutFile});
               }
               else{ 
                  workbook.cancel();
                  res.send({msg: "ERROR", err: err1});
               }
            });

         });
         });
         });
         });

         } else {
            let error=global.error(err, 0, req.controller);
            res.send({msg: 'ERROR', err: error});
         }
      });

   });

   app.post('/policy/reportsupercompany', [control.auth, controller, control.acl], (req, res) => {

      let $filter =  global.filter(req.body.filter);
      let $excel =  req.body.excel;
      let $sort =  {"sort": {"idInsurance": 1, "idRamo": 1}};
      Policy.find($filter, null, $sort, function (err, docs) {
         if (typeof docs !== 'undefined') {

         Insurance.populate(docs, {path: "insurance"},function(err, docs){
         Ramo.populate(docs, {path: "ramo"}, async function(err, docs){

            if($excel==false){
               return res.send({msg: "OK", policies: docs});
            }

            var file = 'supercompany.xlsx';
            var outPutFile = moment().format('YYYY-MM-DD-h.mm.ss') + file;
            var pathDownload = __dirname+'/../../public/download/';
            var workbook = excelbuilder.createWorkbook(pathDownload, outPutFile)
            var sheet1 = workbook.createSheet('sheet1', 10, 12);

            var cols = [2,3,4,5,6,7,8,9];
            var rowIni = 2;
            sheet1.set(cols[0], rowIni, 'Nombre Aseguradora');
            sheet1.set(cols[1], rowIni, 'Ramo');
            sheet1.set(cols[2], rowIni, 'Valor Prima');
            sheet1.set(cols[3], rowIni, 'Valor Comisión');

            //console.log(docs);
            let $length = docs.length;
            let totalPrima=0;
            let comision=0;
            let valorComision=0;

            let totalPrimaResume=0;
            let valorComisionResume=0;

            let idInsurance="";
            let idRamo="";
            if($length>0){
               idInsurance= docs[0].idInsurance;
               idRamo= docs[0].idRamo;
            }

            let insurancename="",ramoName="";

            for (var i = 0; i < $length; i++) {
               if(idRamo != docs[i].idRamo){
                  idRamo= docs[i].idRamo;
                  
                  rowIni++;
                  sheet1.set(cols[0], rowIni, insurancename);
                  sheet1.set(cols[1], rowIni, ramoName);
                  sheet1.set(cols[2], rowIni, totalPrima.toFixed(2));
                  sheet1.set(cols[3], rowIni, valorComision.toFixed(2));
               }
               if(idInsurance != docs[i].idInsurance){
                  totalPrima=0;
                  comision=0;
                  valorComision=0;
                  idInsurance= docs[i].idInsurance;

                  rowIni++;
                  sheet1.merge({col:cols[0],row:rowIni},{col:cols[3],row:rowIni});
                  sheet1.align(cols[0], rowIni, 'center');
                  sheet1.set(cols[0], rowIni, 'TODOS LOS RAMOS DEL SISTEMA');
                  rowIni++;
                  sheet1.font(cols[1], rowIni, {bold:'true', color: '#DF0101'});
                  sheet1.set(cols[1], rowIni, 'Total');
                  sheet1.font(cols[2], rowIni, {bold:'true', color: '#DF0101'});
                  sheet1.set(cols[2], rowIni, totalPrimaResume.toFixed(2));
                  sheet1.font(cols[3], rowIni, {bold:'true', color: '#DF0101'});
                  sheet1.set(cols[3], rowIni, valorComisionResume.toFixed(2));

                  totalPrimaResume=0;
                  valorComisionResume=0;
               }
               $filter =  {"idPolicy": docs[i]._id};
               let policyAnnex = await PolicyAnnex.find($filter);
               $filter =  {"idRamo": docs[i].idRamo, "idInsurance": docs[i].idInsurance};
               let percentageRamo = await PercentageRamo.findOne($filter);
               console.log(policyAnnex);
               console.log(percentageRamo);
               
               if(percentageRamo){ comision = parseFloat(percentageRamo.value)}
               let $lengthAnnex = policyAnnex.length;
               for (var j = 0; j < $lengthAnnex; j++) {
                  totalPrima+=parseFloat(policyAnnex[j].totalPrima);
               }
               //valorComision= Math.round( ((totalPrima*comision)/100) , 2);
               valorComision = Number(Math.round(((totalPrima*comision)/100)+'e2')+'e-2');
               console.log(totalPrima);
               console.log(comision);
               console.log(valorComision);
               totalPrimaResume+=totalPrima;
               valorComisionResume+=valorComision;
               insurancename=docs[i].insurance.bussinesName;
               ramoName=docs[i].ramo.name;

            }

            if($length>0){

               rowIni++;
                  sheet1.set(cols[0], rowIni, insurancename);
                  sheet1.set(cols[1], rowIni, ramoName);
                  sheet1.set(cols[2], rowIni, totalPrima.toFixed(2));
                  sheet1.set(cols[3], rowIni, valorComision.toFixed(2));

               /*rowIni++;
               sheet1.merge({col:cols[0],row:rowIni},{col:cols[3],row:rowIni});
               sheet1.align(cols[0], rowIni, 'center');
               sheet1.set(cols[0], rowIni, 'TODOS LOS RAMOS DEL SISTEMA');*/
               rowIni++;
               sheet1.font(cols[1], rowIni, {bold:'true', color: '#DF0101'});
               sheet1.set(cols[1], rowIni, 'Total');
               sheet1.font(cols[2], rowIni, {bold:'true', color: '#DF0101'});
               sheet1.set(cols[2], rowIni, totalPrimaResume.toFixed(2));
               sheet1.font(cols[3], rowIni, {bold:'true', color: '#DF0101'});
               sheet1.set(cols[3], rowIni, valorComisionResume.toFixed(2));
            }

            workbook.save(function(err1, resp1){
               if (!err1){
                  console.log('congratulations, your workbook created');
                  res.send({msg: "OK", doc_name: outPutFile});
               }
               else{ 
                  workbook.cancel();
                  res.send({msg: "ERROR", err: err1});
               }
            });

         });
         });

         } else {
            let error=global.error(err, 0, req.controller);
            res.send({msg: 'ERROR', err: error});
         }
      });

   });

}

export default policyController
