
import moment from 'moment';

import Branch from "../models/branch";

let branchController = function (app, control={auth, passport, acl}){

   function controller (req, res, next) {
      req.controller = "branch";
      return next();
   }

   function findAction (callback){
      Branch.find({}, function (err, docs) {
         if (!err) {
            callback(docs)
         }
      });
   }

   app.get('/branch/list', [control.auth, controller, control.acl], (req, res) => {

      Branch.find({}, function (err, docs) {
         if (typeof docs !== 'undefined') {
            res.send({msg: "OK", branches: docs});
         } else {
            res.send({
               msg : 'ERR',
               err : err.code
            });
         }
      });

   });

   app.get('/branch/view/:id', [control.auth, controller, control.acl], (req, res) => {

      Branch.findById(req.params.id, function (err, doc) {
         if (!err) {
            res.send({msg: "OK", branch: doc});
         } else {
            res.send({msg: 'ERR', err: err});
         }
      });

   });

   app.post('/branch/add', [control.auth, controller, control.acl], (req, res) => {

      let branch = new Branch({
         name: req.body.name,
         address: req.body.address,
         idCity: req.body.idCity,
         phone: req.body.phone,
         movil: req.body.movil,
         dateCreate: moment(),
         userCreate: req.user.idUser,
         dateUpdate: moment(),
         userUpdate: req.user.idUser
      });

      branch.save((err, doc) => {
         if(!err){
            findAction(function(docs){
               res.send({msg: "OK", update: docs});
            });
         } else {
            res.send({msg: 'ERR', err: err});
         }            
      });

   });

   app.post('/branch/edit/:id', [control.auth, controller, control.acl], (req, res) => {

      let filter = {
         _id: req.params.id
      }

      let update = {
         name: req.body.name,
         address: req.body.address,
         idCity: req.body.idCity,
         phone: req.body.phone,
         movil: req.body.movil,
         dateUpdate: moment(),
         userUpdate: req.user.idUser
      };

      Branch.findOneAndUpdate(filter, update, function (err, doc) {
         if (!err) {
            findAction(function(docs){
               res.send({msg: "OK", update: docs});
            });
         } else {
            res.send({msg: 'ERR', err: err});
         }
      });

   });

}

export default branchController
