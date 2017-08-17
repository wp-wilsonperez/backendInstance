
import moment from 'moment';

import Billing from "../models/billing";
import BillingPolicy from "../models/billingPolicy";
import Wallet from "../models/wallet";
import WalletPayment from "../models/walletPayment";

let billingController = function (app, control={auth, passport, acl}){

   function controller (req, res, next) {
      req.controller = "billing";
      return next();
   }

   function findAction (callback){
      Billing.find({}, function (err, docs) {
         if (!err) {
            callback(docs);
         }
      });
   }

   app.get('/billing/list', [control.auth, controller, control.acl], (req, res) => {

      Billing.find({}, function (err, docs) {
         if (typeof docs !== 'undefined') {

            res.send({msg: "OK", billings: docs});
            
         } else {
            res.send({
               msg : 'ERR',
               err : err.code
            });
         }
      });

   });

   app.get('/billing/view/:id', [control.auth, controller, control.acl], (req, res) => {

      Billing.findById(req.params.id, function (err, doc) {
         if (!err) {
            res.send({msg: "OK", billing: doc});
         } else {
            res.send({msg: 'ERR', err: err});
         }
      });

   });

   app.post('/billing/add', [control.auth, controller, control.acl], (req, res) => {
      let $data = req.body.billing;
      let $billinData = $data;
      let $billingPolicy = $data.items;
      let $moment = moment();
      delete($billinData.items);
      $billinData["dateCreate"] = $moment;
      $billinData["userCreate"] = req.user.idUser;
      $billinData["dateUpdate"] = $moment;
      $billinData["userUpdate"] = req.user.idUser;
      let billing = new Billing($billinData);

      billing.save((err, doc) => {
         if(!err){
            $billingPolicy.forEach(function (item, index) {
               $billingPolicy[index]["idBilling"]=doc._id;
               $billingPolicy[index]["billing"]=doc._id;
               $billingPolicy[index]["dateCreate"] = $moment;
               $billingPolicy[index]["userCreate"] = req.user.idUser;
               $billingPolicy[index]["dateUpdate"] = $moment;
               $billingPolicy[index]["userUpdate"] = req.user.idUser;
            })
            BillingPolicy.insertMany($billingPolicy, (err, docs) => {
               if(!err){
                  let wallet = new Wallet({
                     idBilling: doc._id,
                     DetailsBillingData: doc,
                     expirationDate: $billinData.firstPaymentDate,
                     paymentValue: $billinData.valueEqualPayments,
                     detailsWallet: "",
                     dateCreate: $moment,
                     userCreate: req.user.idUser,
                     dateUpdate: $moment,
                     userUpdate: req.user.idUser
                  });
                  wallet.save((err, docWallet) => {
                     let $walletPayment;
                     let $expirationDate = $billinData.firstPaymentDate;
                     let $paymentValue = $billinData.valueEqualPayments;
                     for(let i = 0; i < $billinData.equalPayments; i++){
                        $walletPayment[i]['idWallet'] = docWallet._id;
                        $walletPayment[i]['wallet'] = docWallet._id;
                        $walletPayment[i]['expirationDate'] = $expirationDate;
                        $walletPayment[i]['paymentValue'] = $paymentValue;
                        $walletPayment[i]['dateCreate'] = $moment;
                        $walletPayment[i]['userCreate'] = req.user.idUser;
                        $walletPayment[i]['dateUpdate'] = $moment;
                        $walletPayment[i]['userUpdate'] = req.user.idUser;

                        $expirationDate = moment($expirationDate).add(1, 'month');
                     }
                     WalletPayment.insertMany($walletPayment, (err, docsWalletPayment) => { });
                  });
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

   });

   app.post('/billing/edit/:id', [control.auth, controller, control.acl], (req, res) => {

      let filter = {
         _id: req.params.id
      }

      let update = {
         typeBilling: req.body.typeBilling,
         idClient: req.body.idClient,
         detailClient: req.body.detailClient,
         idBusiness: req.body.idBusiness,
         detailBusiness: req.body.detailBusiness,
         idInsurance: req.body.idInsurance,
         detailInsurance: req.body.detailInsurance,
         idInsuraceCom: req.body.idInsuraceCom,
         nameInsuranceCom: req.body.nameInsuranceCom,
         billingNumber: req.body.billingNumber,
         billingDate: req.body.billingDate,
         firstPaymentDate: req.body.firstPaymentDate,
         paymentType: req.body.paymentType,
         initialPayment: req.body.initialPayment,
         equalPayments: req.body.equalPayments,
         valueEqualPayments: req.body.valueEqualPayments,
         observationsBilling: req.body.observationsBilling,
         totalPrimaValue: req.body.totalPrimaValue,
         totalIVAValue: req.body.totalIVAValue,
         totalBillingValue: req.body.totalBillingValue,
         dateUpdate: moment(),
         userUpdate: req.user.idUser
      };

      Billing.findOneAndUpdate(filter, update, function (err, doc) {
         if (!err) {
            findAction(function(docs){
               res.send({msg: "OK", update: docs});
            });
         } else {
            res.send({msg: 'ERR', err: err});
         }
      });

   });

   app.delete('/billing/delete/:id', [control.auth, controller, control.acl], (req, res) => {

      let filter = {
         _id: req.params.id
      }

      Billing.findByIdAndRemove(filter, function (err, doc) {
         if(!err){
            findAction(function(docs){
               res.send({msg: "OK", update: docs});
            });
         } else {
            res.send({msg: 'ERR', err: err});
         }            
      });

   });

}

export default billingController
