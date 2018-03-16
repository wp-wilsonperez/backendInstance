
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
      let $filter =  global.filter(null);
      Role.find($filter, function (err, docs) {
         if (!err) {
            callback(docs)
         }
      });
   }

   app.post('/role/filter',[control.auth, controller], (req, res) => {
      let $filter =  global.filter(req.body.filter);
      Role.find($filter, function (err, docs) {
         if (typeof docs !== 'undefined') {
            control.log(req.route.path, req.user);
            res.send({msg: "OK", roles: docs});
         } else {
            let error=global.error(err, 0, req.controller);
            res.send({msg: 'ERROR', err: error});
         }
      });

   });

   app.get('/role/list', [control.auth, controller, control.acl], (req, res) => {
      let $filter =  global.filter(null);
      Role.find($filter, function (err, docs) {
         if (typeof docs !== 'undefined') {
            control.log(req.route.path, req.user);
            res.send({msg: "OK", roles: docs});
         } else {
            let error=global.error(err, 0, req.controller);
            res.send({msg: 'ERROR', err: error});
         }
      });

   });

   app.get('/role/view/:id', [control.auth, controller, control.acl], (req, res) => {

      Role.findById(req.params.id, function (err, doc) {
         if (!err) {
            control.log(req.route.path, req.user);
            res.send({msg: "OK", role: doc});
         } else {
            let error=global.error(err, 0, req.controller);
            res.send({msg: 'ERROR', err: error});
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
               control.log(req.route.path, req.user);
               res.send({msg: "OK", update: docs});
            });
         } else {
            let error=global.error(err, 0, req.controller);
            res.send({msg: 'ERROR', err: error});
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
               control.log(req.route.path, req.user);
               res.send({msg: "OK", update: docs});
            });
         } else {
            let error=global.error(err, 0, req.controller);
            res.send({msg: 'ERROR', err: error});
         }
      });

   });

   app.delete('/role/delete/:id', [control.auth, controller, control.acl], (req, res) => {

      let filter = {
         _id: req.params.id
      }

      let update = {
         dateDelete: moment()
      };

      Role.findOneAndUpdate(filter, update, function (err, doc) {
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

      Role.findByIdAndRemove(filter, function (err, doc) {
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

   app.get('/role/viewgrant/:id', [control.auth, controller, control.acl], (req, res) => {
      console.log("/role/viewgrant/");
      Role.findById(req.params.id, function (err, doc) {
         if (!err) {
            control.log(req.route.path, req.user);
            let $grant = doc.grant != "" ? JSON.parse(doc.grant) : {};
            res.send({msg: "OK", grant: $grant, module: module});
         } else {
            let error=global.error(err, 0, req.controller);
            res.send({msg: 'ERROR', err: error});
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
         return res.send({msg: 'ERROR', err: "the format is not an objet"});
      }
      let update = {
         grant: JSON.stringify($grant)
      };

      Role.findOneAndUpdate(filter, update, function (err, doc) {
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

}

export default roleController
