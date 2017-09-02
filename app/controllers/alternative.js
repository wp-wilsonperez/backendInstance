
import moment from 'moment';

import Alternative from "../models/alternative";

let alternativeController = function (app, control={auth, passport, acl}){

   function controller (req, res, next) {
      req.controller = "alternative";
      return next();
   }

   function findAction (callback){
      Alternative.find({}, function (err, docs) {
         if (!err) {
            
            callback(docs);
         }
      });
   }

   app.get('/alternative/filter',[control.auth, controller], (req, res) => {
      let $filter =  global.filter(req.query.filter);
      Alternative.find($filter, function (err, docs) {
         if (typeof docs !== 'undefined') {

            res.send({msg: "OK", alternatives: docs});
            
         } else {
            res.send({
               msg : 'ERR',
               err : err.code
            });
         }
      });

   });

   app.get('/alternative/list', [control.auth, controller, control.acl], (req, res) => {

      Alternative.find({}, function (err, docs) {
         if (typeof docs !== 'undefined') {

            res.send({msg: "OK", alternatives: docs});
            
         } else {
            res.send({
               msg : 'ERR',
               err : err.code
            });
         }
      });

   });

   app.get('/alternative/view/:id', [control.auth, controller, control.acl], (req, res) => {

      Alternative.findById(req.params.id, function (err, doc) {
         if (!err) {
            res.send({msg: "OK", alternative: doc});
         } else {
            res.send({msg: 'ERR', err: err});
         }
      });

   });

   app.post('/alternative/add', [control.auth, controller, control.acl], (req, res) => {

      let alternative = new Alternative({
         name: req.body.name,
         dateCreate: moment(),
         userCreate: req.user.idUser,
         dateUpdate: moment(),
         userUpdate: req.user.idUser
      });

      alternative.save((err, doc) => {
         if(!err){
            findAction(function(docs){
               res.send({msg: "OK", update: docs});
            });
         } else {
            res.send({msg: 'ERR', err: err});
         }            
      });

   });

   app.post('/alternative/edit/:id', [control.auth, controller, control.acl], (req, res) => {

      let filter = {
         _id: req.params.id
      }

      let update = {
         name: req.body.name,
         value: req.body.value,
         dateUpdate: moment(),
         userUpdate: req.user.idUser
      };

      Alternative.findOneAndUpdate(filter, update, function (err, doc) {
         if (!err) {
            findAction(function(docs){
               res.send({msg: "OK", update: docs});
            });
         } else {
            res.send({msg: 'ERR', err: err});
         }
      });

   });

   app.delete('/alternative/delete/:id', [control.auth, controller, control.acl], (req, res) => {

      let filter = {
         _id: req.params.id
      }

      Alternative.findByIdAndRemove(filter, function (err, doc) {
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

export default alternativeController
