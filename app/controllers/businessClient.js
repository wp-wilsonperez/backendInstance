
import moment from 'moment';

import BusinessClient from "../models/businessClient";

import Business from "../models/business";
import Client from "../models/client";
import Alternative from "../models/alternative";

let businessClientController = function (app, control={auth, passport, acl}){

   function controller (req, res, next) {
      req.controller = "businessClient";
      return next();
   }

   function findAction (callback){
      let $filter =  global.filter(null);
      BusinessClient.find($filter, function (err, docs) {
         if (!err) {
            
            Business.populate(docs, {path: "business"},function(err, docs){
               Client.populate(docs, {path: "client"},function(err, docs){
                  Alternative.populate(docs, {path: "alternative"},function(err, docs){
                     callback(docs);
                  });
               });
            });
         }
      });
   }

   app.post('/businessClient/filter',[control.auth, controller], (req, res) => {
      let $filter =  global.filter(req.body.filter);
      BusinessClient.find($filter, function (err, docs) {
         if (typeof docs !== 'undefined') {
            control.log(req.route.path, req.user);

            Business.populate(docs, {path: "business"},function(err, docs){
               Client.populate(docs, {path: "client"},function(err, docs){
                  Alternative.populate(docs, {path: "alternative"},function(err, docs){
                     res.send({msg: "OK", businessClients: docs});
                  });
               });
            });
            
         } else {
            let error=global.error(err, 0, req.controller);
            res.send({msg: 'ERROR', err: error});
         }
      });

   });

   app.get('/businessClient/list', [control.auth, controller, control.acl], (req, res) => {
      let $filter =  global.filter(null);
      BusinessClient.find($filter, function (err, docs) {
         if (typeof docs !== 'undefined') {
            control.log(req.route.path, req.user);

            Business.populate(docs, {path: "business"},function(err, docs){
               Client.populate(docs, {path: "client"},function(err, docs){
                  Alternative.populate(docs, {path: "alternative"},function(err, docs){
                     res.send({msg: "OK", businessClients: docs});
                  });
               });
            });
            
         } else {
            let error=global.error(err, 0, req.controller);
            res.send({msg: 'ERROR', err: error});
         }
      });

   });

   app.get('/businessClient/view/:id', [control.auth, controller, control.acl], (req, res) => {

      BusinessClient.findById(req.params.id, function (err, doc) {
         if (!err) {
            control.log(req.route.path, req.user);
            res.send({msg: "OK", businessClient: doc});
         } else {
            let error=global.error(err, 0, req.controller);
            res.send({msg: 'ERROR', err: error});
         }
      });

   });

   app.post('/businessClient/add', [control.auth, controller, control.acl], (req, res) => {

      let businessClient = new BusinessClient({
         idBusiness: req.body.idBusiness,
         business: req.body.idBusiness,
         idClient: req.body.idClient,
         client: req.body.idClient,
         idAlternative: req.body.idAlternative,
         alternative: req.body.idAlternative,
         initial: req.body.initial,
         initialDate: req.body.initialDate,
         inclusion: req.body.inclusion,
         inclusionDate: req.body.inclusionDate,
         exclusion: req.body.exclusion,
         exclusionDate: req.body.exclusionDate,
         dateCreate: moment(),
         userCreate: req.user.idUser,
         dateUpdate: moment(),
         userUpdate: req.user.idUser
      });

      businessClient.save((err, doc) => {
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

   app.post('/businessClient/edit/:id', [control.auth, controller, control.acl], (req, res) => {

      let filter = {
         _id: req.params.id
      }

      let update = {
         idBusiness: req.body.idBusiness,
         business: req.body.idBusiness,
         idClient: req.body.idClient,
         client: req.body.idClient,
         idAlternative: req.body.idAlternative,
         alternative: req.body.idAlternative,
         initial: req.body.initial,
         initialDate: req.body.initialDate,
         inclusion: req.body.inclusion,
         inclusionDate: req.body.inclusionDate,
         exclusion: req.body.exclusion,
         exclusionDate: req.body.exclusionDate,
         dateUpdate: moment(),
         userUpdate: req.user.idUser
      };

      BusinessClient.findOneAndUpdate(filter, update, function (err, doc) {
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

   app.delete('/businessClient/delete/:id', [control.auth, controller, control.acl], (req, res) => {

      let filter = {
         _id: req.params.id
      }

      let update = {
         dateDelete: moment()
      };

      BusinessClient.findOneAndUpdate(filter, update, function (err, doc) {
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

      BusinessClient.findByIdAndRemove(filter, function (err, doc) {
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

export default businessClientController
