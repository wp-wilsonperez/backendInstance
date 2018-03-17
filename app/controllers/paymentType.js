
import moment from 'moment';

import PaymentType from "../models/paymentType";

let paymentTypeController = function (app, control={auth, passport, acl}){

   function controller (req, res, next) {
      req.controller = "paymentType";
      return next();
   }

   function findAction (callback){
      let $filter =  global.filter(null);
      PaymentType.find($filter, function (err, docs) {
         if (!err) {
            callback(docs)
         }
      });
   }

   app.post('/paymentType/filter',[control.auth, controller], (req, res) => {
      let $filter =  global.filter(req.body.filter);
      PaymentType.find($filter, function (err, docs) {
         if (typeof docs !== 'undefined') {
            control.log(req.route.path, req.user);
            res.send({msg: "OK", paymentTypes: docs});
         } else {
            let error=global.error(err, 0, req.controller);
            res.send({msg: 'ERROR', err: error});
         }
      });

   });

   app.get('/paymentType/list', [control.auth, controller, control.acl], (req, res) => {
      let $filter =  global.filter(null);
      PaymentType.find($filter, function (err, docs) {
         if (typeof docs !== 'undefined') {
            control.log(req.route.path, req.user);
            res.send({msg: "OK", paymentTypes: docs});
         } else {
            let error=global.error(err, 0, req.controller);
            res.send({msg: 'ERROR', err: error});
         }
      });

   });

   app.get('/paymentType/view/:id', [control.auth, controller, control.acl], (req, res) => {

      PaymentType.findById(req.params.id, function (err, doc) {
         if (!err) {
            control.log(req.route.path, req.user);
            res.send({msg: "OK", paymentType: doc});
         } else {
            let error=global.error(err, 0, req.controller);
            res.send({msg: 'ERROR', err: error});
         }
      });

   });

   app.post('/paymentType/add', [control.auth, controller, control.acl], (req, res) => {

      let paymentType = new PaymentType({
         name: req.body.name,
         initialPayment: req.body.initialPayment,
         equalPayments: req.body.equalPayments,
         dateCreate: moment(),
         userCreate: req.user.idUser,
         dateUpdate: moment(),
         userUpdate: req.user.idUser
      });

      paymentType.save((err, doc) => {
         if(!err){
            control.log(req.route.path, req.user);
            res.send({msg: "OK", doc: doc});
         } else {
            let error=global.error(err, 0, req.controller);
            res.send({msg: 'ERROR', err: error});
         }            
      });

   });

   app.post('/paymentType/edit/:id', [control.auth, controller, control.acl], (req, res) => {

      let filter = {
         _id: req.params.id
      }

      let update = {
         name: req.body.name,
         initialPayment: req.body.initialPayment,
         equalPayments: req.body.equalPayments,
         dateUpdate: moment(),
         userUpdate: req.user.idUser
      };

      PaymentType.findOneAndUpdate(filter, update, function (err, doc) {
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

   app.delete('/paymentType/delete/:id', [control.auth, controller, control.acl], (req, res) => {

      let filter = {
         _id: req.params.id
      }

      let update = {
         dateDelete: moment()
      };

      PaymentType.findOneAndUpdate(filter, update, function (err, doc) {
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

      PaymentType.findByIdAndRemove(filter, function (err, doc) {
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

export default paymentTypeController
