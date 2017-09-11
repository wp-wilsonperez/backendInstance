
import moment from 'moment';

import Issue from "../models/issue";

let issueController = function (app, control={auth, passport, acl}){

   function controller (req, res, next) {
      req.controller = "issue";
      return next();
   }

   function findAction (callback){
      Issue.find({}, function (err, docs) {
         if (!err) {
            callback(docs)
         }
      });
   }

   app.get('/issue/filter',[control.auth, controller], (req, res) => {
      let $filter =  global.filter(req.query.filter);
      Issue.find($filter, function (err, docs) {
         if (typeof docs !== 'undefined') {
            control.log(req.route.path, req.user);
            res.send({msg: "OK", issues: docs});
         } else {
            res.send({
               msg : 'ERR',
               err : err.code
            });
         }
      });

   });

   app.get('/issue/list', [control.auth, controller, control.acl], (req, res) => {

      Issue.find({}, function (err, docs) {
         if (typeof docs !== 'undefined') {
            control.log(req.route.path, req.user);
            res.send({msg: "OK", issues: docs});
         } else {
            res.send({
               msg : 'ERR',
               err : err.code
            });
         }
      });

   });

   app.get('/issue/view/:id', [control.auth, controller, control.acl], (req, res) => {

      Issue.findById(req.params.id, function (err, doc) {
         if (!err) {
            control.log(req.route.path, req.user);
            res.send({msg: "OK", issue: doc});
         } else {
            res.send({msg: 'ERR', err: err});
         }
      });

   });

   app.post('/issue/add', [control.auth, controller, control.acl], (req, res) => {

      let issue = new Issue({
         name: req.body.name,
         start: req.body.start,
         finish: req.body.finish,
         value: req.body.value,
         dateCreate: moment(),
         userCreate: req.user.idUser,
         dateUpdate: moment(),
         userUpdate: req.user.idUser
      });

      issue.save((err, doc) => {
         if(!err){
            control.log(req.route.path, req.user);
            res.send({msg: "OK", doc: doc});
         } else {
            res.send({msg: 'ERR', err: err});
         }            
      });

   });

   app.post('/issue/edit/:id', [control.auth, controller, control.acl], (req, res) => {

      let filter = {
         _id: req.params.id
      }

      let update = {
         name: req.body.name,
         start: req.body.start,
         finish: req.body.finish,
         value: req.body.value,
         dateUpdate: moment(),
         userUpdate: req.user.idUser
      };

      Issue.findOneAndUpdate(filter, update, function (err, doc) {
         if (!err) {
            findAction(function(docs){
               control.log(req.route.path, req.user);
               res.send({msg: "OK", update: docs});
            });
         } else {
            res.send({msg: 'ERR', err: err});
         }
      });

   });

   app.delete('/issue/delete/:id', [control.auth, controller, control.acl], (req, res) => {

      let filter = {
         _id: req.params.id
      }

      Issue.findByIdAndRemove(filter, function (err, doc) {
         if(!err){
            findAction(function(docs){
               control.log(req.route.path, req.user);
               res.send({msg: "OK", update: docs});
            });
         } else {
            res.send({msg: 'ERR', err: err});
         }            
      });

   });

   app.get('/issue/value', [control.auth, controller, control.acl], (req, res) => {
      let $number = parseFloat(req.query.number);
      let where = `${$number} >= this.start  && ${$number} <= this.finish`;
      let filter = {
         $where: where
      }

      Issue.findOne(filter, function (err, doc) {
         if (!err) {
            if(doc)
               return res.send({msg: "OK", value: doc.value});
            res.send({msg: "OK", value: null});
         } else {
            res.send({msg: 'ERR', err: err});
         }
      });

   });

}

export default issueController
