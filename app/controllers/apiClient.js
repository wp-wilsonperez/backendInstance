
import moment from 'moment';
import sha1 from 'sha1';
import nodemailer from 'nodemailer';

import generator from 'generate-password';

import Client from "../models/client";

import Policy from "../models/policy";
import PolicyAnnex from "../models/policyAnnex";
import ItemAnnex from "../models/itemAnnex";
import SubItemAnnex from "../models/subItemAnnex";

import mailConfig from "../configs/nodemailer";

let smtpTransport =  nodemailer.createTransport(`smtps://${mailConfig.mail}%40gmail.com:${mailConfig.password}@smtp.gmail.com`);

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
      Client.findOne($filter, function (err, doc) {
         if (typeof docs !== 'undefined') {
            control.log(req.route.path, req.user);
            res.send({msg: "OK", client: doc});
         } else {
            res.send({
               msg : 'ERR',
               err : err.code
            });
         }
      });

   });

   app.get('/apiClient/recoveryPassword', [controller], (req, res) => {
      let $filter = {
         user: req.query.user
      };
      Client.findOne($filter, function (err, doc) {
         if (typeof docs !== 'undefined') {
            //control.log(req.route.path, req.user);
            let filter = {
               _id: doc._id
            }
            let password = generator.generate({ length: 8, numbers: true});
            let update = {
               password: sha1(password)
            };
            Client.findOneAndUpdate(filter, update, function (err, doc) {
               if (!err) {
                  
                  let html = "";
                     html += "<br>Usuario: "+doc.user+"</br>";
                     html += "<br>Contraseña: "+password+"</br>";
                     html += "<br>HORA DE ENVIO: "+moment().format("YYYY-MM-DD H:mm:ss")+"</br>";
                  let mailOptions = {
                     from: `${mailConfig.name}<${mailConfig.mail}@gmail.com>`,
                     to: doc.user,
                     subject: "Recuperar Contraseña YTODOSEGURO",
                     html: html
                  };
                  smtpTransport.sendMail(mailOptions, function(error, response){
                     if(error){
                        console.log("No Send");
                        console.log(error);
                     }else{
                        console.log("Send");
                     }
                  });

               } else {
                  res.send({msg: 'ERR', err: err});
               }
            });
            res.send({msg: "OK", client: doc});
         } else {
            res.send({
               msg : 'ERR',
               err : err.code
            });
         }
      });

   });

   app.post('/apiClientPolicy/list', [control.auth, controller], (req, res) => {
      let $filter =  global.filter(req.body.filter);
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

   app.post('/apiClientWallet/list', [control.auth, controller], (req, res) => {
      let $filter =  global.filter(req.body.filter);
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
