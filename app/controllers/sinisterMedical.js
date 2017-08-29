
import moment from 'moment';

import SinisterMedical from "../models/sinisterMedical";
import SinisterMedicalDocumentation from "../models/sinisterMedicalDocumentation";
import Sinister from "../models/sinister";
import Client from "../models/client";

let sinisterMedicalController = function (app, control={auth, passport, acl}){

   function controller (req, res, next) {
      req.controller = "sinisterMedical";
      return next();
   }

   function findAction (callback){
      SinisterMedical.find({}, function (err, docs) {
         if (!err) {
            
            Sinister.populate(docs, {path: "sinister"},function(err, docs){
               Client.populate(docs, {path: "client"},function(err, docs){
                  callback(docs);
               });
            });
         }
      });
   }

   app.get('/sinisterMedical/list', [control.auth, controller, control.acl], (req, res) => {

      SinisterMedical.find({}, function (err, docs) {
         if (typeof docs !== 'undefined') {

            Sinister.populate(docs, {path: "sinister"},function(err, docs){
               Client.populate(docs, {path: "client"},function(err, docs){
                  res.send({msg: "OK", sinisterMedicals: docs});
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

   app.get('/sinisterMedical/view/:id', [control.auth, controller, control.acl], (req, res) => {

      SinisterMedical.findById(req.params.id, function (err, doc) {
         if (!err) {
            res.send({msg: "OK", sinisterMedical: doc});
         } else {
            res.send({msg: 'ERR', err: err});
         }
      });

   });

   app.post('/sinisterMedical/add', [control.auth, controller, control.acl], (req, res) => {
      let $data = req.body.sinisterMedical;
      let $sinisterMedicalData = $data;
      let $sinisterMedicalDocumentation = $data.items;
      let $moment = moment();
      delete($sinisterMedicalData.items);
      $sinisterMedicalData["dateCreate"] = $moment;
      $sinisterMedicalData["userCreate"] = req.user.idUser;
      $sinisterMedicalData["dateUpdate"] = $moment;
      $sinisterMedicalData["userUpdate"] = req.user.idUser;
      let sinisterMedical = new SinisterMedical($sinisterMedicalData);

      sinisterMedical.save((err, doc) => {
         if(!err){
            $sinisterMedicalDocumentation.forEach(function (item, index) {
               $sinisterMedicalDocumentation[index]["idSinisterMedical"]=doc._id;
               $sinisterMedicalDocumentation[index]["sinisterMedical"]=doc._id;
               $sinisterMedicalDocumentation[index]["dateCreate"] = $moment;
               $sinisterMedicalDocumentation[index]["userCreate"] = req.user.idUser;
               $sinisterMedicalDocumentation[index]["dateUpdate"] = $moment;
               $sinisterMedicalDocumentation[index]["userUpdate"] = req.user.idUser;
            })
            SinisterMedicalDocumentation.insertMany($sinisterMedicalDocumentation, (err, docs) => { });
            findAction(function(docs){
               res.send({msg: "OK", update: docs});
            });
         } else {
            res.send({msg: 'ERR', err: err});
         }            
      });

   });

   app.post('/sinisterMedical/edit/:id', [control.auth, controller, control.acl], (req, res) => {

      let filter = {
         _id: req.params.id
      }

      let update = {
         name: req.body.name,
         idBank: req.body.idBank,
         bank: req.body.idBank,
         idInsurance: req.body.idInsurance,
         insurance: req.body.idInsurance,
         monthWithoutInterest: req.body.monthWithoutInterest,
         interest: req.body.interest,
         monthWithInterest: req.body.monthWithInterest,
         dateUpdate: moment(),
         userUpdate: req.user.idUser
      };

      SinisterMedical.findOneAndUpdate(filter, update, function (err, doc) {
         if (!err) {
            findAction(function(docs){
               res.send({msg: "OK", update: docs});
            });
         } else {
            res.send({msg: 'ERR', err: err});
         }
      });

   });

   app.delete('/sinisterMedical/delete/:id', [control.auth, controller, control.acl], (req, res) => {

      let filter = {
         _id: req.params.id
      }

      SinisterMedical.findByIdAndRemove(filter, function (err, doc) {
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

export default sinisterMedicalController
