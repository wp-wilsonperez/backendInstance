
import moment from 'moment';

import Wallet from "../models/wallet";
import WalletPayment from "../models/walletPayment";

import Billing from "../models/billing";
import BillingPolicy from "../models/billingPolicy";

import Policy from "../models/policy";
import Ramo from "../models/ramo";
import Branch from "../models/branch";

import City from "../models/city";

import JSZip from 'jszip';
import Docxtemplater from 'docxtemplater';
import excelbuilder from 'msexcel-builder';
var xlsx = require('xlsx');
import fs from 'fs';
import path from 'path';

const pathRender = `download`;
const pathDownload = `./public/${pathRender}`;

if (!fs.existsSync(pathDownload)){
    fs.mkdirSync(pathDownload);
}

let walletController = function (app, control={auth, passport, acl}){

   function controller (req, res, next) {
      req.controller = "wallet";
      return next();
   }

   function findAction (callback){
      let $filter =  global.filter(null);
      Wallet.find($filter, function (err, docs) {
         if (!err) {

            callback(docs);
         }
      });
   }

   app.post('/wallet/filter',[control.auth, controller], (req, res) => {
      let $filter =  global.filter(req.body.filter);
      Wallet.find($filter, function (err, docs) {
         if (typeof docs !== 'undefined') {
            control.log(req.route.path, req.user);

            res.send({msg: "OK", wallets: docs});
         } else {
            let error=global.error(err, 0, req.controller);
            res.send({msg: 'ERROR', err: error});
         }
      });

   });

   app.get('/wallet/list', [control.auth, controller, control.acl], (req, res) => {
      
      let $conditions = [
         { 
            "condition": "between",
            "field": "expirationDate",
            "values": [
               moment().startOf('month').format('YYYY-MM-DD HH:mm:ss'),
               moment().endOf('month').format('YYYY-MM-DD HH:mm:ss')
            ]
         }
      ]
      let $filter =  global.filter($conditions);

      WalletPayment.find($filter, function (err, docs) {
         if (!err) {
            control.log(req.route.path, req.user);

            Wallet.populate(docs, {path: "wallet"},function(err, docs){
               res.send({msg: "OK", walletPayments: docs});
            });
            
         } else {
            let error=global.error(err, 0, req.controller);
            res.send({msg: 'ERROR', err: error});
         }
      });

   });

   app.get('/wallet/view/:id', [control.auth, controller, control.acl], (req, res) => {

      Wallet.findById(req.params.id, function (err, doc) {
         if (!err) {
            control.log(req.route.path, req.user);
            res.send({msg: "OK", wallet: doc});
         } else {
            let error=global.error(err, 0, req.controller);
            res.send({msg: 'ERROR', err: error});
         }
      });

   });

   app.post('/wallet/add', [control.auth, controller, control.acl], (req, res) => {

      let wallet = new Wallet({
         idBilling: req.body.idBilling,
         DetailsBillingData: req.body.DetailsBillingData,
         expirationDate: req.body.expirationDate,
         paymentValue: req.body.paymentValue,
         detailsWallet: req.body.detailsWallet,
         trackingDate: req.body.trackingDate,
         dateCreate: moment(),
         userCreate: req.user.idUser,
         branchCreate: req.user.idBranch,
         dateUpdate: moment(),
         userUpdate: req.user.idUser
      });

      wallet.save((err, doc) => {
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

   app.post('/wallet/edit/:id', [control.auth, controller, control.acl], (req, res) => {

      let filter = {
         _id: req.params.id
      }

      let update = {
         idBilling: req.body.idBilling,
         DetailsBillingData: req.body.DetailsBillingData,
         expirationDate: req.body.expirationDate,
         paymentValue: req.body.paymentValue,
         detailsWallet: req.body.detailsWallet,
         trackingDate: req.body.trackingDate,
         dateUpdate: moment(),
         userUpdate: req.user.idUser
      };

      Wallet.findOneAndUpdate(filter, update, function (err, doc) {
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

   app.delete('/wallet/delete/:id', [control.auth, controller, control.acl], (req, res) => {

      let filter = {
         _id: req.params.id
      }

      let update = {
         dateDelete: moment()
      };

      Wallet.findOneAndUpdate(filter, update, function (err, doc) {
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

      Wallet.findByIdAndRemove(filter, function (err, doc) {
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


   app.post('/wallet/report', [control.auth, controller, control.acl], (req, res) => {

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
               return res.send({msg: "OK", wallets: docs});
            }

         /*Ramo.populate(docs, {path: "ramo"},function(err, docs){
         City.populate(docs, {path: "city"},function(err, docs){
         Branch.populate(docs, {path: "branchCreate"},function(err, docs){
         PolicyType.populate(docs, {path: "policyType"},function(err, docs){*/

            var file = 'wallet.xlsx';
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

export default walletController
