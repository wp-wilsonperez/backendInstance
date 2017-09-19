
import moment from 'moment';

import ItemAnnex from "../models/itemAnnex";
import PolicyAnnex from "../models/policyAnnex";

let itemAnnexController = function (app, control={auth, passport, acl}){

   function controller (req, res, next) {
      req.controller = "itemAnnex";
      return next();
   }

   function findAction (callback){
      ItemAnnex.find({}, function (err, docs) {
         if (!err) {

            PolicyAnnex.populate(docs, {path: "policyAnnex"},function(err, docs){
               callback(docs);
            });
         }
      });
   }

   app.get('/itemAnnex/filter',[control.auth, controller], (req, res) => {
      let $filter =  global.filter(req.query.filter);
      ItemAnnex.find($filter, function (err, docs) {
         if (typeof docs !== 'undefined') {
            control.log(req.route.path, req.user);
            PolicyAnnex.populate(docs, {path: "policyAnnex"},function(err, docs){
               res.send({msg: "OK", itemAnnexs: docs});
            });
         } else {
            res.send({
               msg : 'ERR',
               err : err.code
            });
         }
      });

   });

   app.get('/itemAnnex/list', [control.auth, controller, control.acl], (req, res) => {

      ItemAnnex.find({}, function (err, docs) {
         if (typeof docs !== 'undefined') {
            control.log(req.route.path, req.user);
            PolicyAnnex.populate(docs, {path: "policyAnnex"},function(err, docs){
               res.send({msg: "OK", itemAnnexs: docs});
            });
         } else {
            res.send({
               msg : 'ERR',
               err : err.code
            });
         }
      });

   });

   app.get('/itemAnnex/view/:id', [control.auth, controller, control.acl], (req, res) => {

      ItemAnnex.findById(req.params.id, function (err, doc) {
         if (!err) {
            control.log(req.route.path, req.user);
            res.send({msg: "OK", itemAnnex: doc});
         } else {
            res.send({msg: 'ERR', err: err});
         }
      });

   });

   app.post('/itemAnnex/add', [control.auth, controller, control.acl], (req, res) => {

      let itemAnnex = new ItemAnnex({
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

      itemAnnex.save((err, doc) => {
         if(!err){
            control.log(req.route.path, req.user);
            res.send({msg: "OK", doc: doc});
         } else {
            res.send({msg: 'ERR', err: err});
         }            
      });

   });

   app.post('/itemAnnex/edit/:id', [control.auth, controller, control.acl], (req, res) => {

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

      ItemAnnex.findOneAndUpdate(filter, update, function (err, doc) {
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

   app.delete('/itemAnnex/delete/:id', [control.auth, controller, control.acl], (req, res) => {

      let filter = {
         _id: req.params.id
      }

      ItemAnnex.findByIdAndRemove(filter, function (err, doc) {
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

export default itemAnnexController
