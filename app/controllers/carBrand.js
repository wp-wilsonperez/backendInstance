
import moment from 'moment';

import CarBrand from "../models/carBrand";

let carBrandController = function (app, control={auth, passport, acl}){

   function controller (req, res, next) {
      req.controller = "carBrand";
      return next();
   }

   function findAction (callback){
      CarBrand.find({}, function (err, docs) {
         if (!err) {
            callback(docs)
         }
      });
   }

   app.get('/carBrand/list', [control.auth, controller, control.acl], (req, res) => {

      CarBrand.find({}, function (err, docs) {
         if (typeof docs !== 'undefined') {
            res.send({msg: "OK", carBrands: docs});
         } else {
            res.send({
               msg : 'ERR',
               err : err.code
            });
         }
      });

   });

   app.get('/carBrand/view/:id', [control.auth, controller, control.acl], (req, res) => {

      CarBrand.findById(req.params.id, function (err, doc) {
         if (!err) {
            res.send({msg: "OK", carBrand: doc});
         } else {
            res.send({msg: 'ERR', err: err});
         }
      });

   });

   app.post('/carBrand/add', [control.auth, controller, control.acl], (req, res) => {

      let carBrand = new CarBrand({
         name: req.body.name,
         dateCreate: moment(),
         userCreate: req.user.idUser,
         dateUpdate: moment(),
         userUpdate: req.user.idUser
      });

      carBrand.save((err, doc) => {
         if(!err){
            findAction(function(docs){
               res.send({msg: "OK", update: docs});
            });
         } else {
            res.send({msg: 'ERR', err: err});
         }            
      });

   });

   app.post('/carBrand/edit/:id', [control.auth, controller, control.acl], (req, res) => {

      let filter = {
         _id: req.params.id
      }

      let update = {
         name: req.body.name,
         schedule: req.body.schedule,
         dateUpdate: moment(),
         userUpdate: req.user.idUser
      };

      CarBrand.findOneAndUpdate(filter, update, function (err, doc) {
         if (!err) {
            findAction(function(docs){
               res.send({msg: "OK", update: docs});
            });
         } else {
            res.send({msg: 'ERR', err: err});
         }
      });

   });

   app.delete('/carBrand/delete/:id', [control.auth, controller, control.acl], (req, res) => {

      let filter = {
         _id: req.params.id
      }

      CarBrand.findByIdAndRemove(filter, function (err, doc) {
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

export default carBrandController
