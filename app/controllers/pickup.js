
import moment from 'moment';

import Pickup from "../models/pickup";
import User from "../models/user";

let pickupController = function (app, control={auth, passport, acl}){

   function controller (req, res, next) {
      req.controller = "pickup";
      return next();
   }

   function findAction (callback){
      let $filter =  global.filter(null);
      Pickup.find($filter, function (err, docs) {
         if (!err) {
            User.populate(docs, {path: "userAddress"},function(err, docs){
               callback(docs);
            });
         }
      });
   }

   app.post('/pickup/filter',[control.auth, controller], (req, res) => {
      let $filter =  global.filter(req.body.filter);
      Pickup.find($filter, function (err, docs) {
         if (typeof docs !== 'undefined') {
            control.log(req.route.path, req.user);
            User.populate(docs, {path: "userAddress"},function(err, docs){
               res.send({msg: "OK", pickups: docs});
            });
         } else {
            let error=global.error(err, 0, req.controller);
            res.send({msg: 'ERROR', err: error});
         }
      });

   });

   app.get('/pickup/list', [control.auth, controller, control.acl], (req, res) => {
      let $filter =  global.filter(null);
      Pickup.find($filter, function (err, docs) {
         if (typeof docs !== 'undefined') {
            control.log(req.route.path, req.user);
            User.populate(docs, {path: "userAddress"},function(err, docs){
               res.send({msg: "OK", pickups: docs});
            });
         } else {
            let error=global.error(err, 0, req.controller);
            res.send({msg: 'ERROR', err: error});
         }
      });

   });

   app.get('/pickup/view/:id', [control.auth, controller, control.acl], (req, res) => {

      Pickup.findById(req.params.id, function (err, doc) {
         if (!err) {
            control.log(req.route.path, req.user);
            res.send({msg: "OK", pickup: doc});
         } else {
            let error=global.error(err, 0, req.controller);
            res.send({msg: 'ERROR', err: error});
         }
      });

   });

   app.post('/pickup/add', [control.auth, controller, control.acl], (req, res) => {

      let pickup = new Pickup({
         typeSend: req.body.typeSend,
         pickupStatus: req.body.pickupStatus,
         idSend: req.body.idSend,
         send: req.body.send,
         typeSend:req.body.typeSend,
         idUserAddress: req.body.idUserAddress,
         userAddress: req.body.idUserAddress,
         datePickup: req.body.datePickup,
         dateReception: req.body.dateReception,
         details: req.body.details,
         observations: req.body.observations,
         dateCreate: moment(),
         userCreate: req.user.idUser,
         branchCreate: req.user.idBranch,
         dateUpdate: moment(),
         userUpdate: req.user.idUser
      });

      pickup.save((err, doc) => {
         if(!err){
            control.log(req.route.path, req.user);
            res.send({msg: "OK", doc: doc});
         } else {
            let error=global.error(err, 0, req.controller);
            res.send({msg: 'ERROR', err: error});
         }            
      });

   });

   app.post('/pickup/edit/:id', [control.auth, controller, control.acl], (req, res) => {

      let filter = {
         _id: req.params.id
      }

      let update = {
         typeSend: req.body.typeSend,
         pickupStatus: req.body.pickupStatus,
         idSend: req.body.idSend,
         send: req.body.send,
         typeSend:req.body.typeSend,
         idUserAddress: req.body.idUserAddress,
         userAddress: req.body.idUserAddress,
         datePickup: req.body.datePickup,
         dateReception: req.body.dateReception,
         details: req.body.details,
         observations: req.body.observations,
         dateUpdate: moment(),
         userUpdate: req.user.idUser
      };

      Pickup.findOneAndUpdate(filter, update, function (err, doc) {
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

   app.delete('/pickup/delete/:id', [control.auth, controller, control.acl], (req, res) => {

      let filter = {
         _id: req.params.id
      }

      let update = {
         dateDelete: moment()
      };

      Pickup.findOneAndUpdate(filter, update, function (err, doc) {
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

      Pickup.findByIdAndRemove(filter, function (err, doc) {
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

   app.post('/pickup/dateReception', [control.auth, controller, control.acl], (req, res) => {

      let incomes = req.body.idsDate;
      let update = {
         dateReception:  moment(),
         sendingStatus: incomes.status
      };

      for (var i = 0; i < incomes.ids.length; i++) {
         let filter = {
            _id: incomes.ids[i]._id
         }
         Pickup.findOneAndUpdate(filter, update, function (err, doc) {
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

export default pickupController
