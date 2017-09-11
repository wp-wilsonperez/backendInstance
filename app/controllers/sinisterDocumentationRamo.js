
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

   app.get('/sinisterDocumentationRamo/filter',[control.auth, controller], (req, res) => {
      let $filter =  global.filter(req.query.filter);
      SinisterDocumentationRamo.find($filter, function (err, docs) {
         if (typeof docs !== 'undefined') {
            control.log(req.route.path, req.user);

            res.send({msg: "OK", sinisterDocumentationRamos: docs});
            
         } else {
            res.send({
               msg : 'ERR',
               err : err.code
            });
         }
      });

   });

   app.get('/sinisterDocumentationRamo/list', [control.auth, controller, control.acl], (req, res) => {

      SinisterDocumentationRamo.find({}, function (err, docs) {
         if (typeof docs !== 'undefined') {
            control.log(req.route.path, req.user);

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
            control.log(req.route.path, req.user);
            res.send({msg: "OK", sinisterDocumentationRamo: doc});
         } else {
            res.send({msg: 'ERR', err: err});
         }
      });

   });

   app.post('/sinisterDocumentationRamo/add', [control.auth, controller, control.acl], (req, res) => {

      let sinisterDocumentationRamo = new SinisterDocumentationRamo({
         idSinisterDocumentation: req.body.idSinisterDocumentation,
         idRamo: req.body.idRamo,
         dateCreate: moment(),
         userCreate: req.user.idUser,
         dateUpdate: moment(),
         userUpdate: req.user.idUser
      });

      sinisterDocumentationRamo.save((err, doc) => {
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

   app.post('/sinisterDocumentationRamo/edit/:id', [control.auth, controller, control.acl], (req, res) => {

      let filter = {
         _id: req.params.id
      }

      let update = {
         idSinisterDocumentation: req.body.idSinisterDocumentation,
         idRamo: req.body.idRamo,
         dateUpdate: moment(),
         userUpdate: req.user.idUser
      };

      SinisterDocumentationRamo.findOneAndUpdate(filter, update, function (err, doc) {
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

   app.delete('/sinisterDocumentationRamo/delete/:id', [control.auth, controller, control.acl], (req, res) => {

      let filter = {
         _id: req.params.id
      }

      SinisterDocumentationRamo.findByIdAndRemove(filter, function (err, doc) {
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

export default sinisterDocumentationRamoController
