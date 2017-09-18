
import moment from 'moment';

import SubItemAnnexFire from "../models/subItemAnnexFire";
import ItemAnnexFire from "../models/itemAnnexFire";

let subItemAnnexFireController = function (app, control={auth, passport, acl}){

   function controller (req, res, next) {
      req.controller = "subItemAnnexFire";
      return next();
   }

   function findAction (callback){
      SubItemAnnexFire.find({}, function (err, docs) {
         if (!err) {

         ItemAnnexFire.populate(docs, {path: "itemAnnexFire"},function(err, docs){
               callback(docs);
            });
         }
      });
   }

   app.get('/subItemAnnexFire/filter',[control.auth, controller], (req, res) => {
      let $filter =  global.filter(req.query.filter);
      SubItemAnnexFire.find($filter, function (err, docs) {
         if (typeof docs !== 'undefined') {
            control.log(req.route.path, req.user);
            ItemAnnexFire.populate(docs, {path: "itemAnnexFire"},function(err, docs){
               res.send({msg: "OK", subItemAnnexFires: docs});
            });
         } else {
            res.send({
               msg : 'ERR',
               err : err.code
            });
         }
      });

   });

   app.get('/subItemAnnexFire/list', [control.auth, controller, control.acl], (req, res) => {

      SubItemAnnexFire.find({}, function (err, docs) {
         if (typeof docs !== 'undefined') {
            control.log(req.route.path, req.user);
            ItemAnnexFire.populate(docs, {path: "itemAnnexFire"},function(err, docs){
               res.send({msg: "OK", subItemAnnexFires: docs});
            });
         } else {
            res.send({
               msg : 'ERR',
               err : err.code
            });
         }
      });

   });

   app.get('/subItemAnnexFire/view/:id', [control.auth, controller, control.acl], (req, res) => {

      SubItemAnnexFire.findById(req.params.id, function (err, doc) {
         if (!err) {
            control.log(req.route.path, req.user);
            res.send({msg: "OK", subItemAnnexFire: doc});
         } else {
            res.send({msg: 'ERR', err: err});
         }
      });

   });

   app.post('/subItemAnnexFire/add', [control.auth, controller, control.acl], (req, res) => {

      let subItemAnnexFire = new SubItemAnnexFire({
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

      subItemAnnexFire.save((err, doc) => {
         if(!err){
            control.log(req.route.path, req.user);
            res.send({msg: "OK", doc: doc});
         } else {
            res.send({msg: 'ERR', err: err});
         }            
      });

   });

   app.post('/subItemAnnexFire/edit/:id', [control.auth, controller, control.acl], (req, res) => {

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

      SubItemAnnexFire.findOneAndUpdate(filter, update, function (err, doc) {
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

   app.delete('/subItemAnnexFire/delete/:id', [control.auth, controller, control.acl], (req, res) => {

      let filter = {
         _id: req.params.id
      }

      SubItemAnnexFire.findByIdAndRemove(filter, function (err, doc) {
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

export default subItemAnnexFireController
