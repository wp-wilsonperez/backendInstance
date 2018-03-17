
import moment from 'moment';

import ClearanceTime from "../models/clearanceTime";

import Ramo from "../models/ramo";
import Insurance from "../models/insurance";
import Branch from "../models/branch";

let clearanceTimeController = function (app, control={auth, passport, acl}){

   function controller (req, res, next) {
      req.controller = "clearanceTime";
      return next();
   }

   function findAction (callback){
      let $filter =  global.filter(null);
      ClearanceTime.find($filter, function (err, docs) {
         if (!err) {
            
            Ramo.populate(docs, {path: "ramo"},function(err, docs){
               Insurance.populate(docs, {path: "insurance"},function(err, docs){
                  Branch.populate(docs, {path: "branch"},function(err, docs){
                     callback(docs);
                  });
               });
            });
         }
      });
   }

   app.post('/clearanceTime/filter',[control.auth, controller], (req, res) => {
      let $filter =  global.filter(req.body.filter);
      ClearanceTime.find($filter, function (err, docs) {
         if (typeof docs !== 'undefined') {
            control.log(req.route.path, req.user);

            Ramo.populate(docs, {path: "ramo"},function(err, docs){
               Insurance.populate(docs, {path: "insurance"},function(err, docs){
                  Branch.populate(docs, {path: "branch"},function(err, docs){
                     res.send({msg: "OK", clearanceTimes: docs});
                  });
               });
            });
            
         } else {
            let error=global.error(err, 0, req.controller);
            res.send({msg: 'ERROR', err: error});
         }
      });

   });

   app.get('/clearanceTime/list', [control.auth, controller, control.acl], (req, res) => {
      let $filter =  global.filter(null);
      ClearanceTime.find($filter, function (err, docs) {
         if (typeof docs !== 'undefined') {
            control.log(req.route.path, req.user);

            Ramo.populate(docs, {path: "ramo"},function(err, docs){
               Insurance.populate(docs, {path: "insurance"},function(err, docs){
                  Branch.populate(docs, {path: "branch"},function(err, docs){
                     res.send({msg: "OK", clearanceTimes: docs});
                  });
               });
            });
            
         } else {
            let error=global.error(err, 0, req.controller);
            res.send({msg: 'ERROR', err: error});
         }
      });

   });

   app.get('/clearanceTime/view/:id', [control.auth, controller, control.acl], (req, res) => {

      ClearanceTime.findById(req.params.id, function (err, doc) {
         if (!err) {
            control.log(req.route.path, req.user);
            res.send({msg: "OK", clearanceTime: doc});
         } else {
            let error=global.error(err, 0, req.controller);
            res.send({msg: 'ERROR', err: error});
         }
      });

   });

   app.post('/clearanceTime/add', [control.auth, controller, control.acl], (req, res) => {

      let clearanceTime = new ClearanceTime({
         idRamo: req.body.idRamo,
         ramo: req.body.idRamo,
         idInsurance: req.body.idInsurance,
         insurance: req.body.idInsurance,
         idBranch: req.body.idBranch,
         branch: req.body.idBranch,
         time: req.body.time,
         dateCreate: moment(),
         userCreate: req.user.idUser,
         dateUpdate: moment(),
         userUpdate: req.user.idUser
      });

      let dataFilter = {
         "$and" : [
            {"idRamo": req.body.idRamo},
            {"idInsurance": req.body.idInsurance},
            {"idBranch": req.body.idBranch}
         ]
      }

      clearanceTime.save((err, doc) => {
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

      /*ClearanceTime.find(dataFilter, function (err, docs) {
         if(!err){
            if(docs==[]){
               console.log(docs);
               console.log("------------------------");
               clearanceTime.save((err, doc) => {
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
            } else{
               let error=global.error({duplicated: 3}, 1, req.controller);
               res.send({msg: 'ERROR', err: error});
            }
         }
      });*/

   });

   app.post('/clearanceTime/edit/:id', [control.auth, controller, control.acl], (req, res) => {

      let filter = {
         _id: req.params.id
      }

      let update = {
         idRamo: req.body.idRamo,
         ramo: req.body.idRamo,
         idInsurance: req.body.idInsurance,
         insurance: req.body.idInsurance,
         idBranch: req.body.idBranch,
         branch: req.body.idBranch,
         time: req.body.time,
         dateUpdate: moment(),
         userUpdate: req.user.idUser
      };

      ClearanceTime.findOneAndUpdate(filter, update, function (err, doc) {
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

   app.delete('/clearanceTime/delete/:id', [control.auth, controller, control.acl], (req, res) => {

      let filter = {
         _id: req.params.id
      }

      let update = {
         dateDelete: moment()
      };

      ClearanceTime.findOneAndUpdate(filter, update, function (err, doc) {
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

      ClearanceTime.findByIdAndRemove(filter, function (err, doc) {
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

export default clearanceTimeController
