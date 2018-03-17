
import moment from 'moment';

import CreditNote from "../models/creditNote";

let creditNoteController = function (app, control={auth, passport, acl}){

   function controller (req, res, next) {
      req.controller = "creditNote";
      return next();
   }

   function findAction (callback){
      let $filter =  global.filter(null);
      CreditNote.find($filter, function (err, docs) {
         if (!err) {
            
            callback(docs);            
         }
      });
   }

   app.post('/creditNote/filter',[control.auth, controller], (req, res) => {
      let $filter =  global.filter(req.body.filter);
      CreditNote.find($filter, function (err, docs) {
         if (typeof docs !== 'undefined') {
            control.log(req.route.path, req.user);

            res.send({msg: "OK", creditNotes: docs});
         } else {
            let error=global.error(err, 0, req.controller);
            res.send({msg: 'ERROR', err: error});
         }
      });

   });

   app.get('/creditNote/list', [control.auth, controller, control.acl], (req, res) => {
      let $filter =  global.filter(null);
      CreditNote.find(filter, function (err, docs) {
         if (typeof docs !== 'undefined') {
            control.log(req.route.path, req.user);

            res.send({msg: "OK", creditNotes: docs});
         } else {
            let error=global.error(err, 0, req.controller);
            res.send({msg: 'ERROR', err: error});
         }
      });

   });

   app.get('/creditNote/view/:id', [control.auth, controller, control.acl], (req, res) => {

      CreditNote.findById(req.params.id, function (err, doc) {
         if (!err) {
            control.log(req.route.path, req.user);
            res.send({msg: "OK", creditNote: doc});
         } else {
            let error=global.error(err, 0, req.controller);
            res.send({msg: 'ERROR', err: error});
         }
      });

   });

   app.post('/creditNote/add', [control.auth, controller, control.acl], (req, res) => {

      let creditNote = new CreditNote({
         numberCreditNote: req.body.numberCreditNote,
         idBilling: req.body.idBilling,
         dataBilling: req.body.dataBilling,
         idPolicy: req.body.idPolicy,
         policy: req.body.idPolicy,
         idPolicyAnnex: req.body.idPolicyAnnex,
         policyAnnex: req.body.idPolicyAnnex,
         totalPrima: req.body.totalPrima,
         expirationDate: req.body.expirationDate,
         cancellationDate: req.body.cancellationDate,
         days: req.body.days,
         superBank: req.body.superBank,
         superCamp: req.body.superCamp,
         valueIssue: req.body.valueIssue,
         others1: req.body.others1,
         others2: req.body.others2,
         iva: req.body.iva,
         others3: req.body.others3,
         others4: req.body.others4,
         creditNoteValueBefore: req.body.creditNoteValueBefore,
         creditNoteValueAfter: req.body.creditNoteValueAfter,
         observation: req.body.observation,
         dateCreate: moment(),
         userCreate: req.user.idUser,
         branchCreate: req.user.idBranch,
         dateUpdate: moment(),
         userUpdate: req.user.idUser
      });

      creditNote.save((err, doc) => {
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

   app.post('/creditNote/edit/:id', [control.auth, controller, control.acl], (req, res) => {

      let filter = {
         _id: req.params.id
      }

      let update = {
         numberCreditNote: req.body.numberCreditNote,
         idBilling: req.body.idBilling,
         dataBilling: req.body.dataBilling,
         idPolicy: req.body.idPolicy,
         policy: req.body.idPolicy,
         idPolicyAnnex: req.body.idPolicyAnnex,
         policyAnnex: req.body.idPolicyAnnex,
         totalPrima: req.body.totalPrima,
         expirationDate: req.body.expirationDate,
         cancellationDate: req.body.cancellationDate,
         days: req.body.days,
         superBank: req.body.superBank,
         superCamp: req.body.superCamp,
         valueIssue: req.body.valueIssue,
         others1: req.body.others1,
         others2: req.body.others2,
         iva: req.body.iva,
         others3: req.body.others3,
         others4: req.body.others4,
         creditNoteValueBefore: req.body.creditNoteValueBefore,
         creditNoteValueAfter: req.body.creditNoteValueAfter,
         observation: req.body.observation,
         dateUpdate: moment(),
         userUpdate: req.user.idUser
      };

      CreditNote.findOneAndUpdate(filter, update, function (err, doc) {
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

   app.delete('/creditNote/delete/:id', [control.auth, controller, control.acl], (req, res) => {

      let filter = {
         _id: req.params.id
      }

      let update = {
         dateDelete: moment()
      };

      CreditNote.findOneAndUpdate(filter, update, function (err, doc) {
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

      CreditNote.findByIdAndRemove(filter, function (err, doc) {
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

   app.post('/creditNote/report', [control.auth, controller, control.acl], (req, res) => {

      let $filter =  global.filter(req.body.filter);
      CreditNote.find($filter, function (err, docs) {
         if (typeof docs !== 'undefined') {

         /*Ramo.populate(docs, {path: "ramo"},function(err, docs){
         City.populate(docs, {path: "city"},function(err, docs){
         Branch.populate(docs, {path: "branchCreate"},function(err, docs){
         PolicyType.populate(docs, {path: "policyType"},function(err, docs){*/

            var file = 'creditNote.xlsx';
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
                  if(docs[i].typeRecipient == 'CLIENTE'){
                     $cliente = docs[i].recipient.name+' '+docs[i].recipient.lastName
                  }
               sheet1.set(cols[0], rowIni, docs[i]);
               /*sheet1.set(cols[0], rowIni, docs[i].branchCreate.name);
               sheet1.set(cols[1], rowIni, docs[i].city.name);
               sheet1.set(cols[2], rowIni, $cliente);
               sheet1.set(cols[3], rowIni, docs[i].policyNumber);
               sheet1.set(cols[4], rowIni, docs[i].ramo.name);
               sheet1.set(cols[5], rowIni, docs[i].policyType.name);
               sheet1.set(cols[6], rowIni, docs[i].startDate);
               sheet1.set(cols[7], rowIni, docs[i].finishDate);*/
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

}

export default creditNoteController
