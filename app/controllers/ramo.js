
import moment from 'moment';

import Ramo from "../models/ramo";


let ramoController = function (app, control={auth, passport, acl}){

   function controller (req, res, next) {
      req.controller = "ramo";
      return next();
   }

   function findAction (callback){
      Ramo.find({}, function (err, docs) {
         if (!err) {
            callback(docs)
         }
      });
   }

   app.get('/ramo/filter',[control.auth, controller], (req, res) => {
      let $filter =  global.filter(req.query.filter);
      Ramo.find($filter, function (err, docs) {
         if (typeof docs !== 'undefined') {
            res.send({msg: "OK", ramos: docs});
         } else {
            res.send({
               msg : 'ERR',
               err : err.code
            });
         }
      });

   });

   app.get('/ramo/list', [control.auth, controller, control.acl], (req, res) => {

      Ramo.find({}, function (err, docs) {
         if (typeof docs !== 'undefined') {
            res.send({msg: "OK", ramos: docs});
         } else {
            res.send({
               msg : 'ERR',
               err : err.code
            });
         }
      });

   });

   app.get('/ramo/view/:id', [control.auth, controller, control.acl], (req, res) => {

      Ramo.findById(req.params.id, function (err, doc) {
         if (!err) {
            res.send({msg: "OK", ramo: doc});
         } else {
            res.send({msg: 'ERR', err: err});
         }
      });

   });

   app.post('/ramo/add', [control.auth, controller, control.acl], (req, res) => {

      let ramo = new Ramo({
         name: req.body.name,
         description: req.body.description,
         Enable: false,
         dateCreate: moment(),
         userCreate: req.user.idUser,
         dateUpdate: moment(),
         userUpdate: req.user.idUser
      });

      ramo.save((err, doc) => {
         if(!err){
            res.send({msg: "OK", doc: doc});
         } else {
            res.send({msg: 'ERR', err: err});
         }            
      });

   });

   app.post('/ramo/edit/:id', [control.auth, controller, control.acl], (req, res) => {

      let filter = {
         _id: req.params.id
      }

      let update = {
         name: req.body.name,
         description: req.body.description,
         dateUpdate: moment(),
         userUpdate: req.user.idUser
      };

      Ramo.findOneAndUpdate(filter, update, function (err, doc) {
         if (!err) {
            findAction(function(docs){
               res.send({msg: "OK", update: docs});
            });
         } else {
            res.send({msg: 'ERR', err: err});
         }
      });

   });

   app.post('/ramo/enable/:id', [control.auth, controller, control.acl], (req, res) => {

      let filter = {
         _id: req.params.id
      }

      let update = {
         Enable: true,
         dateUpdate: moment(),
         userUpdate: req.user.idUser
      };

      Ramo.findOneAndUpdate(filter, update, function (err, doc) {
         if (!err) {
            findAction(function(docs){
               res.send({msg: "OK", update: docs});
            });
         } else {
            res.send({msg: 'ERR', err: err});
         }
      });

   });

   app.delete('/ramo/delete/:id', [control.auth, controller, control.acl], (req, res) => {

      let filter = {
         _id: req.params.id
      }

      Ramo.findByIdAndRemove(filter, function (err, doc) {
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

export default ramoController
