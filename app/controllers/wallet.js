
import moment from 'moment';

import Wallet from "../models/wallet";

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

let walletController = function (app, control={auth, passport, acl}){

   function controller (req, res, next) {
      req.controller = "wallet";
      return next();
   }

   function findAction (callback){
      Wallet.find({}, function (err, docs) {
         if (!err) {

            callback(docs);
         }
      });
   }

   app.get('/wallet/filter',[control.auth, controller], (req, res) => {
      let $filter =  global.filter(req.query.filter);
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

      let typeList = app.locals.typeList;
      let filter = {};
      if(typeList=="99097f2c1f"){
         filter = {"userCreate": req.user.idUser};
      } else if(typeList=="99097f2c1c"){
         filter = {"branchCreate": req.user.idBranch};
      } else {
         filter = {};
      }

      Wallet.find(filter, function (err, docs) {
         if (typeof docs !== 'undefined') {
            control.log(req.route.path, req.user);

            res.send({msg: "OK", wallets: docs});
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
      });

   });

   app.post('/wallet/report', [controller], (req, res) => {


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

export default walletController
