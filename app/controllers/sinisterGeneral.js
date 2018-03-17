
import moment from 'moment';

import SinisterGeneral from "../models/sinisterGeneral";

let sinisterGeneralController = function (app, control={auth, passport, acl}){

   function controller (req, res, next) {
      req.controller = "sinisterGeneral";
      return next();
   }

   function findAction (callback){
      let $filter =  global.filter(null);
      SinisterGeneral.find($filter, function (err, docs) {
         if (!err) {
            
            callback(docs);
         }
      });
   }

   app.post('/sinisterGeneral/filter',[control.auth, controller], (req, res) => {
      let $filter =  global.filter(req.body.filter);
      SinisterGeneral.find($filter, function (err, docs) {
         if (typeof docs !== 'undefined') {
            control.log(req.route.path, req.user);

            res.send({msg: "OK", sinisterGenerals: docs});
            
         } else {
            let error=global.error(err, 0, req.controller);
            res.send({msg: 'ERROR', err: error});
         }
      });

   });

   app.get('/sinisterGeneral/list', [control.auth, controller, control.acl], (req, res) => {
      let $filter =  global.filter(null);
      SinisterGeneral.find($filter, function (err, docs) {
         if (typeof docs !== 'undefined') {
            control.log(req.route.path, req.user);

            res.send({msg: "OK", sinisterGenerals: docs});
            
         } else {
            let error=global.error(err, 0, req.controller);
            res.send({msg: 'ERROR', err: error});
         }
      });

   });

   app.get('/sinisterGeneral/view/:id', [control.auth, controller, control.acl], (req, res) => {

      SinisterGeneral.findById(req.params.id, function (err, doc) {
         if (!err) {
            control.log(req.route.path, req.user);
            res.send({msg: "OK", sinisterGeneral: doc});
         } else {
            let error=global.error(err, 0, req.controller);
            res.send({msg: 'ERROR', err: error});
         }
      });

   });

   app.post('/sinisterGeneral/add', [control.auth, controller, control.acl], (req, res) => {

      let sinisterGeneral = new SinisterGeneral({
         idSinister: req.body.idSinister,
         sinister: req.body.idSinister,
         workshop: req.body.workshop,
         arrangement: req.body.arrangement,
         rasa: req.body.rasa,
         sinisterValue: req.body.sinisterValue,
         rc: req.body.rc,
         deductibleValue: req.body.deductibleValue,
         depreciation: req.body.depreciation,
         others1: req.body.others1,
         others2: req.body.others2,
         others3: req.body.others3,
         notCovered: req.body.notCovered,
         observationNotCovered: req.body.observationNotCovered,
         liquidation: req.body.liquidation,
         liquidationDate: req.body.liquidationDate,
         deliverDate: req.body.deliverDate,
         sinisterMap: req.body.sinisterMap,
         dateCreate: moment(),
         userCreate: req.user.idUser,
         dateUpdate: moment(),
         userUpdate: req.user.idUser
      });

      sinisterGeneral.save((err, doc) => {
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

   app.post('/sinisterGeneral/edit/:id', [control.auth, controller, control.acl], (req, res) => {

      let filter = {
         _id: req.params.id
      }

      let update = {
         idSinister: req.body.idSinister,
         sinister: req.body.idSinister,
         workshop: req.body.workshop,
         arrangement: req.body.arrangement,
         rasa: req.body.rasa,
         sinisterValue: req.body.sinisterValue,
         rc: req.body.rc,
         deductibleValue: req.body.deductibleValue,
         depreciation: req.body.depreciation,
         others1: req.body.others1,
         others2: req.body.others2,
         others3: req.body.others3,
         notCovered: req.body.notCovered,
         observationNotCovered: req.body.observationNotCovered,
         liquidation: req.body.liquidation,
         liquidationDate: req.body.liquidationDate,
         deliverDate: req.body.deliverDate,
         sinisterMap: req.body.sinisterMap,
         dateUpdate: moment(),
         userUpdate: req.user.idUser
      };

      SinisterGeneral.findOneAndUpdate(filter, update, function (err, doc) {
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

   app.delete('/sinisterGeneral/delete/:id', [control.auth, controller, control.acl], (req, res) => {

      let filter = {
         _id: req.params.id
      }

      let update = {
         dateDelete: moment()
      };

      SinisterGeneral.findOneAndUpdate(filter, update, function (err, doc) {
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

      SinisterGeneral.findByIdAndRemove(filter, function (err, doc) {
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

export default sinisterGeneralController
