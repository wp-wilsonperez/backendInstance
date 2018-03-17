
import moment from 'moment';

import AnnexMedicalBusinessItem from "../models/annexMedicalBusinessItem";

import AnnexMedicalBusiness from "../models/annexMedicalBusiness";
import PlanAlternative from "../models/planAlternative";

let annexMedicalBusinessItemController = function (app, control={auth, passport, acl}){

   function controller (req, res, next) {
      req.controller = "annexMedicalBusinessItem";
      return next();
   }

   function findAction (callback){
      let $filter =  global.filter(null);
      AnnexMedicalBusinessItem.find($filter, function (err, docs) {
         if (!err) {
            
            AnnexMedicalBusiness.populate(docs, {path: "annexMedicalBusiness"},function(err, docs){
               PlanAlternative.populate(docs, {path: "planAlternative"},function(err, docs){
                  callback(docs);
               });
            });
         }
      });
   }

   app.post('/annexMedicalBusinessItem/filter',[control.auth, controller], (req, res) => {
      let $filter =  global.filter(req.body.filter);
      AnnexMedicalBusinessItem.find($filter, function (err, docs) {
         if (typeof docs !== 'undefined') {
            control.log(req.route.path, req.user);

            AnnexMedicalBusiness.populate(docs, {path: "annexMedicalBusiness"},function(err, docs){
               PlanAlternative.populate(docs, {path: "planAlternative"},function(err, docs){
                  res.send({msg: "OK", annexMedicalBusinessItems: docs});
               });
            });
            
         } else {
            let error=global.error(err, 0, req.controller);
            res.send({msg: 'ERROR', err: error});
         }
      });

   });

   app.get('/annexMedicalBusinessItem/list', [control.auth, controller, control.acl], (req, res) => {
      let $filter =  global.filter(null);
      AnnexMedicalBusinessItem.find($filter, function (err, docs) {
         if (typeof docs !== 'undefined') {
            control.log(req.route.path, req.user);

            AnnexMedicalBusiness.populate(docs, {path: "annexMedicalBusiness"},function(err, docs){
               PlanAlternative.populate(docs, {path: "planAlternative"},function(err, docs){
                  res.send({msg: "OK", annexMedicalBusinessItems: docs});
               });
            });
            
         } else {
            let error=global.error(err, 0, req.controller);
            res.send({msg: 'ERROR', err: error});
         }
      });

   });

   app.get('/annexMedicalBusinessItem/view/:id', [control.auth, controller, control.acl], (req, res) => {

      AnnexMedicalBusinessItem.findById(req.params.id, function (err, doc) {
         if (!err) {
            control.log(req.route.path, req.user);
            res.send({msg: "OK", annexMedicalBusinessItem: doc});
         } else {
            let error=global.error(err, 0, req.controller);
            res.send({msg: 'ERROR', err: error});
         }
      });

   });

   app.post('/annexMedicalBusinessItem/add', [control.auth, controller, control.acl], (req, res) => {

      let annexMedicalBusinessItem = new AnnexMedicalBusinessItem({
         idAnnexMedicalBusiness: req.body.idAnnexMedicalBusiness,
         annexMedicalBusiness: req.body.idAnnexMedicalBusiness,
         idPlanAlternative: req.body.idPlanAlternative,
         planAlternative: req.body.idPlanAlternative,
         value: req.body.value,
         idClient: req.body.idClient,
         client: req.body.idClient,
         alternative: req.body.alternative,
         annexDate: req.body.annexDate,
         dateCreate: moment(),
         userCreate: req.user.idUser,
         dateUpdate: moment(),
         userUpdate: req.user.idUser
      });

      annexMedicalBusinessItem.save((err, doc) => {
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

   app.post('/annexMedicalBusinessItem/edit/:id', [control.auth, controller, control.acl], (req, res) => {

      let filter = {
         _id: req.params.id
      }

      let update = {
         idAnnexMedicalBusiness: req.body.idAnnexMedicalBusiness,
         annexMedicalBusiness: req.body.idAnnexMedicalBusiness,
         idPlanAlternative: req.body.idPlanAlternative,
         planAlternative: req.body.idPlanAlternative,
         value: req.body.value,
         idClient: req.body.idClient,
         client: req.body.idClient,
         alternative: req.body.alternative,
         annexDate: req.body.annexDate,
         dateUpdate: moment(),
         userUpdate: req.user.idUser
      };

      AnnexMedicalBusinessItem.findOneAndUpdate(filter, update, function (err, doc) {
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

   app.delete('/annexMedicalBusinessItem/delete/:id', [control.auth, controller, control.acl], (req, res) => {

      let filter = {
         _id: req.params.id
      }

      let update = {
         dateDelete: moment()
      };

      AnnexMedicalBusinessItem.findOneAndUpdate(filter, update, function (err, doc) {
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

      AnnexMedicalBusinessItem.findByIdAndRemove(filter, function (err, doc) {
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

export default annexMedicalBusinessItemController
