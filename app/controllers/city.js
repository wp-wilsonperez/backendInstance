
import moment from 'moment';

import City from "../models/city";

let cityController = function (app, control={auth, passport, acl}){

   function controller (req, res, next) {
      req.controller = "city";
      return next();
   }

   function findAction (callback){
      City.find({}, function (err, docs) {
         if (!err) {
            callback(docs)
         }
      });
   }

   app.get('/city/list', [control.auth, controller, control.acl], (req, res) => {

      City.find({}, function (err, docs) {
         if (typeof docs !== 'undefined') {
            res.send({msg: "OK", cities: docs});
         } else {
            res.send({
               msg : 'ERR',
               err : err.code
            });
         }
      });

   });

   app.get('/city/view/:id', [control.auth, controller, control.acl], (req, res) => {

      City.findById(req.params.id, function (err, doc) {
         if (!err) {
            res.send({msg: "OK", city: doc});
         } else {
            res.send({msg: 'ERR', err: err});
         }
      });

   });

   app.post('/city/add', [control.auth, controller, control.acl], (req, res) => {

      let city = new City({
         name: req.body.name,
         dateCreate: moment(),
         userCreate: req.user.idUser,
         dateUpdate: moment(),
         userUpdate: req.user.idUser
      });

      city.save((err, doc) => {
         if(!err){
            findAction(function(docs){
               res.send({msg: "OK", update: docs});
            });
         } else {
            res.send({msg: 'ERR', err: err});
         }            
      });

   });

   app.post('/city/edit/:id', [control.auth, controller, control.acl], (req, res) => {

      let filter = {
         _id: req.params.id
      }

      let update = {
         name: req.body.name,
         dateUpdate: moment(),
         userUpdate: req.user.idUser
      };

      City.findOneAndUpdate(filter, update, function (err, doc) {
         if (!err) {
            findAction(function(docs){
               res.send({msg: "OK", update: docs});
            });
         } else {
            res.send({msg: 'ERR', err: err});
         }
      });

   });

}

export default cityController
