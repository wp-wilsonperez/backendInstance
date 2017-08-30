
import moment from 'moment';

import SinisterCarDocumentation from "../models/sinisterCarDocumentation";

import SinisterCar from "../models/sinisterCar";

let sinisterCarDocumentationController = function (app, control={auth, passport, acl}){

   function controller (req, res, next) {
      req.controller = "sinisterCarDocumentation";
      return next();
   }

   function findAction (callback){
      SinisterCarDocumentation.find({}, function (err, docs) {
         if (!err) {
            
            SinisterCar.populate(docs, {path: "sinisterCar"},function(err, docs){
               callback(docs);
            });
         }
      });
   }

   app.get('/sinisterCarDocumentation/filter',[control.auth, controller], (req, res) => {
      let $filter =  global.filter(req.query.filter);
      SinisterCarDocumentation.find($filter, function (err, docs) {
         if (typeof docs !== 'undefined') {

            SinisterCar.populate(docs, {path: "sinisterCar"},function(err, docs){
               res.send({msg: "OK", sinisterCarDocumentations: docs});
            });
            
         } else {
            res.send({
               msg : 'ERR',
               err : err.code
            });
         }
      });

   });

   app.get('/sinisterCarDocumentation/list', [control.auth, controller, control.acl], (req, res) => {

      SinisterCarDocumentation.find({}, function (err, docs) {
         if (typeof docs !== 'undefined') {

            SinisterCar.populate(docs, {path: "sinisterCar"},function(err, docs){
               res.send({msg: "OK", sinisterCarDocumentations: docs});
            });
            
         } else {
            res.send({
               msg : 'ERR',
               err : err.code
            });
         }
      });

   });

   app.get('/sinisterCarDocumentation/view/:id', [control.auth, controller, control.acl], (req, res) => {

      SinisterCarDocumentation.findById(req.params.id, function (err, doc) {
         if (!err) {
            res.send({msg: "OK", sinisterCarDocumentation: doc});
         } else {
            res.send({msg: 'ERR', err: err});
         }
      });

   });

   app.post('/sinisterCarDocumentation/add', [control.auth, controller, control.acl], (req, res) => {

      let sinisterCarDocumentation = new SinisterCarDocumentation({
         idSinisterCar: req.body.idSinisterCar,
         sinisterCar: req.body.idSinisterCar,
         idSinisterDocumentationRamo: req.body.idSinisterDocumentationRamo,
         quantity: req.body.quantity,
         description: req.body.description,
         sendDate: req.body.sendDate,
         responsibleReception: req.body.responsibleReception,
         receptionDate: req.body.receptionDate,
         dateCreate: moment(),
         userCreate: req.user.idUser,
         dateUpdate: moment(),
         userUpdate: req.user.idUser
      });

      sinisterCarDocumentation.save((err, doc) => {
         if(!err){
            findAction(function(docs){
               res.send({msg: "OK", update: docs});
            });
         } else {
            res.send({msg: 'ERR', err: err});
         }            
      });

   });

   app.post('/sinisterCarDocumentation/edit/:id', [control.auth, controller, control.acl], (req, res) => {

      let filter = {
         _id: req.params.id
      }

      let update = {
         idSinisterCar: req.body.idSinisterCar,
         sinisterCar: req.body.idSinisterCar,
         idSinisterDocumentationRamo: req.body.idSinisterDocumentationRamo,
         quantity: req.body.quantity,
         description: req.body.description,
         sendDate: req.body.sendDate,
         responsibleReception: req.body.responsibleReception,
         receptionDate: req.body.receptionDate,
         dateUpdate: moment(),
         userUpdate: req.user.idUser
      };

      SinisterCarDocumentation.findOneAndUpdate(filter, update, function (err, doc) {
         if (!err) {
            findAction(function(docs){
               res.send({msg: "OK", update: docs});
            });
         } else {
            res.send({msg: 'ERR', err: err});
         }
      });

   });

   app.delete('/sinisterCarDocumentation/delete/:id', [control.auth, controller, control.acl], (req, res) => {

      let filter = {
         _id: req.params.id
      }

      SinisterCarDocumentation.findByIdAndRemove(filter, function (err, doc) {
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

export default sinisterCarDocumentationController
