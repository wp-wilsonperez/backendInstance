
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
            res.send({msg: "OK", creditNote: doc});
         } else {
            res.send({msg: 'ERR', err: err});
         }
      });

   });

   app.post('/creditNote/add', [control.auth, controller, control.acl], (req, res) => {

      let creditNote = new CreditNote({
         name: req.body.name,
         idBank: req.body.idBank,
         bank: req.body.idBank,
         idInsurance: req.body.idInsurance,
         insurance: req.body.idInsurance,
         monthWithoutInterest: req.body.monthWithoutInterest,
         interest: req.body.interest,
         monthWithInterest: req.body.monthWithInterest,
         dateCreate: moment(),
         userCreate: req.user.idUser,
         dateUpdate: moment(),
         userUpdate: req.user.idUser
      });

      creditNote.save((err, doc) => {
         if(!err){
            findAction(function(docs){
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
         name: req.body.name,
         idBank: req.body.idBank,
         bank: req.body.idBank,
         idInsurance: req.body.idInsurance,
         insurance: req.body.idInsurance,
         monthWithoutInterest: req.body.monthWithoutInterest,
         interest: req.body.interest,
         monthWithInterest: req.body.monthWithInterest,
         dateUpdate: moment(),
         userUpdate: req.user.idUser
      };

      CreditNote.findOneAndUpdate(filter, update, function (err, doc) {
         if (!err) {
            findAction(function(docs){
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
               res.send({msg: "OK", update: docs});
            });
         } else {
            res.send({msg: 'ERR', err: err});
         }            
      });

   });

}

export default creditNoteController
