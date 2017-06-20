
import moment from 'moment';

import percentageRamo from "../models/percentageRamo";

let percentageRamoController = function (app, control={auth, passport, acl}){

   function controller (req, res, next) {
      req.controller = "percentageRamo";
      return next();
   }

   function findAction (callback){
      percentageRamo.find({}, function (err, docs) {
         if (!err) {
            callback(docs)
         }
      });
   }

   app.get('/percentageRamo/list', [control.auth, controller, control.acl], (req, res) => {

      percentageRamo.find({}, function (err, docs) {
         if (typeof docs !== 'undefined') {
            res.send({msg: "OK", percentageRamos: docs});
         } else {
            res.send({
               msg : 'ERR',
               err : err.code
            });
         }
      });

   });

   app.get('/percentageRamo/view/:id', [control.auth, controller, control.acl], (req, res) => {

      percentageRamo.findById(req.params.id, function (err, doc) {
         if (!err) {
            res.send({msg: "OK", percentageRamo: doc});
         } else {
            res.send({msg: 'ERR', err: err});
         }
      });

   });

   app.post('/percentageRamo/add', [control.auth, controller, control.acl], (req, res) => {

      let percentageRamo = new percentageRamo({
         idRamo: req.body.idRamo,
         idInsurance: req.body.idInsurance,
         value: req.body.value,
         dateCreate: moment(),
         userCreate: req.user.idUser,
         dateUpdate: moment(),
         userUpdate: req.user.idUser
      });

      percentageRamo.save((err, doc) => {
         if(!err){
            findAction(function(docs){
               res.send({msg: "OK", update: docs});
            });
         } else {
            res.send({msg: 'ERR', err: err});
         }            
      });

   });

   app.post('/percentageRamo/edit/:id', [control.auth, controller, control.acl], (req, res) => {

      let filter = {
         _id: req.params.id
      }

      let update = {
         idRamo: req.body.idRamo,
         idInsurance: req.body.idInsurance,
         value: req.body.value,
         userUpdate: req.user.idUser
      };

      percentageRamo.findOneAndUpdate(filter, update, function (err, doc) {
         if (!err) {
            findAction(function(docs){
               res.send({msg: "OK", update: docs});
            });
         } else {
            res.send({msg: 'ERR', err: err});
         }
      });

   });

   app.delete('/percentageRamo/delete/:id', [control.auth, controller, control.acl], (req, res) => {

      let filter = {
         _id: req.params.id
      }

      percentageRamo.findByIdAndRemove(filter, function (err, doc) {
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

export default percentageRamoController
