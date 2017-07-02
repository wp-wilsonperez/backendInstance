
import moment from 'moment';
import multer from 'multer';
import fs from 'fs';

import Insurance from "../models/insurance";

const pathRender = `uploads/insurance`;
const pathInsurance = `./public/${pathRender}`;

if (!fs.existsSync(pathInsurance)){
    fs.mkdirSync(pathInsurance);
}

let storage = multer.diskStorage({
   destination: function(req, file, callback) {
      callback(null, pathInsurance);
   },
   filename: function(req, file, callback){
      var basename = file.originalname.split(/[\\/]/).pop(),
      pos = basename.lastIndexOf(".");
      if (basename === "" || pos < 1)
         return "";
      callback(null, file.fieldname + '-' + Date.now() + '.' + basename.slice(pos + 1));
   }
});

let upload = multer({storage: storage}).single("insuranceImg");

let insuranceController = function (app, control={auth, passport, acl}){

   function controller (req, res, next) {
      req.controller = "insurance";
      return next();
   }

   function findAction (callback){
      Insurance.find({}, function (err, docs) {
         if (!err) {
            callback(docs)
         }
      });
   }

   app.get('/insurance/list', [control.auth, controller, control.acl], (req, res) => {

      Insurance.find({}, function (err, docs) {
         if (typeof docs !== 'undefined') {
            res.send({msg: "OK", insurances: docs});
         } else {
            res.send({
               msg : 'ERR',
               err : err.code
            });
         }
      });

   });

   app.get('/insurance/view/:id', [control.auth, controller, control.acl], (req, res) => {

      Insurance.findById(req.params.id, function (err, doc) {
         if (!err) {
            res.send({msg: "OK", insurance: doc});
         } else {
            res.send({msg: 'ERR', err: err});
         }
      });

   });

   app.post('/insurance/add', [control.auth, controller, control.acl], (req, res) => {

      let insurance = new Insurance({
         ruc: req.body.ruc,
         bussinesName: req.body.bussinesName,
         cellPhone: req.body.cellPhone,
         phones: req.body.phones,
         address: req.body.address,
         img1: req.body.img1,
         img2: req.body.img2,
         img3: req.body.img3,
         parking: req.body.parking,
         schedules: req.body.schedules,
         web: req.body.web,
         mail: req.body.mail,
         Enable: false,
         dateCreate: moment(),
         userCreate: req.user.idUser,
         dateUpdate: moment(),
         userUpdate: req.user.idUser
      });

      insurance.save((err, doc) => {
         if(!err){
            res.send({msg: "OK", doc: doc});
         } else {
            res.send({msg: 'ERR', err: err});
         }            
      });

   });

   app.post('/insurance/edit/:id', [control.auth, controller, control.acl], (req, res) => {

      let filter = {
         _id: req.params.id
      }

      let update = {
         ruc: req.body.ruc,
         bussinesName: req.body.bussinesName,
         cellPhone: req.body.cellPhone,
         phones: req.body.phones,
         address: req.body.address,
         img1: req.body.img1,
         img2: req.body.img2,
         img3: req.body.img3,
         parking: req.body.parking,
         schedules: req.body.schedules,
         web: req.body.web,
         mail: req.body.mail,
         dateUpdate: moment(),
         userUpdate: req.user.idUser
      };

      Insurance.findOneAndUpdate(filter, update, function (err, doc) {
         if (!err) {
            findAction(function(docs){
               res.send({msg: "OK", update: docs});
            });
         } else {
            res.send({msg: 'ERR', err: err});
         }
      });

   });

   app.post('/insurance/enable/:id', [control.auth, controller, control.acl], (req, res) => {

      let filter = {
         _id: req.params.id
      }

      let update = {
         Enable: true,
         dateUpdate: moment(),
         userUpdate: req.user.idUser
      };

      Insurance.findOneAndUpdate(filter, update, function (err, doc) {
         if (!err) {
            findAction(function(docs){
               res.send({msg: "OK", update: docs});
            });
         } else {
            res.send({msg: 'ERR', err: err});
         }
      });

   });

   app.delete('/insurance/delete/:id', [control.auth, controller, control.acl], (req, res) => {

      let filter = {
         _id: req.params.id
      }

      Insurance.findByIdAndRemove(filter, function (err, doc) {
         if(!err){
            findAction(function(docs){
               res.send({msg: "OK", update: docs});
            });
         } else {
            res.send({msg: 'ERR', err: err});
         }            
      });

   });

   app.post('/insurance/addinsuranceImg', [control.auth, controller, control.acl], (req, res) => {

      upload(req , res , function(err) {
         if(!err){
            let $insuranceImg = `${req.file.filename}`;
            res.send({msg: "OK", ainsuranceImg: $insuranceImg, path: pathRender});
         } else {
            res.send({msg: 'ERR', err: err});
         }
      });

   });

   app.delete('/insurance/deleteinsurancetImg/:name', [control.auth, controller, control.acl], (req, res) => {

      let $insuranceImgPath = `${pathInsurance}/${req.params.name}`;
      fs.unlink($insuranceImgPath, function (err) {
         if(!err){
            res.send({msg: "OK"});
         } else {
            res.send({msg: 'ERR', err: err});
         }
      });

   });

}

export default insuranceController