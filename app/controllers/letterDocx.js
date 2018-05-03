
import JSZip from 'jszip';
import Docxtemplater from 'docxtemplater';
var xlsx = require('xlsx');
import fs from 'fs';
import path from 'path';
import moment from 'moment';

import CreditNote from "../models/creditNote";

import Sinister from "../models/sinister";
import Ramo from "../models/ramo";
import User from "../models/user";
import Role from "../models/role";

const pathRender = `download`;
const pathDownload = `./public/${pathRender}`;

if (!fs.existsSync(pathDownload)){
    fs.mkdirSync(pathDownload);
}

let letterDocxController = function (app, control={auth, passport}){

   function controller (req, res, next) {
      req.controller = "letterDocx";
      return next();
   }


   app.get('/letterDocx/expirationDate/:idExpirationDate', [control.auth, controller], (req, res) => {

      /*CreditNote.findById(req.params.id, function (err, doc) {
         if (!err) {
            res.send({msg: "OK", creditNote: doc});
         } else {
            res.send({msg: 'ERR', err: err});
         }
      });*/
      console.log(__dirname);
      console.log("*******************************************");

      let $data = req.query;
       //Load the docx file as a binary
      let content = fs.readFileSync(path.resolve(__dirname+'/../letters', 'Renovacion.docx'), 'binary');
      let zip = new JSZip(content);
      let doc = new Docxtemplater();
      doc.loadZip(zip);

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

      doc.setData(data);

      try {
          // render the document (replace all occurences of {first_name} by John, {last_name} by Doe, ...)
          doc.render()
      }
      catch (error) {
          var e = {
              message: error.message,
              name: error.name,
              stack: error.stack,
              properties: error.properties,
          }
          console.log(JSON.stringify({error: e}));
          // The error thrown here contains additional information when logged with JSON.stringify (it contains a property object).
          throw error;
      }

      var buf = doc.getZip().generate({type: 'nodebuffer'});

      // buf is a nodejs buffer, you can either write it to a file or do anything else with it.
      var pathCake = __dirname+'/../../public/download';
      console.log(pathCake);
      //fs.writeFileSync(path.resolve(pathCake, 'output.docx'), buf);
      var outPutFile = moment().format('YYYY-MM-DD-h:mm:ss') + 'Renovacion.docx';
      fs.writeFile(path.resolve(pathCake, outPutFile), buf, function (err) {
          if (err) throw err;
          console.log('It\'s saved!');
          //res.setHeader('Access-Control-Allow-Headers', 'X-DEBUGKIT-ID');
          res.send({"status": "ok", "doc_name": outPutFile});
      });

   });

   app.get('/letterDocx/creditNote/:idCreditNote', [control.auth, controller], (req, res) => {

      /*CreditNote.findById(req.params.id, function (err, doc) {
         if (!err) {
            res.send({msg: "OK", creditNote: doc});
         } else {
            res.send({msg: 'ERR', err: err});
         }
      });*/
      console.log(__dirname);
      console.log("*******************************************");

      let $data = req.query;
       //Load the docx file as a binary
      let content = fs.readFileSync(path.resolve(__dirname+'/../letters', 'Cancelacion.docx'), 'binary');
      let zip = new JSZip(content);
      let doc = new Docxtemplater();
      doc.loadZip(zip);

      let data = {
         date : "Cuenca, 04 de Octubre del 2017",
         letter_number : "756",
         client_name : "JUAN PEREZ",
         insurence_name : "VAZSEGUROS",
         policy_placa : "43500",
         policy_anexo : "02",
         policy_number : "43500",
         ramo_name : "Vehiculo",
         ramo_detail : "Chevrolet Spark/Negro",
         credit_number : "20550",
         credit_value : "Vehiculo",
         user_name : "Ing. Diana Moncayo V.",
         user_role : "Jefe Dpto. de Emision"
      };

      doc.setData(data);

      try {
          // render the document (replace all occurences of {first_name} by John, {last_name} by Doe, ...)
          doc.render()
      }
      catch (error) {
          var e = {
              message: error.message,
              name: error.name,
              stack: error.stack,
              properties: error.properties,
          }
          console.log(JSON.stringify({error: e}));
          // The error thrown here contains additional information when logged with JSON.stringify (it contains a property object).
          throw error;
      }

      var buf = doc.getZip().generate({type: 'nodebuffer'});

      // buf is a nodejs buffer, you can either write it to a file or do anything else with it.
      var pathCake = __dirname+'/../../public/download';
      console.log(pathCake);
      //fs.writeFileSync(path.resolve(pathCake, 'output.docx'), buf);
      var outPutFile = moment().format('YYYY-MM-DD-h:mm:ss') + 'Cancelacion.docx';
      fs.writeFile(path.resolve(pathCake, outPutFile), buf, function (err) {
          if (err) throw err;
          console.log('It\'s saved!');
          //res.setHeader('Access-Control-Allow-Headers', 'X-DEBUGKIT-ID');
          res.send({"status": "ok", "doc_name": outPutFile});
      });

   });

   app.get('/letterDocx/letterInsuranceProgram/:idBilling', [control.auth, controller], (req, res) => {

      /*CreditNote.findById(req.params.id, function (err, doc) {
         if (!err) {
            res.send({msg: "OK", creditNote: doc});
         } else {
            res.send({msg: 'ERR', err: err});
         }
      });*/
      console.log(__dirname);
      console.log("*******************************************");

      let $data = req.query;
       //Load the docx file as a binary
      let content = fs.readFileSync(path.resolve(__dirname+'/../letters', 'Programa.docx'), 'binary');
      let zip = new JSZip(content);
      let doc = new Docxtemplater();
      doc.loadZip(zip);

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

      doc.setData(data);

      try {
          // render the document (replace all occurences of {first_name} by John, {last_name} by Doe, ...)
          doc.render()
      }
      catch (error) {
          var e = {
              message: error.message,
              name: error.name,
              stack: error.stack,
              properties: error.properties,
          }
          console.log(JSON.stringify({error: e}));
          // The error thrown here contains additional information when logged with JSON.stringify (it contains a property object).
          throw error;
      }

      var buf = doc.getZip().generate({type: 'nodebuffer'});

      // buf is a nodejs buffer, you can either write it to a file or do anything else with it.
      var pathCake = __dirname+'/../../public/download';
      console.log(pathCake);
      //fs.writeFileSync(path.resolve(pathCake, 'output.docx'), buf);
      var outPutFile = moment().format('YYYY-MM-DD-h:mm:ss') + 'Programa.docx';
      fs.writeFile(path.resolve(pathCake, outPutFile), buf, function (err) {
          if (err) throw err;
          console.log('It\'s saved!');
          //res.setHeader('Access-Control-Allow-Headers', 'X-DEBUGKIT-ID');
          res.send({"status": "ok", "doc_name": outPutFile});
      });

   });

   app.get('/letterDocx/expirationNotice/:idPolicy', [control.auth, controller], (req, res) => {

      /*CreditNote.findById(req.params.id, function (err, doc) {
         if (!err) {
            res.send({msg: "OK", creditNote: doc});
         } else {
            res.send({msg: 'ERR', err: err});
         }
      });*/
      console.log(__dirname);
      console.log("*******************************************");

      let $data = req.query;
       //Load the docx file as a binary
      let content = fs.readFileSync(path.resolve(__dirname+'/../letters', 'AvisoVencimiento.docx'), 'binary');
      let zip = new JSZip(content);
      let doc = new Docxtemplater();
      doc.loadZip(zip);

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

      doc.setData(data);

      try {
          // render the document (replace all occurences of {first_name} by John, {last_name} by Doe, ...)
          doc.render()
      }
      catch (error) {
          var e = {
              message: error.message,
              name: error.name,
              stack: error.stack,
              properties: error.properties,
          }
          console.log(JSON.stringify({error: e}));
          // The error thrown here contains additional information when logged with JSON.stringify (it contains a property object).
          throw error;
      }

      var buf = doc.getZip().generate({type: 'nodebuffer'});

      // buf is a nodejs buffer, you can either write it to a file or do anything else with it.
      var pathCake = __dirname+'/../../public/download';
      console.log(pathCake);
      //fs.writeFileSync(path.resolve(pathCake, 'output.docx'), buf);
      var outPutFile = moment().format('YYYY-MM-DD-h:mm:ss') + 'AvisoVencimiento.docx';
      fs.writeFile(path.resolve(pathCake, outPutFile), buf, function (err) {
          if (err) throw err;
          console.log('It\'s saved!');
          //res.setHeader('Access-Control-Allow-Headers', 'X-DEBUGKIT-ID');
          res.send({"status": "ok", "doc_name": outPutFile});
      });

   });

   app.get('/letterDocx/calculationRamo/:idPolicy', [control.auth, controller], (req, res) => {

      /*CreditNote.findById(req.params.id, function (err, doc) {
         if (!err) {
            res.send({msg: "OK", creditNote: doc});
         } else {
            res.send({msg: 'ERR', err: err});
         }
      });*/
      console.log(__dirname);
      console.log("*******************************************");

      let $data = req.query;
       //Load the docx file as a binary
      let content = fs.readFileSync(path.resolve(__dirname+'/../letters', 'CalculoDePrimas.docx'), 'binary');
      let zip = new JSZip(content);
      let doc = new Docxtemplater();
      doc.loadZip(zip);

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

      doc.setData(data);

      try {
          // render the document (replace all occurences of {first_name} by John, {last_name} by Doe, ...)
          doc.render()
      }
      catch (error) {
          var e = {
              message: error.message,
              name: error.name,
              stack: error.stack,
              properties: error.properties,
          }
          console.log(JSON.stringify({error: e}));
          // The error thrown here contains additional information when logged with JSON.stringify (it contains a property object).
          throw error;
      }

      var buf = doc.getZip().generate({type: 'nodebuffer'});

      // buf is a nodejs buffer, you can either write it to a file or do anything else with it.
      var pathCake = __dirname+'/../../public/download';
      console.log(pathCake);
      //fs.writeFileSync(path.resolve(pathCake, 'output.docx'), buf);
      var outPutFile = moment().format('YYYY-MM-DD-h:mm:ss') + 'CalculoDePrimas.docx';
      fs.writeFile(path.resolve(pathCake, outPutFile), buf, function (err) {
          if (err) throw err;
          console.log('It\'s saved!');
          //res.setHeader('Access-Control-Allow-Headers', 'X-DEBUGKIT-ID');
          res.send({"status": "ok", "doc_name": outPutFile});
      });

   });

   app.get('/letterDocx/sinisterNotice/:idSinister', [control.auth, controller], (req, res) => {

      //let $filter =  global.filter(null);
      let $filter = {
         _id: req.params.idSinister
      }
      Sinister.findOne($filter, function (err, docData) {
        //control.log(req.route.path, req.user);
        Ramo.populate(docData, {path: "ramo"},function(err, docData){
        User.populate(docData, {path: "userCreate"},function(err, docData){
        Role.populate(docData, {path: "userCreate.role"},function(err, docData){
          //res.send({msg: "OK", sinisters: docs});

          console.log(__dirname);
          console.log(docData);
          console.log("*******************************************");

          let $data = req.query;
            //Load the docx file as a binary
          let content = fs.readFileSync(path.resolve(__dirname+'/../letters', 'NotificacionSiniestro.docx'), 'binary');
          //console.log(content);
          let zip = new JSZip(content);
          let doc = new Docxtemplater();
          doc.loadZip(zip);

          let userC = docData.userCreate.name+' '+docData.userCreate.lastName;
          let data = {
             dateNotification : docData.dateNotification,
             sinisterNumber : docData.sinisterNumber,
             compName : docData.compName,
             recipient_name : docData.recipient.name,
             clientInsured : docData.clientInsured,
             beneficiary : docData.beneficiary,
             policyNumber : docData.policyData.policyNumber,
             annexedNumber : docData.policyData.annexedNumber,
             policy_startDate : docData.policyData.startDate,
             policy_finishDate : docData.policyData.finishDate,
             sinisterDiagnosis : docData.sinisterDiagnosis,
             deductibleValue : docData.deductibleValue,
             valorAsegurado : docData.valorAsegurado,
             dateSinister : docData.dateSinister,
             userCreate : userC,
             role : docData.userCreate.role.name,
             idRamo: docData.idRamo
          };
          console.log(data);

          doc.setData(data);

          try {
              // render the document (replace all occurences of {first_name} by John, {last_name} by Doe, ...)
              doc.render()
          }
          catch (error) {
              var e = {
                  message: error.message,
                  name: error.name,
                  stack: error.stack,
                  properties: error.properties,
              }
              console.log(JSON.stringify({error: e}));
              // The error thrown here contains additional information when logged with JSON.stringify (it contains a property object).
              throw error;
          }

          var buf = doc.getZip().generate({type: 'nodebuffer'});

          // buf is a nodejs buffer, you can either write it to a file or do anything else with it.
          var pathCake = __dirname+'/../../public/download';
          console.log(pathCake);
          //fs.writeFileSync(path.resolve(pathCake, 'output.docx'), buf);
          var outPutFile = moment().format('YYYY-MM-DD-h:mm:ss') + 'NotificacionSiniestro.docx';
          fs.writeFile(path.resolve(pathCake, outPutFile), buf, function (err) {
              if (err) throw err;
              console.log('It\'s saved!');
              //res.setHeader('Access-Control-Allow-Headers', 'X-DEBUGKIT-ID');
              res.send({"status": "ok", "doc_name": outPutFile});
          });

        });
        });
        });
      });



   });

   app.get('/letterDocx/docSinisterNotification/:idSinister', [controller], (req, res) => {

      /*CreditNote.findById(req.params.id, function (err, doc) {
         if (!err) {
            res.send({msg: "OK", creditNote: doc});
         } else {
            res.send({msg: 'ERR', err: err});
         }
      });*/
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

      var pathXlsx = path.resolve(__dirname+'/../letters', 'DocumentacionSiniestro.xlsx');
      var workbook = xlsx.readFile(pathXlsx);

      //xlsx.writeFile(workbook, 'out.xlsb');
      var outPutFile = moment().format('YYYY-MM-DD-h:mm:ss') + 'DocumentacionSiniestro.xlsx';
      var pathCake = __dirname+'/../../public/download/'+outPutFile;
      xlsx.writeFileAsync(pathCake, workbook, (err) => {
        if (err) throw err;
        res.send({"status": "ok", "doc_name": outPutFile});

      });

      

   });

   app.get('/letterDocx/documentacionSiniestroAMV/:idSinister', [controller], (req, res) => {

      /*CreditNote.findById(req.params.id, function (err, doc) {
         if (!err) {
            res.send({msg: "OK", creditNote: doc});
         } else {
            res.send({msg: 'ERR', err: err});
         }
      });*/
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

      var pathXlsx = path.resolve(__dirname+'/../letters', 'DocumentacionSiniestroAMV.xlsx');
      var workbook = xlsx.readFile(pathXlsx);

      //xlsx.writeFile(workbook, 'out.xlsb');
      var outPutFile = moment().format('YYYY-MM-DD-h:mm:ss') + 'DocumentacionSiniestroAMV.xlsx';
      var pathCake = __dirname+'/../../public/download/'+outPutFile;
      xlsx.writeFileAsync(pathCake, workbook, (err) => {
        if (err) throw err;
        res.send({"status": "ok", "doc_name": outPutFile});

      });

      

   });

   app.get('/letterDocx/liquidacionSiniestroAMV/:idSinister', [controller], (req, res) => {

      /*CreditNote.findById(req.params.id, function (err, doc) {
         if (!err) {
            res.send({msg: "OK", creditNote: doc});
         } else {
            res.send({msg: 'ERR', err: err});
         }
      });*/
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

export default letterDocxController
