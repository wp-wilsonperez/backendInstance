
import moment from 'moment';

import SinisterGeneralDocumentation from "../models/sinisterGeneralDocumentation";

let sinisterGeneralDocumentationController = function (app, control={auth, passport, acl}){

   function controller (req, res, next) {
      req.controller = "sinisterGeneralDocumentation";
      return next();
   }

   function findAction (callback){
      let $filter =  global.filter(null);
      SinisterGeneralDocumentation.find($filter, function (err, docs) {
         if (!err) {
            
            callback(docs);
         }
      });
   }

   app.post('/sinisterGeneralDocumentation/filter',[control.auth, controller], (req, res) => {
      let $filter =  global.filter(req.body.filter);
      SinisterGeneralDocumentation.find($filter, function (err, docs) {
         if (typeof docs !== 'undefined') {
            control.log(req.route.path, req.user);

            res.send({msg: "OK", sinisterGeneralDocumentations: docs});
            
         } else {
            let error=global.error(err, 0, req.controller);
            res.send({msg: 'ERROR', err: error});
         }
      });

   });

   app.get('/sinisterGeneralDocumentation/list', [control.auth, controller, control.acl], (req, res) => {
      let $filter =  global.filter(null);
      SinisterGeneralDocumentation.find($filter, function (err, docs) {
         if (typeof docs !== 'undefined') {
            control.log(req.route.path, req.user);

            res.send({msg: "OK", sinisterGeneralDocumentations: docs});
            
         } else {
            let error=global.error(err, 0, req.controller);
            res.send({msg: 'ERROR', err: error});
         }
      });

   });

   app.get('/sinisterGeneralDocumentation/view/:id', [control.auth, controller, control.acl], (req, res) => {

      SinisterGeneralDocumentation.findById(req.params.id, function (err, doc) {
         if (!err) {
            control.log(req.route.path, req.user);
            res.send({msg: "OK", sinisterGeneralDocumentation: doc});
         } else {
            let error=global.error(err, 0, req.controller);
            res.send({msg: 'ERROR', err: error});
         }
      });

   });

   app.post('/sinisterGeneralDocumentation/add', [control.auth, controller, control.acl], (req, res) => {

      let sinisterGeneralDocumentation = new SinisterGeneralDocumentation({
         idSinisterGeneral: req.body.idSinisterGeneral,
         sinisterGeneral: req.body.idSinisterGeneral,
         idSinisterDocumentationRamo: req.body.idSinisterDocumentationRamo,
         sinisterDocumentationRamo: req.body.idSinisterDocumentationRamo,
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

      sinisterGeneralDocumentation.save((err, doc) => {
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

   app.post('/sinisterGeneralDocumentation/edit/:id', [control.auth, controller, control.acl], (req, res) => {

      let filter = {
         _id: req.params.id
      }

      let update = {
         idSinisterGeneral: req.body.idSinisterGeneral,
         sinisterGeneral: req.body.idSinisterGeneral,
         idSinisterDocumentationRamo: req.body.idSinisterDocumentationRamo,
         sinisterDocumentationRamo: req.body.idSinisterDocumentationRamo,
         quantity: req.body.quantity,
         description: req.body.description,
         sendDate: req.body.sendDate,
         responsibleReception: req.body.responsibleReception,
         receptionDate: req.body.receptionDate,
         dateUpdate: moment(),
         userUpdate: req.user.idUser
      };

      SinisterGeneralDocumentation.findOneAndUpdate(filter, update, function (err, doc) {
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

   app.delete('/sinisterGeneralDocumentation/delete/:id', [control.auth, controller, control.acl], (req, res) => {

      let filter = {
         _id: req.params.id
      }

      let update = {
         dateDelete: moment()
      };

      SinisterGeneralDocumentation.findOneAndUpdate(filter, update, function (err, doc) {
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

      SinisterGeneralDocumentation.findByIdAndRemove(filter, function (err, doc) {
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

export default sinisterGeneralDocumentationController
