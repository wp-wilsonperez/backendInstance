
import moment from 'moment';
import multer from 'multer';
import fs from 'fs';
import PolicyAnnex from "../models/policyAnnex";

import Policy from "../models/policy";

const pathRender = `uploads/policyAnnex`;
const pathPolicyAnnex = `./public/${pathRender}`;

if (!fs.existsSync(pathPolicyAnnex)){
    fs.mkdirSync(pathPolicyAnnex);
}

let storage = multer.diskStorage({
   destination: function(req, file, callback) {
      callback(null, pathPolicyAnnex);
   },
   filename: function(req, file, callback){
      var basename = file.originalname.split(/[\\/]/).pop(),
      pos = basename.lastIndexOf(".");
      if (basename === "" || pos < 1)
         return "";
      callback(null, file.fieldname + '-' + Date.now() + '.' + basename.slice(pos + 1));
   }
});

let upload = multer({storage: storage}).single("policyAnnexImg");

let policyAnnexController = function (app, control={auth, passport, acl}){

   function controller (req, res, next) {
      req.controller = "policyAnnex";
      return next();
   }

   function findAction (callback){
      let $filter =  global.filter(null);
      PolicyAnnex.find($filter, function (err, docs) {
         if (!err) {
            
            Policy.populate(docs, {path: "policy"},function(err, docs){
               callback(docs);
            });
         }
      });
   }

   app.post('/policyAnnex/filter',[control.auth, controller], (req, res) => {
      let $filter =  global.filter(req.body.filter);
      PolicyAnnex.find($filter, function (err, docs) {
         if (typeof docs !== 'undefined') {
            control.log(req.route.path, req.user);

            Policy.populate(docs, {path: "policy"},function(err, docs){
               res.send({msg: "OK", policyAnnexes: docs});
            });
            
         } else {
            let error=global.error(err, 0, req.controller);
            res.send({msg: 'ERROR', err: error});
         }
      });

   });

   app.get('/policyAnnex/list', [control.auth, controller, control.acl], (req, res) => {
      let $filter =  global.filter(null);
      PolicyAnnex.find($filter, function (err, docs) {
         if (typeof docs !== 'undefined') {
            control.log(req.route.path, req.user);

            Policy.populate(docs, {path: "policy"},function(err, docs){
               res.send({msg: "OK", policyAnnexes: docs});
            });
            
         } else {
            let error=global.error(err, 0, req.controller);
            res.send({msg: 'ERROR', err: error});
         }
      });

   });

    app.get('/policyAnnex/param/:idPolicy', [control.auth, controller, control.acl], (req, res) => {

      PolicyAnnex.find({idPolicy: req.params.idPolicy}, function (err, doc) {
         if (!err) {
            //control.log(req.route.path, req.user);
            res.send({msg: "OK", policyAnnex: doc});
         } else {
            let error=global.error(err, 0, req.controller);
            res.send({msg: 'ERROR', err: error});
         }
      });

   });


   app.get('/policyAnnex/view/:id', [control.auth, controller, control.acl], (req, res) => {

      PolicyAnnex.findById(req.params.id, function (err, doc) {
         if (!err) {
            control.log(req.route.path, req.user);
            res.send({msg: "OK", policyAnnex: doc});
         } else {
            let error=global.error(err, 0, req.controller);
            res.send({msg: 'ERROR', err: error});
         }
      });

   });


   app.post('/policyAnnex/add', [control.auth, controller, control.acl], (req, res) => {

      let policyAnnex = new PolicyAnnex({
         idPolicy: req.body.idPolicy,
         policy: req.body.idPolicy,
         annexNumber: req.body.annexNumber,
         certificateNumber: req.body.certificateNumber,
         totalPrima: req.body.totalPrima,
         detailsAnnex: req.body.detailsAnnex,
         superBank: req.body.superBank,
         iva: req.body.iva,
         segCamp: req.body.segCamp,
         valueIssue: req.body.valueIssue,
         totalValue: req.body.totalValue,
         others: req.body.others,
         hasBilling: req.body.hasBilling,
         isBilling: false,
         dateCreate: moment(),
         userCreate: req.user.idUser,
         dateUpdate: moment(),
         userUpdate: req.user.idUser
      });
      console.log(req.body);

      policyAnnex.save((err, doc) => {
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

   app.post('/policyAnnex/edit/:id', [control.auth, controller, control.acl], (req, res) => {

      let filter = {
         _id: req.params.id
      }

      let update = {
         idPolicy: req.body.idPolicy,
         policy: req.body.idPolicy,
         annexNumber: req.body.annexNumber,
         certificateNumber: req.body.certificateNumber,
         totalPrima: req.body.totalPrima,
         detailsAnnex: req.body.detailsAnnex,
         superBank: req.body.superBank,
         iva: req.body.iva,
         segCamp: req.body.segCamp,
         valueIssue: req.body.valueIssue,
         totalValue: req.body.totalValue,
         others: req.body.others,
         hasBilling: req.body.hasBilling,
         dateUpdate: moment(),
         userUpdate: req.user.idUser
      };

      PolicyAnnex.findOneAndUpdate(filter, update, function (err, doc) {
         if (!err) {
            findAction(function(docs){
               control.log(req.route.path, req.user);
               res.send({msg: "OK", update: doc});
            });
         } else {
            let error=global.error(err, 0, req.controller);
            res.send({msg: 'ERROR', err: error});
         }
      });

   });

   app.post('/policyAnnex/editItems/:id', [control.auth, controller], (req, res) => {

      let filter = {
         _id: req.params.id
      }

      let update = {
         itemAnnex: req.body.itemAnnex,
         dateUpdate: moment(),
         userUpdate: req.user.idUser
      };

      let totalValue=0, totalPrima=0, $length=update.itemAnnex.items.length;

      for (var i = 0; i < $length; i++) {
         totalValue+=parseFloat(update.itemAnnex.items[i].totalValueItem);
         totalPrima+=parseFloat(update.itemAnnex.items[i].totalValuePrimaItem);
      }
      update['totalValue']=totalValue;
      update['totalPrima']=totalPrima;

      console.log(req.body.itemAnnex);

      PolicyAnnex.findOneAndUpdate(filter, update, function (err, doc) {
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

   app.delete('/policyAnnex/delete/:id', [control.auth, controller, control.acl], (req, res) => {

      let filter = {
         _id: req.params.id
      }

      let update = {
         dateDelete: moment()
      };

      PolicyAnnex.findOneAndUpdate(filter, update, function (err, doc) {
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

      PolicyAnnex.findByIdAndRemove(filter, function (err, doc) {
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

   app.post('/policyAnnex/addpolicyAnnexImg', [control.auth, controller, control.acl], (req, res) => {

      upload(req , res , function(err) {
         if(!err){
            let $policyAnnexImg = `${req.file.filename}`;
            res.send({msg: "OK", policyAnnexImg: $policyAnnexImg, path: pathRender});
         } else {
            let error=global.error(err, 0, req.controller);
            res.send({msg: 'ERROR', err: error});
         }
      });

   });

   app.delete('/policyAnnex/deletepolicyAnnexImg/:name', [control.auth, controller, control.acl], (req, res) => {

      let $policyAnnexImgPath = `${pathPolicyAnnex}/${req.params.name}`;
      fs.unlink($policyAnnexImgPath, function (err) {
         if(!err){
            res.send({msg: "OK"});
         } else {
            let error=global.error(err, 0, req.controller);
            res.send({msg: 'ERROR', err: error});
         }
      });

   });

}

export default policyAnnexController
