
import moment from 'moment';

import Policy from "../models/policy";
import PolicyAnnex from "../models/policyAnnex";
import ItemAnnex from "../models/itemAnnex";
import SubItemAnnex from "../models/subItemAnnex";

let policyController = function (app, control={auth, passport, acl}){

   function controller (req, res, next) {
      req.controller = "policy";
      return next();
   }

   function findAction (callback){
      Policy.find({}, function (err, docs) {
         if (!err) {
            callback(docs)
         }
      });
   }

   app.get('/policy/filter',[control.auth, controller], (req, res) => {
      let $filter =  global.filter(req.query.filter);
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

   app.get('/policy/list', [control.auth, controller, control.acl], (req, res) => {

      Policy.find({}, function (err, docs) {
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

   app.get('/policy/view/:id', [control.auth, controller, control.acl], (req, res) => {

      Policy.findById(req.params.id, function (err, doc) {
         if (!err) {
            control.log(req.route.path, req.user);
            res.send({msg: "OK", policy: doc});
         } else {
            res.send({msg: 'ERR', err: err});
         }
      });

   });

   app.post('/policy/add', [control.auth, controller, control.acl], (req, res) => {

      if(req.body.policy){
         let $data = req.body.policy;
         let $policy = $data;
         let $policyAnnex = $data.policyAnnex;
         let $moment = moment();
         delete($policy.policyAnnex);
         $policy["dateCreate"] = $moment;
         $policy["userCreate"] = req.user.idUser;
         $policy["dateUpdate"] = $moment;
         $policy["userUpdate"] = req.user.idUser;
         let policy = new Policy($policy);

         policy.save((err, docPolicy) => {
            if(!err){
               let $itemAnnexes = $policyAnnex.itemAnnexes;
               delete($policyAnnexes.itemAnnexes);
               $policyAnnex["idPolicy"] = docPolicy._id;
               $policyAnnex["policy"] = docPolicy._id;
               $policyAnnex["dateCreate"] = $moment;
               $policyAnnex["userCreate"] = req.user.idUser;
               $policyAnnex["dateUpdate"] = $moment;
               $policyAnnex["userUpdate"] = req.user.idUser;
               let policyAnnex = new PolicyAnnex($policyAnnex);

               policyAnnex.save((err, docPolicyAnnex) => {
                  if(!err){
                     for (var i=0 ; i>$itemAnnexes.length; i++) {
                        let $itemAnnex = $itemAnnexes[0];
                        let $subItemAnnexes = $itemAnnex.subItemAnnexes;
                        delete($itemAnnex.subItemAnnexes);
                        $itemAnnex["idPolicyAnnex"] = docPolicyAnnex._id;
                        $itemAnnex["policyAnnex"] = docPolicyAnnex._id;
                        $itemAnnex["dateCreate"] = $moment;
                        $itemAnnex["userCreate"] = req.user.idUser;
                        $itemAnnex["dateUpdate"] = $moment;
                        $itemAnnex["userUpdate"] = req.user.idUser;
                        let itemAnnex = new ItemAnnex($itemAnnex);

                        itemAnnex.save((err, docItemAnnex) => {
                           if(!err){
                              for(let i = 0; i < $subItemAnnexes.length; i++){
                                 $subItemAnnexes["idItemAnnex"] = docItemAnnex._id;
                                 $subItemAnnexes["itemAnnex"] = docItemAnnex._id;
                                 $subItemAnnexes["dateCreate"] = $moment;
                                 $subItemAnnexes["userCreate"] = req.user.idUser;
                                 $subItemAnnexes["dateUpdate"] = $moment;
                                 $subItemAnnexes["userUpdate"] = req.user.idUser;
                              }
                              ItemAnnex.insertMany($subItemAnnexes, (err, docsWalletPayment) => { });
                           } else {
                              res.send({msg: 'ERR', err: err});
                           }
                        });
                     }
                     findAction(function(docs){
                        res.send({msg: "OK", update: docs});
                     });
                  } else {
                     res.send({msg: 'ERR', err: err});
                  }
               });
            } else {
               res.send({msg: 'ERR', err: err});
            }            
         });

      } else {
         let policy = new Policy({
            policyNumber: req.body.policyNumber,
            annexedNumber: req.body.annexedNumber,
            certificateNumber: req.body.certificateNumber,
            idInsurance: req.body.idInsurance,
            insurance: req.body.idInsurance,
            idRamo: req.body.idRamo,
            ramo: req.body.idRamo,
            idUser: req.body.idUser,
            user: req.body.idUser,
            idDeductible: req.body.idDeductible,
            deductible: req.body.idDeductible,
            insured: req.body.insured,
            startDate: req.body.startDate,
            finishDate: req.body.finishDate,
            daysofValidity: req.body.daysofValidity,
            idPolicyType: req.body.idPolicyType,
            policyType: req.body.idPolicyType,
            idFrequencyPayment: req.body.idFrequencyPayment,
            frequencyPayment: req.body.idFrequencyPayment,
            idCity: req.body.idCity,
            city: req.body.idCity,
            dateAdmission: req.body.dateAdmission,
            dateCancellation: req.body.dateCancellation,
            dateCreate: moment(),
            userCreate: req.user.idUser,
            dateUpdate: moment(),
            userUpdate: req.user.idUser
         });

         policy.save((err, doc) => {
            if(!err){
               control.log(req.route.path, req.user);
               res.send({msg: "OK", doc: doc});
            } else {
               res.send({msg: 'ERR', err: err});
            }            
         });

      }
   });

   app.post('/policy/edit/:id', [control.auth, controller, control.acl], (req, res) => {

      let filter = {
         _id: req.params.id
      }

      let update = {
         policyNumber: req.body.policyNumber,
         annexedNumber: req.body.annexedNumber,
         certificateNumber: req.body.certificateNumber,
         idInsurance: req.body.idInsurance,
         insurance: req.body.idInsurance,
         idRamo: req.body.idRamo,
         ramo: req.body.idRamo,
         idUser: req.body.idUser,
         user: req.body.idUser,
         idDeductible: req.body.idDeductible,
         deductible: req.body.idDeductible,
         insured: req.body.insured,
         startDate: req.body.startDate,
         finishDate: req.body.finishDate,
         daysofValidity: req.body.daysofValidity,
         idPolicyType: req.body.idPolicyType,
         policyType: req.body.idPolicyType,
         idFrequencyPayment: req.body.idFrequencyPayment,
         frequencyPayment: req.body.idFrequencyPayment,
         idCity: req.body.idCity,
         city: req.body.idCity,
         dateAdmission: req.body.dateAdmission,
         dateCancellation: req.body.dateCancellation,
         dateUpdate: moment(),
         userUpdate: req.user.idUser
      };

      Policy.findOneAndUpdate(filter, update, function (err, doc) {
         if (!err) {
            findAction(function(docs){
               control.log(req.route.path, req.user);
               res.send({msg: "OK", update: docs});
            });
         } else {
            res.send({msg: 'ERR', err: err});
         }
      });

   });

   app.delete('/policy/delete/:id', [control.auth, controller, control.acl], (req, res) => {

      let filter = {
         _id: req.params.id
      }

      Policy.findByIdAndRemove(filter, function (err, doc) {
         if(!err){
            findAction(function(docs){
               control.log(req.route.path, req.user);
               res.send({msg: "OK", update: docs});
            });
         } else {
            res.send({msg: 'ERR', err: err});
         }            
      });

   });

}

export default policyController
