
import moment from 'moment';
import multer from 'multer';
import fs from 'fs';

import Dependent from "../models/dependent";

import Client from "../models/client";

const pathRender = `uploads/dependent`;
const pathDependent = `./public/${pathRender}`;

if (!fs.existsSync(pathDependent)){
    fs.mkdirSync(pathDependent);
}

let storage = multer.diskStorage({
   destination: function(req, file, callback) {
      callback(null, pathDependent);
   },
   filename: function(req, file, callback){
      var basename = file.originalname.split(/[\\/]/).pop(),
      pos = basename.lastIndexOf(".");
      if (basename === "" || pos < 1)
         return "";
      callback(null, file.fieldname + '-' + Date.now() + '.' + basename.slice(pos + 1));
   }
});

let upload = multer({storage: storage}).single("copyImg");

let dependentController = function (app, control={auth, passport, acl}){

   function controller (req, res, next) {
      req.controller = "dependent";
      return next();
   }

   function findAction (callback){
      Dependent.find({}, function (err, docs) {
         if (!err) {
            
            Client.populate(docs, {path: "client"},function(err, docs){
               callback(docs);
            });
         }
      });
   }

   app.get('/dependent/list', [control.auth, controller, control.acl], (req, res) => {

      Dependent.find({}, function (err, docs) {
         if (typeof docs !== 'undefined') {

            Client.populate(docs, {path: "client"},function(err, docs){
               res.send({msg: "OK", dependents: docs});
            });
            
         } else {
            res.send({
               msg : 'ERR',
               err : err.code
            });
         }
      });

   });

   app.get('/dependent/view/:id', [control.auth, controller, control.acl], (req, res) => {

      Dependent.findById(req.params.id, function (err, doc) {
         if (!err) {
            res.send({msg: "OK", dependent: doc});
         } else {
            res.send({msg: 'ERR', err: err});
         }
      });

   });

   app.post('/dependent/add', [control.auth, controller, control.acl], (req, res) => {

      let dependent = new Dependent({
         idClient: req.body.idClient,
         client: req.body.idClient,
         cedula: req.body.cedula,
         name: req.body.name,
         lastName: req.body.lastName,
         relationship: req.body.relationship,
         birthdate: req.body.birthdate,
         workingDetails: req.body.workingDetails,
         sex: req.body.sex,
         notCovered: req.body.notCovered,
         docRelationship: req.body.docRelationship,
         dateCreate: moment(),
         userCreate: req.user.idUser,
         dateUpdate: moment(),
         userUpdate: req.user.idUser
      });

      dependent.save((err, doc) => {
         if(!err){
            findAction(function(docs){
               res.send({msg: "OK", update: docs});
            });
         } else {
            res.send({msg: 'ERR', err: err});
         }            
      });

   });

   app.post('/dependent/edit/:id', [control.auth, controller, control.acl], (req, res) => {

      let filter = {
         _id: req.params.id
      }

      let update = {
         idClient: req.body.idClient,
         client: req.body.idClient,
         cedula: req.body.cedula,
         name: req.body.name,
         lastName: req.body.lastName,
         relationship: req.body.relationship,
         birthdate: req.body.birthdate,
         workingDetails: req.body.workingDetails,
         sex: req.body.sex,
         notCovered: req.body.notCovered,
         docRelationship: req.body.docRelationship,
         dateUpdate: moment(),
         userUpdate: req.user.idUser
      };

      Dependent.findOneAndUpdate(filter, update, function (err, doc) {
         if (!err) {
            findAction(function(docs){
               res.send({msg: "OK", update: docs});
            });
         } else {
            res.send({msg: 'ERR', err: err});
         }
      });

   });

   app.delete('/dependent/delete/:id', [control.auth, controller, control.acl], (req, res) => {

      let filter = {
         _id: req.params.id
      }

      Dependent.findByIdAndRemove(filter, function (err, doc) {
         if(!err){
            findAction(function(docs){
               res.send({msg: "OK", update: docs});
            });
         } else {
            res.send({msg: 'ERR', err: err});
         }            
      });

   });

   app.post('/dependent/adddependentImg', [control.auth, controller, control.acl], (req, res) => {

      upload(req , res , function(err) {
         if(!err){
            let $dependentImg = `${req.file.filename}`;
            res.send({msg: "OK", dependentImg: $dependentImg, path: pathRender});
         } else {
            res.send({msg: 'ERR', err: err});
         }
      });

   });

   app.delete('/dependent/deletedependentImg/:name', [control.auth, controller, control.acl], (req, res) => {

      let $dependentImgPath = `${pathDependent}/${req.params.name}`;
      fs.unlink($dependentImgPath, function (err) {
         if(!err){
            res.send({msg: "OK"});
         } else {
            res.send({msg: 'ERR', err: err});
         }
      });

   });

}

export default dependentController
