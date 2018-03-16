
import moment from 'moment';
import multer from 'multer';
import fs from 'fs';
import acl from "../configs/acl";

import Account from "../models/account";

const pathRender = `uploads/account`;
const pathAccount = `./public/${pathRender}`;

if (!fs.existsSync(pathAccount)){
    fs.mkdirSync(pathAccount);
}

let storage = multer.diskStorage({
   destination: function(req, file, callback) {
      callback(null, pathAccount);
   },
   filename: function(req, file, callback){
      var basename = file.originalname.split(/[\\/]/).pop(),
      pos = basename.lastIndexOf(".");
      if (basename === "" || pos < 1)
         return "";
      callback(null, file.fieldname + '-' + Date.now() + '.' + basename.slice(pos + 1));
   }
});

let upload = multer({storage: storage}).single("accountImg");

let accountController = function (app, control={auth, passport, acl}){

   function controller (req, res, next) {
      req.controller = "account";
      return next();
   }

   function findAction (callback){
      let $filter =  global.filter(null);
      Account.find($filter, function (err, docs) {
         if (!err) {
            callback(docs)
         }
      });
   }

   app.post('/account/filter',[control.auth, controller], (req, res) => {
      let $filter =  global.filter(req.body.filter);
      Account.find($filter, function (err, docs) {
         if (typeof docs !== 'undefined') {
            control.log(req.route.path, req.user);
            res.send({msg: "OK", accounts: docs});
         } else {
            let error=global.error(err, 0, req.controller);
            res.send({msg: 'ERROR', err: error});
         }
      });

   });

   app.get('/account/list', [control.auth, controller, control.acl], (req, res) => {
      let $filter =  global.filter(null);
      Account.find($filter, function (err, docs) {
         if (typeof docs !== 'undefined') {
            control.log(req.route.path, req.user);
            res.send({msg: "OK", accounts: docs});
         } else {
            let error=global.error(err, 0, req.controller);
            res.send({msg: 'ERROR', err: error});
         }
      });

   });

   app.get('/account/view/:id', [control.auth, controller, control.acl], (req, res) => {

      Account.findById(req.params.id, function (err, doc) {
         if (!err) {
            control.log(req.route.path, req.user);
            res.send({msg: "OK", account: doc});
         } else {
            let error=global.error(err, 0, req.controller);
            res.send({msg: 'ERROR', err: error});
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
         description: req.body.description,
         dateCreate: moment(),
         userCreate: req.user.idUser,
         dateUpdate: moment(),
         userUpdate: req.user.idUser
      });

      account.save((err, doc) => {
         if(!err){
            control.log(req.route.path, req.user);
            res.send({msg: "OK", doc: doc});
         } else {
            let error=global.error(err, 0, req.controller);
            res.send({msg: 'ERROR', err: error});
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
         description: req.body.description,
         dateUpdate: moment(),
         userUpdate: req.user.idUser
      };

      Account.findOneAndUpdate(filter, update, function (err, doc) {
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

   app.delete('/account/delete/:id', [control.auth, controller, control.acl], (req, res) => {

      let filter = {
         _id: req.params.id
      }

      let update = {
         dateDelete: moment()
      };

      Account.findOneAndUpdate(filter, update, function (err, doc) {
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

      Account.findByIdAndRemove(filter, function (err, doc) {
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

   app.post('/account/addaccountImg', [control.auth, controller, control.acl], (req, res) => {

      upload(req , res , function(err) {
         if(!err){
            let $accountImg = `${req.file.filename}`;
            res.send({msg: "OK", accountImg: $accountImg, path: pathRender});
         } else {
            let error=global.error(err, 0, req.controller);
            res.send({msg: 'ERROR', err: error});
         }
      });

   });

   app.delete('/account/deleteaccountImg/:name', [control.auth, controller, control.acl], (req, res) => {

      let $accountImgPath = `${pathAccount}/${req.params.name}`;
      fs.unlink($accountImgPath, function (err) {
         if(!err){
            res.send({msg: "OK"});
         } else {
            let error=global.error(err, 0, req.controller);
            res.send({msg: 'ERROR', err: error});
         }
      });

   });

}

export default accountController
