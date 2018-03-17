
import moment from 'moment';

import ItemAnnexCar from "../models/itemAnnexCar";

import PolicyAnnex from "../models/policyAnnex";
import Car from "../models/car";

let itemAnnexCarController = function (app, control={auth, passport, acl}){

   function controller (req, res, next) {
      req.controller = "itemAnnexCar";
      return next();
   }

   function findAction (callback){
      let $filter =  global.filter(null);
      ItemAnnexCar.find($filter, function (err, docs) {
         if (!err) {
            
            PolicyAnnex.populate(docs, {path: "policyAnnex"},function(err, docs){
               Car.populate(docs, {path: "car"},function(err, docs){
                  callback(docs);
               });
            });
         }
      });
   }

   app.post('/itemAnnexCar/filter',[control.auth, controller], (req, res) => {
      let $filter =  global.filter(req.body.filter);
      ItemAnnexCar.find($filter, function (err, docs) {
         if (typeof docs !== 'undefined') {
            control.log(req.route.path, req.user);

            PolicyAnnex.populate(docs, {path: "policyAnnex"},function(err, docs){
               Car.populate(docs, {path: "car"},function(err, docs){
                  res.send({msg: "OK", itemAnnexCars: docs});
               });
            });
            
         } else {
            let error=global.error(err, 0, req.controller);
            res.send({msg: 'ERROR', err: error});
         }
      });

   });

   app.get('/itemAnnexCar/list', [control.auth, controller, control.acl], (req, res) => {
      let $filter =  global.filter(null);
      ItemAnnexCar.find($filter, function (err, docs) {
         if (typeof docs !== 'undefined') {
            control.log(req.route.path, req.user);

            PolicyAnnex.populate(docs, {path: "policyAnnex"},function(err, docs){
               Car.populate(docs, {path: "car"},function(err, docs){
                  res.send({msg: "OK", itemAnnexCars: docs});
               });
            });
            
         } else {
            let error=global.error(err, 0, req.controller);
            res.send({msg: 'ERROR', err: error});
         }
      });

   });
    
   app.get('/itemAnnexCar/param/:idPolicyAnnex', [control.auth, controller, control.acl], (req, res) => {

      ItemAnnexCar.find({idPolicyAnnex: req.params.idPolicyAnnex}, function (err, doc) {
         if (!err) {
            control.log(req.route.path, req.user);
            res.send({msg: "OK", itemAnnexCars: doc});
         } else {
            let error=global.error(err, 0, req.controller);
            res.send({msg: 'ERROR', err: error});
         }
      });

   });

   


   app.get('/itemAnnexCar/view/:id', [control.auth, controller, control.acl], (req, res) => {

      ItemAnnexCar.findById(req.params.id, function (err, doc) {
         if (!err) {
            control.log(req.route.path, req.user);
            res.send({msg: "OK", itemAnnexCar: doc});
         } else {
            let error=global.error(err, 0, req.controller);
            res.send({msg: 'ERROR', err: error});
         }
      });

   });

   app.post('/itemAnnexCar/add', [control.auth, controller, control.acl], (req, res) => {

      let itemAnnexCar = new ItemAnnexCar({
         idPolicyAnnex: req.body.idPolicyAnnex,
         policyAnnex: req.body.idPolicyAnnex,
         idCar: req.body.idCar,
         tasa: req.body.tasa,
         carUse: req.body.carUse,
         interest: req.body.interest,
         carValue: req.body.carValue,
         amparoPatrimonial: req.body.amparoPatrimonial,
         rc: req.body.rc,
         others: req.body.others,
         othersPrima: req.body.othersPrima,
         detailsCar: req.body.detailsCar,
         prima: req.body.prima,
         exclusionDate: req.body.exclusionDate,
         inclusionDate: req.body.inclusionDate,
         modificationDate: req.body.modificationDate,
         dateCreate: moment(),
         userCreate: req.user.idUser,
         dateUpdate: moment(),
         userUpdate: req.user.idUser
      });

      itemAnnexCar.save((err, doc) => {
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

   app.post('/itemAnnexCar/edit/:id', [control.auth, controller, control.acl], (req, res) => {

      let filter = {
         _id: req.params.id
      }

      let update = {
         idPolicyAnnex: req.body.idPolicyAnnex,
         policyAnnex: req.body.idPolicyAnnex,
         idCar: req.body.idCar,
         car: req.body.idCar,
         tasa: req.body.tasa,
         carUse: req.body.carUse,
         interest: req.body.interest,
         carValue: req.body.carValue,
         amparoPatrimonial: req.body.amparoPatrimonial,
         rc: req.body.rc,
         others: req.body.others,
         othersPrima: req.body.othersPrima,
         detailsCar: req.body.detailsCar,
         prima: req.body.prima,
         exclusionDate: req.body.exclusionDate,
         inclusionDate: req.body.inclusionDate,
         modificationDate: req.body.modificationDate,
         dateUpdate: moment(),
         userUpdate: req.user.idUser
      };

      ItemAnnexCar.findOneAndUpdate(filter, update, function (err, doc) {
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

   app.delete('/itemAnnexCar/delete/:id', [control.auth, controller, control.acl], (req, res) => {

      let filter = {
         _id: req.params.id
      }

      let update = {
         dateDelete: moment()
      };

      ItemAnnexCar.findOneAndUpdate(filter, update, function (err, doc) {
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

      ItemAnnexCar.findByIdAndRemove(filter, function (err, doc) {
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

export default itemAnnexCarController
