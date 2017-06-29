
import moment from 'moment';
import multer from 'multer';
import fs from 'fs';

import Client from "../models/client";

const pathRender = `uploads/client`;
const pathClient = `./public/${pathRender}`;

if (!fs.existsSync(pathClient)){
    fs.mkdirSync(pathClient);
}

let storage = multer.diskStorage({
   destination: function(req, file, callback) {
      callback(null, pathClient);
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

let clientController = function (app, control={auth, passport, acl}){

   function controller (req, res, next) {
      req.controller = "client";
      return next();
   }

   function findAction (callback){
      Client.find({}, function (err, docs) {
         if (!err) {
            callback(docs)
         }
      });
   }

   app.get('/client/list', [control.auth, controller, control.acl], (req, res) => {

      Client.find({}, function (err, docs) {
         if (typeof docs !== 'undefined') {
            res.send({msg: "OK", clients: docs});
         } else {
            res.send({
               msg : 'ERR',
               err : err.code
            });
         }
      });

   });

   app.get('/client/view/:id', [control.auth, controller, control.acl], (req, res) => {

      Client.findById(req.params.id, function (err, doc) {
         if (!err) {
            res.send({msg: "OK", client: doc});
         } else {
            res.send({msg: 'ERR', err: err});
         }
      });

   });

   app.post('/client/add', [control.auth, controller, control.acl], (req, res) => {

      let client = new Client({
         name: req.body.name,
         lastName: req.body.lastName,
         doc: req.body.doc,
         docType: req.body.docType,
         cellPhone: req.body.cellPhone,
         mail: req.body.mail,
         address: req.body.address,
         nameEmergency: req.body.nameEmergency,
         lastNameEmergency: req.body.lastNameEmergency,
         phoneEmergency: req.body.phoneEmergency,
         nameWork: req.body.nameWork,
         phoneWork: req.body.phoneWork,
         map: req.body.map,
         birthdate: req.body.birthdate,
         copyDoc: req.body.copyDoc,
         copyRegister: req.body.copyRegister,
         copyVote: req.body.copyVote,
         copyBasicService: req.body.copyBasicService,
         copyGroup: req.body.copyGroup,
         idTypeClient: req.body.idTypeClient,
         idCity: req.body.idCity,
         idMaritalStatus: req.body.idMaritalStatus,
         dateCreate: moment(),
         userCreate: req.user.idUser,
         dateUpdate: moment(),
         userUpdate: req.user.idUser
      });

      client.save((err, doc) => {
         if(!err){
            res.send({msg: "OK", doc: doc});
         } else {
            res.send({msg: 'ERR', err: err});
         }            
      });

   });

   app.post('/client/edit/:id', [control.auth, controller, control.acl], (req, res) => {

      let filter = {
         _id: req.params.id
      }

      let update = {
         name: req.body.name,
         lastName: req.body.lastName,
         doc: req.body.doc,
         docType: req.body.docType,
         cellPhone: req.body.cellPhone,
         mail: req.body.mail,
         address: req.body.address,
         nameEmergency: req.body.nameEmergency,
         lastNameEmergency: req.body.lastNameEmergency,
         phoneEmergency: req.body.phoneEmergency,
         nameWork: req.body.nameWork,
         phoneWork: req.body.phoneWork,
         map: req.body.map,
         birthdate: req.body.birthdate,
         copyDoc: req.body.copyDoc,
         copyRegister: req.body.copyRegister,
         copyVote: req.body.copyVote,
         copyBasicService: req.body.copyBasicService,
         copyGroup: req.body.copyGroup,
         idTypeClient: req.body.idTypeClient,
         idCity: req.body.idCity,
         idMaritalStatus: req.body.idMaritalStatus,
         dateUpdate: moment(),
         userUpdate: req.user.idUser
      };

      Client.findOneAndUpdate(filter, update, function (err, doc) {
         if (!err) {
            findAction(function(docs){
               res.send({msg: "OK", update: docs});
            });
         } else {
            res.send({msg: 'ERR', err: err});
         }
      });

   });

   app.delete('/client/delete/:id', [control.auth, controller, control.acl], (req, res) => {

      let filter = {
         _id: req.params.id
      }

      Client.findByIdAndRemove(filter, function (err, doc) {
         if(!err){
            findAction(function(docs){
               res.send({msg: "OK", update: docs});
            });
         } else {
            res.send({msg: 'ERR', err: err});
         }            
      });

   });

   app.post('/client/addclientImg', [control.auth, controller, control.acl], (req, res) => {

      upload(req , res , function(err) {
         if(!err){
            let $clientImg = `${req.file.filename}`;
            res.send({msg: "OK", clientImg: $clientImg, path: pathRender});
         } else {
            res.send({msg: 'ERR', err: err});
         }
      });

   });

   app.delete('/client/deleteclientImg/:name', [control.auth, controller, control.acl], (req, res) => {

      let $clientImgPath = `${pathClient}/${req.params.name}`;
      fs.unlink($accountImgPath, function (err) {
         if(!err){
            res.send({msg: "OK"});
         } else {
            res.send({msg: 'ERR', err: err});
         }
      });

   });

}

export default clientController
