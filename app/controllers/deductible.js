
import moment from 'moment';

import Deductible from "../models/deductible";

let deductibleController = function (app, control={auth, passport, acl}){

   function controller (req, res, next) {
      req.controller = "deductible";
      return next();
   }

   function findAction (callback){
      Deductible.find({}, function (err, docs) {
         if (!err) {
            callback(docs)
         }
      });
   }

   app.get('/deductible/list', [control.auth, controller, control.acl], (req, res) => {

      Deductible.find({}, function (err, docs) {
         if (typeof docs !== 'undefined') {
            res.send({msg: "OK", deductibles: docs});
         } else {
            res.send({
               msg : 'ERR',
               err : err.code
            });
         }
      });

   });

   app.get('/deductible/view/:id', [control.auth, controller, control.acl], (req, res) => {

      Deductible.findById(req.params.id, function (err, doc) {
         if (!err) {
            res.send({msg: "OK", deductible: doc});
         } else {
            res.send({msg: 'ERR', err: err});
         }
      });

   });

   app.post('/deductible/add', [control.auth, controller, control.acl], (req, res) => {

      let deductible = new Deductible({
         name: req.body.name,
         idBranch: req.body.idBranch,
         idInsurance: req.body.idInsurance,
         desciption: req.body.desciption,
         dateCreate: moment(),
         userCreate: req.user.idUser,
         dateUpdate: moment(),
         userUpdate: req.user.idUser
      });

      deductible.save((err, doc) => {
         if(!err){
            res.send({msg: "OK", doc: doc});
         } else {
            res.send({msg: 'ERR', err: err});
         }            
      });

   });

   app.post('/deductible/edit/:id', [control.auth, controller, control.acl], (req, res) => {

      let filter = {
         _id: req.params.id
      }

      let update = {
         name: req.body.name,
         idBranch: req.body.idBranch,
         idInsurance: req.body.idInsurance,
         desciption: req.body.desciption,
         dateUpdate: moment(),
         userUpdate: req.user.idUser
      };

      Deductible.findOneAndUpdate(filter, update, function (err, doc) {
         if (!err) {
            findAction(function(docs){
               res.send({msg: "OK", update: docs});
            });
         } else {
            res.send({msg: 'ERR', err: err});
         }
      });

   });

   app.delete('/deductible/delete/:id', [control.auth, controller, control.acl], (req, res) => {

      let filter = {
         _id: req.params.id
      }

      Deductible.findByIdAndRemove(filter, function (err, doc) {
         if(!err){
            findAction(function(docs){
               res.send({msg: "OK", update: docs});
            });
         } else {
            res.send({msg: 'ERR', err: err});
         }            
      });

   });

}

export default deductibleController
