
import moment from 'moment';
import multer from 'multer';
import fs from 'fs';

import LetterAccident from "../models/letterAccident";
import Insurance from "../models/insurance";
import Ramo from "../models/ramo";

const pathRender = `uploads/letterAccident`;
const pathLetterAccident = `./public/${pathRender}`;

if (!fs.existsSync(pathLetterAccident)){
    fs.mkdirSync(pathLetterAccident);
}

let storage = multer.diskStorage({
   destination: function(req, file, callback) {
      callback(null, pathLetterAccident);
   },
   filename: function(req, file, callback){
      var basename = file.originalname.split(/[\\/]/).pop(),
      pos = basename.lastIndexOf(".");
      if (basename === "" || pos < 1)
         return "";
      callback(null, file.fieldname + '-' + Date.now() + '.' + basename.slice(pos + 1));
   }
});

let upload = multer({storage: storage}).single("letterAccidentFile");

let letterAccidentController = function (app, control={auth, passport, acl}){

   function controller (req, res, next) {
      req.controller = "letterAccident";
      return next();
   }

   function findAction (callback){
      let $filter =  global.filter(null);
      LetterAccident.find($filter, function (err, docs) {
         if (!err) {
            Insurance.populate(docs, {path: "insurance"},function(err, docs){
               Ramo.populate(docs, {path: "ramo"},function(err, docs){
                  callback(docs);
               });
            });
         }
      });
   }

   app.post('/letterAccident/filter',[control.auth, controller], (req, res) => {
      let $filter =  global.filter(req.body.filter);
      LetterAccident.find($filter, function (err, docs) {
         if (typeof docs !== 'undefined') {
            control.log(req.route.path, req.user);
            Insurance.populate(docs, {path: "insurance"},function(err, docs){
               Ramo.populate(docs, {path: "ramo"},function(err, docs){
                  res.send({msg: "OK", letterAccidents: docs});
               });
            });
         } else {
            let error=global.error(err, 0, req.controller);
            res.send({msg: 'ERROR', err: error});
         }
      });

   });

   app.get('/letterAccident/list', [control.auth, controller, control.acl], (req, res) => {
      let $filter =  global.filter(null);
      LetterAccident.find($filter, function (err, docs) {
         if (typeof docs !== 'undefined') {
            control.log(req.route.path, req.user);
            Insurance.populate(docs, {path: "insurance"},function(err, docs){
               Ramo.populate(docs, {path: "ramo"},function(err, docs){
                  res.send({msg: "OK", letterAccidents: docs});
               });
            });
         } else {
            let error=global.error(err, 0, req.controller);
            res.send({msg: 'ERROR', err: error});
         }
      });

   });

   app.get('/letterAccident/view/:id', [control.auth, controller, control.acl], (req, res) => {

      LetterAccident.findById(req.params.id, function (err, doc) {
         if (!err) {
            control.log(req.route.path, req.user);
            res.send({msg: "OK", letterAccident: doc});
         } else {
            let error=global.error(err, 0, req.controller);
            res.send({msg: 'ERROR', err: error});
         }
      });

   });

   app.post('/letterAccident/add', [control.auth, controller, control.acl], (req, res) => {

      let letterAccident = new LetterAccident({
         idInsurance: req.body.idInsurance,
         insurance: req.body.idInsurance,
         idRamo: req.body.idRamo,
         ramo: req.body.idRamo,
         file: req.body.file,
         dateCreate: moment(),
         userCreate: req.user.idUser,
         dateUpdate: moment(),
         userUpdate: req.user.idUser
      });

      letterAccident.save((err, doc) => {
         if(!err){
            control.log(req.route.path, req.user);
            res.send({msg: "OK", doc: doc});
         } else {
            let error=global.error(err, 0, req.controller);
            res.send({msg: 'ERROR', err: error});
         }            
      });

   });

   app.post('/letterAccident/edit/:id', [control.auth, controller, control.acl], (req, res) => {

      let filter = {
         _id: req.params.id
      }

      let update = {
         idInsurance: req.body.idInsurance,
         insurance: req.body.idInsurance,
         idRamo: req.body.idRamo,
         ramo: req.body.idRamo,
         file: req.body.file,
         dateUpdate: moment(),
         userUpdate: req.user.idUser
      };

      LetterAccident.findOneAndUpdate(filter, update, function (err, doc) {
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

   app.delete('/letterAccident/delete/:id', [control.auth, controller, control.acl], (req, res) => {

      let filter = {
         _id: req.params.id
      }

      let update = {
         dateDelete: moment()
      };

      LetterAccident.findOneAndUpdate(filter, update, function (err, doc) {
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

      LetterAccident.findByIdAndRemove(filter, function (err, doc) {
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

   app.post('/letterAccident/addletterAccidentFile', [control.auth, controller, control.acl], (req, res) => {

      upload(req , res , function(err) {
         if(!err){
            let $letterAccidentFile = `${req.file.filename}`;
            res.send({msg: "OK", letterAccidentFile: $letterAccidentFile, path: pathRender});
         } else {
            let error=global.error(err, 0, req.controller);
            res.send({msg: 'ERROR', err: error});
         }
      });

   });

   app.delete('/letterAccident/deleteletterAccidentFile/:name', [control.auth, controller, control.acl], (req, res) => {

      let $letterAccidentFilePath = `${pathLetterAccident}/${req.params.name}`;
      fs.unlink($letterAccidentFilePath, function (err) {
         if(!err){
            res.send({msg: "OK"});
         } else {
            let error=global.error(err, 0, req.controller);
            res.send({msg: 'ERROR', err: error});
         }
      });

   });

}

export default letterAccidentController
