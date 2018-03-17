
import moment from 'moment';

import SinisterMedicalDocumentation from "../models/sinisterMedicalDocumentation";

import SinisterMedical from "../models/sinisterMedical";
import SinisterDocumentationRamo from "../models/sinisterDocumentationRamo";

let sinisterMedicalDocumentationController = function (app, control={auth, passport, acl}){

   function controller (req, res, next) {
      req.controller = "sinisterMedicalDocumentation";
      return next();
   }

   function findAction (callback){
      let $filter =  global.filter(null);
      SinisterMedicalDocumentation.find($filter, function (err, docs) {
         if (!err) {
            
            SinisterMedical.populate(docs, {path: "sinisterMedical"},function(err, docs){
               SinisterDocumentationRamo.populate(docs, {path: "sinisterDocumentationRamo"},function(err, docs){
                  callback(docs);
               });
            });
         }
      });
   }

   app.post('/sinisterMedicalDocumentation/filter',[control.auth, controller], (req, res) => {
      let $filter =  global.filter(req.body.filter);
      SinisterMedicalDocumentation.find($filter, function (err, docs) {
         if (typeof docs !== 'undefined') {
            control.log(req.route.path, req.user);

            SinisterMedical.populate(docs, {path: "sinisterMedical"},function(err, docs){
               SinisterDocumentationRamo.populate(docs, {path: "sinisterDocumentationRamo"},function(err, docs){
                  res.send({msg: "OK", sinisterMedicalDocumentations: docs});
               });
            });
            
         } else {
            let error=global.error(err, 0, req.controller);
            res.send({msg: 'ERROR', err: error});
         }
      });

   });

   app.get('/sinisterMedicalDocumentation/list', [control.auth, controller, control.acl], (req, res) => {
      let $filter =  global.filter(null);
      SinisterMedicalDocumentation.find($filter, function (err, docs) {
         if (typeof docs !== 'undefined') {
            control.log(req.route.path, req.user);

            SinisterMedical.populate(docs, {path: "sinisterMedical"},function(err, docs){
               SinisterDocumentationRamo.populate(docs, {path: "sinisterDocumentationRamo"},function(err, docs){
                  res.send({msg: "OK", sinisterMedicalDocumentations: docs});
               });
            });
            
         } else {
            let error=global.error(err, 0, req.controller);
            res.send({msg: 'ERROR', err: error});
         }
      });

   });

   app.get('/sinisterMedicalDocumentation/view/:id', [control.auth, controller, control.acl], (req, res) => {

      SinisterMedicalDocumentation.findById(req.params.id, function (err, doc) {
         if (!err) {
            control.log(req.route.path, req.user);
            res.send({msg: "OK", sinisterMedicalDocumentation: doc});
         } else {
            let error=global.error(err, 0, req.controller);
            res.send({msg: 'ERROR', err: error});
         }
      });

   });

   app.post('/sinisterMedicalDocumentation/add', [control.auth, controller, control.acl], (req, res) => {

      let sinisterMedicalDocumentation = new SinisterMedicalDocumentation({
         idSinisterMedical: req.body.idSinisterMedical,
         sinisterMedical: req.body.idSinisterMedical,
         idSinisterDocumentationRamo: req.body.idSinisterDocumentationRamo,
         sinisterDocumentationRamo: req.body.idSinisterDocumentationRamo,
         quantity: req.body.quantity,
         description: req.body.description,
         numberAllBilling: req.body.numberAllBilling,
         totalBillingValue: req.body.totalBillingValue,
         sendDate: req.body.sendDate,
         responsibleReception: req.body.responsibleReception,
         receptionDate: req.body.receptionDate,
         dateCreate: moment(),
         userCreate: req.user.idUser,
         dateUpdate: moment(),
         userUpdate: req.user.idUser
      });

      sinisterMedicalDocumentation.save((err, doc) => {
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

   app.post('/sinisterMedicalDocumentation/edit/:id', [control.auth, controller, control.acl], (req, res) => {

      let filter = {
         _id: req.params.id
      }

      let update = {
         idSinisterMedical: req.body.idSinisterMedical,
         sinisterMedical: req.body.idSinisterMedical,
         idSinisterDocumentationRamo: req.body.idSinisterDocumentationRamo,
         sinisterDocumentationRamo: req.body.idSinisterDocumentationRamo,
         quantity: req.body.quantity,
         description: req.body.description,
         numberAllBilling: req.body.numberAllBilling,
         totalBillingValue: req.body.totalBillingValue,
         sendDate: req.body.sendDate,
         responsibleReception: req.body.responsibleReception,
         receptionDate: req.body.receptionDate,
         dateUpdate: moment(),
         userUpdate: req.user.idUser
      };

      SinisterMedicalDocumentation.findOneAndUpdate(filter, update, function (err, doc) {
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

   app.delete('/sinisterMedicalDocumentation/delete/:id', [control.auth, controller, control.acl], (req, res) => {

      let filter = {
         _id: req.params.id
      }

      let update = {
         dateDelete: moment()
      };

      SinisterMedicalDocumentation.findOneAndUpdate(filter, update, function (err, doc) {
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

      SinisterMedicalDocumentation.findByIdAndRemove(filter, function (err, doc) {
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

export default sinisterMedicalDocumentationController
