
import moment from 'moment';

import ItemAnnex from "../models/itemAnnex";
import PolicyAnnex from "../models/policyAnnex";

let itemAnnexController = function (app, control={auth, passport, acl}){

   function controller (req, res, next) {
      req.controller = "itemAnnex";
      return next();
   }

   function findAction (callback){
      let $filter =  global.filter(null);
      ItemAnnex.find($filter, function (err, docs) {
         if (!err) {

            PolicyAnnex.populate(docs, {path: "policyAnnex"},function(err, docs){
               callback(docs);
            });
         }
      });
   }

   app.post('/itemAnnex/filter',[control.auth, controller], (req, res) => {
      let $filter =  global.filter(req.body.filter);
      ItemAnnex.find($filter, function (err, docs) {
         if (typeof docs !== 'undefined') {
            control.log(req.route.path, req.user);
            PolicyAnnex.populate(docs, {path: "policyAnnex"},function(err, docs){
               res.send({msg: "OK", itemAnnexs: docs});
            });
         } else {
            let error=global.error(err, 0, req.controller);
            res.send({msg: 'ERROR', err: error});
         }
      });

   });

   app.get('/itemAnnex/list', [control.auth, controller, control.acl], (req, res) => {
      let $filter =  global.filter(null);
      ItemAnnex.find($filter, function (err, docs) {
         if (typeof docs !== 'undefined') {
            control.log(req.route.path, req.user);
            PolicyAnnex.populate(docs, {path: "policyAnnex"},function(err, docs){
               res.send({msg: "OK", itemAnnexs: docs});
            });
         } else {
            let error=global.error(err, 0, req.controller);
            res.send({msg: 'ERROR', err: error});
         }
      });

   });

   app.get('/itemAnnex/view/:id', [control.auth, controller, control.acl], (req, res) => {

      ItemAnnex.findById(req.params.id, function (err, doc) {
         if (!err) {
            control.log(req.route.path, req.user);
            res.send({msg: "OK", itemAnnex: doc});
         } else {
            let error=global.error(err, 0, req.controller);
            res.send({msg: 'ERROR', err: error});
         }
      });

   });

   app.post('/itemAnnex/add', [control.auth, controller, control.acl], (req, res) => {

      let itemAnnex = new ItemAnnex({
         idPolicyAnnex: req.body.idPolicyAnnex,
         policyAnnex: req.body.idPolicyAnnex,
         numberItem: req.body.numberItem,
         travelfrom: req.body.travelfrom,
         travelTo: req.body.travelTo,
         travelTransportation: req.body.travelTransportation,
         commodity: req.body.commodity,
         coverage: req.body.coverage,
         packaging: req.body.packaging,
         application: req.body.application,
         order: req.body.order,
         provider: req.body.provider,
         limitPerShipment: req.body.limitPerShipment,
         totalValueItem: req.body.totalValueItem,
         totalValuePrimaItem: req.body.totalValuePrimaItem,
         detailsItem: req.body.detailsItem,
         observationsItem: req.body.observationsItem,
         deductible: req.body.deductible,
         validDays: req.body.validDays,
         exclusionDate: req.body.exclusionDate,
         inclusionDate: req.body.inclusionDate,
         modificationDate: req.body.modificationDate,
         years: req.body.years,
         deprecationYears: req.body.deprecationYears,
         dateCreate: moment(),
         userCreate: req.user.idUser,
         dateUpdate: moment(),
         userUpdate: req.user.idUser
      });

      itemAnnex.save((err, doc) => {
         if(!err){
            control.log(req.route.path, req.user);
            res.send({msg: "OK", doc: doc});
         } else {
            let error=global.error(err, 0, req.controller);
            res.send({msg: 'ERROR', err: error});
         }            
      });

   });

   app.post('/itemAnnex/edit/:id', [control.auth, controller, control.acl], (req, res) => {

      let filter = {
         _id: req.params.id
      }

      let update = {
         idPolicyAnnex: req.body.idPolicyAnnex,
         policyAnnex: req.body.idPolicyAnnex,
         numberItem: req.body.numberItem,
         travelfrom: req.body.travelfrom,
         travelTo: req.body.travelTo,
         travelTransportation: req.body.travelTransportation,
         commodity: req.body.commodity,
         coverage: req.body.coverage,
         packaging: req.body.packaging,
         application: req.body.application,
         order: req.body.order,
         provider: req.body.provider,
         limitPerShipment: req.body.limitPerShipment,
         totalValueItem: req.body.totalValueItem,
         totalValuePrimaItem: req.body.totalValuePrimaItem,
         detailsItem: req.body.detailsItem,
         observationsItem: req.body.observationsItem,
         deductible: req.body.deductible,
         validDays: req.body.validDays,
         exclusionDate: req.body.exclusionDate,
         inclusionDate: req.body.inclusionDate,
         modificationDate: req.body.modificationDate,
         years: req.body.years,
         deprecationYears: req.body.deprecationYears,
         dateUpdate: moment(),
         userUpdate: req.user.idUser
      };

      ItemAnnex.findOneAndUpdate(filter, update, function (err, doc) {
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

   app.delete('/itemAnnex/delete/:id', [control.auth, controller, control.acl], (req, res) => {

      let filter = {
         _id: req.params.id
      }

      let update = {
         dateDelete: moment()
      };

      ItemAnnex.findOneAndUpdate(filter, update, function (err, doc) {
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

      ItemAnnex.findByIdAndRemove(filter, function (err, doc) {
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

export default itemAnnexController
