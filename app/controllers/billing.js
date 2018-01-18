
import moment from 'moment';

import Billing from "../models/billing";
import BillingPolicy from "../models/billingPolicy";
import Wallet from "../models/wallet";
import WalletPayment from "../models/walletPayment";

import Client from "../models/client";
import Business from "../models/business";
import Insurance from "../models/insurance";

import JSZip from 'jszip';
import Docxtemplater from 'docxtemplater';
var xlsx = require('xlsx');
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
      Billing.find({}, function (err, docs) {
         if (!err) {
            callback(docs);
         }
      });
   }

   app.get('/billing/filter',[control.auth, controller], (req, res) => {
      let $filter =  global.filter(req.query.filter);
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

      let typeList = app.locals.typeList;
      let filter = {};
      if(typeList=="99097f2c1f"){
         filter = {"userCreate": req.user.idUser};
      } else if(typeList=="99097f2c1c"){
         filter = {"branchCreate": req.user.idBranch};
      } else {
         filter = {};
      }

      Billing.find(filter, function (err, docs) {
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
                     $billingPolicy[index]["dateCreate"] = $moment;
                     $billingPolicy[index]["userCreate"] = req.user.idUser;
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
                           for(let i = 0; i < $billinData.equalPayments; i++){
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
                              $walletPayment.push(obj);
                              $expirationDate = moment($expirationDate).add(1, 'month');
                           }
                           WalletPayment.insertMany($walletPayment, (err, docsWalletPayment) => { });
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
<<<<<<< HEAD
               if (!err) {
=======

               if (!err2) {
>>>>>>> c3c4acf7f496e6b6098020f53a9dd1de7fcce04b
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
      });

   });

   app.post('/billing/report', [controller], (req, res) => {


      let data = {
         date : "Cuenca, 04 de Octubre del 2017",
         letter_number : "756",
         client_name : "JUAN PEREZ",
         insurence_name : "VAZSEGUROS",
         policy_name : "POLIZA DE VEHICULOS",
         policy_placa : "VH-43500",
         policy_anexo : "02",
         policy_number : "43500",
         ramo_name : "Vehiculo",
         ramo_detail : "TOYOTA COROLLA/PLATA",
         billing_number : "25023",
         billing_value : "467.04",
         credit_number : "20550",
         credit_value : "Vehiculo",
         user_name : "Ing. Diana Moncayo V.",
         user_role : "Jefe Dpto. de Emision"
      };

      var pathXlsx = path.resolve(__dirname+'/../letters', 'LiquidacionSiniestroAMV.xlsx');
      var workbook = xlsx.readFile(pathXlsx);

      //xlsx.writeFile(workbook, 'out.xlsb');
      var outPutFile = moment().format('YYYY-MM-DD-h:mm:ss') + 'LiquidacionSiniestroAMV.xlsx';
      var pathCake = __dirname+'/../../public/download/'+outPutFile;
      xlsx.writeFileAsync(pathCake, workbook, (err) => {
        if (err) throw err;
        res.send({"status": "ok", "doc_name": outPutFile});

      });

   });

}

export default billingController
