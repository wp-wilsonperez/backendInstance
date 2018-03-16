
import moment from 'moment';

import Car from "../models/car";

import Client from "../models/client";
import Ramo from "../models/ramo";
import CarBrand from "../models/carBrand";
import CarModel from "../models/carModel";

let carController = function (app, control={auth, passport, acl}){

   function controller (req, res, next) {
      req.controller = "car";
      return next();
   }

   function findAction (callback){
      let $filter =  global.filter(null);
      Car.find($filter, function (err, docs) {
         if (!err) {
            
            Client.populate(docs, {path: "client"},function(err, docs){
               Ramo.populate(docs, {path: "ramo"},function(err, docs){
                  CarBrand.populate(docs, {path: "carBrand"},function(err, docs){
                     CarModel.populate(docs, {path: "carModel"},function(err, docs){
                        callback(docs);
                     });
                  });
               });
            });
         }
      });
   }
   
   app.post('/car/filter',[control.auth, controller], (req, res) => {
    let filter =  req.body.filter;
        Car.find(filter, function (err, docs) {
            if (typeof docs !== 'undefined') {
                control.log(req.route.path, req.user);

                Client.populate(docs, {path: "client"},function(err, docs){
                    Ramo.populate(docs, {path: "ramo"},function(err, docs){
                       CarBrand.populate(docs, {path: "carBrand"},function(err, docs){
                          CarModel.populate(docs, {path: "carModel"},function(err, docs){
                             res.send({msg: "OK", cars: docs});
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

   app.get('/car/list', [control.auth, controller, control.acl], (req, res) => {
      let $filter =  global.filter(null);
        Car.find($filter, function (err, docs) {
         if (typeof docs !== 'undefined') {
            control.log(req.route.path, req.user);

            Client.populate(docs, {path: "client"},function(err, docs){
               Ramo.populate(docs, {path: "ramo"},function(err, docs){
                  CarBrand.populate(docs, {path: "carBrand"},function(err, docs){
                     CarModel.populate(docs, {path: "carModel"},function(err, docs){
                        res.send({msg: "OK", cars: docs});
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

   app.get('/car/view/:id', [control.auth, controller, control.acl], (req, res) => {

      Car.findById(req.params.id, function (err, doc) {
         if (!err) {
            control.log(req.route.path, req.user);
            Client.populate(doc, {path: "client"},function(err, doc){
               Ramo.populate(doc, {path: "ramo"},function(err, doc){
                  CarBrand.populate(doc, {path: "carBrand"},function(err, doc){
                     CarModel.populate(doc, {path: "carModel"},function(err, doc){
                        res.send({msg: "OK", car: doc});
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

   app.post('/car/add', [control.auth, controller, control.acl], (req, res) => {

      let car = new Car({
         idClient: req.body.idClient,
         client: req.body.idClient,
         idRamo: req.body.idRamo,
         ramo: req.body.idRamo,
         idCarBrand: req.body.idCarBrand,
         carBrand: req.body.idCarBrand,
         idCarModel: req.body.idCarModel,
         carModel: req.body.idCarModel,
         idCarColor: req.body.idCarColor,
         carColor: req.body.idCarColor,
         chasis: req.body.chasis,
         motor: req.body.motor,
         placa: req.body.placa,
         carUse: req.body.carUse,
         extras: req.body.extras,
         extrasValue: req.body.extrasValue,
         dateCreate: moment(),
         userCreate: req.user.idUser,
         dateUpdate: moment(),
         userUpdate: req.user.idUser
      });

      car.save((err, doc) => {
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

   app.post('/car/edit/:id', [control.auth, controller, control.acl], (req, res) => {

      let filter = {
         _id: req.params.id
      }

      let update = {
         idClient: req.body.idClient,
         client: req.body.idClient,
         idRamo: req.body.idRamo,
         ramo: req.body.idRamo,
         idCarBrand: req.body.idCarBrand,
         carBrand: req.body.idCarBrand,
         idCarModel: req.body.idCarModel,
         carModel: req.body.idCarModel,
         idCarColor: req.body.idCarColor,
         carColor: req.body.idCarColor,
         chasis: req.body.chasis,
         motor: req.body.motor,
         placa: req.body.placa,
         carUse: req.body.carUse,
         extras: req.body.extras,
         extrasValue: req.body.extrasValue,
         dateUpdate: moment(),
         userUpdate: req.user.idUser
      };

      Car.findOneAndUpdate(filter, update, function (err, doc) {
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

   app.delete('/car/delete/:id', [control.auth, controller, control.acl], (req, res) => {

      let filter = {
         _id: req.params.id
      }

      let update = {
         chasis: moment(),
         motor: moment(),
         placa: moment(),
         dateDelete: moment()
      };

      Car.findOneAndUpdate(filter, update, function (err, doc) {
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

      Car.findByIdAndRemove(filter, function (err, doc) {
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

export default carController
