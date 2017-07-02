
import moment from 'moment';

import Country from "../models/country";

let countryController = function (app, control={auth, passport, acl}){

   function controller (req, res, next) {
      req.controller = "country";
      return next();
   }

   function findAction (callback){
      Country.find({}, function (err, docs) {
         if (!err) {
            callback(docs)
         }
      });
   }

   app.get('/country/list', [control.auth, controller, control.acl], (req, res) => {

      Country.find({}, function (err, docs) {
         if (typeof docs !== 'undefined') {
            res.send({msg: "OK", countries: docs});
         } else {
            res.send({
               msg : 'ERR',
               err : err.code
            });
         }
      });

   });

   app.get('/country/view/:id', [control.auth, controller, control.acl], (req, res) => {

      Country.findById(req.params.id, function (err, doc) {
         if (!err) {
            res.send({msg: "OK", country: doc});
         } else {
            res.send({msg: 'ERR', err: err});
         }
      });

   });

   app.post('/country/add', [control.auth, controller, control.acl], (req, res) => {

      let country = new Country({
         name: req.body.name,
         dateCreate: moment(),
         userCreate: req.user.idUser,
         dateUpdate: moment(),
         userUpdate: req.user.idUser
      });

      country.save((err, doc) => {
         if(!err){
            findAction(function(docs){
               res.send({msg: "OK", update: docs});
            });
         } else {
            res.send({msg: 'ERR', err: err});
         }            
      });

   });

   app.post('/country/edit/:id', [control.auth, controller, control.acl], (req, res) => {

      let filter = {
         _id: req.params.id
      }

      let update = {
         name: req.body.name,
         schedule: req.body.schedule,
         dateUpdate: moment(),
         userUpdate: req.user.idUser
      };

      Country.findOneAndUpdate(filter, update, function (err, doc) {
         if (!err) {
            findAction(function(docs){
               res.send({msg: "OK", update: docs});
            });
         } else {
            res.send({msg: 'ERR', err: err});
         }
      });

   });

   app.delete('/country/delete/:id', [control.auth, controller, control.acl], (req, res) => {

      let filter = {
         _id: req.params.id
      }

      Country.findByIdAndRemove(filter, function (err, doc) {
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

export default countryController
