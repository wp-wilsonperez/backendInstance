
import moment from 'moment';

import SinisterCar from "../models/sinisterCar";

let sinisterCarController = function (app, control={auth, passport, acl}){

   function controller (req, res, next) {
      req.controller = "sinisterCar";
      return next();
   }

   function findAction (callback){
      SinisterCar.find({}, function (err, docs) {
         if (!err) {
            
            callback(docs);
         }
      });
   }

   app.get('/sinisterCar/list', [control.auth, controller, control.acl], (req, res) => {

      SinisterCar.find({}, function (err, docs) {
         if (typeof docs !== 'undefined') {

            res.send({msg: "OK", sinisterCars: docs});
            
         } else {
            res.send({
               msg : 'ERR',
               err : err.code
            });
         }
      });

   });

   app.get('/sinisterCar/view/:id', [control.auth, controller, control.acl], (req, res) => {

      SinisterCar.findById(req.params.id, function (err, doc) {
         if (!err) {
            res.send({msg: "OK", sinisterCar: doc});
         } else {
            res.send({msg: 'ERR', err: err});
         }
      });

   });

   app.post('/sinisterCar/add', [control.auth, controller, control.acl], (req, res) => {

      let sinisterCar = new SinisterCar({
         idCar: req.body.idCar,
         carDetails: req.body.carDetails,
         sinisterDiagnosis: req.body.sinisterDiagnosis,
         workshop: req.body.workshop,
         arrangement: req.body.arrangement,
         rasa: req.body.rasa,
         medicalExpense: req.body.medicalExpense,
         sinisterValue: req.body.sinisterValue,
         rc: req.body.rc,
         deductibleValue: req.body.deductibleValue,
         depreciation: req.body.depreciation,
         others1: req.body.others1,
         others2: req.body.others2,
         others3: req.body.others3,
         notCovered: req.body.notCovered,
         observationNotCovered: req.body.observationNotCovered,
         liquidation: req.body.liquidation,
         liquidationDate: req.body.liquidationDate,
         deliverDate: req.body.deliverDate,
         sinisterMap: req.body.sinisterMap,
         dateCreate: moment(),
         userCreate: req.user.idUser,
         dateUpdate: moment(),
         userUpdate: req.user.idUser
      });

      sinisterCar.save((err, doc) => {
         if(!err){
            findAction(function(docs){
               res.send({msg: "OK", update: docs});
            });
         } else {
            res.send({msg: 'ERR', err: err});
         }            
      });

   });

   app.post('/sinisterCar/edit/:id', [control.auth, controller, control.acl], (req, res) => {

      let filter = {
         _id: req.params.id
      }

      let update = {
         idCar: req.body.idCar,
         carDetails: req.body.carDetails,
         sinisterDiagnosis: req.body.sinisterDiagnosis,
         workshop: req.body.workshop,
         arrangement: req.body.arrangement,
         rasa: req.body.rasa,
         medicalExpense: req.body.medicalExpense,
         sinisterValue: req.body.sinisterValue,
         rc: req.body.rc,
         deductibleValue: req.body.deductibleValue,
         depreciation: req.body.depreciation,
         others1: req.body.others1,
         others2: req.body.others2,
         others3: req.body.others3,
         notCovered: req.body.notCovered,
         observationNotCovered: req.body.observationNotCovered,
         liquidation: req.body.liquidation,
         liquidationDate: req.body.liquidationDate,
         deliverDate: req.body.deliverDate,
         sinisterMap: req.body.sinisterMap,
         dateUpdate: moment(),
         userUpdate: req.user.idUser
      };

      SinisterCar.findOneAndUpdate(filter, update, function (err, doc) {
         if (!err) {
            findAction(function(docs){
               res.send({msg: "OK", update: docs});
            });
         } else {
            res.send({msg: 'ERR', err: err});
         }
      });

   });

   app.delete('/sinisterCar/delete/:id', [control.auth, controller, control.acl], (req, res) => {

      let filter = {
         _id: req.params.id
      }

      SinisterCar.findByIdAndRemove(filter, function (err, doc) {
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

export default sinisterCarController
