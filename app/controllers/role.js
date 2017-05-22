
import moment from 'moment';
import acl from "../configs/acl";
import module from "../configs/module";

import Role from "../models/role";

let roleController = function (app, control={auth, passport, acl}){

   function controller (req, res, next) {
      req.controller = "role";
      return next();
   }

   function findAction (callback){
      Role.find({}, function (err, docs) {
         if (!err) {
            callback(docs)
         }
      });
   }

   app.get('/role/list', [control.auth, controller, control.acl], (req, res) => {

      Role.find({}, function (err, docs) {
         if (typeof docs !== 'undefined') {
            res.send({msg: "OK", roles: docs});
         } else {
            res.send({
               msg : 'ERR',
               err : err.code
            });
         }
      });

   });

   app.get('/role/view/:id', [control.auth, controller, control.acl], (req, res) => {

      Role.findById(req.params.id, function (err, doc) {
         if (!err) {
            res.send({msg: "OK", role: doc});
         } else {
            res.send({msg: 'ERR', err: err});
         }
      });

   });

   app.post('/role/add', [control.auth, controller, control.acl], (req, res) => {

      let role = new Role({
         name: req.body.name,
         description: req.body.description,
         dateCreate: moment(),
         userCreate: req.user.idUser,
         dateUpdate: moment(),
         userUpdate: req.user.idUser
      });

      role.save((err, doc) => {
         if(!err){
            findAction(function(docs){
               res.send({msg: "OK", update: docs});
            });
         } else {
            res.send({msg: 'ERR', err: err});
         }            
      });

   });

   app.post('/role/edit/:id', [control.auth, controller, control.acl], (req, res) => {

      let filter = {
         _id: req.params.id
      }

      let update = {
         name: req.body.name,
         description: req.body.description,
         dateUpdate: moment(),
         userUpdate: req.user.idUser
      };

      Role.findOneAndUpdate(filter, update, function (err, doc) {
         if (!err) {
            findAction(function(docs){
               res.send({msg: "OK", update: docs});
            });
         } else {
            res.send({msg: 'ERR', err: err});
         }
      });

   });

   app.delete('/role/delete/:id', [control.auth, controller, control.acl], (req, res) => {

      let filter = {
         _id: req.params.id
      }
      console.log("/role/delete/");
      Role.findByIdAndRemove(filter, function (err, doc) {
         if(!err){
            findAction(function(docs){
               res.send({msg: "OK", update: docs});
            });
         } else {
            res.send({msg: 'ERR', err: err});
         }            
      });

   });

   app.get('/role/viewgrant/:id', [control.auth, controller, control.acl], (req, res) => {
      console.log("/role/viewgrant/");
      Role.findById(req.params.id, function (err, doc) {
         if (!err) {
            let $grant = doc.grant != "" ? JSON.parse(doc.grant) : {};
            res.send({msg: "OK", grant: $grant, module: module});
         } else {
            res.send({msg: 'ERR', err: err});
         }
      });

   });

   app.post('/role/addgrant/:id', [control.auth, controller, control.acl], (req, res) => {
      console.log("/role/addgrant/");
      let filter = {
         _id: req.params.id
      }

      let $grant = req.body.grant;
      if (typeof($grant) !== "object") {
         return res.send({msg: 'ERR', err: "the format is not an objet"});
      }
      let update = {
         grant: JSON.stringify($grant)
      };

      Role.findOneAndUpdate(filter, update, function (err, doc) {
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

export default roleController
