
import moment from 'moment';

import Billing from "../models/billing";
import BillingPolicy from "../models/billingPolicy";
import Wallet from "../models/wallet";
import WalletPayment from "../models/walletPayment";

import Policy from "../models/policy";
import Ramo from "../models/ramo";
import Branch from "../models/branch";

import Client from "../models/client";
import Business from "../models/business";
import Insurance from "../models/insurance";

import City from "../models/city";

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

let billingController = function (app, control={auth, passport, acl}){

   function controller (req, res, next) {
      req.controller = "billing";
      return next();
   }

   function findAction (callback){
      let $filter =  global.filter(null);
      Billing.find($filter, function (err, docs) {
         if (!err) {
            callback(docs);
         }
      });
   }

   app.post('/billing/filter',[control.auth, controller], (req, res) => {
      let $filter =  global.filter(req.body.filter);
      Billing.find($filter, function (err, docs) {
         if (typeof docs !== 'undefined') {
            control.log(req.route.path, req.user);

            res.send({msg: "OK", billings: docs});
            
         } else {
            let error=global.error(err, 0, req.controller);
            res.send({msg: 'ERROR', err: error});
         }
      });

   });

   app.get('/billing/list', [control.auth, controller, control.acl], (req, res) => {
      let $filter =  global.filter(null);
      Billing.find($filter, function (err, docs) {
         if (typeof docs !== 'undefined') {
            control.log(req.route.path, req.user);

            res.send({msg: "OK", billings: docs});
            
         } else {
            let error=global.error(err, 0, req.controller);
            res.send({msg: 'ERROR', err: error});
         }
      });

   });

   app.get('/billing/view/:id', [control.auth, controller, control.acl], (req, res) => {

      Billing.findById(req.params.id, function (err, doc) {
         if (!err) {
            control.log(req.route.path, req.user);
            res.send({msg: "OK", billing: doc});
         } else {
            let error=global.error(err, 0, req.controller);
            res.send({msg: 'ERROR', err: error});
         }
      });

   });

   app.post('/billing/add', [control.auth, controller, control.acl], (req, res) => {
      let $data = req.body.billing;
      let $billinData = $data;
      let $billingPolicy = $data.items;
      let $moment = moment();
      delete($billinData.items);
      $billinData["dateCreate"] = $moment;
      $billinData["userCreate"] = req.user.idUser;
      $billinData["branchCreate"] = req.user.idBranch;
      $billinData["dateUpdate"] = $moment;
      $billinData["userUpdate"] = req.user.idUser;
      

      let ClientBilling;
      if($data.typeBilling=='99097f2c1f'){
         ClientBilling = Client;
      }
      else if($data.typeBilling=='99097f2c1c'){
         ClientBilling = Business;
      }
      else if($data.typeBilling=='99097f2c1d'){
         ClientBilling = Insurance;
      }
      ClientBilling.findById($data.idDetailsClientBilling, function (err, doc) {
         if (!err) {
            //control.log(req.route.path, req.user);
            //res.send({msg: "OK", billing: doc});
            $billinData["detailsClientBilling"] = doc;
            let billing = new Billing($billinData);
            billing.save((err, doc) => {
               if(!err){
                  control.log(req.route.path, req.user);
                  $billingPolicy.forEach(function (item, index) {
                     $billingPolicy[index]["idBilling"]=doc._id;
                     $billingPolicy[index]["billing"]=doc._id;
                     $billingPolicy[index]["policy"]=$billingPolicy[index]["idPolicy"];
                     $billingPolicy[index]["dateCreate"] = $moment;
                     $billingPolicy[index]["userCreate"] = req.user.idUser;
                     $billingPolicy[index]["branchCreate"] = req.user.idBranch;
                     $billingPolicy[index]["dateUpdate"] = $moment;
                     $billingPolicy[index]["userUpdate"] = req.user.idUser;
                  })
                  BillingPolicy.insertMany($billingPolicy, (err, docs) => {
                     if(!err){
                        let wallet = new Wallet({
                           idBilling: doc._id,
                           DetailsBillingData: doc,
                           expirationDate: $billinData.firstPaymentDate,
                           paymentValue: $billinData.valueEqualPayments,
                           detailsWallet: "",
                           dateCreate: $moment,
                           userCreate: req.user.idUser,
                           dateUpdate: $moment,
                           userUpdate: req.user.idUser
                        });
                        wallet.save((err, docWallet) => {
                           let $walletPayment =[];
                           let $expirationDate = $billinData.firstPaymentDate;
                           let $paymentValue = $billinData.valueEqualPayments;
                           let $total = parseInt($billinData.equalPayments);
                           for(let i = 0; i < $total; i++){
                              let obj= {
                                  idWallet:docWallet._id,
                                  wallet:docWallet._id,
                                  expirationDate:$expirationDate,
                                  paymentValue: $paymentValue,
                                  arrayWalletPayment: [],
                                  dateCreate:$moment,
                                  userCreate: req.user.idUser,
                                  dateUpdate:$moment,
                                  userUpdate:req.user.idUser
                              }
                              $walletPayment[i] = obj;
                              
                              $expirationDate = moment($expirationDate).add(1, 'month').format('YYYY-MM-DD');

                              let walletPayment = new WalletPayment(obj);
                              walletPayment.save((err, docWalletPayment) => {
                              });

                           }
                           //WalletPayment.insertMany($walletPayment, (err, docsWalletPayment) => { });
                        });
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
            let error=global.error(err, 0, req.controller);
            res.send({msg: 'ERROR', err: error});
         }
      });



   });

   app.post('/billing/edit/:id', [control.auth, controller, control.acl], (req, res) => {

      let filter = {
         _id: req.params.id
      }

      let $data = req.body.billing;
      let $billinData = $data;
      let $billingPolicy = $data.items;
      let $moment = moment();
      delete($billinData.items);
      $billinData["dateUpdate"] = $moment;
      $billinData["userUpdate"] = req.user.idUser;
      let billing = new Billing($billinData);
      let update = $billinData;

      Billing.findOneAndUpdate(filter, update, function (err1, doc) {
         if (!err1) {
            //res.send({msg: "OK", update: docs});
            filter = {
               idBilling: req.params.id
            }
            BillingPolicy.remove(filter, function(err2, response) {

               if (!err2) {
                  $billingPolicy.forEach(function (item, index) {
                     $billingPolicy[index]["idBilling"]=doc._id;
                     $billingPolicy[index]["billing"]=doc._id;
                     $billingPolicy[index]["dateCreate"] = $moment;
                     $billingPolicy[index]["userCreate"] = req.user.idUser;
                     $billingPolicy[index]["dateUpdate"] = $moment;
                     $billingPolicy[index]["userUpdate"] = req.user.idUser;
                  })
                  BillingPolicy.insertMany($billingPolicy, (err3, docs) => {
                     if(!err3){
                        findAction(function(docs){
                           res.send({msg: "OK", update: docs});
                        });
                     } else {
                        let error=global.error(err3, 0, req.controller);
                        res.send({msg: 'ERROR', err: error});
                     }
                  });

               } else {
                  let error=global.error(err2, 0, req.controller);
                  res.send({msg: 'ERROR', err: error});
               }
            });
            
         } else {
            let error=global.error(err1, 0, req.controller);
            res.send({msg: 'ERROR', err: error});
         }
      });

   });

   app.delete('/billing/delete/:id', [control.auth, controller, control.acl], (req, res) => {

      let filter = {
         _id: req.params.id
      }

      let update = {
         dateDelete: moment()
      };

      Billing.findOneAndUpdate(filter, update, function (err, doc) {
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

      Billing.findByIdAndRemove(filter, function (err, doc) {
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

   app.post('/billing/report', [control.auth, controller, control.acl], (req, res) => {

      let $filter =  global.filter(req.body.filter);
      let $excel =  req.body.excel;

      BillingPolicy.find($filter, function (err, docs) {

      Billing.populate(docs, {path: "billing"}, function(err, docs){
      Policy.populate(docs, {path: "policy"}, function(err, docs){
      Branch.populate(docs, {path: "branchCreate"}, function(err, docs){
      Ramo.populate(docs, {path: "policy.ramo"}, function(err, docs){
      City.populate(docs, {path: "billing.detailsClientBilling.city"},function(err, docs){
      //Billing.find($filter, function (err, docs) {

      //City.populate(docs, {path: "detailsClientBilling.city"},function(err, docs){

         if (typeof docs !== 'undefined') {

            if($excel==false){
               return res.send({msg: "OK", billings: docs});
            }

         /*Ramo.populate(docs, {path: "ramo"},function(err, docs){
         City.populate(docs, {path: "city"},function(err, docs){
         Branch.populate(docs, {path: "branchCreate"},function(err, docs){
         PolicyType.populate(docs, {path: "policyType"},function(err, docs){*/

            var file = 'billing.xlsx';
            var outPutFile = moment().format('YYYY-MM-DD-h:mm:ss') + file;
            var pathDownload = __dirname+'/../../public/download/';
            var workbook = excelbuilder.createWorkbook(pathDownload, outPutFile)
            var sheet1 = workbook.createSheet('sheet1', 10, 12);

            var cols = [2,3,4,5,6,7,8,9];
            var rowIni = 2;
            sheet1.set(cols[0], rowIni, 'Agencia');
            sheet1.set(cols[1], rowIni, 'Ciudad');
            sheet1.set(cols[2], rowIni, 'Nombre Cliente');
            sheet1.set(cols[3], rowIni, 'Numero de Factura');
            sheet1.set(cols[4], rowIni, 'Nombre Ramo');
            sheet1.set(cols[5], rowIni, 'Fecha de Inicio de Vigencia');
            sheet1.set(cols[6], rowIni, 'Fecha de fin de Vigencia');
            sheet1.set(cols[7], rowIni, 'Fecha de Factura');

            console.log(docs);
            let $length = docs.length;
            for (var i = 0; i < $length; i++) {
               rowIni++;
               let $cliente = '';
                  if(docs[i].policy.typeRecipient == 'CLIENTE'){
                     $cliente = docs[i].policy.recipient.name+' '+docs[i].policy.recipient.lastName
                  }
               sheet1.set(cols[0], rowIni, docs[i].branchCreate.name);
               sheet1.set(cols[1], rowIni, docs[i].billing.detailsClientBilling.city.name);
               sheet1.set(cols[2], rowIni, $cliente);
               sheet1.set(cols[3], rowIni, docs[i].policy.policyNumber);
               sheet1.set(cols[4], rowIni, docs[i].policy.ramo.name);
               sheet1.set(cols[5], rowIni, moment(docs[i].policy.startDate).format('YYYY-MM-DD'));
               sheet1.set(cols[6], rowIni, moment(docs[i].policy.finishDate).format('YYYY-MM-DD'));
               sheet1.set(cols[7], rowIni, moment(docs[i].billing.billingDate).format('YYYY-MM-DD'));
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

         /*});
         });
         });
         });*/

         } else {
            let error=global.error(err, 0, req.controller);
            res.send({msg: 'ERROR', err: error});
         }

      });
      });
      });
      });
      });

      });

   });

}

export default billingController
