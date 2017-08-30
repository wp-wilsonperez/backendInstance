
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
      BusinessClient.find({}, function (err, docs) {
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

   app.get('/businessClient/filter',[control.auth, controller], (req, res) => {
      let $filter =  global.filter(req.query.filter);
      BusinessClient.find($filter, function (err, docs) {
         if (typeof docs !== 'undefined') {

            Business.populate(docs, {path: "business"},function(err, docs){
               Client.populate(docs, {path: "client"},function(err, docs){
                  Alternative.populate(docs, {path: "alternative"},function(err, docs){
                     res.send({msg: "OK", businessClients: docs});
                  });
               });
            });
            
         } else {
            res.send({
               msg : 'ERR',
               err : err.code
            });
         }
      });

   });

   app.get('/businessClient/list', [control.auth, controller, control.acl], (req, res) => {

      BusinessClient.find({}, function (err, docs) {
         if (typeof docs !== 'undefined') {

            Business.populate(docs, {path: "business"},function(err, docs){
               Client.populate(docs, {path: "client"},function(err, docs){
                  Alternative.populate(docs, {path: "alternative"},function(err, docs){
                     res.send({msg: "OK", businessClients: docs});
                  });
               });
            });
            
         } else {
            res.send({
               msg : 'ERR',
               err : err.code
            });
         }
      });

   });

   app.get('/businessClient/view/:id', [control.auth, controller, control.acl], (req, res) => {

      BusinessClient.findById(req.params.id, function (err, doc) {
         if (!err) {
            res.send({msg: "OK", businessClient: doc});
         } else {
            res.send({msg: 'ERR', err: err});
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
               res.send({msg: "OK", update: docs});
            });
         } else {
            res.send({msg: 'ERR', err: err});
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
               res.send({msg: "OK", update: docs});
            });
         } else {
            res.send({msg: 'ERR', err: err});
         }
      });

   });

   app.delete('/businessClient/delete/:id', [control.auth, controller, control.acl], (req, res) => {

      let filter = {
         _id: req.params.id
      }

      BusinessClient.findByIdAndRemove(filter, function (err, doc) {
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

export default businessClientController
