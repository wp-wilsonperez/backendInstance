
import sha1 from 'sha1';
import moment from 'moment';
import multer from 'multer';
import fs from 'fs';
import acl from "../configs/acl";
import nodemailer from 'nodemailer';

import generator from 'generate-password';

import User from "../models/user";
import Role from "../models/role";
import Branch from "../models/branch";

const pathRender = `uploads/user`;
const pathUser = `./public/${pathRender}`;

import mailConfig from "../configs/nodemailer";

let smtpTransport =  nodemailer.createTransport(`smtps://${mailConfig.mail}%40gmail.com:${mailConfig.password}@smtp.gmail.com`);

if (!fs.existsSync(pathUser)){
    fs.mkdirSync(pathUser);
}

let storage = multer.diskStorage({
   destination: function(req, file, callback) {
      callback(null, pathUser);
   },
   filename: function(req, file, callback){
      var basename = file.originalname.split(/[\\/]/).pop(),
      pos = basename.lastIndexOf(".");
      if (basename === "" || pos < 1)
         return "";
      callback(null, file.fieldname + '-' + Date.now() + '.' + basename.slice(pos + 1));
   }
});

let upload = multer({storage: storage}).single("userImg");


let userController = function (app, control={auth, passport, acl}){

   function controller (req, res, next) {
      req.controller = "user";
      return next();
   }

   function findAction (callback){
      let $filter =  global.filter(null);
      User.find($filter, function (err, docs) {
         if (!err) {
            Role.populate(docs, {path: "role"},function(err, docs){
               Branch.populate(docs, {path: "branch"},function(err, docs){
                  callback(docs);
               });
            });
         }
      });
   }

   app.get('/user/login', (req, res) => {

      res.render('user/login');
   });

   app.post('/user/login', (req, res, next) => {
      console.log(req.body);
      control.passport.authenticate('local', (err, user) => {
      if (err)  { return next(err); }
            if (!user) { return res.status(401).send({"login": false}); }
            req.logIn(user, function (err) {
               if (err) { return res.status(401).send({"login": false}); }
               control.log(req.route.path, req.user);
               return res.send({"login": true, "user": req.user});
            });

      })(req, res, next);
      
   });

   app.get('/user/recoveryPassword', [controller], (req, res) => {
      let $filter = {
         mail: req.query.mail
      };
      User.findOne($filter, function (err, doc) {
         if (typeof docs !== 'undefined') {
            //control.log(req.route.path, req.user);
            let filter = {
               _id: doc._id
            }
            let password = generator.generate({ length: 8, numbers: true});
            let update = {
               password: sha1(password)
            };
            User.findOneAndUpdate(filter, update, function (err, doc) {
               if (!err) {
                  
                  let html = "";
                     html += "<br>Cedula: "+doc.cedula+"</br>";
                     html += "<br>Correo: "+doc.mail+"</br>";
                     html += "<br>Contraseña: "+password+"</br>";
                     html += "<br>HORA DE ENVIO: "+moment().format("YYYY-MM-DD H:mm:ss")+"</br>";
                  let mailOptions = {
                     from: `${mailConfig.name}<${mailConfig.mail}@gmail.com>`,
                     to: doc.mail,
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
                  let error=global.error(err, 0, req.controller);
                  res.send({msg: 'ERROR', err: error});
               }
            });
            res.send({msg: "OK", client: doc});
         } else {
            let error=global.error(err, 0, req.controller);
            res.send({msg: 'ERROR', err: error});
         }
      });

   });
   
   app.get('/user/logout', (req, res) => {
      control.log(req.route.path, req.user);
      req.logout();
      res.redirect('/');
   });

   app.get('/admin', [control.auth, controller, control.acl], (req, res) => {

      let userSession = false;
      if(req.user){
         userSession = req.user;
      }

      res.render('user/admin', {userSession: userSession});
      
   });

   app.post('/user/filter',[control.auth, controller], (req, res) => {
      let $filter =  global.filter(req.body.filter);
      User.find($filter, function (err, docs) {
         if (typeof docs !== 'undefined') {
            control.log(req.route.path, req.user);
            Role.populate(docs, {path: "role"},function(err, docs){
               Branch.populate(docs, {path: "branch"},function(err, docs){
                  res.send({msg: "OK", users: docs});
               });
            });
         } else {
            let error=global.error(err, 0, req.controller);
            res.send({msg: 'ERROR', err: error});
         }
      });

   });

   app.get('/user/list', [control.auth, controller, control.acl], (req, res) => {
      let $filter =  global.filter(null);
      User.find($filter, function (err, docs) {
         if (typeof docs !== 'undefined') {
            control.log(req.route.path, req.user);
            Role.populate(docs, {path: "role"},function(err, docs){
               Branch.populate(docs, {path: "branch"},function(err, docs){
                  res.send({msg: "OK", users: docs});
               });
            });
         } else {
            let error=global.error(err, 0, req.controller);
            res.send({msg: 'ERROR', err: error});
         }
      });

   });

   app.get('/user/view/:id', [control.auth, controller, control.acl], (req, res) => {

      User.findById(req.params.id, function (err, doc) {
         if (!err) {
            control.log(req.route.path, req.user);
            res.send({msg: "OK", user: doc});
         } else {
            let error=global.error(err, 0, req.controller);
            res.send({msg: 'ERROR', err: error});
         }
      });

   });

   app.post('/user/password/:id', [control.auth, controller], (req, res) => {

      let filter = {
         _id: req.params.id
      }

      let update = {
         password: sha1(req.body.password)
      };

      User.findOneAndUpdate(filter, update, function (err, doc) {
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

   app.post('/user/edit/:id', [control.auth, controller, control.acl], (req, res) => {

      let filter = {
         _id: req.params.id
      }

      let update = {
         name: req.body.name,
         lastName: req.body.lastName,
         mail: req.body.mail,
         phone: req.body.phone,
         dateBirthday: req.body.dateBirthday,
         idRole: req.body.idRole,
         role: req.body.idRole,
         idBranch: req.body.idBranch,
         branch: req.body.idBranch,
         userImg: req.body.userImg,
         dateUpdate: moment(),
         userUpdate: req.user.idUser,
         Enabled: req.body.Enabled
      };

      User.findOneAndUpdate(filter, update, function (err, doc) {
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

   app.post('/user/add', [control.auth, controller, control.acl], (req, res) => {

      let user = new User({
         name: req.body.name,
         lastName: req.body.lastName,
         cedula: req.body.cedula,
         password: sha1(req.body.password),
         mail: req.body.mail,
         phone: req.body.phone,
         dateBirthday: req.body.dateBirthday,
         idRole: req.body.idRole,
         role: req.body.idRole,
         idBranch: req.body.idBranch,
         branch: req.body.idBranch,
         userImg: req.body.userImg,
         dateCreate: moment(),
         userCreate: req.user.idUser,
         dateUpdate: moment(),
         userUpdate: req.user.idUser,
         Enabled: req.body.Enabled
      });

      user.save((err, doc) => {
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

   app.delete('/user/delete/:id', [control.auth, controller, control.acl], (req, res) => {

      let filter = {
         _id: req.params.id
      }

      let update = {
         cedula: moment(),
         mail: moment(),
         dateDelete: moment()
      };

      User.findOneAndUpdate(filter, update, function (err, doc) {
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

      User.findByIdAndRemove(filter, function (err, doc) {
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

   app.post('/user/adduserImg', [control.auth, controller, control.acl], (req, res) => {

      upload(req , res , function(err) {
         if(!err){
            let $userImg = `${req.file.filename}`;
            res.send({msg: "OK", userImg: $userImg, path: pathRender});
         } else {
            let error=global.error(err, 0, req.controller);
            res.send({msg: 'ERROR', err: error});
         }
      });

   });

   app.delete('/user/deleteuserImg/:name', [control.auth, controller, control.acl], (req, res) => {

      let $userImgPath = `${pathUser}/${req.params.name}`;
      fs.unlink($userImgPath, function (err) {
         if(!err){
            res.send({msg: "OK"});
         } else {
            let error=global.error(err, 0, req.controller);
            res.send({msg: 'ERROR', err: error});
         }
      });

   });

}

export default userController
