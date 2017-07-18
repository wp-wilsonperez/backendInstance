
import moment from 'moment';

import ItemAnnexExtra from "../models/itemAnnexExtra";

import ItemAnnexCar from "../models/itemAnnexCar";

let itemAnnexExtraController = function (app, control={auth, passport, acl}){

   function controller (req, res, next) {
      req.controller = "itemAnnexExtra";
      return next();
   }

   function findAction (callback){
      ItemAnnexExtra.find({}, function (err, docs) {
         if (!err) {
            
            ItemAnnexCar.populate(docs, {path: "itemAnnexCar"},function(err, docs){
               callback(docs);
            });
         }
      });
   }

   app.get('/itemAnnexExtra/list', [control.auth, controller, control.acl], (req, res) => {

      ItemAnnexExtra.find({}, function (err, docs) {
         if (typeof docs !== 'undefined') {

            ItemAnnexCar.populate(docs, {path: "itemAnnexCar"},function(err, docs){
               res.send({msg: "OK", itemAnnexExtras: docs});
            });
            
         } else {
            res.send({
               msg : 'ERR',
               err : err.code
            });
         }
      });

   });

   app.get('/itemAnnexExtra/view/:id', [control.auth, controller, control.acl], (req, res) => {

      ItemAnnexExtra.findById(req.params.id, function (err, doc) {
         if (!err) {
            res.send({msg: "OK", itemAnnexExtra: doc});
         } else {
            res.send({msg: 'ERR', err: err});
         }
      });

   });

   app.post('/itemAnnexExtra/add', [control.auth, controller, control.acl], (req, res) => {

      let itemAnnexExtra = new ItemAnnexExtra({
         idItemAnnexCar: req.body.idItemAnnexCar,
         itemAnnexCar: req.body.itemAnnexCar,
         extraDetails: req.body.extraDetails,
         extraValue: req.body.extraValue,
         extraTasa: req.body.extraTasa,
         exclusionDate: req.body.exclusionDate,
         inclusionDate: req.body.inclusionDate,
         modificationDate: req.body.modificationDate,
         dateCreate: moment(),
         userCreate: req.user.idUser,
         dateUpdate: moment(),
         userUpdate: req.user.idUser
      });

      itemAnnexExtra.save((err, doc) => {
         if(!err){
            findAction(function(docs){
               res.send({msg: "OK", update: docs});
            });
         } else {
            res.send({msg: 'ERR', err: err});
         }            
      });

   });

   app.post('/itemAnnexExtra/edit/:id', [control.auth, controller, control.acl], (req, res) => {

      let filter = {
         _id: req.params.id
      }

      let update = {
         idItemAnnexCar: req.body.idItemAnnexCar,
         itemAnnexCar: req.body.itemAnnexCar,
         extraDetails: req.body.extraDetails,
         extraValue: req.body.extraValue,
         extraTasa: req.body.extraTasa,
         exclusionDate: req.body.exclusionDate,
         inclusionDate: req.body.inclusionDate,
         modificationDate: req.body.modificationDate,
         dateUpdate: moment(),
         userUpdate: req.user.idUser
      };

      ItemAnnexExtra.findOneAndUpdate(filter, update, function (err, doc) {
         if (!err) {
            findAction(function(docs){
               res.send({msg: "OK", update: docs});
            });
         } else {
            res.send({msg: 'ERR', err: err});
         }
      });

   });

   app.delete('/itemAnnexExtra/delete/:id', [control.auth, controller, control.acl], (req, res) => {

      let filter = {
         _id: req.params.id
      }

      ItemAnnexExtra.findByIdAndRemove(filter, function (err, doc) {
         if(!err){
            findAction(function(docs){
               res.send({msg: "OK", update: docs});
            });
         } else {
            res.send({msg: 'ERR', err: err});
         }            
      });

   });

}

export default itemAnnexExtraController
