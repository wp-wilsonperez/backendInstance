
import moment from 'moment';

import Business from "../models/business";

let businessController = function (app, control={auth, passport, acl}){

   function controller (req, res, next) {
      req.controller = "business";
      return next();
   }

   function findAction (callback){
      let $filter =  global.filter(null);
      Business.find($filter, function (err, docs) {
         if (!err) {
            callback(docs)
         }
      });
   }

   app.post('/business/filter',[control.auth, controller], (req, res) => {
      let $filter =  global.filter(req.body.filter);
      Business.find($filter, function (err, docs) {
         if (typeof docs !== 'undefined') {
            control.log(req.route.path, req.user);

            res.send({msg: "OK", users: docs});
               
         } else {
            let error=global.error(err, 0, req.controller);
            res.send({msg: 'ERROR', err: error});
         }
      });

   });

   app.get('/business/list', [control.auth, controller, control.acl], (req, res) => {
      let $filter =  global.filter(null);
      Business.find($filter, function (err, docs) {
         if (typeof docs !== 'undefined') {
            control.log(req.route.path, req.user);

            res.send({msg: "OK", businesses: docs});
         } else {
            let error=global.error(err, 0, req.controller);
            res.send({msg: 'ERROR', err: error});
         }
      });

   });

   app.get('/business/view/:id', [control.auth, controller, control.acl], (req, res) => {

      Business.findById(req.params.id, function (err, doc) {
         if (!err) {
            control.log(req.route.path, req.user);
            res.send({msg: "OK", business: doc});
         } else {
            let error=global.error(err, 0, req.controller);
            res.send({msg: 'ERROR', err: error});
         }
      });

   });

   app.post('/business/add', [control.auth, controller, control.acl], (req, res) => {

      let business = new Business({
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

      business.save((err, doc) => {
         if(!err){
            control.log(req.route.path, req.user);
            res.send({msg: "OK", doc: doc});
         } else {
            let error=global.error(err, 0, req.controller);
            res.send({msg: 'ERROR', err: error});
         }            
      });

   });

   app.post('/business/edit/:id', [control.auth, controller, control.acl], (req, res) => {

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

      Business.findOneAndUpdate(filter, update, function (err, doc) {
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

   app.delete('/business/delete/:id', [control.auth, controller, control.acl], (req, res) => {

      let filter = {
         _id: req.params.id
      }

      let update = {
         name: moment(),
         dateDelete: moment()
      };

      Business.findOneAndUpdate(filter, update, function (err, doc) {
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

      Business.findByIdAndRemove(filter, function (err, doc) {
         if(!err){
            findAction(function(docs){
               control.log(req.route.path, req.user);
               res.send({msg: "OK", update: docs});
            });
         } else {
            res.send({msg: 'ERR', err: err});
         }            
      });*/

   });

}

export default businessController
