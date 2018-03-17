
import moment from 'moment';

import SinisterDocumentation from "../models/sinisterDocumentation";

let sinisterDocumentationController = function (app, control={auth, passport, acl}){

   function controller (req, res, next) {
      req.controller = "sinisterDocumentation";
      return next();
   }

   function findAction (callback){
      let $filter =  global.filter(null);
      SinisterDocumentation.find($filter, function (err, docs) {
         if (!err) {
            
            callback(docs);
         }
      });
   }

   app.post('/sinisterDocumentation/filter',[control.auth, controller], (req, res) => {
      let $filter =  global.filter(req.body.filter);
      SinisterDocumentation.find($filter, function (err, docs) {
         if (typeof docs !== 'undefined') {
            control.log(req.route.path, req.user);

            res.send({msg: "OK", sinisterDocumentations: docs});
            
         } else {
            let error=global.error(err, 0, req.controller);
            res.send({msg: 'ERROR', err: error});
         }
      });

   });

   app.get('/sinisterDocumentation/list', [control.auth, controller, control.acl], (req, res) => {
      let $filter =  global.filter(null);
      SinisterDocumentation.find($filter, function (err, docs) {
         if (typeof docs !== 'undefined') {
            control.log(req.route.path, req.user);

            res.send({msg: "OK", sinisterDocumentations: docs});
            
         } else {
            let error=global.error(err, 0, req.controller);
            res.send({msg: 'ERROR', err: error});
         }
      });

   });

   app.get('/sinisterDocumentation/view/:id', [control.auth, controller, control.acl], (req, res) => {

      SinisterDocumentation.findById(req.params.id, function (err, doc) {
         if (!err) {
            control.log(req.route.path, req.user);
            res.send({msg: "OK", sinisterDocumentation: doc});
         } else {
            let error=global.error(err, 0, req.controller);
            res.send({msg: 'ERROR', err: error});
         }
      });

   });

   app.post('/sinisterDocumentation/add', [control.auth, controller, control.acl], (req, res) => {

      let sinisterDocumentation = new SinisterDocumentation({
         name: req.body.name,
         description: req.body.description,
         enabled: req.body.enabled,
         dateCreate: moment(),
         userCreate: req.user.idUser,
         dateUpdate: moment(),
         userUpdate: req.user.idUser
      });

      sinisterDocumentation.save((err, doc) => {
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

   app.post('/sinisterDocumentation/edit/:id', [control.auth, controller, control.acl], (req, res) => {

      let filter = {
         _id: req.params.id
      }

      let update = {
         name: req.body.name,
         description: req.body.description,
         enabled: req.body.enabled,
         dateUpdate: moment(),
         userUpdate: req.user.idUser
      };

      SinisterDocumentation.findOneAndUpdate(filter, update, function (err, doc) {
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

   app.delete('/sinisterDocumentation/delete/:id', [control.auth, controller, control.acl], (req, res) => {

      let filter = {
         _id: req.params.id
      }

      let update = {
         dateDelete: moment()
      };

      SinisterDocumentation.findOneAndUpdate(filter, update, function (err, doc) {
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

      SinisterDocumentation.findByIdAndRemove(filter, function (err, doc) {
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

export default sinisterDocumentationController
