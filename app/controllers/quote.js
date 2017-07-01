
import moment from 'moment';

import Quote from "../models/quote";

let quoteController = function (app, control={auth, passport, acl}){

   function controller (req, res, next) {
      req.controller = "quote";
      return next();
   }

   function findAction (callback){
      Quote.find({}, function (err, docs) {
         if (!err) {
            callback(docs)
         }
      });
   }

   app.get('/quote/list', [control.auth, controller, control.acl], (req, res) => {

      Quote.find({}, function (err, docs) {
         if (typeof docs !== 'undefined') {
            res.send({msg: "OK", quotes: docs});
         } else {
            res.send({
               msg : 'ERR',
               err : err.code
            });
         }
      });

   });

   app.get('/quote/view/:id', [control.auth, controller, control.acl], (req, res) => {

      Quote.findById(req.params.id, function (err, doc) {
         if (!err) {
            res.send({msg: "OK", quote: doc});
         } else {
            res.send({msg: 'ERR', err: err});
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
         idInsurance: req.body.idInsurance,
         idDeductible: req.body.idDeductible,
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
         totalAmount: req.body.totalAmount,
         idPaymentTye: req.body.idPaymentTye,
         idTypeClient: req.body.idTypeClient,
         dateCreate: moment(),
         userCreate: req.user.idUser,
         dateUpdate: moment(),
         userUpdate: req.user.idUser
      });

      quote.save((err, doc) => {
         if(!err){
            res.send({msg: "OK", doc: doc});
         } else {
            res.send({msg: 'ERR', err: err});
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
         idInsurance: req.body.idInsurance,
         idDeductible: req.body.idDeductible,
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
         totalAmount: req.body.totalAmount,
         idPaymentTye: req.body.idPaymentTye,
         idTypeClient: req.body.idTypeClient,
         dateUpdate: moment(),
         userUpdate: req.user.idUser
      };

      Quote.findOneAndUpdate(filter, update, function (err, doc) {
         if (!err) {
            findAction(function(docs){
               res.send({msg: "OK", update: docs});
            });
         } else {
            res.send({msg: 'ERR', err: err});
         }
      });

   });

   app.delete('/quote/delete/:id', [control.auth, controller, control.acl], (req, res) => {

      let filter = {
         _id: req.params.id
      }

      Quote.findByIdAndRemove(filter, function (err, doc) {
         if(!err){
            findAction(function(docs){
               res.send({msg: "OK", update: docs});
            });
         } else {
            res.send({msg: 'ERR', err: err});
         }            
      });

   });

}

export default quoteController
