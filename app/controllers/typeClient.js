
import moment from 'moment';

import TypeClient from "../models/typeClient";

let typeClientController = function (app, control={auth, passport, acl}){

   function controller (req, res, next) {
      req.controller = "typeClient";
      return next();
   }

   function findAction (callback){
      TypeClient.find({}, function (err, docs) {
         if (!err) {
            callback(docs)
         }
      });
   }

   app.get('/typeClient/list', [control.auth, controller, control.acl], (req, res) => {

      TypeClient.find({}, function (err, docs) {
         if (typeof docs !== 'undefined') {
            res.send({msg: "OK", typeClients: docs});
         } else {
            res.send({
               msg : 'ERR',
               err : err.code
            });
         }
      });

   });

   app.get('/typeClient/view/:id', [control.auth, controller, control.acl], (req, res) => {

      TypeClient.findById(req.params.id, function (err, doc) {
         if (!err) {
            res.send({msg: "OK", typeClient: doc});
         } else {
            res.send({msg: 'ERR', err: err});
         }
      });

   });

   app.post('/typeClient/add', [control.auth, controller, control.acl], (req, res) => {

      let typeClient = new TypeClient({
         name: req.body.name,
         dateCreate: moment(),
         userCreate: req.user.idUser,
         dateUpdate: moment(),
         userUpdate: req.user.idUser
      });

      typeClient.save((err, doc) => {
         if(!err){
            res.send({msg: "OK", doc: doc});
         } else {
            res.send({msg: 'ERR', err: err});
         }            
      });

   });

   app.post('/typeClient/edit/:id', [control.auth, controller, control.acl], (req, res) => {

      let filter = {
         _id: req.params.id
      }

      let update = {
         name: req.body.name,
         dateUpdate: moment(),
         userUpdate: req.user.idUser
      };

      TypeClient.findOneAndUpdate(filter, update, function (err, doc) {
         if (!err) {
            findAction(function(docs){
               res.send({msg: "OK", update: docs});
            });
         } else {
            res.send({msg: 'ERR', err: err});
         }
      });

   });

   app.delete('/typeClient/delete/:id', [control.auth, controller, control.acl], (req, res) => {

      let filter = {
         _id: req.params.id
      }

      TypeClient.findByIdAndRemove(filter, function (err, doc) {
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

export default typeClientController
