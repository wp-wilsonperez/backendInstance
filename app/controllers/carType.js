
import moment from 'moment';

import CarType from "../models/carType";

let carTypeController = function (app, control={auth, passport, acl}){

   function controller (req, res, next) {
      req.controller = "carType";
      return next();
   }

   function findAction (callback){
      CarType.find({}, function (err, docs) {
         if (!err) {
            callback(docs)
         }
      });
   }

   app.get('/carType/list', [control.auth, controller, control.acl], (req, res) => {

      CarType.find({}, function (err, docs) {
         if (typeof docs !== 'undefined') {
            res.send({msg: "OK", carTypes: docs});
         } else {
            res.send({
               msg : 'ERR',
               err : err.code
            });
         }
      });

   });

   app.get('/carType/view/:id', [control.auth, controller, control.acl], (req, res) => {

      CarType.findById(req.params.id, function (err, doc) {
         if (!err) {
            res.send({msg: "OK", carType: doc});
         } else {
            res.send({msg: 'ERR', err: err});
         }
      });

   });

   app.post('/carType/add', [control.auth, controller, control.acl], (req, res) => {

      let carType = new CarType({
         name: req.body.name,
         dateCreate: moment(),
         userCreate: req.user.idUser,
         dateUpdate: moment(),
         userUpdate: req.user.idUser
      });

      carType.save((err, doc) => {
         if(!err){
            findAction(function(docs){
               res.send({msg: "OK", update: docs});
            });
         } else {
            res.send({msg: 'ERR', err: err});
         }            
      });

   });

   app.post('/carType/edit/:id', [control.auth, controller, control.acl], (req, res) => {

      let filter = {
         _id: req.params.id
      }

      let update = {
         name: req.body.name,
         schedule: req.body.schedule,
         dateUpdate: moment(),
         userUpdate: req.user.idUser
      };

      CarType.findOneAndUpdate(filter, update, function (err, doc) {
         if (!err) {
            findAction(function(docs){
               res.send({msg: "OK", update: docs});
            });
         } else {
            res.send({msg: 'ERR', err: err});
         }
      });

   });

   app.delete('/carType/delete/:id', [control.auth, controller, control.acl], (req, res) => {

      let filter = {
         _id: req.params.id
      }

      CarType.findByIdAndRemove(filter, function (err, doc) {
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

export default carTypeController
