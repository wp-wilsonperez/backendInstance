
import moment from 'moment';
import acl from "../configs/acl";

import Setting from "../models/setting";

let settingController = function (app, control={auth, passport, acl}){

   function controller (req, res, next) {
      req.controller = "setting";
      return next();
   }

   function findAction (callback){
      Setting.find({}, function (err, docs) {
         if (!err) {
            callback(docs)
         }
      });
   }

   app.get('/setting/list', [control.auth, controller, control.acl], (req, res) => {

      Setting.find({}, function (err, docs) {
         if (typeof docs !== 'undefined') {
            res.send({msg: "OK", settings: docs});
         } else {
            res.send({
               msg : 'ERR',
               err : err.code
            });
         }
      });

   });

   app.get('/setting/view/:id', [control.auth, controller, control.acl], (req, res) => {

      Setting.findById(req.params.id, function (err, doc) {
         if (!err) {
            res.send({msg: "OK", setting: doc});
         } else {
            res.send({msg: 'ERR', err: err});
         }
      });

   });

   app.post('/setting/add', [control.auth, controller, control.acl], (req, res) => {

      let setting = new Setting({
         iva: req.body.iva,
         connectionTime: req.body.connectionTime,
         maxAttached: req.body.maxAttached,
         idSchedule: req.body.idSchedule,
         idMacs: req.body.idMacs,
         dateCreate: moment(),
         userCreate: req.user.idUser,
         dateUpdate: moment(),
         userUpdate: req.user.idUser
      });

      setting.save((err, doc) => {
         if(!err){
            res.send({msg: "OK", doc: doc});
         } else {
            res.send({msg: 'ERR', err: err});
         }            
      });

   });

   app.post('/setting/edit/:id', [control.auth, controller, control.acl], (req, res) => {

      let filter = {
         _id: req.params.id
      }

      let update = {
         iva: req.body.iva,
         connectionTime: req.body.connectionTime,
         maxAttached: req.body.maxAttached,
         idSchedule: req.body.idSchedule,
         idMacs: req.body.idMacs,
         dateUpdate: moment(),
         userUpdate: req.user.idUser
      };

      Setting.findOneAndUpdate(filter, update, function (err, doc) {
         if (!err) {
            findAction(function(docs){
               res.send({msg: "OK", update: docs});
            });
         } else {
            res.send({msg: 'ERR', err: err});
         }
      });

   });

   app.delete('/license/delete/:id', [control.auth, controller, control.acl], (req, res) => {

      let filter = {
         _id: req.params.id
      }

      Setting.findByIdAndRemove(filter, function (err, doc) {
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

export default settingController
