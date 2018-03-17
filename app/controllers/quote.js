
import moment from 'moment';

import Quote from "../models/quote";
import BankInsurance from "../models/bankInsurance";
import Deductible from "../models/deductible";
import TypeClient from "../models/typeClient";

let quoteController = function (app, control={auth, passport, acl}){

   function controller (req, res, next) {
      req.controller = "quote";
      return next();
   }

   function findAction (callback){
      let $filter =  global.filter(null);
      Quote.find($filter, function (err, docs) {
         if (!err) {
            BankInsurance.populate(docs, {path: "bankInsurance"},function(err, docs){
               Deductible.populate(docs, {path: "deductible"},function(err, docs){
                  TypeClient.populate(docs, {path: "typeClient"},function(err, docs){
                     callback(docs);
                  });
               });
            });
         }
      });
   }

   app.post('/quote/filter',[control.auth, controller], (req, res) => {
      let $filter =  global.filter(req.body.filter);
      Quote.find($filter, function (err, docs) {
         if (typeof docs !== 'undefined') {
            control.log(req.route.path, req.user);
            BankInsurance.populate(docs, {path: "bankInsurance"},function(err, docs){
               Deductible.populate(docs, {path: "deductible"},function(err, docs){
                  TypeClient.populate(docs, {path: "typeClient"},function(err, docs){
                     res.send({msg: "OK", quotes: docs});
                  });
               });
            });
         } else {
            let error=global.error(err, 0, req.controller);
            res.send({msg: 'ERROR', err: error});
         }
      });

   });

   app.get('/quote/list', [control.auth, controller, control.acl], (req, res) => {
      let $filter =  global.filter(null);
      Quote.find($filter, function (err, docs) {
         if (typeof docs !== 'undefined') {
            control.log(req.route.path, req.user);
            BankInsurance.populate(docs, {path: "bankInsurance"},function(err, docs){
               Deductible.populate(docs, {path: "deductible"},function(err, docs){
                  TypeClient.populate(docs, {path: "typeClient"},function(err, docs){
                     res.send({msg: "OK", quotes: docs});
                  });
               });
            });
         } else {
            let error=global.error(err, 0, req.controller);
            res.send({msg: 'ERROR', err: error});
         }
      });

   });

   app.get('/quote/view/:id', [control.auth, controller, control.acl], (req, res) => {

      Quote.findById(req.params.id, function (err, doc) {
         if (!err) {
            control.log(req.route.path, req.user);
            res.send({msg: "OK", quote: doc});
         } else {
            let error=global.error(err, 0, req.controller);
            res.send({msg: 'ERROR', err: error});
         }
      });

   });

   app.post('/quote/add', [control.auth, controller, control.acl], (req, res) => {

      let quote = new Quote({
         date: req.body.date,
         doc: req.body.doc,
         docType: req.body.docType,
         name: req.body.name,
         lastName: req.body.lastName,
         cellPhone: req.body.cellPhone,
         mail: req.body.mail,
         car: req.body.car,
         carUse: req.body.carUse,
         idBankInsurance: req.body.idBankInsurance,
         bankInsurance: req.body.idBankInsurance,
         idDeductible: req.body.idDeductible,
         deductible: req.body.idDeductible,
         startDate: req.body.startDate,
         finishDate: req.body.finishDate,
         valueCar: req.body.valueCar,
         accessories: req.body.accessories,
         tasaValue: req.body.tasaValue,
         iva: req.body.iva,
         superBank: req.body.superBank,
         peasantInsurance: req.body.peasantInsurance,
         valueWithoutTaxes: req.body.valueWithoutTaxes,
         emissionRights: req.body.emissionRights,
         initialValue: req.body.initialValue,
         initialPayment: req.body.initialPayment,
         equalPayments: req.body.equalPayments,
         totalAmount: req.body.totalAmount,
         paymentType: req.body.paymentType,
         idBank: req.body.idBank,
         bank: req.body.idBank,
         idTypeClient: req.body.idTypeClient,
         typeClient: req.body.idTypeClient,
         dateCreate: moment(),
         userCreate: req.user.idUser,
         dateUpdate: moment(),
         userUpdate: req.user.idUser
      });

      quote.save((err, doc) => {
         if(!err){
            control.log(req.route.path, req.user);
            res.send({msg: "OK", doc: doc});
         } else {
            let error=global.error(err, 0, req.controller);
            res.send({msg: 'ERROR', err: error});
         }            
      });

   });

   app.post('/quote/edit/:id', [control.auth, controller, control.acl], (req, res) => {

      let filter = {
         _id: req.params.id
      }

      let update = {
         date: req.body.date,
         doc: req.body.doc,
         docType: req.body.docType,
         name: req.body.name,
         lastName: req.body.lastName,
         cellPhone: req.body.cellPhone,
         mail: req.body.mail,
         car: req.body.car,
         carUse: req.body.carUse,
         idBankInsurance: req.body.idBankInsurance,
         bankInsurance: req.body.idBankInsurance,
         idDeductible: req.body.idDeductible,
         deductible: req.body.idDeductible,
         startDate: req.body.startDate,
         finishDate: req.body.finishDate,
         valueCar: req.body.valueCar,
         accessories: req.body.accessories,
         tasaValue: req.body.tasaValue,
         iva: req.body.iva,
         superBank: req.body.superBank,
         peasantInsurance: req.body.peasantInsurance,
         valueWithoutTaxes: req.body.valueWithoutTaxes,
         emissionRights: req.body.emissionRights,
         initialValue: req.body.initialValue,
         initialPayment: req.body.initialPayment,
         equalPayments: req.body.equalPayments,
         totalAmount: req.body.totalAmount,
         paymentType: req.body.paymentType,
         idBank: req.body.idBank,
         bank: req.body.idBank,
         idTypeClient: req.body.idTypeClient,
         typeClient: req.body.idTypeClient,
         dateUpdate: moment(),
         userUpdate: req.user.idUser
      };

      Quote.findOneAndUpdate(filter, update, function (err, doc) {
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

   app.delete('/quote/delete/:id', [control.auth, controller, control.acl], (req, res) => {

      let filter = {
         _id: req.params.id
      }

      let update = {
         dateDelete: moment()
      };

      Quote.findOneAndUpdate(filter, update, function (err, doc) {
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

      Quote.findByIdAndRemove(filter, function (err, doc) {
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

}

export default quoteController
