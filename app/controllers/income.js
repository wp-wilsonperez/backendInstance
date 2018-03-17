
import moment from 'moment';

import Income from "../models/income";

import User from "../models/user";

let incomeController = function (app, control={auth, passport, acl}){

   function controller (req, res, next) {
      req.controller = "income";
      return next();
   }

   function findAction (callback){
      let $filter =  global.filter(null);
      Income.find($filter, function (err, docs) {
         if (!err) {
            User.populate(docs, {path: "userAddress"},function(err, docs){
               callback(docs);
            });
         }
      });
   }

   app.post('/income/filter',[control.auth, controller], (req, res) => {
      let $filter =  global.filter(req.body.filter);
      Income.find($filter, function (err, docs) {
         if (typeof docs !== 'undefined') {
            control.log(req.route.path, req.user);
            User.populate(docs, {path: "userAddress"},function(err, docs){
               res.send({msg: "OK", incomes: docs});
            });
         } else {
            let error=global.error(err, 0, req.controller);
            res.send({msg: 'ERROR', err: error});
         }
      });

   });

   app.get('/income/list', [control.auth, controller, control.acl], (req, res) => {
      let $filter =  global.filter(null);
      Income.find($filter, function (err, docs) {
         if (typeof docs !== 'undefined') {
            control.log(req.route.path, req.user);
            User.populate(docs, {path: "userAddress"},function(err, docs){
               res.send({msg: "OK", incomes: docs});
            });
         } else {
            let error=global.error(err, 0, req.controller);
            res.send({msg: 'ERROR', err: error});
         }
      });

   });

   app.get('/income/view/:id', [control.auth, controller, control.acl], (req, res) => {

      Income.findById(req.params.id, function (err, doc) {
         if (!err) {
            control.log(req.route.path, req.user);
            res.send({msg: "OK", income: doc});
         } else {
            let error=global.error(err, 0, req.controller);
            res.send({msg: 'ERROR', err: error});
         }
      });

   });

   app.post('/income/add', [control.auth, controller, control.acl], (req, res) => {

      let income = new Income({
         typeSend: req.body.typeSend,
         incomeStatus: req.body.incomeStatus,
         idSend: req.body.idSend,
         send: req.body.send,
         typeSend:req.body.typeSend,
         idUserAddress: req.body.idUserAddress,
         userAddress: req.body.idUserAddress,
         dateIncome: req.body.dateIncome,
         dateReception: req.body.dateReception,
         details: req.body.details,
         observations: req.body.observations,
         dateCreate: moment(),
         userCreate: req.user.idUser,
         branchCreate: req.user.idBranch,
         dateUpdate: moment(),
         userUpdate: req.user.idUser
      });

      income.save((err, doc) => {
         if(!err){
            control.log(req.route.path, req.user);
            res.send({msg: "OK", doc: doc});
         } else {
            let error=global.error(err, 0, req.controller);
            res.send({msg: 'ERROR', err: error});
         }            
      });

   });

   app.post('/income/edit/:id', [control.auth, controller, control.acl], (req, res) => {

      let filter = {
         _id: req.params.id
      }

      let update = {
         typeSend: req.body.typeSend,
         idSend: req.body.idSend,
         send: req.body.send,
         idUserAddress: req.body.idUserAddress,
         userAddress: req.body.idUserAddress,
         dateIncome: req.body.dateIncome,
         dateReception: req.body.dateReception,
         details: req.body.details,
         observations: req.body.observations,
         dateUpdate: moment(),
         userUpdate: req.user.idUser
      };

      Income.findOneAndUpdate(filter, update, function (err, doc) {
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

   app.delete('/income/delete/:id', [control.auth, controller, control.acl], (req, res) => {

      let filter = {
         _id: req.params.id
      }

      let update = {
         dateDelete: moment()
      };

      Income.findOneAndUpdate(filter, update, function (err, doc) {
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

      Income.findByIdAndRemove(filter, function (err, doc) {
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

   app.post('/income/dateReception', [control.auth, controller, control.acl], (req, res) => {

      let incomes = req.body.idsDate;
      let update = {
         dateReception:  moment(),
         incomeStatus: incomes.status
      };

      for (var i = 0; i < incomes.ids.length; i++) {
         let filter = {
            _id: incomes.ids[i]._id
         }
         Income.findOneAndUpdate(filter, update, function (err, doc) {
            if (!err) {
               //control.log(req.route.path, req.user);
            } else {
            }
         });
      }
      //res.send({msg: 'ERR', err: err});
      res.send({msg: "OK"});

   });

}

export default incomeController
