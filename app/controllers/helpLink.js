
import moment from 'moment';

import HelpLink from "../models/helpLink";

let helpLinkController = function (app, control={auth, passport, acl}){

   function controller (req, res, next) {
      req.controller = "helpLink";
      return next();
   }

   function findAction (callback){
      HelpLink.find({}, function (err, docs) {
         if (!err) {
            callback(docs)
         }
      });
   }

   app.get('/helpLink/list', [control.auth, controller, control.acl], (req, res) => {

      HelpLink.find({}, function (err, docs) {
         if (typeof docs !== 'undefined') {
            res.send({msg: "OK", helpLinks: docs});
         } else {
            res.send({
               msg : 'ERR',
               err : err.code
            });
         }
      });

   });

   app.get('/helpLink/view/:id', [control.auth, controller, control.acl], (req, res) => {

      HelpLink.findById(req.params.id, function (err, doc) {
         if (!err) {
            res.send({msg: "OK", helpLink: doc});
         } else {
            res.send({msg: 'ERR', err: err});
         }
      });

   });

   app.post('/helpLink/add', [control.auth, controller, control.acl], (req, res) => {

      let helpLink = new HelpLink({
         ruc: req.body.ruc,
         name: req.body.name,
         address: req.body.address,
         phones: req.body.phones,
         cellPhone: req.body.cellPhone,
         map: req.body.map,
         mail: req.body.mail,
         dateCreate: moment(),
         userCreate: req.user.idUser,
         dateUpdate: moment(),
         userUpdate: req.user.idUser
      });

      helpLink.save((err, doc) => {
         if(!err){
            res.send({msg: "OK", doc: doc});
         } else {
            res.send({msg: 'ERR', err: err});
         }            
      });

   });

   app.post('/helpLink/edit/:id', [control.auth, controller, control.acl], (req, res) => {

      let filter = {
         _id: req.params.id
      }

      let update = {
         ruc: req.body.ruc,
         name: req.body.name,
         address: req.body.address,
         phones: req.body.phones,
         cellPhone: req.body.cellPhone,
         map: req.body.map,
         mail: req.body.mail,
         dateUpdate: moment(),
         userUpdate: req.user.idUser
      };

      HelpLink.findOneAndUpdate(filter, update, function (err, doc) {
         if (!err) {
            findAction(function(docs){
               res.send({msg: "OK", update: docs});
            });
         } else {
            res.send({msg: 'ERR', err: err});
         }
      });

   });

   app.delete('/helpLink/delete/:id', [control.auth, controller, control.acl], (req, res) => {

      let filter = {
         _id: req.params.id
      }

      HelpLink.findByIdAndRemove(filter, function (err, doc) {
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

export default helpLinkController
