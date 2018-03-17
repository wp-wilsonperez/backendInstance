
import moment from 'moment';

import NoRenewalRamo from "../models/noRenewalRamo";

import NoRenewal from "../models/noRenewal";
import Ramo from "../models/ramo";

let noRenewalRamoController = function (app, control={auth, passport, acl}){

   function controller (req, res, next) {
      req.controller = "bankInsurance";
      return next();
   }

   function findAction (callback){
      let $filter =  global.filter(null);
      NoRenewalRamo.find($filter, function (err, docs) {
         if (!err) {
            
            NoRenewal.populate(docs, {path: "noRenewal"},function(err, docs){
               Ramo.populate(docs, {path: "ramo"},function(err, docs){
                  callback(docs);
               });
            });
         }
      });
   }

   app.post('/noRenewalRamo/filter',[control.auth, controller], (req, res) => {
      let $filter =  global.filter(req.body.filter);
      NoRenewalRamo.find($filter, function (err, docs) {
         if (typeof docs !== 'undefined') {
            control.log(req.route.path, req.user);

            NoRenewal.populate(docs, {path: "noRenewal"},function(err, docs){
               Ramo.populate(docs, {path: "ramo"},function(err, docs){
                  res.send({msg: "OK", noRenewalRamos: docs});
               });
            });
            
         } else {
            let error=global.error(err, 0, req.controller);
            res.send({msg: 'ERROR', err: error});
         }
      });

   });

   app.get('/noRenewalRamo/list', [control.auth, controller, control.acl], (req, res) => {
      let $filter =  global.filter(null);
      NoRenewalRamo.find($filter, function (err, docs) {
         if (typeof docs !== 'undefined') {
            control.log(req.route.path, req.user);

            NoRenewal.populate(docs, {path: "noRenewal"},function(err, docs){
               Ramo.populate(docs, {path: "ramo"},function(err, docs){
                  res.send({msg: "OK", noRenewalRamos: docs});
               });
            });
            
         } else {
            let error=global.error(err, 0, req.controller);
            res.send({msg: 'ERROR', err: error});
         }
      });

   });

   app.get('/noRenewalRamo/view/:id', [control.auth, controller, control.acl], (req, res) => {

      NoRenewalRamo.findById(req.params.id, function (err, doc) {
         if (!err) {
            control.log(req.route.path, req.user);
            res.send({msg: "OK", noRenewalRamo: doc});
         } else {
            let error=global.error(err, 0, req.controller);
            res.send({msg: 'ERROR', err: error});
         }
      });

   });

   app.post('/noRenewalRamo/add', [control.auth, controller, control.acl], (req, res) => {

      let noRenewalRamo = new NoRenewalRamo({
         name: req.body.name,
         idNoRenewal: req.body.idNoRenewal,
         noRenewal: req.body.idNoRenewal,
         idRamo: req.body.idRamo,
         ramo: req.body.idRamo,
         dateCreate: moment(),
         userCreate: req.user.idUser,
         dateUpdate: moment(),
         userUpdate: req.user.idUser
      });

      noRenewalRamo.save((err, doc) => {
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

   app.post('/noRenewalRamo/edit/:id', [control.auth, controller, control.acl], (req, res) => {

      let filter = {
         _id: req.params.id
      }

      let update = {
         name: req.body.name,
         idNoRenewal: req.body.idNoRenewal,
         noRenewal: req.body.idNoRenewal,
         idRamo: req.body.idRamo,
         ramo: req.body.idRamo,
         dateUpdate: moment(),
         userUpdate: req.user.idUser
      };

      NoRenewalRamo.findOneAndUpdate(filter, update, function (err, doc) {
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

   app.delete('/noRenewalRamo/delete/:id', [control.auth, controller, control.acl], (req, res) => {

      let filter = {
         _id: req.params.id
      }

      let update = {
         dateDelete: moment()
      };

      NoRenewalRamo.findOneAndUpdate(filter, update, function (err, doc) {
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

      NoRenewalRamo.findByIdAndRemove(filter, function (err, doc) {
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

export default noRenewalRamoController
