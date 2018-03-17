
import moment from 'moment';

import SubItemAnnex from "../models/subItemAnnex";
import ItemAnnex from "../models/itemAnnex";

let subItemAnnexController = function (app, control={auth, passport, acl}){

   function controller (req, res, next) {
      req.controller = "subItemAnnex";
      return next();
   }

   function findAction (callback){
      let $filter =  global.filter(null);
      SubItemAnnex.find($filter, function (err, docs) {
         if (!err) {

         ItemAnnex.populate(docs, {path: "itemAnnex"},function(err, docs){
               callback(docs);
            });
         }
      });
   }

   app.post('/subItemAnnex/filter',[control.auth, controller], (req, res) => {
      let $filter =  global.filter(req.body.filter);
      SubItemAnnex.find($filter, function (err, docs) {
         if (typeof docs !== 'undefined') {
            control.log(req.route.path, req.user);
            ItemAnnex.populate(docs, {path: "itemAnnex"},function(err, docs){
               res.send({msg: "OK", subItemAnnexs: docs});
            });
         } else {
            let error=global.error(err, 0, req.controller);
            res.send({msg: 'ERROR', err: error});
         }
      });

   });

   app.get('/subItemAnnex/list', [control.auth, controller, control.acl], (req, res) => {
      let $filter =  global.filter(null);
      SubItemAnnex.find($filter, function (err, docs) {
         if (typeof docs !== 'undefined') {
            control.log(req.route.path, req.user);
            ItemAnnex.populate(docs, {path: "itemAnnex"},function(err, docs){
               res.send({msg: "OK", subItemAnnexs: docs});
            });
         } else {
            let error=global.error(err, 0, req.controller);
            res.send({msg: 'ERROR', err: error});
         }
      });

   });

   app.get('/subItemAnnex/view/:id', [control.auth, controller, control.acl], (req, res) => {

      SubItemAnnex.findById(req.params.id, function (err, doc) {
         if (!err) {
            control.log(req.route.path, req.user);
            res.send({msg: "OK", subItemAnnex: doc});
         } else {
            let error=global.error(err, 0, req.controller);
            res.send({msg: 'ERROR', err: error});
         }
      });

   });

   app.post('/subItemAnnex/add', [control.auth, controller, control.acl], (req, res) => {

      let subItemAnnex = new SubItemAnnex({
         idItemAnnex: req.body.idItemAnnex,
         itemAnnex: req.body.idItemAnnex,
         numberSubItem: req.body.numberSubItem,
         name: req.body.name,
         planAlternative: req.body.planAlternative,
         ValueSubItem: req.body.ValueSubItem,
         tasa: req.body.tasa,
         calcFloat: req.body.calcFloat,
         primaNeta: req.body.primaNeta,
         detailsSubItem: req.body.detailsSubItem,
         observationsSubItem: req.body.observationsSubItem,
         exclusionDate: req.body.exclusionDate,
         inclusionDate: req.body.inclusionDate,
         modificationDate: req.body.modificationDate,
         dateCreate: moment(),
         userCreate: req.user.idUser,
         dateUpdate: moment(),
         userUpdate: req.user.idUser
      });

      subItemAnnex.save((err, doc) => {
         if(!err){
            control.log(req.route.path, req.user);
            res.send({msg: "OK", doc: doc});
         } else {
            let error=global.error(err, 0, req.controller);
            res.send({msg: 'ERROR', err: error});
         }            
      });

   });

   app.post('/subItemAnnex/edit/:id', [control.auth, controller, control.acl], (req, res) => {

      let filter = {
         _id: req.params.id
      }

      let update = {
         idItemAnnex: req.body.idItemAnnex,
         itemAnnex: req.body.idItemAnnex,
         numberSubItem: req.body.numberSubItem,
         name: req.body.name,
         planAlternative: req.body.planAlternative,
         ValueSubItem: req.body.ValueSubItem,
         tasa: req.body.tasa,
         calcFloat: req.body.calcFloat,
         primaNeta: req.body.primaNeta,
         detailsSubItem: req.body.detailsSubItem,
         observationsSubItem: req.body.observationsSubItem,
         exclusionDate: req.body.exclusionDate,
         inclusionDate: req.body.inclusionDate,
         modificationDate: req.body.modificationDate,
         dateUpdate: moment(),
         userUpdate: req.user.idUser
      };

      SubItemAnnex.findOneAndUpdate(filter, update, function (err, doc) {
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

   app.delete('/subItemAnnex/delete/:id', [control.auth, controller, control.acl], (req, res) => {

      let filter = {
         _id: req.params.id
      }

      let update = {
         dateDelete: moment()
      };

      SubItemAnnex.findOneAndUpdate(filter, update, function (err, doc) {
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

      SubItemAnnex.findByIdAndRemove(filter, function (err, doc) {
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

export default subItemAnnexController
