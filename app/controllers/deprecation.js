
import moment from 'moment';

import Deprecation from "../models/deprecation";
import Ramo from "../models/ramo";
import Branch from "../models/branch";

let deprecationController = function (app, control={auth, passport, acl}){

   function controller (req, res, next) {
      req.controller = "deprecation";
      return next();
   }

   function findAction (callback){
      let $filter =  global.filter(null);
      Deprecation.find($filter, function (err, docs) {
         if (!err) {
            Ramo.populate(docs, {path: "ramo"},function(err, docs){
               Branch.populate(docs, {path: "branch"},function(err, docs){
                  callback(docs);
               });
            });
         }
      });
   }

   app.post('/deprecation/filter',[control.auth, controller], (req, res) => {
      let $filter =  global.filter(req.body.filter);
      Deprecation.find($filter, function (err, docs) {
         if (typeof docs !== 'undefined') {
            control.log(req.route.path, req.user);
            Ramo.populate(docs, {path: "ramo"},function(err, docs){
               Branch.populate(docs, {path: "branch"},function(err, docs){
                  res.send({msg: "OK", deprecations: docs});
               });
            });
            
         } else {
            let error=global.error(err, 0, req.controller);
            res.send({msg: 'ERROR', err: error});
         }
      });

   });

   app.get('/deprecation/list', [control.auth, controller, control.acl], (req, res) => {
      let $filter =  global.filter(null);
      Deprecation.find($filter, function (err, docs) {
         if (typeof docs !== 'undefined') {
            control.log(req.route.path, req.user);
            Ramo.populate(docs, {path: "ramo"},function(err, docs){
               Branch.populate(docs, {path: "branch"},function(err, docs){
                  res.send({msg: "OK", deprecations: docs});
               });
            });
            
         } else {
            let error=global.error(err, 0, req.controller);
            res.send({msg: 'ERROR', err: error});
         }
      });

   });

   app.get('/deprecation/view/:id', [control.auth, controller, control.acl], (req, res) => {

      Deprecation.findById(req.params.id, function (err, doc) {
         if (!err) {
            control.log(req.route.path, req.user);
            res.send({msg: "OK", deprecation: doc});
         } else {
            let error=global.error(err, 0, req.controller);
            res.send({msg: 'ERROR', err: error});
         }
      });

   });

   app.post('/deprecation/add', [control.auth, controller, control.acl], (req, res) => {

      let deprecation = new Deprecation({
         idRamo: req.body.idRamo,
         ramo: req.body.idRamo,
         idBranch: req.body.idBranch,
         branch: req.body.idBranch,
         year: req.body.year,
         value: req.body.value,
         typeYear: req.body.typeYear,
         activated: false,
         dateCreate: moment(),
         userCreate: req.user.idUser,
         dateUpdate: moment(),
         userUpdate: req.user.idUser
      });

      deprecation.save((err, doc) => {
         if(!err){
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

   app.post('/deprecation/edit/:id', [control.auth, controller, control.acl], (req, res) => {

      let filter = {
         _id: req.params.id
      }

      let update = {
         idRamo: req.body.idRamo,
         ramo: req.body.idRamo,
         idBranch: req.body.idBranch,
         branch: req.body.idBranch,
         year: req.body.year,
         value: req.body.value,
         typeYear: req.body.typeYear,
         dateUpdate: moment(),
         userUpdate: req.user.idUser
      };

      Deprecation.findOneAndUpdate(filter, update, function (err, doc) {
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

   app.delete('/deprecation/delete/:id', [control.auth, controller, control.acl], (req, res) => {

      let filter = {
         _id: req.params.id
      }

      Deprecation.findByIdAndRemove(filter, function (err, doc) {
         if(!err){
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

}

export default deprecationController
