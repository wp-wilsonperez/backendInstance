
import moment from 'moment';

import WalletPayment from "../models/walletPayment";

import Wallet from "../models/wallet";

var PDFDocument = require('pdfkit')
var fs = require('fs')
//import Bank from "../models/bank";

let walletPaymentController = function (app, control={auth, passport, acl}){

   function controller (req, res, next) {
      req.controller = "walletPayment";
      return next();
   }

   function findAction (callback){
      let $filter =  global.filter(null);
      WalletPayment.find($filter, function (err, docs) {
         if (!err) {
            
            Wallet.populate(docs, {path: "wallet"},function(err, docs){
               callback(docs);
            });
         }
      });
   }

   app.post('/walletPayment/filter',[control.auth, controller], (req, res) => {
      let $filter =  global.filter(req.body.filter);
      WalletPayment.find($filter, function (err, docs) {
         if (typeof docs !== 'undefined') {
            control.log(req.route.path, req.user);

            Wallet.populate(docs, {path: "wallet"},function(err, docs){
               res.send({msg: "OK", walletPayments: docs});
            });
            
         } else {
            let error=global.error(err, 0, req.controller);
            res.send({msg: 'ERROR', err: error});
         }
      });

   });

   app.get('/walletPayment/list', [control.auth, controller, control.acl], (req, res) => {
      let $filter =  global.filter(null);
      WalletPayment.find($filter, function (err, docs) {
         if (typeof docs !== 'undefined') {
            control.log(req.route.path, req.user);

            Wallet.populate(docs, {path: "wallet"},function(err, docs){
               res.send({msg: "OK", walletPayments: docs});
            });
            
         } else {
            let error=global.error(err, 0, req.controller);
            res.send({msg: 'ERROR', err: error});
         }
      });

   });

   app.get('/walletPayment/view/:id', [control.auth, controller, control.acl], (req, res) => {

      WalletPayment.findById(req.params.id, function (err, doc) {
         if (!err) {
            control.log(req.route.path, req.user);
            res.send({msg: "OK", walletPayment: doc});
         } else {
            let error=global.error(err, 0, req.controller);
            res.send({msg: 'ERROR', err: error});
         }
      });

   });

   app.post('/walletPayment/add', [control.auth, controller, control.acl], (req, res) => {

      let walletPaymentData = {
         idWallet: req.body.idWallet,
         wallet: req.body.idWallet,
         ctaCteNumber: req.body.ctaCteNumber,
         expirationDate: req.body.expirationDate,
         paymentValue: req.body.paymentValue,
         arrayWalletPayment: [],
         paymentFlag: false,
         dateCreate: moment(),
         userCreate: req.user.idUser,
         dateUpdate: moment(),
         userUpdate: req.user.idUser
      };
      if(req.body.percentagePrima){
         walletPaymentData["percentagePrima"] = req.body.percentagePrima;
      }
      if(req.body.percentageIVA){
         walletPaymentData["percentageIVA"] = req.body.percentageIVA;
      }

      let walletPayment = new WalletPayment(walletPaymentData);

      walletPayment.save((err, doc) => {
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

   app.post('/walletPayment/edit/:id', [control.auth, controller, control.acl], (req, res) => {

      let filter = {
         _id: req.params.id
      }

      let update = {
         idWallet: req.body.idWallet,
         wallet: req.body.idWallet,
         ctaCteNumber: req.body.ctaCteNumber,
         expirationDate: req.body.expirationDate,
         paymentValue: req.body.paymentValue,
         arrayWalletPayment: req.body.arrayWalletPayment,
         paymentFlag: true,
         dateUpdate: moment(),
         userUpdate: req.user.idUser
      };
      if(req.body.percentagePrima){
         update["percentagePrima"] = req.body.percentagePrima;
      }
      if(req.body.percentageIVA){
         update["percentageIVA"] = req.body.percentageIVA;
      }

      WalletPayment.findOneAndUpdate(filter, update, function (err, doc) {
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

   app.delete('/walletPayment/delete/:id', [control.auth, controller, control.acl], (req, res) => {

      let filter = {
         _id: req.params.id
      }

      let update = {
         dateDelete: moment()
      };

      WalletPayment.findOneAndUpdate(filter, update, function (err, doc) {
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

      WalletPayment.findByIdAndRemove(filter, function (err, doc) {
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

   app.get('/walletPayment/print',[control.auth, controller], (req, res) => {
      let $filter =  global.filter(req.query.filter);
      WalletPayment.find($filter, function (err, docs) {
         if (typeof docs !== 'undefined') {
            control.log(req.route.path, req.user);

            Wallet.populate(docs, {path: "wallet"},function(err, docs){
                  res.send({msg: "OK", walletPayments: docs});
            });
            
         } else {
            let error=global.error(err, 0, req.controller);
            res.send({msg: 'ERROR', err: error});
         }
      });

   });

   app.get('/walletPayment/bill/:id',[control.auth, controller], async (req, res) => {
      //let $filter =  global.filter(req.query.filter);
      /*WalletPayment.find($filter, function (err, docs) {
         if (typeof docs !== 'undefined') {
            control.log(req.route.path, req.user);

            Wallet.populate(docs, {path: "wallet"},function(err, docs){
                  res.send({msg: "OK", walletPayments: docs});
            });
            
         } else {
            let error=global.error(err, 0, req.controller);
            res.send({msg: 'ERROR', err: error});
         }
      });*/
      
      var optionsPDF = {
         size: 'A5',
         layout: 'landscape',
         margins : { // by default, all are 72
            top: 0, 
            bottom: 0,
            left: 0,
            right: 0
         }
      }
      var doc = new PDFDocument(optionsPDF);
      var pathCake = __dirname+'/../../public/download/';
      var outFile = moment().format('YYYY-MM-DD-h:mm:ss') + 'Recibo_de_Caja.pdf';
      var outPutFile = pathCake+outFile;
      doc.pipe(fs.createWriteStream(outPutFile))

      var $y=[1, 33, 50, 65, 80, 95, 108, 115, 128, 135, 148, 155]
      doc.font('Times-Roman')
         .fontSize(12)
         .text('Recibo No.', 10, $y[1])
         .fontSize(12)
         .text('RECIBO DE CAJA', 250, $y[1])
         .fontSize(11)
         .text('001', 420, $y[1])
         .fontSize(10)
         .text('Pagina:   1 / 1', 500, $y[1])

      doc.fontSize(9)

      doc.text('Fecha Emisión:', 10, $y[2], {width: 90, align: 'left'})
         .text('Cuenca, 07 de marzo 2017', 100, $y[2], {width: 250, align: 'left'})
         .text('Fecha Cobro:', 350, $y[2], {width: 80, align: 'left'})
         .text('07-MAR-2017 00:00', 420, $y[2], {align: 'left'})

      doc.text('Cliente:', 10, $y[3], {width: 90, align: 'left'})
         .text('PEREZ SUCUZHAÑAY WILSON FABIAN', 100, $y[3], {width: 250, align: 'left'})
         .text('Código Cliente:', 350, $y[3], {width: 80, align: 'left'})
         .text('00009254', 420, $y[3], {align: 'left'})

      doc.text('Dirección:', 10, $y[4], {width: 90, align: 'left'})
         .text('PEDRO BOUGER SN Y DEL RETORNO', 100, $y[4], {width: 250, align: 'left'})
         .text('Teléfono:', 350, $y[4], {width: 80, align: 'left'})
         .text('0998932898', 420, $y[4], {width: 80, align: 'left'})
         .text('RREMISION.rdt', 500, $y[4], {align: 'left'})

      doc.text('Por concepto de:', 10, $y[5], {width: 90, align: 'left'})
         .text('Recaudación de Pólizas', 100, $y[5], {width: 250, align: 'left'})

      doc.lineWidth(0.5).moveTo(10, $y[6]).lineTo(580, $y[6]).stroke()

      doc.text('Ven.', 10, $y[7], {width: 50, align: 'center'})
         .text('Póliza', 60, $y[7], {width: 50, align: 'center'})
         .text('Doc. No', 110, $y[7], {width: 50, align: 'center'})
         .text('Valor', 160, $y[7], {width: 50, align: 'right'})
         .text('Banco', 210, $y[7], {width: 50, align: 'center'})
         .text('Cta Cte Nro', 260, $y[7], {width: 50, align: 'center'})
         .text('N.Debito CF', 310, $y[7], {width: 50, align: 'center'})
         .text('Fec. Venc.', 360, $y[7], {width: 50, align: 'center'})
         .text('Por Concepto de', 410, $y[7], {width: 100, align: 'center'})
         .text('Valor', 510, $y[7], {width: 50, align: 'right'})

      doc.lineWidth(0.5).moveTo(10, $y[8]).lineTo(580, $y[8]).stroke()

      doc.text('2/7.', 10, $y[9], {width: 30, align: 'center'})
         .text('VH-392500-0000', 40, $y[9], {width: 70, align: 'center'})
         .text('FP0031065', 110, $y[9], {width: 50, align: 'center'})
         .text('287.48', 160, $y[9], {width: 50, align: 'right'})
         .text('', 210, $y[9], {width: 200, align: 'center'})
         .text('FACT: ', 410, $y[9], {width: 40, align: 'left'})
         .text('91196', 450, $y[9], {width: 50, align: 'left'})

      doc.lineWidth(0.5).moveTo(10, $y[10]).lineTo(580, $y[10]).stroke()

      doc.text('1', 10, $y[11], {width: 50, align: 'center'})
         .text('TARJETA DE CRE 256', 60, $y[11], {width: 300, align: 'left'})
         .text('2017-03-07', 360, $y[11], {width: 50, align: 'center'})
         .text('Recaudación de Pólizas', 410, $y[11], {width: 100, align: 'center'})
         .text('287.48', 510, $y[11], {width: 50, align: 'right'})

      /*doc.fontSize(12)
         .text('T', 580, 400)*/

      doc.rect(15, 300, 565, 100).stroke()
      doc.lineWidth(0.5).moveTo(455, 300).lineTo(455, 400).stroke()
      doc.lineWidth(0.5).moveTo(335, 300).lineTo(335, 400).stroke()
      doc.lineWidth(0.5).moveTo(215, 300).lineTo(215, 400).stroke()
      doc.lineWidth(0.5).moveTo(215, 325).lineTo(580, 325).stroke()


      doc.text('SUMAN:', 20, 310, {width: 140, align: 'left'})
         .text('287.48', 160, 310, {width: 40, align: 'right'})
         .text('RECIBI CONFORME', 215, 310, {width: 120, align: 'center'})
         .text('REVISADO', 335, 310, {width: 120, align: 'center'})
         .text('IMPRESO POR', 455, 310, {width: 120, align: 'center'})

   //DATA PUT IN POSITION Y
      doc.text('RETENCION', 20, 325, {width: 140, align: 'left'})
      doc.text('COMISION', 20, 340, {width: 140, align: 'left'})
      doc.text('TOTAL:', 20, 385, {width: 140, align: 'left'})
         .text('287.48', 160, 385, {width: 40, align: 'right'})

      doc.text('VAZSEGUROS S.A.', 215, 335, {width: 120, align: 'center'})

      doc.text('ING. XIMENA SARMIENTO', 335, 335, {width: 120, align: 'center'})
      doc.text('Departamente de', 335, 350, {width: 120, align: 'center'})
      doc.text('Producción', 335, 365, {width: 120, align: 'center'})

      doc.text('XPSO-XPSO', 455, 335, {width: 120, align: 'center'})
         
      /*doc.addPage()
         .fontSize(25)
         .text('Here is some vector graphics...', 100, 100)

      doc.addPage()
         .fillColor("blue")
         .text('Here is a link!', 100, 100)
         .underline(100, 100, 160, 27, {color: "#0000FF"})
         .link(100, 100, 160, 27, 'http://google.com/')*/
      
      doc.end()

      res.send({msg: 'OK', doc_name: outFile});

   });

}

export default walletPaymentController
