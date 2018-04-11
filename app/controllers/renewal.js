
import moment from 'moment';

import Renewal from "../models/renewal";
import Policy from "../models/policy";
import Insurance from "../models/insurance";
import Ramo from "../models/ramo";


let renewalController = function (app, control={auth, passport, acl}){

   function controller (req, res, next) {
      req.controller = "renewal";
      return next();
   }

   function findAction (callback){
      let $filter =  global.filter(null);
      Renewal.find($filter, function (err, docs) {
         if (!err) {
            
            callback(docs);
         }
      });
   }

   app.post('/renewal/filter',[control.auth, controller], (req, res) => {
      let $filter =  global.filter(req.body.filter);
      Renewal.find($filter, function (err, docs) {
         if (typeof docs !== 'undefined') {
            control.log(req.route.path, req.user);
            res.send({msg: "OK", renewals: docs});
         } else {
            let error=global.error(err, 0, req.controller);
            res.send({msg: 'ERROR', err: error});
         }
      });

   });

   app.get('/renewal/list', [control.auth, controller], (req, res) => {
      let $conditions = [
         { 
            "condition": "between",
            "field": "finishDate",
            "values": [
               moment().startOf('month').format('YYYY-MM-DD HH:mm:ss'),
               moment().endOf('month').format('YYYY-MM-DD HH:mm:ss')
            ]
         }
      ]
      let $filter =  global.filter($conditions);
      Policy.find($filter, function (err, docs) {
         if (!err) {
            //Insurance.populate(docs, {path: "insurance"},function(err, docs){
               //Ramo.populate(docs, {path: "ramo"},function(err, docs){
                  $filter =  global.filter(null);
                  Renewal.find($filter, function (err2, docs2) {
                     if (!err2) {
                        control.log(req.route.path, req.user);
                        res.send({msg: "OK", renewals: docs2, policies: docs});
                     } else {
                        let error=global.error(err2, 0, req.controller);
                        res.send({msg: 'ERROR', err: error});
                     }
                  });
               //});
            //});
         } else {
            let error=global.error(err, 0, req.controller);
            res.send({msg: 'ERROR', err: error});
         }
      });

   });

   app.get('/renewal/view/:id', [control.auth, controller, control.acl], (req, res) => {

      Renewal.findById(req.params.id, function (err, doc) {
         if (!err) {
            control.log(req.route.path, req.user);
            res.send({msg: "OK", renewal: doc});
         } else {
            let error=global.error(err, 0, req.controller);
            res.send({msg: 'ERROR', err: error});
         }
      });

   });

   app.post('/renewal/add', [control.auth, controller, control.acl], (req, res) => {

      let renewalData = {
         idPolicy: req.body.idPolicy,
         numberPolicyOverdue: req.body.numberPolicyOverdue,
         numberRenewedPolicy: req.body.numberRenewedPolicy,
         dateNewTerm: req.body.dateNewTerm,
         sellerComments: req.body.sellerComments,
         typePolicy: req.body.typePolicy,
         dateCreate: moment(),
         userCreate: req.user.idUser,
         dateUpdate: moment(),
         userUpdate: req.user.idUser
      };
      Policy.findById(req.body.idPolicy, function (err1, doc1) {
         if (!err1) {
            
            renewalData['policy'] = doc1;
            let renewal = new Renewal(renewalData);

            renewal.save((err2, doc2) => {
               if(!err2){
                  findAction(function(docs){
                     control.log(req.route.path, req.user);
                     res.send({msg: "OK", update: docs});
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

   app.post('/renewal/edit/:id', [control.auth, controller, control.acl], (req, res) => {

      let filter = {
         _id: req.params.id
      }

      let update = {
         idPolicy: req.body.idPolicy,
         policy: req.body.idPolicy,
         numberPolicyOverdue: req.body.numberPolicyOverdue,
         numberRenewedPolicy: req.body.numberRenewedPolicy,
         dateNewTerm: req.body.dateNewTerm,
         sellerComments: req.body.sellerComments,
         typePolicy: req.body.typePolicy,
         dateUpdate: moment(),
         userUpdate: req.user.idUser
      };

      Renewal.findOneAndUpdate(filter, update, function (err, doc) {
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

   app.delete('/renewal/delete/:id', [control.auth, controller, control.acl], (req, res) => {

      let filter = {
         _id: req.params.id
      }

      let update = {
         dateDelete: moment()
      };

      Renewal.findOneAndUpdate(filter, update, function (err, doc) {
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

      Renewal.findByIdAndRemove(filter, function (err, doc) {
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

   app.post('/renewal/report', [control.auth, controller, control.acl], (req, res) => {

      let $filter =  global.filter(req.body.filter);
      let $excel =  req.body.excel;
      Renewal.find($filter, function (err, docs) {
         if (typeof docs !== 'undefined') {

            if($excel==false){
               return res.send({msg: "OK", renewals: docs});
            }

         /*Ramo.populate(docs, {path: "ramo"},function(err, docs){
         City.populate(docs, {path: "city"},function(err, docs){
         Branch.populate(docs, {path: "branchCreate"},function(err, docs){
         PolicyType.populate(docs, {path: "policyType"},function(err, docs){*/

            var file = 'renewal.xlsx';
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

export default renewalController
