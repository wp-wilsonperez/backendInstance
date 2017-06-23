
import moment from 'moment';

import Tasa from "../models/tasa";

let tasaController = function (app, control={auth, passport, acl}){

   function controller (req, res, next) {
      req.controller = "tasa";
      return next();
   }

   function findAction (callback){
      Tasa.find({}, function (err, docs) {
         if (!err) {
            callback(docs)
         }
      });
   }

   app.get('/tasa/list', [control.auth, controller, control.acl], (req, res) => {

      Tasa.find({}, function (err, docs) {
         if (typeof docs !== 'undefined') {
            res.send({msg: "OK", tasas: docs});
         } else {
            res.send({
               msg : 'ERR',
               err : err.code
            });
         }
      });

   });

   app.get('/tasa/view/:id', [control.auth, controller, control.acl], (req, res) => {

      Tasa.findById(req.params.id, function (err, doc) {
         if (!err) {
            res.send({msg: "OK", tasa: doc});
         } else {
            res.send({msg: 'ERR', err: err});
         }
      });

   });

   app.post('/tasa/add', [control.auth, controller, control.acl], (req, res) => {

      let tasa = new Tasa({
         name: req.body.name,
         idInsurance: req.body.idInsurance,
         idDeductible: req.body.idDeductible,
         idRamo: req.body.idRamo,
         carUse: req.body.carUse,
         value: req.body.value,
         dateCreate: moment(),
         userCreate: req.user.idUser,
         dateUpdate: moment(),
         userUpdate: req.user.idUser
      });

      tasa.save((err, doc) => {
         if(!err){
            res.send({msg: "OK", doc: doc});
         } else {
            res.send({msg: 'ERR', err: err});
         }            
      });

   });

   app.post('/tasa/edit/:id', [control.auth, controller, control.acl], (req, res) => {

      let filter = {
         _id: req.params.id
      }

      let update = {
         name: req.body.name,
         idInsurance: req.body.idInsurance,
         idDeductible: req.body.idDeductible,
         idRamo: req.body.idRamo,
         carUse: req.body.carUse,
         value: req.body.value,
         dateUpdate: moment(),
         userUpdate: req.user.idUser
      };

      Tasa.findOneAndUpdate(filter, update, function (err, doc) {
         if (!err) {
            findAction(function(docs){
               res.send({msg: "OK", update: docs});
            });
         } else {
            res.send({msg: 'ERR', err: err});
         }
      });

   });

   app.delete('/tasa/delete/:id', [control.auth, controller, control.acl], (req, res) => {

      let filter = {
         _id: req.params.id
      }

      Tasa.findByIdAndRemove(filter, function (err, doc) {
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

export default tasaController
