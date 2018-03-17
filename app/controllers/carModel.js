
import moment from 'moment';

import CarModel from "../models/carModel";

import Country from "../models/country";
import CarBrand from "../models/carBrand";
import CarType from "../models/carType";
import CarColor from "../models/carColor";

let carModelController = function (app, control={auth, passport, acl}){

   function controller (req, res, next) {
      req.controller = "carModel";
      return next();
   }

   function findAction (callback){
      let $filter =  global.filter(null);
      CarModel.find($filter, function (err, docs) {
         if (!err) {
            
            Country.populate(docs, {path: "country"},function(err, docs){
               CarBrand.populate(docs, {path: "carBrand"},function(err, docs){
                  CarType.populate(docs, {path: "carType"},function(err, docs){
                     CarColor.populate(docs, {path: "color"},function(err, docs){
                        callback(docs);
                     });
                  });
               });
            });
         }
      });
   }

   app.post('/carModel/filter',[control.auth, controller], (req, res) => {
      let $filter =  global.filter(req.body.filter);
      CarModel.find($filter, function (err, docs) {
         if (typeof docs !== 'undefined') {
            control.log(req.route.path, req.user);

            Country.populate(docs, {path: "country"},function(err, docs){
               CarBrand.populate(docs, {path: "carBrand"},function(err, docs){
                  CarType.populate(docs, {path: "carType"},function(err, docs){
                     CarColor.populate(docs, {path: "color"},function(err, docs){
                        res.send({msg: "OK", carModels: docs});
                     });
                  });
               });
            });
            
         } else {
            let error=global.error(err, 0, req.controller);
            res.send({msg: 'ERROR', err: error});
         }
      });

   });

   app.get('/carModel/list', [control.auth, controller, control.acl], (req, res) => {
      let $filter =  global.filter(null);
      CarModel.find($filter, function (err, docs) {
         if (typeof docs !== 'undefined') {
            control.log(req.route.path, req.user);

            Country.populate(docs, {path: "country"},function(err, docs){
               CarBrand.populate(docs, {path: "carBrand"},function(err, docs){
                  CarType.populate(docs, {path: "carType"},function(err, docs){
                     CarColor.populate(docs, {path: "color"},function(err, docs){
                        res.send({msg: "OK", carModels: docs});
                     });
                  });
               });
            });
            
         } else {
            let error=global.error(err, 0, req.controller);
            res.send({msg: 'ERROR', err: error});
         }
      });

   });

   app.get('/carModel/view/:id', [control.auth, controller, control.acl], (req, res) => {

      CarModel.findById(req.params.id, function (err, doc) {
         if (!err) {
            control.log(req.route.path, req.user);
            res.send({msg: "OK", carModel: doc});
         } else {
            let error=global.error(err, 0, req.controller);
            res.send({msg: 'ERROR', err: error});
         }
      });

   });

   app.post('/carModel/add', [control.auth, controller, control.acl], (req, res) => {

      let carModel = new CarModel({
         name: req.body.name,
         cylinder: req.body.cylinder,
         year: req.body.year,
         idCountry: req.body.idCountry,
         country: req.body.idCountry,
         idCarBrand: req.body.idCarBrand,
         carBrand: req.body.idCarBrand,
         idCarType: req.body.idCarType,
         carType: req.body.idCarType,
         idColor: req.body.idColor,
         color: req.body.idColor,
         dateCreate: moment(),
         userCreate: req.user.idUser,
         dateUpdate: moment(),
         userUpdate: req.user.idUser
      });

      carModel.save((err, doc) => {
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

   app.post('/carModel/edit/:id', [control.auth, controller, control.acl], (req, res) => {

      let filter = {
         _id: req.params.id
      }

      let update = {
         name: req.body.name,
         cylinder: req.body.cylinder,
         year: req.body.year,
         idCountry: req.body.idCountry,
         country: req.body.idCountry,
         idCarBrand: req.body.idCarBrand,
         carBrand: req.body.idCarBrand,
         idCarType: req.body.idCarType,
         carType: req.body.idCarType,
         idColor: req.body.idColor,
         color: req.body.idColor,
         dateUpdate: moment(),
         userUpdate: req.user.idUser
      };

      CarModel.findOneAndUpdate(filter, update, function (err, doc) {
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

   app.delete('/carModel/delete/:id', [control.auth, controller, control.acl], (req, res) => {

      let filter = {
         _id: req.params.id
      }

      let update = {
         dateDelete: moment()
      };

      carModel.findOneAndUpdate(filter, update, function (err, doc) {
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

      CarModel.findByIdAndRemove(filter, function (err, doc) {
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

export default carModelController
