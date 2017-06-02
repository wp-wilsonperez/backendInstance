
import moment from 'moment';
import acl from "../configs/acl";

import Account from "../models/account";

let accountController = function (app, control={auth, passport, acl}){

   function controller (req, res, next) {
      req.controller = "account";
      return next();
   }

   function findAction (callback){
      Account.find({}, function (err, docs) {
         if (!err) {
            callback(docs)
         }
      });
   }

   app.get('/account/list', [control.auth, controller, control.acl], (req, res) => {

      Account.find({}, function (err, docs) {
         if (typeof docs !== 'undefined') {
            res.send({msg: "OK", accounts: docs});
         } else {
            res.send({
               msg : 'ERR',
               err : err.code
            });
         }
      });

   });

   app.get('/account/view/:id', [control.auth, controller, control.acl], (req, res) => {

      Account.findById(req.params.id, function (err, doc) {
         if (!err) {
            res.send({msg: "OK", account: doc});
         } else {
            res.send({msg: 'ERR', err: err});
         }
      });

   });

   app.post('/account/add', [control.auth, controller, control.acl], (req, res) => {

      let account = new Account({
         name: req.body.name,
         logo: req.body.logo,
         img1: req.body.img1,
         img2: req.body.img2,
         img3: req.body.img3,
         parking: req.body.parking,
         desciption: req.body.desciption,
         dateCreate: moment(),
         userCreate: req.user.idUser,
         dateUpdate: moment(),
         userUpdate: req.user.idUser
      });

      account.save((err, doc) => {
         if(!err){
            res.send({msg: "OK", doc: doc});
         } else {
            res.send({msg: 'ERR', err: err});
         }            
      });

   });

   app.post('/account/edit/:id', [control.auth, controller, control.acl], (req, res) => {

      let filter = {
         _id: req.params.id
      }

      let update = {
         name: req.body.name,
         logo: req.body.logo,
         img1: req.body.img1,
         img2: req.body.img2,
         img3: req.body.img3,
         parking: req.body.parking,
         desciption: req.body.desciption,
         dateUpdate: moment(),
         userUpdate: req.user.idUser
      };

      Account.findOneAndUpdate(filter, update, function (err, doc) {
         if (!err) {
            findAction(function(docs){
               res.send({msg: "OK", update: docs});
            });
         } else {
            res.send({msg: 'ERR', err: err});
         }
      });

   });

   app.delete('/account/delete/:id', [control.auth, controller, control.acl], (req, res) => {

      let filter = {
         _id: req.params.id
      }

      Account.findByIdAndRemove(filter, function (err, doc) {
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

export default accountController
