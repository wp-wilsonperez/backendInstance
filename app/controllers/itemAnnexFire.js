
import moment from 'moment';

import ItemAnnexFire from "../models/itemAnnexFire";
import PolicyAnnex from "../models/policyAnnex";

let itemAnnexFireController = function (app, control={auth, passport, acl}){

   function controller (req, res, next) {
      req.controller = "itemAnnexFire";
      return next();
   }

   function findAction (callback){
      ItemAnnexFire.find({}, function (err, docs) {
         if (!err) {

            PolicyAnnex.populate(docs, {path: "policyAnnex"},function(err, docs){
               callback(docs);
            });
         }
      });
   }

   app.get('/itemAnnexFire/filter',[control.auth, controller], (req, res) => {
      let $filter =  global.filter(req.query.filter);
      ItemAnnexFire.find($filter, function (err, docs) {
         if (typeof docs !== 'undefined') {
            control.log(req.route.path, req.user);
            PolicyAnnex.populate(docs, {path: "policyAnnex"},function(err, docs){
               res.send({msg: "OK", itemAnnexFires: docs});
            });
         } else {
            res.send({
               msg : 'ERR',
               err : err.code
            });
         }
      });

   });

   app.get('/itemAnnexFire/list', [control.auth, controller, control.acl], (req, res) => {

      ItemAnnexFire.find({}, function (err, docs) {
         if (typeof docs !== 'undefined') {
            control.log(req.route.path, req.user);
            PolicyAnnex.populate(docs, {path: "policyAnnex"},function(err, docs){
               res.send({msg: "OK", itemAnnexFires: docs});
            });
         } else {
            res.send({
               msg : 'ERR',
               err : err.code
            });
         }
      });

   });

   app.get('/itemAnnexFire/view/:id', [control.auth, controller, control.acl], (req, res) => {

      ItemAnnexFire.findById(req.params.id, function (err, doc) {
         if (!err) {
            control.log(req.route.path, req.user);
            res.send({msg: "OK", itemAnnexFire: doc});
         } else {
            res.send({msg: 'ERR', err: err});
         }
      });

   });

   app.post('/itemAnnexFire/add', [control.auth, controller, control.acl], (req, res) => {

      let itemAnnexFire = new ItemAnnexFire({
         name: req.body.name,
         idRamo: req.body.idRamo,
         ramo: req.body.idRamo,
         idInsurance: req.body.idInsurance,
         insurance: req.body.idInsurance,
         desciption: req.body.desciption,
         dateCreate: moment(),
         userCreate: req.user.idUser,
         dateUpdate: moment(),
         userUpdate: req.user.idUser
      });

      itemAnnexFire.save((err, doc) => {
         if(!err){
            control.log(req.route.path, req.user);
            res.send({msg: "OK", doc: doc});
         } else {
            res.send({msg: 'ERR', err: err});
         }            
      });

   });

   app.post('/itemAnnexFire/edit/:id', [control.auth, controller, control.acl], (req, res) => {

      let filter = {
         _id: req.params.id
      }

      let update = {
         name: req.body.name,
         idRamo: req.body.idRamo,
         ramo: req.body.idRamo,
         idInsurance: req.body.idInsurance,
         insurance: req.body.idInsurance,
         desciption: req.body.desciption,
         dateUpdate: moment(),
         userUpdate: req.user.idUser
      };

      ItemAnnexFire.findOneAndUpdate(filter, update, function (err, doc) {
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

   app.delete('/itemAnnexFire/delete/:id', [control.auth, controller, control.acl], (req, res) => {

      let filter = {
         _id: req.params.id
      }

      ItemAnnexFire.findByIdAndRemove(filter, function (err, doc) {
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

export default itemAnnexFireController
