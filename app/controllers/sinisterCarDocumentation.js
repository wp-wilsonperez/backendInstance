
import moment from 'moment';

import SinisterCarDocumentation from "../models/sinisterCarDocumentation";

import SinisterCar from "../models/sinisterCar";

let sinisterCarDocumentationController = function (app, control={auth, passport, acl}){

   function controller (req, res, next) {
      req.controller = "sinisterCarDocumentation";
      return next();
   }

   function findAction (callback){
      let $filter =  global.filter(null);
      SinisterCarDocumentation.find($filter, function (err, docs) {
         if (!err) {
            
            SinisterCar.populate(docs, {path: "sinisterCar"},function(err, docs){
               callback(docs);
            });
         }
      });
   }

   app.post('/sinisterCarDocumentation/filter',[control.auth, controller], (req, res) => {
      let $filter =  global.filter(req.body.filter);
      SinisterCarDocumentation.find($filter, function (err, docs) {
         if (typeof docs !== 'undefined') {
            control.log(req.route.path, req.user);

            SinisterCar.populate(docs, {path: "sinisterCar"},function(err, docs){
               res.send({msg: "OK", sinisterCarDocumentations: docs});
            });
            
         } else {
            let error=global.error(err, 0, req.controller);
            res.send({msg: 'ERROR', err: error});
         }
      });

   });

   app.get('/sinisterCarDocumentation/list', [control.auth, controller, control.acl], (req, res) => {
      let $filter =  global.filter(null);
      SinisterCarDocumentation.find($filter, function (err, docs) {
         if (typeof docs !== 'undefined') {
            control.log(req.route.path, req.user);

            SinisterCar.populate(docs, {path: "sinisterCar"},function(err, docs){
               res.send({msg: "OK", sinisterCarDocumentations: docs});
            });
            
         } else {
            let error=global.error(err, 0, req.controller);
            res.send({msg: 'ERROR', err: error});
         }
      });

   });

   app.get('/sinisterCarDocumentation/view/:id', [control.auth, controller, control.acl], (req, res) => {

      SinisterCarDocumentation.findById(req.params.id, function (err, doc) {
         if (!err) {
            control.log(req.route.path, req.user);
            res.send({msg: "OK", sinisterCarDocumentation: doc});
         } else {
            let error=global.error(err, 0, req.controller);
            res.send({msg: 'ERROR', err: error});
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
               control.log(req.route.path, req.user);
               res.send({msg: "OK", update: docs});
            });
         } else {
            let error=global.error(err, 0, req.controller);
            res.send({msg: 'ERROR', err: error});
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
               control.log(req.route.path, req.user);
               res.send({msg: "OK", update: docs});
            });
         } else {
            let error=global.error(err, 0, req.controller);
            res.send({msg: 'ERROR', err: error});
         }
      });

   });

   app.delete('/sinisterCarDocumentation/delete/:id', [control.auth, controller, control.acl], (req, res) => {

      let filter = {
         _id: req.params.id
      }

      let update = {
         dateDelete: moment()
      };

      SinisterCarDocumentation.findOneAndUpdate(filter, update, function (err, doc) {
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

      SinisterCarDocumentation.findByIdAndRemove(filter, function (err, doc) {
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

export default sinisterCarDocumentationController
