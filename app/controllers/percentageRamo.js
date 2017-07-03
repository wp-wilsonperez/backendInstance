
import moment from 'moment';

import PercentageRamo from "../models/percentageRamo";
import Ramo from "../models/ramo";
import Insurance from "../models/insurance";

let percentageRamoController = function (app, control={auth, passport, acl}){

   function controller (req, res, next) {
      req.controller = "percentageRamo";
      return next();
   }

   function findAction (callback){
      PercentageRamo.find({}, function (err, docs) {
         if (!err) {
            Ramo.populate(docs, {path: "ramo"},function(err, docs){
               Insurance.populate(docs, {path: "insurance"},function(err, docs){
                  callback(docs);
               });
            });
         }
      });
   }

   app.get('/percentageRamo/list', [control.auth, controller, control.acl], (req, res) => {

      PercentageRamo.find({}, function (err, docs) {
         if (typeof docs !== 'undefined') {
            Ramo.populate(docs, {path: "ramo"},function(err, docs){
               Insurance.populate(docs, {path: "insurance"},function(err, docs){
                  res.send({msg: "OK", percentageRamos: docs});
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

   app.get('/percentageRamo/view/:id', [control.auth, controller, control.acl], (req, res) => {

      PercentageRamo.findById(req.params.id, function (err, doc) {
         if (!err) {
            res.send({msg: "OK", percentageRamo: doc});
         } else {
            res.send({msg: 'ERR', err: err});
         }
      });

   });

   app.post('/percentageRamo/add', [control.auth, controller, control.acl], (req, res) => {

      let percentageRamo = new PercentageRamo({
         idRamo: req.body.idRamo,
         ramo: req.body.idRamo,
         idInsurance: req.body.idInsurance,
         insurance: req.body.idInsurance,
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
         ramo: req.body.idRamo,
         idInsurance: req.body.idInsurance,
         insurance: req.body.idInsurance,
         value: req.body.value,
         userUpdate: req.user.idUser
      };

      PercentageRamo.findOneAndUpdate(filter, update, function (err, doc) {
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

      PercentageRamo.findByIdAndRemove(filter, function (err, doc) {
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
