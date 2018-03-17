
import moment from 'moment';
import multer from 'multer';
import fs from 'fs';
import sha1 from 'sha1';
import nodemailer from 'nodemailer';

import generator from 'generate-password';

import Client from "../models/client";
import TypeClient from "../models/typeClient";
import City from "../models/city";
import MaritalStatus from "../models/maritalStatus";

import mailConfig from "../configs/nodemailer";

const pathRender = `uploads/client`;
const pathClient = `./public/${pathRender}`;

let smtpTransport =  nodemailer.createTransport(`smtps://${mailConfig.mail}%40gmail.com:${mailConfig.password}@smtp.gmail.com`);

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
      let $filter =  global.filter(null);
      Client.find($filter, function (err, docs) {
         if (!err) {

            TypeClient.populate(docs, {path: "typeClient"},function(err, docs){
               City.populate(docs, {path: "city"},function(err, docs){
                  MaritalStatus.populate(docs, {path: "maritalStatus"},function(err, docs){
                     callback(docs);
                  });
               });
            });
         }
      });
   }

   app.post('/client/filter',[control.auth, controller], (req, res) => {
    let filter =  req.body.filter;
        Client.find(filter, function (err, docs) {
            if (typeof docs !== 'undefined') {
                control.log(req.route.path, req.user);
                TypeClient.populate(docs, {path: "typeClient"},function(err, docs){
                    City.populate(docs, {path: "city"},function(err, docs){
                       MaritalStatus.populate(docs, {path: "maritalStatus"},function(err, docs){
                          res.send({msg: "OK", clients: docs});
                       });
                    });
                 });
            } else {
            let error=global.error(err, 0, req.controller);
            res.send({msg: 'ERROR', err: error});
            }
        });
    
    });

   app.get('/client/list', [control.auth, controller, control.acl], (req, res) => {
      let $filter =  global.filter(null);
      Client.find($filter, function (err, docs) {
         if (typeof docs !== 'undefined') {
            control.log(req.route.path, req.user);
            TypeClient.populate(docs, {path: "typeClient"},function(err, docs){
               City.populate(docs, {path: "city"},function(err, docs){
                  MaritalStatus.populate(docs, {path: "maritalStatus"},function(err, docs){
                     res.send({msg: "OK", clients: docs});
                  });
               });
            });
         } else {
            let error=global.error(err, 0, req.controller);
            res.send({msg: 'ERROR', err: error});
         }
      });

   });

   app.get('/client/view/:id', [control.auth, controller, control.acl], (req, res) => {

      Client.findById(req.params.id, function (err, doc) {
         if (!err) {
            control.log(req.route.path, req.user);
            res.send({msg: "OK", client: doc});
         } else {
            let error=global.error(err, 0, req.controller);
            res.send({msg: 'ERROR', err: error});
         }
      });

   });

   app.post('/client/add', [control.auth, controller, control.acl], (req, res) => {

      let password = generator.generate({ length: 8, numbers: true});

      let dataClient = {
         name: req.body.name,
         lastName: req.body.lastName,
         doc: req.body.doc,
         docType: req.body.docType,
         phones: req.body.phones,
         checkPhones: req.body.checkPhones,
         detailPhones: req.body.detailPhones,
         cellPhone: req.body.cellPhone,
         checkCellPhone: req.body.cellPhone,
         detailCellPhone: req.body.detailCellPhone,
         mail: req.body.mail,
         checkMail: req.body.checkMail,
         detailMail: req.body.detailMail,
         address: req.body.address,
         nameEmergency: req.body.nameEmergency,
         lastNameEmergency: req.body.lastNameEmergency,
         phoneEmergency: req.body.phoneEmergency,
         nameWork: req.body.nameWork,
         phoneWork: req.body.phoneWork,
         addressWork: req.body.addressWork,
         map: req.body.map,
         mapSecond: req.body.mapSecond,
         birthdate: req.body.birthdate,
         copyDoc: req.body.copyDoc,
         copyRegister: req.body.copyRegister,
         copyVote: req.body.copyVote,
         copyBasicService: req.body.copyBasicService,
         copyGroup: req.body.copyGroup,
         idTypeClient: req.body.idTypeClient,
         typeClient: req.body.idTypeClient,
         idCity: req.body.idCity,
         city: req.body.idCity,
         idMaritalStatus: req.body.idMaritalStatus,
         maritalStatus: req.body.idMaritalStatus,
         user: req.body.mail,
         password: sha1(password),
         confirm: false,
         dateCreate: moment(),
         userCreate: req.user.idUser,
         dateUpdate: moment(),
         userUpdate: req.user.idUser
      };

      let client = new Client(dataClient);

      client.save((err, doc) => {
         if(!err){
            control.log(req.route.path, req.user);
            let html = "";
               html += "<br>Usuario: "+dataClient.user+"</br>";
               html += "<br>Contraseña: "+password+"</br>";
               html += "<br>HORA DE ENVIO: "+moment().format("YYYY-MM-DD H:mm:ss")+"</br>";
            let mailOptions = {
               from: `${dataClient.name}<${dataClient.mail}@gmail.com>`,
               to: dataClient.user,
               subject: "Registro de YTODOSEGURO",
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

            res.send({msg: "OK", doc: doc});
         } else {
            let error=global.error(err, 0, req.controller);
            res.send({msg: 'ERROR', err: error});
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
         phones: req.body.phones,
         checkPhones: req.body.checkPhones,
         detailPhones: req.body.detailPhones,
         cellPhone: req.body.cellPhone,
         checkCellPhone: req.body.cellPhone,
         detailCellPhone: req.body.detailCellPhone,
         mail: req.body.mail,
         checkMail: req.body.checkMail,
         detailMail: req.body.detailMail,
         address: req.body.address,
         nameEmergency: req.body.nameEmergency,
         lastNameEmergency: req.body.lastNameEmergency,
         phoneEmergency: req.body.phoneEmergency,
         nameWork: req.body.nameWork,
         phoneWork: req.body.phoneWork,
         addressWork: req.body.addressWork,
         map: req.body.map,
         mapSecond: req.body.mapSecond,
         birthdate: req.body.birthdate,
         copyDoc: req.body.copyDoc,
         copyRegister: req.body.copyRegister,
         copyVote: req.body.copyVote,
         copyBasicService: req.body.copyBasicService,
         copyGroup: req.body.copyGroup,
         idTypeClient: req.body.idTypeClient,
         typeClient: req.body.idTypeClient,
         idCity: req.body.idCity,
         city: req.body.idCity,
         idMaritalStatus: req.body.idMaritalStatus,
         maritalStatus: req.body.idMaritalStatus,
         dateUpdate: moment(),
         userUpdate: req.user.idUser
      };

      Client.findOneAndUpdate(filter, update, function (err, doc) {
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

   app.delete('/client/delete/:id', [control.auth, controller, control.acl], (req, res) => {

      let filter = {
         _id: req.params.id
      }

      let update = {
         dateDelete: moment()
      };

      Client.findOneAndUpdate(filter, update, function (err, doc) {
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

      Client.findByIdAndRemove(filter, function (err, doc) {
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

   app.post('/client/addclientImg', [control.auth, controller, control.acl], (req, res) => {

      upload(req , res , function(err) {
         if(!err){
            let $clientImg = `${req.file.filename}`;
            res.send({msg: "OK", clientImg: $clientImg, path: pathRender});
         } else {
            let error=global.error(err, 0, req.controller);
            res.send({msg: 'ERROR', err: error});
         }
      });

   });

   app.delete('/client/deleteclientImg/:name', [control.auth, controller, control.acl], (req, res) => {

      let $clientImgPath = `${pathClient}/${req.params.name}`;
      fs.unlink($clientImgPath, function (err) {
         if(!err){
            res.send({msg: "OK"});
         } else {
            let error=global.error(err, 0, req.controller);
            res.send({msg: 'ERROR', err: error});
         }
      });

   });

}

export default clientController
