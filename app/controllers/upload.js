
import moment from 'moment';
import multer from 'multer';

import Client from "../models/client";
import Car from "../models/car";
import JSZip from 'jszip';
import Docxtemplater from 'docxtemplater';
import excelbuilder from 'msexcel-builder';
import fs from 'fs';
import path from 'path';
var XLSX = require('xlsx')

const pathRender = `download`;
const pathDownload = `./public/${pathRender}`;

if (!fs.existsSync(pathDownload)){
    fs.mkdirSync(pathDownload);
}

let storage = multer.diskStorage({
   destination: function(req, file, callback) {
      callback(null, pathDownload);
   },
   filename: function(req, file, callback){
      var basename = file.originalname.split(/[\\/]/).pop(),
      pos = basename.lastIndexOf(".");
      if (basename === "" || pos < 1)
         return "";
      callback(null, file.fieldname + '-' + Date.now() + '.' + basename.slice(pos + 1));
   }
});

let upload = multer({storage: storage}).single("file");

let uploadController = function (app, control={auth, passport, acl}){

   function controller (req, res, next) {
      req.controller = "upload";
      return next();
   }

   function validarCedula (value) {
       
        var numero = value;
        var padre="group_cedula";
        var hijo="error_cedula";
        var mensaje="";
        var suma = 0;      
        var residuo = 0;      
        var pri = false;      
        var pub = false;            
        var nat = false;      
        var numeroProvincias = 22;                  
        var modulo = 11;
         var testBoolean = true;
                    
        /* Verifico que el campo no contenga letras */                  
        var ok=1;
        for (var i=0; i<numero.length && ok==1 ; i++)
        {
           var n = parseInt(numero.charAt(i));
           if (isNaN(n)) ok=0;
        }                 
        if (numero.length <= 9 )
        {              
           mensaje = "El número de cédula consta de 10 números"; 
           //document.getElementById('erroCedula').innerHTML = mensaje;                
           testBoolean = false;
        }
       
        /* Los primeros dos digitos corresponden al codigo de la provincia */
        var provincia = numero.substr(0,2);      
        if (provincia < 1 || provincia > numeroProvincias){           
        mensaje = "Número de cédula no válido.";
        //document.getElementById('erroCedula').innerHTML = mensaje; 
         testBoolean = false;       
        }

        /* Aqui almacenamos los digitos de la cedula en variables. */
        var d1  = numero.substr(0,1);         
        var d2  = numero.substr(1,1);         
        var d3  = numero.substr(2,1);         
        var d4  = numero.substr(3,1);         
        var d5  = numero.substr(4,1);         
        var d6  = numero.substr(5,1);         
        var d7  = numero.substr(6,1);         
        var d8  = numero.substr(7,1);         
        var d9  = numero.substr(8,1);         
        var d10 = numero.substr(9,1);
        var p1,p2,p3,p4,p5,p6,p7,p8,p9;
           
        /* El tercer digito es: */                           
        /* 9 para sociedades privadas y extranjeros   */         
        /* 6 para sociedades publicas */         
        /* menor que 6 (0,1,2,3,4,5) para personas naturales */ 

        if (d3==7 || d3==8){      
        mensaje = "Número de cédula no válido."; 
        //document.getElementById('erroCedula').innerHTML = mensaje;                        
           testBoolean = false;
        }         
           
        /* Solo para personas naturales (modulo 10) */         
        if (d3 < 6){           
           nat = true;            
           p1 = d1 * 2;  if (p1 >= 10) p1 -= 9;
           p2 = d2 * 1;  if (p2 >= 10) p2 -= 9;
           p3 = d3 * 2;  if (p3 >= 10) p3 -= 9;
           p4 = d4 * 1;  if (p4 >= 10) p4 -= 9;
           p5 = d5 * 2;  if (p5 >= 10) p5 -= 9;
           p6 = d6 * 1;  if (p6 >= 10) p6 -= 9; 
           p7 = d7 * 2;  if (p7 >= 10) p7 -= 9;
           p8 = d8 * 1;  if (p8 >= 10) p8 -= 9;
           p9 = d9 * 2;  if (p9 >= 10) p9 -= 9;             
           modulo = 10;
        }         

        /* Solo para sociedades publicas (modulo 11) */                  
        /* Aqui el digito verficador esta en la posicion 9, en las otras 2 en la pos. 10 */
        else if(d3 == 6){           
           pub = true;             
           p1 = d1 * 3;
           p2 = d2 * 2;
           p3 = d3 * 7;
           p4 = d4 * 6;
           p5 = d5 * 5;
           p6 = d6 * 4;
           p7 = d7 * 3;
           p8 = d8 * 2;            
           p9 = 0;            
        }         
           
        /* Solo para entidades privadas (modulo 11) */         
        else if(d3 == 9) {           
           pri = true;                                   
           p1 = d1 * 4;
           p2 = d2 * 3;
           p3 = d3 * 2;
           p4 = d4 * 7;
           p5 = d5 * 6;
           p6 = d6 * 5;
           p7 = d7 * 4;
           p8 = d8 * 3;
           p9 = d9 * 2;            
        }
                  
        suma = p1 + p2 + p3 + p4 + p5 + p6 + p7 + p8 + p9;                
        residuo = suma % modulo;                                         

        /* Si residuo=0, dig.ver.=0, caso contrario 10 - residuo*/
        var digitoVerificador = residuo==0 ? 0: modulo - residuo;                

        /* ahora comparamos el elemento de la posicion 10 con el dig. ver.*/                         
        if (pub==true){           
           if (digitoVerificador != d9)
           {       
             mensaje = "Número de cédula no válido."; 
               //document.getElementById('erroCedula').innerHTML = mensaje;                          
              testBoolean = false;
           }                  
           /* El ruc de las empresas del sector publico terminan con 0001*/         
           if ( numero.substr(9,4) != '0001' ){     
           mensaje = "Número de cédula no válido."; 
             //document.getElementById('erroCedula').innerHTML = mensaje;                
              testBoolean = false;
           }
        }         
        else if(pri == true){         
           if (digitoVerificador != d10){    
              mensaje = "Número de cédula no válido.";
                //document.getElementById('erroCedula').innerHTML = mensaje; 
              testBoolean = false;
           }         
           if ( numero.substr(10,3) != '001' ){  
            mensaje = "Número de cédula no válido.";  
              //document.getElementById('erroCedula').innerHTML = mensaje;                 
              testBoolean = false;
           }
        }      

        else if(nat == true){         
           if (digitoVerificador != d10)
           {  
              mensaje = "Número de cédula no válido.";    
              //document.getElementById('erroCedula').innerHTML = mensaje;                     
              testBoolean = false;
           }         
           if (numero.length >10 && numero.substr(10,3) != '001' ){ 
              mensaje = "Número de cédula no válido.";    
              //document.getElementById('erroCedula').innerHTML = mensaje;                
              
              testBoolean = false;
           }
      }      
      if(testBoolean===true)
      {
          //document.getElementById('erroCedula').innerHTML = "";
        //document.cedulaInit.submit();
      }
      return testBoolean;
   }

   app.post('/upload/client', [control.auth, controller], (req, res) => {

      let $data = req.body.data;

      upload(req , res , async function(err) {
         if(!err){
            let $data = req.body.data;
            var $file = __dirname+'/../../public/download/'+req.file.filename;
            //let $file = `${pathDownload}/${req.file.filename}`;

            var workbook = XLSX.readFile($file);
            var sheet_name_list = workbook.SheetNames;
            var xlsData = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);
            console.log(xlsData);
            var $erroData = [];


            var file = 'clientesFallidos.xlsx';
            var outPutFile = moment().format('YYYY-MM-DD-h:mm:ss') + file;
            var pathDownload = __dirname+'/../../public/download/';
            var workbook = excelbuilder.createWorkbook(pathDownload, outPutFile)
            var sheet1 = workbook.createSheet('sheet1', 15, 1000);

            var cols = [2,3,4,5,6,7,8,9,10,11,12,13,14,15];
            var rowIni = 2;
            sheet1.set(cols[0], rowIni, 'name');
            sheet1.set(cols[1], rowIni, 'lastName');
            sheet1.set(cols[2], rowIni, 'doc');
            sheet1.set(cols[4], rowIni, 'docType');
            sheet1.set(cols[5], rowIni, 'phones');
            sheet1.set(cols[6], rowIni, 'checkPhones');
            sheet1.set(cols[7], rowIni, 'detailPhones');
            sheet1.set(cols[8], rowIni, 'cellPhone');
            sheet1.set(cols[9], rowIni, 'checkCellPhone');
            sheet1.set(cols[10], rowIni, 'mail');
            sheet1.set(cols[11], rowIni, 'checkMail');
            sheet1.set(cols[12], rowIni, 'detailMail');
            sheet1.set(cols[13], rowIni, 'address');

            for (var i=0; i < xlsData.length ; i++) {
               //var client = await Client.save(xlsData[i]);
               let $clientData = xlsData[i];
               //console.log(  );
               let filter = {cedula: $clientData.doc};
               let exist = await Client.findOne(filter);
               console.log("---------------------exist");
               //console.log(exist);
               if(validarCedula($clientData.doc)== true && exist=='null') {
                  let client = new Client($clientData);
                  var clientResult = await client.save();
               }else {
                  $erroData.push($clientData);

                  //let $length = docs.length;
                  //for (var i = 0; i < $length; i++) {
                     rowIni++;
                     sheet1.set(cols[0], rowIni, $clientData.name);
                     sheet1.set(cols[1], rowIni, $clientData.lastName);
                     sheet1.set(cols[2], rowIni, $clientData.doc);
                     sheet1.set(cols[4], rowIni, $clientData.docType);
                     sheet1.set(cols[5], rowIni, $clientData.phones);
                     sheet1.set(cols[6], rowIni, $clientData.checkPhones);
                     sheet1.set(cols[7], rowIni, $clientData.detailPhones);
                     sheet1.set(cols[8], rowIni, $clientData.cellPhone);
                     sheet1.set(cols[9], rowIni, $clientData.checkCellPhone);
                     sheet1.set(cols[10], rowIni, $clientData.mail);
                     sheet1.set(cols[11], rowIni, $clientData.checkMail);
                     sheet1.set(cols[12], rowIni, $clientData.detailMail);
                     sheet1.set(cols[13], rowIni, $clientData.address);
                  //}
               }
               
            }
            console.log($erroData);

            workbook.save(function(err1, resp1){
               if (!err1){
                  console.log('congratulations, your workbook created');
                  res.send({msg: "OK", doc_name: outPutFile});
               }
               else{ 
                  workbook.cancel();
                  res.send({msg: "ERROR", err: err1});
               }
            });

         } else {
            let error=global.error(err, 0, req.controller);
            res.send({msg: 'ERROR', err: error});
         }
         
      });

   });

   app.post('/upload/car', [control.auth, controller], (req, res) => {

      let $data = req.body.data;

      upload(req , res , async function(err) {
         if(!err){
            let $data = req.body.data;
            var $file = __dirname+'/../../public/download/'+req.file.filename;

            var workbook = XLSX.readFile($file);
            var sheet_name_list = workbook.SheetNames;
            var xlsData = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);
            console.log(xlsData);
            var $erroData = [];


            var file = 'autosFallidos.xlsx';
            var outPutFile = moment().format('YYYY-MM-DD-h:mm:ss') + file;
            var pathDownload = __dirname+'/../../public/download/';
            var workbook = excelbuilder.createWorkbook(pathDownload, outPutFile)
            var sheet1 = workbook.createSheet('sheet1', 15, 1000);

            var cols = [2,3,4,5,6,7,8,9,10,11,12,13,14,15];
            var rowIni = 2;
            sheet1.set(cols[0], rowIni, 'doc');
            sheet1.set(cols[1], rowIni, 'idRamo');
            sheet1.set(cols[2], rowIni, 'chasis');
            sheet1.set(cols[4], rowIni, 'motor');
            sheet1.set(cols[5], rowIni, 'placa');
            sheet1.set(cols[6], rowIni, 'carUse');
            sheet1.set(cols[7], rowIni, 'extras');
            sheet1.set(cols[8], rowIni, 'extrasValue');
            sheet1.set(cols[9], rowIni, 'idCarBrand');
            sheet1.set(cols[10], rowIni, 'idCarModel');
            sheet1.set(cols[11], rowIni, 'idCarColor');

            for (var i=0; i < xlsData.length ; i++) {
               //var client = await Client.save(xlsData[i]);
               let $carData = xlsData[i];
               //console.log(  );
               let filter = {doc: $carData.doc};
               console.log(filter);
               let exist = await Client.findOne(filter);
               filter = {"$or": [{'chasis': $carData.chasis}, {'motor': $carData.motor}, {'placa': $carData.placa}]};
               let exist2 = await Car.findOne(filter);
               console.log("---------------------exist");
               console.log(exist);
               console.log("---------------------exist2");
               console.log(typeof(exist2));
               console.log(typeof(null));
               //console.log(exist);
               if(exist!=null && exist2==null) {
                  $carData['idClient'] = exist._id;
                  $carData['client'] = exist._id;
                  let car = new Car($carData);
                  var carResult = await car.save();
                  console.log("YES");
               }else {
                  console.log("NO");
                  $erroData.push($carData);

                  //let $length = docs.length;
                  //for (var i = 0; i < $length; i++) {
                     rowIni++;
                     sheet1.set(cols[0], rowIni, $carData.doc);
                     sheet1.set(cols[1], rowIni, $carData.idRamo);
                     sheet1.set(cols[2], rowIni, $carData.chasis);
                     sheet1.set(cols[4], rowIni, $carData.motor);
                     sheet1.set(cols[5], rowIni, $carData.placa);
                     sheet1.set(cols[6], rowIni, $carData.carUse);
                     sheet1.set(cols[7], rowIni, $carData.extras);
                     sheet1.set(cols[8], rowIni, $carData.extrasValue);
                     sheet1.set(cols[9], rowIni, $carData.idCarBrand);
                     sheet1.set(cols[10], rowIni, $carData.idCarModel);
                     sheet1.set(cols[11], rowIni, $carData.idCarColor);
                  //}
               }
               
            }
            //console.log($erroData);

            workbook.save(function(err1, resp1){
               if (!err1){
                  console.log('congratulations, your workbook created');
                  res.send({msg: "OK", doc_name: outPutFile});
               }
               else{ 
                  workbook.cancel();
                  res.send({msg: "ERROR", err: err1});
               }
            });

         } else {
            let error=global.error(err, 0, req.controller);
            res.send({msg: 'ERROR', err: error});
         }
         
      });

   });

}

export default uploadController
