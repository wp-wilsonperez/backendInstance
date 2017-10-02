
import moment from 'moment';
import sha1 from 'sha1';

import Client from "../models/client";

import Policy from "../models/policy";
import PolicyAnnex from "../models/policyAnnex";
import ItemAnnex from "../models/itemAnnex";
import SubItemAnnex from "../models/subItemAnnex";

let apiClientController = function (app, control={auth, passport, acl}){

   function controller (req, res, next) {
      req.controller = "apiClient";
      return next();
   }

   app.get('/apiClient/login', [control.auth, controller], (req, res) => {
      let $filter = {
         user: req.query.user,
         password: sha1(req.query.password)
      };
      Client.find($filter, function (err, docs) {
         if (typeof docs !== 'undefined') {
            control.log(req.route.path, req.user);
            res.send({msg: "OK", clients: docs});
         } else {
            res.send({
               msg : 'ERR',
               err : err.code
            });
         }
      });

   });

   app.get('/apiClientPolicy/list', [control.auth, controller], (req, res) => {
      let $filter =  global.filter(req.query.filter);
      Policy.find($filter, function (err, docs) {
         if (typeof docs !== 'undefined') {
            control.log(req.route.path, req.user);
            res.send({msg: "OK", policies: docs});
         } else {
            res.send({
               msg : 'ERR',
               err : err.code
            });
         }
      });

   });

   app.get('/apiClientWallet/list', [control.auth, controller], (req, res) => {
      let $filter =  global.filter(req.query.filter);
      Wallet.find($filter, function (err, docs) {
         if (typeof docs !== 'undefined') {
            control.log(req.route.path, req.user);

            res.send({msg: "OK", wallets: docs});
         } else {
            res.send({
               msg : 'ERR',
               err : err.code
            });
         }
      });

   });

}

export default apiClientController
