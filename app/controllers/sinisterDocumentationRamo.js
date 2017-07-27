
import moment from 'moment';

import SinisterDocumentationRamo from "../models/sinisterDocumentationRamo";

let sinisterDocumentationRamoController = function (app, control={auth, passport, acl}){

   function controller (req, res, next) {
      req.controller = "sinisterDocumentationRamo";
      return next();
   }

   function findAction (callback){
      SinisterDocumentationRamo.find({}, function (err, docs) {
         if (!err) {

            callback(docs);
         }
      });
   }

   app.get('/sinisterDocumentationRamo/list', [control.auth, controller, control.acl], (req, res) => {

      SinisterDocumentationRamo.find({}, function (err, docs) {
         if (typeof docs !== 'undefined') {

            res.send({msg: "OK", sinisterDocumentationRamos: docs});
            
         } else {
            res.send({
               msg : 'ERR',
               err : err.code
            });
         }
      });

   });

   app.get('/sinisterDocumentationRamo/view/:id', [control.auth, controller, control.acl], (req, res) => {

      SinisterDocumentationRamo.findById(req.params.id, function (err, doc) {
         if (!err) {
            res.send({msg: "OK", sinisterDocumentationRamo: doc});
         } else {
            res.send({msg: 'ERR', err: err});
         }
      });

   });

   app.post('/sinisterDocumentationRamo/add', [control.auth, controller, control.acl], (req, res) => {

      let sinisterDocumentationRamo = new SinisterDocumentationRamo({
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

      sinisterDocumentationRamo.save((err, doc) => {
         if(!err){
            findAction(function(docs){
               res.send({msg: "OK", update: docs});
            });
         } else {
            res.send({msg: 'ERR', err: err});
         }            
      });

   });

   app.post('/sinisterDocumentationRamo/edit/:id', [control.auth, controller, control.acl], (req, res) => {

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

      SinisterDocumentationRamo.findOneAndUpdate(filter, update, function (err, doc) {
         if (!err) {
            findAction(function(docs){
               res.send({msg: "OK", update: docs});
            });
         } else {
            res.send({msg: 'ERR', err: err});
         }
      });

   });

   app.delete('/sinisterDocumentationRamo/delete/:id', [control.auth, controller, control.acl], (req, res) => {

      let filter = {
         _id: req.params.id
      }

      SinisterDocumentationRamo.findByIdAndRemove(filter, function (err, doc) {
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

export default sinisterDocumentationRamoController