
import moment from 'moment';
import acl from "../configs/acl";

import Setting from "../models/setting";

let settingController = function (app, control={auth, passport, acl}){

   function controller (req, res, next) {
      req.controller = "setting";
      return next();
   }

   function findAction (callback){
      let $filter =  global.filter(null);
      Setting.find($filter, function (err, docs) {
         if (!err) {
            callback(docs)
         }
      });
   }

   app.post('/setting/filter',[control.auth, controller], (req, res) => {
      let $filter =  global.filter(req.body.filter);
      Setting.find($filter, function (err, docs) {
         if (typeof docs !== 'undefined') {
            control.log(req.route.path, req.user);
            res.send({msg: "OK", settings: docs});
         } else {
            let error=global.error(err, 0, req.controller);
            res.send({msg: 'ERROR', err: error});
         }
      });

   });

   app.get('/setting/list', [control.auth, controller, control.acl], (req, res) => {
      let $filter =  global.filter(null);
      Setting.find($filter, function (err, docs) {
         if (typeof docs !== 'undefined') {
            control.log(req.route.path, req.user);
            res.send({msg: "OK", settings: docs});
         } else {
            let error=global.error(err, 0, req.controller);
            res.send({msg: 'ERROR', err: error});
         }
      });

   });

   app.get('/setting/view/:id', [control.auth, controller, control.acl], (req, res) => {

      Setting.findById(req.params.id, function (err, doc) {
         if (!err) {
            control.log(req.route.path, req.user);
            res.send({msg: "OK", setting: doc});
         } else {
            let error=global.error(err, 0, req.controller);
            res.send({msg: 'ERROR', err: error});
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
         sbancos: req.body.sbancos,
         scampesino: req.body.scampesino,
         dateCreate: moment(),
         userCreate: req.user.idUser,
         dateUpdate: moment(),
         userUpdate: req.user.idUser
      });

      setting.save((err, doc) => {
         if(!err){
            control.log(req.route.path, req.user);
            res.send({msg: "OK", doc: doc});
         } else {
            let error=global.error(err, 0, req.controller);
            res.send({msg: 'ERROR', err: error});
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
         sbancos: req.body.sbancos,
         scampesino: req.body.scampesino,
         dateUpdate: moment(),
         userUpdate: req.user.idUser
      };

      Setting.findOneAndUpdate(filter, update, function (err, doc) {
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

   app.delete('/license/delete/:id', [control.auth, controller, control.acl], (req, res) => {

      let filter = {
         _id: req.params.id
      }

      let update = {
         dateDelete: moment()
      };

      Setting.findOneAndUpdate(filter, update, function (err, doc) {
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

      Setting.findByIdAndRemove(filter, function (err, doc) {
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

}

export default settingController
