
import moment from 'moment';

import Branch from "../models/branch";
import City from "../models/city";

let branchController = function (app, control={auth, passport, acl}){

   function controller (req, res, next) {
      req.controller = "branch";
      return next();
   }

   function findAction (callback){
      let $filter =  global.filter(null);
      Branch.find($filter, function (err, docs) {
         if (!err) {
            City.populate(docs, {path: "city"},function(err, docs){
               callback(docs);
            });
         }
      });
   }

   app.post('/branch/filter',[control.auth, controller], (req, res) => {
      let $filter =  global.filter(req.body.filter);
      Branch.find($filter, function (err, docs) {
         if (typeof docs !== 'undefined') {
            control.log(req.route.path, req.user);
            City.populate(docs, {path: "city"},function(err, docs){
               res.send({msg: "OK", branches: docs});
            });
         } else {
            let error=global.error(err, 0, req.controller);
            res.send({msg: 'ERROR', err: error});
         }
      });

   });

   app.get('/branch/list', [control.auth, controller, control.acl], (req, res) => {
      let $filter =  global.filter(null);
      Branch.find($filter, function (err, docs) {
         if (typeof docs !== 'undefined') {
            City.populate(docs, {path: "city"},function(err, docs){
               control.log(req.route.path, req.user);
               res.send({msg: "OK", branches: docs});
            });
         } else {
            let error=global.error(err, 0, req.controller);
            res.send({msg: 'ERROR', err: error});
         }
      });

   });

   app.get('/branch/view/:id', [control.auth, controller, control.acl], (req, res) => {

      Branch.findById(req.params.id, function (err, doc) {
         if (!err) {
            control.log(req.route.path, req.user);
            res.send({msg: "OK", branch: doc});
         } else {
            let error=global.error(err, 0, req.controller);
            res.send({msg: 'ERROR', err: error});
         }
      });

   });

   app.post('/branch/add', [control.auth, controller, control.acl], (req, res) => {

      let branch = new Branch({
         name: req.body.name,
         address: req.body.address,
         idCity: req.body.idCity,
         city: req.body.idCity,
         phone: req.body.phone,
         movil: req.body.movil,
         schedule: req.body.schedule,
         dateCreate: moment(),
         userCreate: req.user.idUser,
         dateUpdate: moment(),
         userUpdate: req.user.idUser
      });

      branch.save((err, doc) => {
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

   app.post('/branch/edit/:id', [control.auth, controller, control.acl], (req, res) => {

      let filter = {
         _id: req.params.id
      }

      let update = {
         name: req.body.name,
         address: req.body.address,
         idCity: req.body.idCity,
         city: req.body.idCity,
         phone: req.body.phone,
         movil: req.body.movil,
         schedule: req.body.schedule,
         dateUpdate: moment(),
         userUpdate: req.user.idUser
      };

      Branch.findOneAndUpdate(filter, update, function (err, doc) {
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

   app.delete('/branch/delete/:id', [control.auth, controller, control.acl], (req, res) => {

      let filter = {
         _id: req.params.id
      }

      let update = {
         //"$inc": {"name": moment()},
         name: moment(),
         dateDelete: moment()
      };

      Branch.findOneAndUpdate(filter, update, function (err, doc) {
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

      Branch.findByIdAndRemove(filter, function (err, doc) {
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

export default branchController
