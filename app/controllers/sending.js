
import moment from 'moment';

import Sending from "../models/sending";
import User from "../models/user";

let sendingController = function (app, control={auth, passport, acl}){

   function controller (req, res, next) {
      req.controller = "income";
      return next();
   }

   function findAction (callback){
      let $filter =  global.filter(null);
      Sending.find($filter, function (err, docs) {
         if (!err) {
            User.populate(docs, {path: "userAddress"},function(err, docs){
               callback(docs);
            });
         }
      });
   }

   app.post('/sending/filter',[control.auth, controller], (req, res) => {
      let $filter =  global.filter(req.body.filter);
      Sending.find($filter, function (err, docs) {
         if (typeof docs !== 'undefined') {
            control.log(req.route.path, req.user);
            User.populate(docs, {path: "userAddress"},function(err, docs){
               res.send({msg: "OK", sendings: docs});
            });
         } else {
            let error=global.error(err, 0, req.controller);
            res.send({msg: 'ERROR', err: error});
         }
      });

   });

   app.get('/sending/list', [control.auth, controller, control.acl], (req, res) => {
      let $filter =  global.filter(null);
      Sending.find($filter, function (err, docs) {
         if (typeof docs !== 'undefined') {
            control.log(req.route.path, req.user);
            User.populate(docs, {path: "userAddress"},function(err, docs){
               res.send({msg: "OK", sendings: docs});
            });
         } else {
            let error=global.error(err, 0, req.controller);
            res.send({msg: 'ERROR', err: error});
         }
      });

   });

   app.get('/sending/view/:id', [control.auth, controller, control.acl], (req, res) => {

      Sending.findById(req.params.id, function (err, doc) {
         if (!err) {
            control.log(req.route.path, req.user);
            res.send({msg: "OK", sending: doc});
         } else {
            let error=global.error(err, 0, req.controller);
            res.send({msg: 'ERROR', err: error});
         }
      });

   });

   app.post('/sending/add', [control.auth, controller, control.acl], (req, res) => {

      let sending = new Sending({
         typeSend: req.body.typeSend,
         sendingStatus: req.body.sendingStatus,
         idSend: req.body.idSend,
         send: req.body.send,
         typeSend:req.body.typeSend,
         idUserAddress: req.body.idUserAddress,
         userAddress: req.body.idUserAddress,
         dateSending: req.body.dateSending,
         dateReception: req.body.dateReception,
         details: req.body.details,
         observations: req.body.observations,
         dateCreate: moment(),
         userCreate: req.user.idUser,
         branchCreate: req.user.idBranch,
         dateUpdate: moment(),
         userUpdate: req.user.idUser
      });

      sending.save((err, doc) => {
         if(!err){
            control.log(req.route.path, req.user);
            res.send({msg: "OK", doc: doc});
         } else {
            let error=global.error(err, 0, req.controller);
            res.send({msg: 'ERROR', err: error});
         }            
      });

   });

   app.post('/sending/edit/:id', [control.auth, controller, control.acl], (req, res) => {

      let filter = {
         _id: req.params.id
      }

      let update = {
         typeSend: req.body.typeSend,
         idSend: req.body.idSend,
         send: req.body.send,
         idUserAddress: req.body.idUserAddress,
         userAddress: req.body.idUserAddress,
         dateSendind: req.body.dateSendind,
         dateReception: req.body.dateReception,
         details: req.body.details,
         observations: req.body.observations,
         dateUpdate: moment(),
         userUpdate: req.user.idUser
      };

      Sending.findOneAndUpdate(filter, update, function (err, doc) {
         if (!err) {
            findAction(function(docs){
               control.log(req.route.path, req.user);
               res.send({msg: "OK", update: docs});
            });
         } else {
            let error=global.error(err, 0, req.controller);
            res.send({msg: 'ERROR', err: error});
         }
      });

   });

   app.delete('/sending/delete/:id', [control.auth, controller, control.acl], (req, res) => {

      let filter = {
         _id: req.params.id
      }

      let update = {
         dateDelete: moment()
      };

      Sending.findOneAndUpdate(filter, update, function (err, doc) {
         if (!err) {
            findAction(function(docs){
               control.log(req.route.path, req.user);
               res.send({msg: "OK", update: docs});
            });
         } else {
            let error=global.error(err, 0, req.controller);
            res.send({msg: 'ERROR', err: error});
         }
      });

      /*let filter = {
         _id: req.params.id
      }

      Sending.findByIdAndRemove(filter, function (err, doc) {
         if(!err){
            findAction(function(docs){
               control.log(req.route.path, req.user);
               res.send({msg: "OK", update: docs});
            });
         } else {
            let error=global.error(err, 0, req.controller);
            res.send({msg: 'ERROR', err: error});
         }            
      });*/

   });

   app.post('/sending/dateReception', [control.auth, controller, control.acl], (req, res) => {

      let incomes = req.body.idsDate;
      let update = {
         dateReception:  moment(),
         sendingStatus: incomes.status
      };

      for (var i = 0; i < incomes.ids.length; i++) {
         let filter = {
            _id: incomes.ids[i]._id
         }
         Sending.findOneAndUpdate(filter, update, function (err, doc) {
            if (!err) {
               //control.log(req.route.path, req.user);
            } else {
            }
         });
      }
      //res.send({msg: 'ERR', err: err});
      res.send({msg: "OK"});

   });

}

export default sendingController
