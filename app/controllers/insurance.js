
import moment from 'moment';

import Insurance from "../models/insurance";


let insuranceController = function (app, control={auth, passport, acl}){

   function controller (req, res, next) {
      req.controller = "insurance";
      return next();
   }

   function findAction (callback){
      Insurance.find({}, function (err, docs) {
         if (!err) {
            callback(docs)
         }
      });
   }

   app.get('/insurance/list', [control.auth, controller, control.acl], (req, res) => {

      Insurance.find({}, function (err, docs) {
         if (typeof docs !== 'undefined') {
            res.send({msg: "OK", insurances: docs});
         } else {
            res.send({
               msg : 'ERR',
               err : err.code
            });
         }
      });

   });

   app.get('/insurance/view/:id', [control.auth, controller, control.acl], (req, res) => {

      Insurance.findById(req.params.id, function (err, doc) {
         if (!err) {
            res.send({msg: "OK", insurance: doc});
         } else {
            res.send({msg: 'ERR', err: err});
         }
      });

   });

   app.post('/insurance/add', [control.auth, controller, control.acl], (req, res) => {

      let insurance = new Insurance({
         name: req.body.name,
         description: req.body.logo,
         Enable: false,
         dateCreate: moment(),
         userCreate: req.user.idUser,
         dateUpdate: moment(),
         userUpdate: req.user.idUser
      });

      insurance.save((err, doc) => {
         if(!err){
            res.send({msg: "OK", doc: doc});
         } else {
            res.send({msg: 'ERR', err: err});
         }            
      });

   });

   app.post('/insurance/edit/:id', [control.auth, controller, control.acl], (req, res) => {

      let filter = {
         _id: req.params.id
      }

      let update = {
         name: req.body.name,
         description: req.body.logo,
         dateUpdate: moment(),
         userUpdate: req.user.idUser
      };

      Insurance.findOneAndUpdate(filter, update, function (err, doc) {
         if (!err) {
            findAction(function(docs){
               res.send({msg: "OK", update: docs});
            });
         } else {
            res.send({msg: 'ERR', err: err});
         }
      });

   });

   app.post('/insurance/enable/:id', [control.auth, controller, control.acl], (req, res) => {

      let filter = {
         _id: req.params.id
      }

      let update = {
         Enable: true,
         dateUpdate: moment(),
         userUpdate: req.user.idUser
      };

      Insurance.findOneAndUpdate(filter, update, function (err, doc) {
         if (!err) {
            findAction(function(docs){
               res.send({msg: "OK", update: docs});
            });
         } else {
            res.send({msg: 'ERR', err: err});
         }
      });

   });

   app.delete('/insurance/delete/:id', [control.auth, controller, control.acl], (req, res) => {

      let filter = {
         _id: req.params.id
      }

      Insurance.findByIdAndRemove(filter, function (err, doc) {
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

export default insuranceController
