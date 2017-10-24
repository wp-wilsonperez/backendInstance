
import moment from 'moment';

import Sinister from "../models/sinister";
import SinisterCar from "../models/sinisterCar";
import SinisterCarDocumentation from "../models/sinisterCarDocumentation";

import Ramo from "../models/ramo";

let sinisterController = function (app, control={auth, passport, acl}){

   function controller (req, res, next) {
      req.controller = "sinister";
      return next();
   }

   function findAction (callback){
      Sinister.find({}, function (err, docs) {
         if (!err) {
            
            Ramo.populate(docs, {path: "ramo"},function(err, docs){
               callback(docs);
            });
         }
      });
   }

   app.get('/sinister/filter',[control.auth, controller], (req, res) => {
      let $filter =  global.filter(req.query.filter);
      Sinister.find($filter, function (err, docs) {
         if (typeof docs !== 'undefined') {
            control.log(req.route.path, req.user);

            Ramo.populate(docs, {path: "ramo"},function(err, docs){
               res.send({msg: "OK", sinisters: docs});
            });
            
         } else {
            res.send({
               msg : 'ERR',
               err : err.code
            });
         }
      });

   });

   app.get('/sinister/list', [control.auth, controller, control.acl], (req, res) => {

      Sinister.find({}, function (err, docs) {
         if (typeof docs !== 'undefined') {
            control.log(req.route.path, req.user);

            Ramo.populate(docs, {path: "ramo"},function(err, docs){
               res.send({msg: "OK", sinisters: docs});
            });
            
         } else {
            res.send({
               msg : 'ERR',
               err : err.code
            });
         }
      });

   });

   app.get('/sinister/view/:id', [control.auth, controller, control.acl], (req, res) => {

      Sinister.findById(req.params.id, function (err, doc) {
         if (!err) {
            control.log(req.route.path, req.user);
            res.send({msg: "OK", sinister: doc});
         } else {
            res.send({msg: 'ERR', err: err});
         }
      });

   });

   app.post('/sinister/add', [control.auth, controller, control.acl], (req, res) => {

      let $data = req.body.sinister;
      let $sinisterData = $data;
      let $sinisterCar = $data.item;
      let $sinisterCarDocumentation = $data.item.items;
      let $moment = moment();
      delete($sinisterData.item);
      delete($sinisterCarDocumentation.items);
      $sinisterData["dateCreate"] = $moment;
      $sinisterData["userCreate"] = req.user.idUser;
      $sinisterData["dateUpdate"] = $moment;
      $sinisterData["userUpdate"] = req.user.idUser;
      let sinister = new Sinister($sinisterData);

      sinister.save((err, doc) => {
         if(!err){
            control.log(req.route.path, req.user);
            $sinisterCar["idSinister"] = doc._id;
            $sinisterCar["sinister"] = doc._id;
            $sinisterCar["dateCreate"] = $moment;
            $sinisterCar["userCreate"] = req.user.idUser;
            $sinisterCar["dateUpdate"] = $moment;
            $sinisterCar["userUpdate"] = req.user.idUser;
            let sinisterCar = new SinisterCar($sinisterCar);
            sinisterCar.save((err, doc) => {
               if(!err){
                  $sinisterCarDocumentation.forEach(function (item, index) {
                     $sinisterCarDocumentation[index]["idSinisterCar"]=doc._id;
                     $sinisterCarDocumentation[index]["sinisterCar"]=doc._id;
                     $sinisterCarDocumentation[index]["dateCreate"] = $moment;
                     $sinisterCarDocumentation[index]["userCreate"] = req.user.idUser;
                     $sinisterCarDocumentation[index]["dateUpdate"] = $moment;
                     $sinisterCarDocumentation[index]["userUpdate"] = req.user.idUser;
                  })
                  SinisterCarDocumentation.insertMany($sinisterCarDocumentation, (err, docs) => {
                  });
               }
            });
            findAction(function(docs){
               res.send({msg: "OK", update: docs});
            });
         } else {
            res.send({msg: 'ERR', err: err});
         }            
      });

   });

   app.post('/sinister/edit/:id', [control.auth, controller, control.acl], (req, res) => {

      let filter = {
         _id: req.params.id
      }

      let update = {
         idPolicy: req.body.idPolicy,
         policyData: req.body.policyData,
         idPolicyAnnex: req.body.idPolicyAnnex,
         annexData: req.body.annexData,
         idClient: req.body.idClient,
         clientData: req.body.clientData,
         compName: req.body.compName,
         clientInsured: req.body.clientInsured,
         beneficiary: req.body.beneficiary,
         dateSinester: req.body.dateSinester,
         dateNotification: req.body.dateNotification,
         beneficiary: req.body.beneficiary,
         idRamo: req.body.idRamo,
         ramo: req.body.idRamo,
         sinisterState: req.body.sinisterState,
         settlementDate: req.body.settlementDate,
         dateUpdate: moment(),
         userUpdate: req.user.idUser
      };

      Sinister.findOneAndUpdate(filter, update, function (err, doc) {
         if (!err) {
            findAction(function(docs){
               control.log(req.route.path, req.user);
               res.send({msg: "OK", update: docs});
            });
         } else {
            res.send({msg: 'ERR', err: err});
         }
      });

   });

   app.delete('/sinister/delete/:id', [control.auth, controller, control.acl], (req, res) => {

      let filter = {
         _id: req.params.id
      }

      Sinister.findByIdAndRemove(filter, function (err, doc) {
         if(!err){
            findAction(function(docs){
               control.log(req.route.path, req.user);
               res.send({msg: "OK", update: docs});
            });
         } else {
            res.send({msg: 'ERR', err: err});
         }            
      });

   });

}

export default sinisterController
