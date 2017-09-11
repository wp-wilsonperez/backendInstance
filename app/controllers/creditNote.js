
import moment from 'moment';

import CreditNote from "../models/creditNote";

let creditNoteController = function (app, control={auth, passport, acl}){

   function controller (req, res, next) {
      req.controller = "creditNote";
      return next();
   }

   function findAction (callback){
      CreditNote.find({}, function (err, docs) {
         if (!err) {
            
            callback(docs);            
         }
      });
   }

   app.get('/creditNote/filter',[control.auth, controller], (req, res) => {
      let $filter =  global.filter(req.query.filter);
      CreditNote.find($filter, function (err, docs) {
         if (typeof docs !== 'undefined') {
            control.log(req.route.path, req.user);

            res.send({msg: "OK", creditNotes: docs});
         } else {
            res.send({
               msg : 'ERR',
               err : err.code
            });
         }
      });

   });

   app.get('/creditNote/list', [control.auth, controller, control.acl], (req, res) => {

      CreditNote.find({}, function (err, docs) {
         if (typeof docs !== 'undefined') {
            control.log(req.route.path, req.user);

            res.send({msg: "OK", creditNotes: docs});
         } else {
            res.send({
               msg : 'ERR',
               err : err.code
            });
         }
      });

   });

   app.get('/creditNote/view/:id', [control.auth, controller, control.acl], (req, res) => {

      CreditNote.findById(req.params.id, function (err, doc) {
         if (!err) {
            control.log(req.route.path, req.user);
            res.send({msg: "OK", creditNote: doc});
         } else {
            res.send({msg: 'ERR', err: err});
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
            res.send({msg: 'ERR', err: err});
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
            res.send({msg: 'ERR', err: err});
         }
      });

   });

   app.delete('/creditNote/delete/:id', [control.auth, controller, control.acl], (req, res) => {

      let filter = {
         _id: req.params.id
      }

      CreditNote.findByIdAndRemove(filter, function (err, doc) {
         if(!err){
            findAction(function(docs){
               control.log(req.route.path, req.user);
               res.send({msg: "OK", update: docs});
            });
         } else {
            res.send({msg: 'ERR', err: err});
         }            
      });

   });

}

export default creditNoteController
