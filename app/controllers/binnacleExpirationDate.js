
import moment from 'moment';

import BinnacleExpirationDate from "../models/binnacleExpirationDate";

import ExpirationDate from "../models/renewal";

let binnacleExpirationDateController = function (app, control={auth, passport, acl}){

   function controller (req, res, next) {
      req.controller = "binnacleExpirationDate";
      return next();
   }

   function findAction (callback){
      let $filter =  global.filter(null);
      BinnacleExpirationDate.find($filter, function (err, docs) {
         if (!err) {
            
            ExpirationDate.populate(docs, {path: "expirationDate"},function(err, docs){
               callback(docs);
            });
         }
      });
   }

   app.post('/binnacleExpirationDate/filter',[control.auth, controller], (req, res) => {
      let $filter =  global.filter(req.body.filter);
      BinnacleExpirationDate.find($filter, function (err, docs) {
         if (typeof docs !== 'undefined') {
            control.log(req.route.path, req.user);

            ExpirationDate.populate(docs, {path: "expirationDate"},function(err, docs){
               res.send({msg: "OK", binnacleExpirationDates: docs});
            });
            
         } else {
            let error=global.error(err, 0, req.controller);
            res.send({msg: 'ERROR', err: error});
         }
      });

   });

   app.get('/binnacleExpirationDate/list', [control.auth, controller, control.acl], (req, res) => {
      let $filter =  global.filter(null);
      BinnacleExpirationDate.find($filter, function (err, docs) {
         if (typeof docs !== 'undefined') {
            control.log(req.route.path, req.user);

            ExpirationDate.populate(docs, {path: "expirationDate"},function(err, docs){
               res.send({msg: "OK", binnacleExpirationDates: docs});
            });
            
         } else {
            let error=global.error(err, 0, req.controller);
            res.send({msg: 'ERROR', err: error});
         }
      });

   });

   app.get('/binnacleExpirationDate/view/:id', [control.auth, controller, control.acl], (req, res) => {

      BinnacleExpirationDate.findById(req.params.id, function (err, doc) {
         if (!err) {
            control.log(req.route.path, req.user);
            res.send({msg: "OK", binnacleExpirationDate: doc});
         } else {
            let error=global.error(err, 0, req.controller);
            res.send({msg: 'ERROR', err: error});
         }
      });

   });

   app.post('/binnacleExpirationDate/add', [control.auth, controller, control.acl], (req, res) => {

      let binnacleExpirationDate = new BinnacleExpirationDate({
         idExpirationDate: req.body.idExpirationDate,
         expirationDate: req.body.idExpirationDate,
         callCenterComments: req.body.callCenterComments,
         dateCreate: moment(),
         userCreate: req.user.idUser,
         dateUpdate: moment(),
         userUpdate: req.user.idUser
      });

      binnacleExpirationDate.save((err, doc) => {
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

   app.post('/binnacleExpirationDate/edit/:id', [control.auth, controller, control.acl], (req, res) => {

      let filter = {
         _id: req.params.id
      }

      let update = {
         idExpirationDate: req.body.idExpirationDate,
         expirationDate: req.body.idExpirationDate,
         callCenterComments: req.body.callCenterComments,
         dateUpdate: moment(),
         userUpdate: req.user.idUser
      };

      BinnacleExpirationDate.findOneAndUpdate(filter, update, function (err, doc) {
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

   app.delete('/binnacleExpirationDate/delete/:id', [control.auth, controller, control.acl], (req, res) => {

      let filter = {
         _id: req.params.id
      }

      let update = {
         dateDelete: moment()
      };

      BinnacleExpirationDate.findOneAndUpdate(filter, update, function (err, doc) {
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

      BinnacleExpirationDate.findByIdAndRemove(filter, function (err, doc) {
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

export default binnacleExpirationDateController
