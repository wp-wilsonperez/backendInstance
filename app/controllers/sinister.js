
import moment from 'moment';

import Sinister from "../models/sinister";
import SinisterGeneral from "../models/sinisterGeneral";
import SinisterGeneralDocumentation from "../models/sinisterGeneralDocumentation";

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
            let error=global.error(err, 0, req.controller);
            res.send({msg: 'ERROR', err: error});
         }
      });

   });

   app.get('/sinister/list', [control.auth, controller, control.acl], (req, res) => {

      let typeList = app.locals.typeList;
      let filter = {};
      if(typeList=="99097f2c1f"){
         filter = {"userCreate": req.user.idUser};
      } else if(typeList=="99097f2c1c"){
         filter = {"branchCreate": req.user.idBranch};
      } else {
         filter = {};
      }

      Sinister.find(filter, function (err, docs) {
         if (typeof docs !== 'undefined') {
            control.log(req.route.path, req.user);

            Ramo.populate(docs, {path: "ramo"},function(err, docs){
               res.send({msg: "OK", sinisters: docs});
            });
            
         } else {
            let error=global.error(err, 0, req.controller);
            res.send({msg: 'ERROR', err: error});
         }
      });

   });

   app.get('/sinister/view/:id', [control.auth, controller, control.acl], (req, res) => {

      Sinister.findById(req.params.id, function (err, doc) {
         if (!err) {
            control.log(req.route.path, req.user);
            res.send({msg: "OK", sinister: doc});
         } else {
            let error=global.error(err, 0, req.controller);
            res.send({msg: 'ERROR', err: error});
         }
      });

   });

   app.post('/sinister/add', [control.auth, controller, control.acl], (req, res) => {

      let $data = req.body.sinister;
      let $sinisterData = $data;
      let $sinisterGeneral = $data.item;
      let $sinisterGeneralDocumentation = $data.item.items;
      let $moment = moment();
      delete($sinisterData.item);
      delete($sinisterGeneralDocumentation.items);
      $sinisterData["dateCreate"] = $moment;
      $sinisterData["userCreate"] = req.user.idUser;
      $sinisterData["branchCreate"] = req.user.idBranch;
      $sinisterData["dateUpdate"] = $moment;
      $sinisterData["userUpdate"] = req.user.idUser;
      let sinister = new Sinister($sinisterData);

      sinister.save((err, doc) => {
         if(!err){
            control.log(req.route.path, req.user);
            $sinisterGeneral["idSinister"] = doc._id;
            $sinisterGeneral["sinister"] = doc._id;
            $sinisterGeneral["dateCreate"] = $moment;
            $sinisterGeneral["userCreate"] = req.user.idUser;
            $sinisterGeneral["dateUpdate"] = $moment;
            $sinisterGeneral["userUpdate"] = req.user.idUser;
            let sinisterGeneral = new SinisterCar($sinisterGeneral);
            sinisterGeneral.save((err, doc) => {
               if(!err){
                  $sinisterGeneralDocumentation.forEach(function (item, index) {
                     $sinisterGeneralDocumentation[index]["idSinisterGeneral"]=doc._id;
                     $sinisterGeneralDocumentation[index]["sinisterGeneral"]=doc._id;
                     $sinisterGeneralDocumentation[index]["dateCreate"] = $moment;
                     $sinisterGeneralDocumentation[index]["userCreate"] = req.user.idUser;
                     $sinisterGeneralDocumentation[index]["dateUpdate"] = $moment;
                     $sinisterGeneralDocumentation[index]["userUpdate"] = req.user.idUser;
                  })
                  sinisterGeneralDocumentation.insertMany($sinisterGeneralDocumentation, (err, docs) => {
                  });
               }
            });
            findAction(function(docs){
               res.send({msg: "OK", update: docs});
            });
         } else {
            let error=global.error(err, 0, req.controller);
            res.send({msg: 'ERROR', err: error});
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
            let error=global.error(err, 0, req.controller);
            res.send({msg: 'ERROR', err: error});
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
            let error=global.error(err, 0, req.controller);
            res.send({msg: 'ERROR', err: error});
         }            
      });

   });

}

export default sinisterController
