
import sha1 from 'sha1';
import moment from 'moment';
import multer from 'multer';
import fs from 'fs';
import acl from "../configs/acl";

import User from "../models/user";

const pathRender = `uploads/user`;
const pathUser = `./public/${pathRender}`;

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
      User.find({}, function (err, docs) {
         if (!err) {
            callback(docs)
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
               return res.send({"login": true, "user": user});
            });

      })(req, res, next);
      
   });
   
   app.get('/user/logout', (req, res) => {
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

   app.get('/user/list', [control.auth, controller, control.acl], (req, res) => {
      console.log(req.user);
      User.find({}, function (err, docs) {
         if (typeof docs !== 'undefined') {
            res.send({msg: "OK", users: docs});
         } else {
            res.send({
               msg : 'ERR',
               err : err.code
            });
         }
      });

   });

   app.get('/user/view/:id', [control.auth, controller, control.acl], (req, res) => {

      User.findById(req.params.id, function (err, doc) {
         if (!err) {
            res.send({msg: "OK", user: doc});
         } else {
            res.send({msg: 'ERR', err: err});
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
         cedula: req.body.cedula,
         mail: req.body.mail,
         phone: req.body.phone,
         dateBirthday: req.body.dateBirthday,
         idRol: req.body.idRol,
         userImg: req.body.userImg,
         dateUpdate: moment(),
         userUpdate: req.user.idUser,
         Enabled: req.body.Enabled
      };

      User.findOneAndUpdate(filter, update, function (err, doc) {
         if (!err) {
            findAction(function(docs){
               res.send({msg: "OK", update: docs});
            });
         } else {
            res.send({msg: 'ERR', err: err});
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
         idRol: req.body.idRol,
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
               res.send({msg: "OK", update: docs});
            });
         } else {
            res.send({msg: 'ERR', err: err});
         }            
      });

   });

   app.delete('/user/delete/:id', [control.auth, controller, control.acl], (req, res) => {

      let filter = {
         _id: req.params.id
      }

      User.findByIdAndRemove(filter, function (err, doc) {
         if(!err){
            findAction(function(docs){
               res.send({msg: "OK", update: docs});
            });
         } else {
            res.send({msg: 'ERR', err: err});
         }            
      });

   });

   app.post('/user/adduserImg', [control.auth, controller, control.acl], (req, res) => {

      upload(req , res , function(err) {
         if(!err){
            let $userImg = `${req.file.filename}`;
            res.send({msg: "OK", userImg: $userImg, path: pathRender});
         } else {
            res.send({msg: 'ERR', err: err});
         }
      });

   });

   app.delete('/user/deleteuserImg/:name', [control.auth, controller, control.acl], (req, res) => {

      let $userImgPath = `${pathUser}/${req.params.name}`;
      fs.unlink($userImgPath, function (err) {
         if(!err){
            res.send({msg: "OK"});
         } else {
            res.send({msg: 'ERR', err: err});
         }
      });

   });

}

export default userController
