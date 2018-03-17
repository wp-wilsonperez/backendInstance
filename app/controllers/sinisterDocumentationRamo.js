
import moment from 'moment';

import SinisterDocumentationRamo from "../models/sinisterDocumentationRamo";

import SinisterDocumentation from "../models/sinisterDocumentation";
import Ramo from "../models/ramo";

let sinisterDocumentationRamoController = function (app, control={auth, passport, acl}){

   function controller (req, res, next) {
      req.controller = "sinisterDocumentationRamo";
      return next();
   }

   function findAction (callback){
      let $filter =  global.filter(null);
      SinisterDocumentationRamo.find($filter, function (err, docs) {
         if (!err) {

            callback(docs);
         }
      });
   }

   app.post('/sinisterDocumentationRamo/filter',[control.auth, controller], (req, res) => {
    let filter =  req.body.filter;
        SinisterDocumentationRamo.find(filter, function (err, docs) {
            if (typeof docs !== 'undefined') {
                control.log(req.route.path, req.user);
                SinisterDocumentation.populate(docs, {path: "sinisterDocumentation"},function(err, docs){
                   Ramo.populate(docs, {path: "ramo"},function(err, docs){
                      res.send({msg: "OK", sinisterDocumentationRamos: docs});
                   });
                });
                
             } else {
            let error=global.error(err, 0, req.controller);
            res.send({msg: 'ERROR', err: error});
         }
      });

   });

   app.get('/sinisterDocumentationRamo/list', [control.auth, controller, control.acl], (req, res) => {
      let $filter =  global.filter(null);
      SinisterDocumentationRamo.find($filter, function (err, docs) {
         if (typeof docs !== 'undefined') {
            control.log(req.route.path, req.user);
            SinisterDocumentation.populate(docs, {path: "sinisterDocumentation"},function(err, docs){
               Ramo.populate(docs, {path: "ramo"},function(err, docs){
                  res.send({msg: "OK", sinisterDocumentationRamos: docs});
               });
            });
            
         } else {
            let error=global.error(err, 0, req.controller);
            res.send({msg: 'ERROR', err: error});
         }
      });

   });

   app.get('/sinisterDocumentationRamo/view/:id', [control.auth, controller, control.acl], (req, res) => {

      SinisterDocumentationRamo.findById(req.params.id, function (err, doc) {
         if (!err) {
            control.log(req.route.path, req.user);
            SinisterDocumentation.populate(docs, {path: "sinisterDocumentation"},function(err, docs){
               Ramo.populate(docs, {path: "ramo"},function(err, docs){
                  res.send({msg: "OK", sinisterDocumentationRamo: doc});
               });
            });
         } else {
            let error=global.error(err, 0, req.controller);
            res.send({msg: 'ERROR', err: error});
         }
      });

   });

   app.post('/sinisterDocumentationRamo/add', [control.auth, controller, control.acl], (req, res) => {

      let sinisterDocumentationRamo = new SinisterDocumentationRamo({
         idSinisterDocumentation: req.body.idSinisterDocumentation,
         sinisterDocumentation: req.body.idSinisterDocumentation,
         idRamo: req.body.idRamo,
         ramo: req.body.idRamo,
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
            let error=global.error(err, 0, req.controller);
            res.send({msg: 'ERROR', err: error});
         }            
      });

   });

   app.post('/sinisterDocumentationRamo/edit/:id', [control.auth, controller, control.acl], (req, res) => {

      let filter = {
         _id: req.params.id
      }

      let update = {
         idSinisterDocumentation: req.body.idSinisterDocumentation,
         sinisterDocumentation: req.body.idSinisterDocumentation,
         idRamo: req.body.idRamo,
         ramo: req.body.idRamo,
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
            let error=global.error(err, 0, req.controller);
            res.send({msg: 'ERROR', err: error});
         }
      });

   });

   app.delete('/sinisterDocumentationRamo/delete/:id', [control.auth, controller, control.acl], (req, res) => {

      let filter = {
         _id: req.params.id
      }

      let update = {
         dateDelete: moment()
      };

      SinisterDocumentationRamo.findOneAndUpdate(filter, update, function (err, doc) {
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

      SinisterDocumentationRamo.findByIdAndRemove(filter, function (err, doc) {
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

export default sinisterDocumentationRamoController
