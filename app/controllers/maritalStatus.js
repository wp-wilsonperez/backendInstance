
import moment from 'moment';

import MaritalStatus from "../models/maritalStatus";

let maritalStatusController = function (app, control={auth, passport, acl}){

   function controller (req, res, next) {
      req.controller = "maritalStatus";
      return next();
   }

   function findAction (callback){
      MaritalStatus.find({}, function (err, docs) {
         if (!err) {
            callback(docs)
         }
      });
   }

   app.get('/maritalStatus/filter',[control.auth, controller], (req, res) => {
      let $filter =  global.filter(req.query.filter);
      MaritalStatus.find($filter, function (err, docs) {
         if (typeof docs !== 'undefined') {
            control.log(req.route.path, req.user);
            res.send({msg: "OK", maritalStatus: docs});
         } else {
            res.send({
               msg : 'ERR',
               err : err.code
            });
         }
      });

   });

   app.get('/maritalStatus/list', [control.auth, controller, control.acl], (req, res) => {

      MaritalStatus.find({}, function (err, docs) {
         if (typeof docs !== 'undefined') {
            control.log(req.route.path, req.user);
            res.send({msg: "OK", maritalStatus: docs});
         } else {
            res.send({
               msg : 'ERR',
               err : err.code
            });
         }
      });

   });

   app.get('/maritalStatus/view/:id', [control.auth, controller, control.acl], (req, res) => {

      MaritalStatus.findById(req.params.id, function (err, doc) {
         if (!err) {
            control.log(req.route.path, req.user);
            res.send({msg: "OK", maritalStatus: doc});
         } else {
            res.send({msg: 'ERR', err: err});
         }
      });

   });

   app.post('/maritalStatus/add', [control.auth, controller, control.acl], (req, res) => {

      let maritalStatus = new MaritalStatus({
         name: req.body.name,
         dateCreate: moment(),
         userCreate: req.user.idUser,
         dateUpdate: moment(),
         userUpdate: req.user.idUser
      });

      maritalStatus.save((err, doc) => {
         if(!err){
            findAction(function(docs){
               control.log(req.route.path, req.user);
               res.send({msg: "OK", update: docs});
            });
         } else {
            res.send({msg: 'ERR', err: err});
         }            
      });

   });

   app.post('/maritalStatus/edit/:id', [control.auth, controller, control.acl], (req, res) => {

      let filter = {
         _id: req.params.id
      }

      let update = {
         name: req.body.name,
         dateUpdate: moment(),
         userUpdate: req.user.idUser
      };

      MaritalStatus.findOneAndUpdate(filter, update, function (err, doc) {
         if (!err) {
            findAction(function(docs){
               control.log(req.route.path, req.user);
               res.send({msg: "OK", update: docs});
            });
         } else {
            res.send({msg: 'ERR', err: err});
         }
      });

   });

   app.delete('/maritalStatus/delete/:id', [control.auth, controller, control.acl], (req, res) => {

      let filter = {
         _id: req.params.id
      }

      MaritalStatus.findByIdAndRemove(filter, function (err, doc) {
         if(!err){
            findAction(function(docs){
               control.log(req.route.path, req.user);
               res.send({msg: "OK", update: docs});
            });
         } else {
            res.send({msg: 'ERR', err: err});
         }            
      });

   });

}

export default maritalStatusController
