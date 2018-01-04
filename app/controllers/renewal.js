
import moment from 'moment';

import Renewal from "../models/renewal";
import Policy from "../models/policy";


let renewalController = function (app, control={auth, passport, acl}){

   function controller (req, res, next) {
      req.controller = "renewal";
      return next();
   }

   function findAction (callback){
      Renewal.find({}, function (err, docs) {
         if (!err) {
            
            callback(docs);
         }
      });
   }

   app.get('/renewal/filter',[control.auth, controller], (req, res) => {
      let $filter =  global.filter(req.query.filter);
      Renewal.find($filter, function (err, docs) {
         if (typeof docs !== 'undefined') {
            control.log(req.route.path, req.user);
            res.send({msg: "OK", renewals: docs});
         } else {
            let error=global.error(err, 0, req.controller);
            res.send({msg: 'ERROR', err: error});
         }
      });

   });

   app.get('/renewal/list', [control.auth, controller, control.acl], (req, res) => {

      Renewal.find({}, function (err, docs) {
         if (typeof docs !== 'undefined') {
            control.log(req.route.path, req.user);
            res.send({msg: "OK", renewals: docs});
         } else {
            let error=global.error(err, 0, req.controller);
            res.send({msg: 'ERROR', err: error});
         }
      });

   });

   app.get('/renewal/view/:id', [control.auth, controller, control.acl], (req, res) => {

      Renewal.findById(req.params.id, function (err, doc) {
         if (!err) {
            control.log(req.route.path, req.user);
            res.send({msg: "OK", renewal: doc});
         } else {
            let error=global.error(err, 0, req.controller);
            res.send({msg: 'ERROR', err: error});
         }
      });

   });

   app.post('/renewal/add', [control.auth, controller, control.acl], (req, res) => {

      let renewalData = {
         idPolicy: req.body.idPolicy,
         numberPolicyOverdue: req.body.numberPolicyOverdue,
         numberRenewedPolicy: req.body.numberRenewedPolicy,
         dateNewTerm: req.body.dateNewTerm,
         sellerComments: req.body.sellerComments,
         typePolicy: req.body.typePolicy,
         dateCreate: moment(),
         userCreate: req.user.idUser,
         dateUpdate: moment(),
         userUpdate: req.user.idUser
      };

      

      Policy.findById(req.body.idPolicy, function (err1, doc1) {
         if (!err1) {
            
            renewalData['policy'] = doc1;
            let renewal = new Renewal(renewalData);

            renewal.save((err2, doc2) => {
               if(!err2){
                  findAction(function(docs){
                     control.log(req.route.path, req.user);
                     res.send({msg: "OK", update: docs});
                  });
               } else {
                  let error=global.error(err2, 0, req.controller);
                  res.send({msg: 'ERROR', err: error});
               }            
            });
         } else {
            let error=global.error(err1, 0, req.controller);
            res.send({msg: 'ERROR', err: error});
         }
      });

   });

   app.post('/renewal/edit/:id', [control.auth, controller, control.acl], (req, res) => {

      let filter = {
         _id: req.params.id
      }

      let update = {
         idPolicy: req.body.idPolicy,
         policy: req.body.idPolicy,
         numberPolicyOverdue: req.body.numberPolicyOverdue,
         numberRenewedPolicy: req.body.numberRenewedPolicy,
         dateNewTerm: req.body.dateNewTerm,
         sellerComments: req.body.sellerComments,
         typePolicy: req.body.typePolicy,
         dateUpdate: moment(),
         userUpdate: req.user.idUser
      };

      Renewal.findOneAndUpdate(filter, update, function (err, doc) {
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

   app.delete('/renewal/delete/:id', [control.auth, controller, control.acl], (req, res) => {

      let filter = {
         _id: req.params.id
      }

      Renewal.findByIdAndRemove(filter, function (err, doc) {
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

}

export default renewalController
