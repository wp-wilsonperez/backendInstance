
import moment from 'moment';

import SubItemAnnex from "../models/subItemAnnex";
import ItemAnnex from "../models/itemAnnex";

let subItemAnnexController = function (app, control={auth, passport, acl}){

   function controller (req, res, next) {
      req.controller = "subItemAnnex";
      return next();
   }

   function findAction (callback){
      SubItemAnnex.find({}, function (err, docs) {
         if (!err) {

         ItemAnnex.populate(docs, {path: "itemAnnex"},function(err, docs){
               callback(docs);
            });
         }
      });
   }

   app.get('/subItemAnnex/filter',[control.auth, controller], (req, res) => {
      let $filter =  global.filter(req.query.filter);
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

      SubItemAnnex.find({}, function (err, docs) {
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
         name: req.body.name,
         idRamo: req.body.idRamo,
         ramo: req.body.idRamo,
         idInsurance: req.body.idInsurance,
         insurance: req.body.idInsurance,
         desciption: req.body.desciption,
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
         name: req.body.name,
         idRamo: req.body.idRamo,
         ramo: req.body.idRamo,
         idInsurance: req.body.idInsurance,
         insurance: req.body.idInsurance,
         desciption: req.body.desciption,
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
      });

   });

}

export default subItemAnnexController
