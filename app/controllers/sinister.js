
import moment from 'moment';

import Sinister from "../models/sinister";
import SinisterGeneral from "../models/sinisterGeneral";
import SinisterGeneralDocumentation from "../models/sinisterGeneralDocumentation";
import SinisterCar from "../models/sinisterCar";

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

import helper from "../configs/helper.json";

const pathRender = `download`;
const pathDownload = `./public/${pathRender}`;

if (!fs.existsSync(pathDownload)){
    fs.mkdirSync(pathDownload);
}

let sinisterController = function (app, control={auth, passport, acl}){

   function controller (req, res, next) {
      req.controller = "sinister";
      return next();
   }

   function findAction (callback){
      let $filter =  global.filter(null);
      Sinister.find($filter, function (err, docs) {
         if (!err) {
            
            Ramo.populate(docs, {path: "ramo"},function(err, docs){
               callback(docs);
            });
         }
      });
   }

   app.post('/sinister/filter',[control.auth, controller], (req, res) => {
      let $filter =  global.filter(req.body.filter);
      Sinister.find($filter, function (err, docs) {
         if (typeof docs !== 'undefined') {
            control.log(req.route.path, req.user);

            Ramo.populate(docs, {path: "ramo"},function(err, docs){
               res.send({msg: "OK", sinisters: docs});
            });
            
         } else {
            let error=global.error(err, 0, req.controller);
            res.send({msg: 'ERROR', err: error});
         }
      });

   });

   app.get('/sinister/list', (req, res) => {
      let $filter =  global.filter(null);
      Sinister.find($filter, function (err, docs) {
         if (typeof docs !== 'undefined') {
            control.log(req.route.path, req.user);
            Ramo.populate(docs, {path: "ramo"},function(err, docs){
               res.send({msg: "OK", sinisters: docs});
            });
            
         } else {
            let error=global.error(err, 0, req.controller);
            res.send({msg: 'ERROR', err: error});
         }
      });

   });

   app.get('/sinister/view/:id', [control.auth, controller, control.acl], (req, res) => {

      Sinister.findById(req.params.id, function (err, doc) {
         if (!err) {
            control.log(req.route.path, req.user);
            res.send({msg: "OK", sinister: doc});
         } else {
            let error=global.error(err, 0, req.controller);
            res.send({msg: 'ERROR', err: error});
         }
      });

   });

   app.post('/sinister/add', [control.auth, controller, control.acl], (req, res) => {

      let $data = req.body.sinister;
      console.log($data);
      //return res.send($data);
      let $sinisterData = $data;
      $sinisterData.ramo = $sinisterData.idRamo;
      let $sinisterGeneral = $data.item;
      let $sinisterGeneralDocumentation = $data.item.items;
      let $moment = moment();
      /*delete($sinisterData.item);
      delete($sinisterGeneralDocumentation.items);*/
      $sinisterData["dateCreate"] = $moment;
      $sinisterData["userCreate"] = req.user.idUser;
      $sinisterData["branchCreate"] = req.user.idBranch;
      $sinisterData["dateUpdate"] = $moment;
      $sinisterData["userUpdate"] = req.user.idUser;
      let sinister = new Sinister($sinisterData);

      sinister.save((err, doc) => {
         if(!err){
            control.log(req.route.path, req.user);
            /*$sinisterGeneral["idSinister"] = doc._id;
            $sinisterGeneral["sinister"] = doc._id;
            $sinisterGeneral["dateCreate"] = $moment;
            $sinisterGeneral["userCreate"] = req.user.idUser;
            $sinisterGeneral["dateUpdate"] = $moment;
            $sinisterGeneral["userUpdate"] = req.user.idUser;
            let sinisterGeneral = new SinisterGeneral($sinisterGeneral);
            sinisterGeneral.save((err, doc) => {
               if(!err){
                  $sinisterGeneralDocumentation.forEach(function (item, index) {
                     $sinisterGeneralDocumentation[index]["idSinisterGeneral"]=doc._id;
                     $sinisterGeneralDocumentation[index]["sinisterGeneral"]=doc._id;
                     $sinisterGeneralDocumentation[index]["dateCreate"] = $moment;
                     $sinisterGeneralDocumentation[index]["userCreate"] = req.user.idUser;
                     $sinisterGeneralDocumentation[index]["dateUpdate"] = $moment;
                     $sinisterGeneralDocumentation[index]["userUpdate"] = req.user.idUser;
                  })
                  //let sinisterGeneralDocumentation = new SinisterGeneralDocumentation();
                  SinisterGeneralDocumentation.insertMany($sinisterGeneralDocumentation, (err, docs) => {
                  });
               }
            });*/
            findAction(function(docs){
               console.log("OK");
               res.send({msg: "OK", update: docs});
            });
         } else {
            console.log("ERROR");
            console.log(err);
            let error=global.error(err, 0, req.controller);
            res.send({msg: 'ERROR', err: error});
         }            
      });

   });

   app.post('/sinister/edit/:id', [control.auth, controller, control.acl], (req, res) => {

      let filter = {
         _id: req.params.id
      }
      let $data = req.body.sinister;
      let update = $data;

      Sinister.findOneAndUpdate(filter, update, function (err, doc) {
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

   app.delete('/sinister/delete/:id', [control.auth, controller, control.acl], (req, res) => {

      let filter = {
         _id: req.params.id
      }

      let update = {
         dateDelete: moment()
      };

      Sinister.findOneAndUpdate(filter, update, function (err, doc) {
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

      Sinister.findByIdAndRemove(filter, function (err, doc) {
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

   app.post('/sinister/report', [control.auth, controller, control.acl], (req, res) => {

      let $filter =  global.filter(req.body.filter);
      let $excel =  req.body.excel;

      Sinister.find($filter, function (err, docs) {

      Branch.populate(docs, {path: "branchCreate"}, function(err, docs){
      City.populate(docs, {path: "policyData.recipient.city"},function(err, docs){
      //Billing.find($filter, function (err, docs) {

      //City.populate(docs, {path: "detailsClientBilling.city"},function(err, docs){

         if (typeof docs !== 'undefined') {

            if($excel==false){
               return res.send({msg: "OK", sinisters: docs});
            }

         /*Ramo.populate(docs, {path: "ramo"},function(err, docs){
         City.populate(docs, {path: "city"},function(err, docs){
         Branch.populate(docs, {path: "branchCreate"},function(err, docs){
         PolicyType.populate(docs, {path: "policyType"},function(err, docs){*/

            var file = 'sinister.xlsx';
            var outPutFile = moment().format('YYYY-MM-DD-h:mm:ss') + file;
            var pathDownload = __dirname+'/../../public/download/';
            var workbook = excelbuilder.createWorkbook(pathDownload, outPutFile)
            var sheet1 = workbook.createSheet('sheet1', 12, 15);

            var cols = [2,3,4,5,6,7,8,9,10,11,12];
            var rowIni = 2;
            sheet1.set(cols[0], rowIni, 'Agencia');
            sheet1.set(cols[1], rowIni, 'Ciudad');
            sheet1.set(cols[2], rowIni, 'Nombre Cliente');
            sheet1.set(cols[3], rowIni, 'Numero de Factura');
            //sheet1.set(cols[4], rowIni, 'Numero de Siniestro');
            sheet1.set(cols[4], rowIni, 'Estado de Siniestro');
            sheet1.set(cols[5], rowIni, 'Nombre Ramo');
            sheet1.set(cols[6], rowIni, 'Fecha de Inicio de Vigencia');
            sheet1.set(cols[7], rowIni, 'Fecha de fin de Vigencia');
            sheet1.set(cols[8], rowIni, 'Fecha de Siniestro');
            sheet1.set(cols[9], rowIni, 'Fecha de Notificaión');

            console.log(docs);
            let $length = docs.length;
            for (var i = 0; i < $length; i++) {
               rowIni++;
               let $cliente = '';
                  if(docs[i].policyData.typeRecipient == 'CLIENTE'){
                     $cliente = docs[i].policyData.recipient.name+' '+docs[i].policyData.recipient.lastName
                  }
               sheet1.set(cols[0], rowIni, docs[i].branchCreate.name);
               sheet1.set(cols[1], rowIni, docs[i].policyData.recipient.city.name);
               sheet1.set(cols[2], rowIni, $cliente);
               sheet1.set(cols[3], rowIni, docs[i].policyData.policyNumber);
               //sheet1.set(cols[4], rowIni, docs[i].policy.sinisterNumber);
               sheet1.set(cols[4], rowIni, helper.sinisterState.one[docs[i].sinisterState]);
               sheet1.set(cols[5], rowIni, docs[i].policyData.ramo.name);
               sheet1.set(cols[6], rowIni, moment(docs[i].policyData.startDate).format('YYYY-MM-DD'));
               sheet1.set(cols[7], rowIni, moment(docs[i].policyData.finishDate).format('YYYY-MM-DD'));
               sheet1.set(cols[8], rowIni, moment(docs[i].dateSinister).format('YYYY-MM-DD'));
               sheet1.set(cols[9], rowIni, moment(docs[i].dateNotification).format('YYYY-MM-DD'));
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

}

export default sinisterController
