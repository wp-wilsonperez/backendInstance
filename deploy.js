
import mongoose from 'mongoose';

import Role from './app/models/role';
import City from './app/models/city';
import Branch from './app/models/branch';
import User from './app/models/user';
import Account from './app/models/account';
import Setting from './app/models/setting';
import MaritalStatus from './app/models/maritalStatus';
import TypeClient from './app/models/typeClient';
import Ramo from './app/models/ramo';
import Plan from './app/models/plan';
import Alternative from './app/models/alternative';
import FrequencyPayment from './app/models/frequencyPayment';

import Config from './app/configs/app';

mongoose.connect(Config.mongoose);
const $total=12;
let $execute=0;
function answer (text, cant) {
   console.log("*Insert data in "+text);
   console.log("--Total Docs in "+text+": "+cant);
   $execute++;
   console.log("--Total Models: "+$total+", Models Executes: "+$execute);

   if($total == $execute){
      console.log("ALL INSERTS SUCCESS press CTRL + C to end the execution");
   }
}
/********ROLE********/
let $roleData = [
   { "_id" : "599222be7f05fc0933b643f3", "name" : "Super Administrador", "description" : "Super Administrador del sistema", "dateCreate" : "2017-01-01 00:00:00", "userCreate" : "0", "dateUpdate" : "2017-01-01 00:00:00", "userUpdate" : "0", "grant" : "{\"user\":{\"list\":true,\"add\":true,\"edit\":true,\"delete\":true},\"branch\":{\"list\":true,\"add\":true,\"edit\":true,\"delete\":true},\"role\":{\"list\":true,\"add\":true,\"edit\":true,\"delete\":true,\"addgrant\":true,\"viewgrant\":true},\"license\":{},\"city\":{\"list\":true,\"add\":true,\"edit\":true,\"delete\":true},\"account\":{\"view\":true,\"add\":true,\"edit\":true,\"delete\":true},\"setting\":{\"view\":true,\"add\":true,\"edit\":true,\"delete\":true},\"log\":{\"list\":true},\"insurance\":{\"list\":true,\"view\":true,\"add\":true,\"edit\":true,\"delete\":true,\"enable\":true},\"business\":{\"list\":true,\"view\":true,\"add\":true,\"edit\":true,\"delete\":true},\"ramo\":{\"list\":true,\"add\":true,\"edit\":true,\"delete\":true,\"enable\":true},\"percentageRamo\":{\"list\":true,\"add\":true,\"edit\":true,\"delete\":true,\"enable\":true},\"deductible\":{\"list\":true,\"add\":true,\"edit\":true,\"delete\":true,\"enable\":true},\"helpLink\":{\"list\":true,\"add\":true,\"edit\":true,\"delete\":true,\"enable\":true},\"bank\":{\"list\":true,\"add\":true,\"edit\":true,\"delete\":true,\"enable\":true},\"tasa\":{\"list\":true,\"add\":true,\"edit\":true,\"delete\":true,\"enable\":true},\"letterAccident\":{\"list\":true,\"add\":true,\"edit\":true,\"delete\":true,\"enable\":true},\"paymentType\":{\"list\":true,\"add\":true,\"edit\":true,\"delete\":true,\"enable\":true},\"quote\":{\"list\":true,\"add\":true,\"edit\":true,\"delete\":true,\"enable\":true},\"issue\":{\"list\":true,\"add\":true,\"edit\":true,\"delete\":true,\"enable\":true},\"client\":{\"list\":true,\"view\":true,\"add\":true,\"edit\":true,\"delete\":true,\"enable\":true},\"maritalStatus\":{\"list\":true,\"add\":true,\"edit\":true,\"delete\":true},\"typeClient\":{\"list\":true,\"add\":true,\"edit\":true,\"delete\":true,\"enable\":true},\"car\":{\"list\":true,\"add\":true,\"edit\":true,\"delete\":true,\"enable\":true},\"carBrand\":{\"list\":true,\"add\":true,\"edit\":true,\"delete\":true,\"enable\":true},\"carModel\":{\"list\":true,\"add\":true,\"edit\":true,\"delete\":true,\"enable\":true},\"carColor\":{\"list\":true,\"add\":true,\"edit\":true,\"delete\":true,\"enable\":true},\"carType\":{\"list\":true,\"add\":true,\"edit\":true,\"delete\":true,\"enable\":true},\"policy\":{\"list\":true,\"add\":true,\"edit\":true,\"delete\":true,\"enable\":true,\"ramoPercentageValue\":true},\"policyType\":{\"list\":true,\"add\":true,\"edit\":true,\"delete\":true,\"enable\":true},\"income\":{\"list\":true,\"add\":true,\"edit\":true,\"delete\":true,\"enable\":true},\"route\":{\"list\":true,\"add\":true,\"edit\":true,\"delete\":true,\"enable\":true},\"frequencyPayment\":{\"list\":true,\"add\":true,\"edit\":true,\"delete\":true,\"enable\":true},\"bankInsurance\":{\"list\":true,\"add\":true,\"edit\":true,\"delete\":true,\"enable\":true},\"policyAnnex\":{\"list\":true,\"view\":true,\"param\":true,\"add\":true,\"edit\":true,\"delete\":true,\"enable\":true},\"itemAnnexCar\":{\"list\":true,\"param\":true,\"add\":true,\"edit\":true,\"delete\":true,\"enable\":true},\"itemAnnexExtra\":{\"list\":true,\"param\":true,\"add\":true,\"edit\":true,\"delete\":true,\"enable\":true},\"billing\":{\"list\":true,\"add\":true,\"edit\":true,\"delete\":true,\"enable\":true,\"ramoPercentageValue\":true}}"}
];
Role.insertMany($roleData, (err, docs) => {
   answer("role", $roleData.length);
});
/********CITY********/
let $cityData = [
   { "_id" : "599222be7f05fc0933b643f3", "name" : "Cuenca","dateCreate" : "2017-01-01 00:00:00", "userCreate" : "0", "dateUpdate" : "2017-01-01 00:00:00", "userUpdate" : "0"}
];
City.insertMany($cityData, (err, docs) => {
   answer("city", $cityData.length);
});
/********BRANCH********/
let $branchData = [
   { "_id" : "599222be7f05fc0933b643f3", "name" : "Matriz", "address" : "Calle del Retorno", "idCity" : "599222be7f05fc0933b643f3", "phone" : "074112389", "movil" : "0998932898", "dateCreate" : "2017-01-01 00:00:00", "userCreate" : "0", "dateUpdate" : "2017-01-01 00:00:00", "userUpdate" : "0"}
];
Branch.insertMany($branchData, (err, docs) => {
   answer("branch", $branchData.length);
});
/********USER********/
let $userData = [
   { "_id" : "599222be7f05fc0933b643f3", "name" : "Cinta", "lastName" : "Negra", "cedula" : "2222222222", "password" : "571c34f62e9ea7fba7e619d8b417aebc4d60ef4e", "mail" : "info@cintanegra.net", "phone" : "0998932898", "dateBirthday" : "1990-01-01", "idRole" : "599222be7f05fc0933b643f3", "role" : "599222be7f05fc0933b643f3", "idBranch" : "599222be7f05fc0933b643f3", "branch" : "599222be7f05fc0933b643f3", "dateCreate" : "2017-01-01 00:00:00", "userCreate" : "599222be7f05fc0933b643f3", "dateUpdate" : "2017-01-01 00:00:00", "userUpdate" : "599222be7f05fc0933b643f3", "userImg" : "defaultUser.jpg", "Enabled" : 1}
];
User.insertMany($userData, (err, docs) => {
   answer("user", $userData.length);
});
/********ACCOUNT********/
let $accountData = [
   {"_id" : "599222be7f05fc0933b643f3", "name": "Aseguradores", "logo": "defaultAccount.jpg", "img1": "defaultAccount.jpg", "img2": "defaultAccount.jpg", "img3": "defaultAccount.jpg", "parking": false, "description":"Ingrese los datos de su empresa", "dateCreate" : "2017-01-01 00:00:00", "userCreate" : "0", "dateUpdate" : "2017-01-01 00:00:00", "userUpdate" : "0"}
];
Account.insertMany($accountData, (err, docs) => {
   answer("account", $accountData.length);
});
/********SETTING********/
let $settingData = [
   {"_id" : "599222be7f05fc0933b643f3", "iva": 12, "connectionTime": 30, "maxAttached": 1, "idSchedule": "", "idMacs": [], "dateCreate" : "2017-01-01 00:00:00", "userCreate" : "0", "dateUpdate" : "2017-01-01 00:00:00", "userUpdate" : "0"}
];
Setting.insertMany($settingData, (err, docs) => {
   answer("setting", $settingData.length);
});
/********MARITALSTATUS********/
let $maritalStatusData = [
   { "_id" : "599222be7f05fc0933b643f3", "name" : "Soltero", "dateCreate" : "2017-01-01 00:00:00", "userCreate" : "0", "dateUpdate" : "2017-01-01 00:00:00", "userUpdate" : "0"},
   { "_id" : "599222ce7f05fc0933b643f4", "name" : "Casado", "dateCreate" : "2017-01-01 00:00:00", "userCreate" : "0", "dateUpdate" : "2017-01-01 00:00:00", "userUpdate" : "0"},
   { "_id" : "599222d07f05fc0933b643f5", "name" : "Divorciado", "dateCreate" : "2017-01-01 00:00:00", "userCreate" : "0", "dateUpdate" : "2017-01-01 00:00:00", "userUpdate" : "0"},
   { "_id" : "599222d77f05fc0933b643f6", "name" : "Unión Libre", "dateCreate" : "2017-01-01 00:00:00", "userCreate" : "0", "dateUpdate" : "2017-01-01 00:00:00", "userUpdate" : "0"},
   { "_id" : "599222fe7f05fc0933b643f7", "name" : "Unión de Hecho", "dateCreate" : "2017-01-01 00:00:00", "userCreate" : "0", "dateUpdate" : "2017-01-01 00:00:00", "userUpdate" : "0"}
];
MaritalStatus.insertMany($maritalStatusData, (err, docs) => {
   answer("maritalStatus", $maritalStatusData.length);
});
/********TYPECLIENT********/
let $typeClientData = [
   { "_id" : "599222be7f05fc0933b643f3", "name" : "Cotización", "dateCreate" : "2017-01-01 00:00:00", "userCreate" : "0", "dateUpdate" : "2017-01-01 00:00:00", "userUpdate" : "0"},
   { "_id" : "599222ce7f05fc0933b643f4", "name" : "Cliente", "dateCreate" : "2017-01-01 00:00:00", "userCreate" : "0", "dateUpdate" : "2017-01-01 00:00:00", "userUpdate" : "0"}
];
TypeClient.insertMany($typeClientData, (err, docs) => {
   answer("typeClient", $typeClientData.length);
});
/********RAMO********/
let $ramoData = [
   { "_id" : "599222be7f05fc0933b643f3", "name" : "Vehículos", "codRamo": 7, "description" : "Ramo para vehículos", "Enable" : true, "dateCreate" : "2017-01-01 00:00:00", "userCreate" : "0", "dateUpdate" : "2017-01-01 00:00:00", "userUpdate" : "0"},
   { "_id" : "599222ce7f05fc0933b643f4", "name" : "Vida Colectiva", "codRamo": 2, "description" : "Trámites de forma Colectiva", "Enable" : true, "dateCreate" : "2017-01-01 00:00:00", "userCreate" : "0", "dateUpdate" : "2017-01-01 00:00:00", "userUpdate" : "0"},
   { "_id" : "599222d07f05fc0933b643f5", "name" : "Asistencia Médica Colectiva", "codRamo": 3, "description" : "Trámites de forma Colectiva e Individuales", "Enable" : true, "dateCreate" : "2017-01-01 00:00:00", "userCreate" : "0", "dateUpdate" : "2017-01-01 00:00:00", "userUpdate" : "0"},
   { "_id" : "599222d77f05fc0933b643f6", "name" : "Incendio y Aliadas", "codRamo": 5, "description" : "Incendio y Aliadas", "Enable" : true, "dateCreate" : "2017-01-01 00:00:00", "userCreate" : "0", "dateUpdate" : "2017-01-01 00:00:00", "userUpdate" : "0"},
   { "_id" : "599222fe7f05fc0933b643f7", "name" : "Lucro Cesante", "codRamo": 6, "description" : "Lucro Cesante", "Enable" : true, "dateCreate" : "2017-01-01 00:00:00", "userCreate" : "0", "dateUpdate" : "2017-01-01 00:00:00", "userUpdate" : "0"},
   { "_id" : "5992230f7f05fc0933b643f8", "name" : "Robo", "codRamo": 11, "description" : "Robo", "Enable" : true, "dateCreate" : "2017-01-01 00:00:00", "userCreate" : "0", "dateUpdate" : "2017-01-01 00:00:00", "userUpdate" : "0"},
   { "_id" : "599223127f05fc0933b643f9", "name" : "Accidentes Personales", "codRamo": 4, "description" : "Accidentes Personales", "Enable" : true, "dateCreate" : "2017-01-01 00:00:00", "userCreate" : "0", "dateUpdate" : "2017-01-01 00:00:00", "userUpdate" : "0"},
   { "_id" : "599223137f05fc0933b643fa", "name" : "Responsabilidad Civil", "codRamo": 21, "description" : "Responsabilidad Civil", "Enable" : true, "dateCreate" : "2017-01-01 00:00:00", "userCreate" : "0", "dateUpdate" : "2017-01-01 00:00:00", "userUpdate" : "0"},
   { "_id" : "599223147f05fc0933b643fb", "name" : "Transporte Interno", "description" : "Transporte Interno", "Enable" : true, "dateCreate" : "2017-01-01 00:00:00", "userCreate" : "0", "dateUpdate" : "2017-01-01 00:00:00", "userUpdate" : "0"},
   { "_id" : "599223147f05fc0933b643fc", "name" : "Transporte de Dinero", "description" : "Transporte de Dinero", "Enable" : true, "dateCreate" : "2017-01-01 00:00:00", "userCreate" : "0", "dateUpdate" : "2017-01-01 00:00:00", "userUpdate" : "0"},
   { "_id" : "599223147f05fc0933b643fd", "name" : "Fidelidad", "codRamo": 22, "description" : "Fidelidad", "Enable" : true, "dateCreate" : "2017-01-01 00:00:00", "userCreate" : "0", "dateUpdate" : "2017-01-01 00:00:00", "userUpdate" : "0"},
   { "_id" : "599223157f05fc0933b643fe", "name" : "Licencias", "description" : "Licencias", "Enable" : true, "dateCreate" : "2017-01-01 00:00:00", "userCreate" : "0", "dateUpdate" : "2017-01-01 00:00:00", "userUpdate" : "0"},
   { "_id" : "599223157f05fc0933b643ff", "name" : "Rotura de Maquinaria", "codRamo": 16, "description" : "Rotura de Maquinaria", "Enable" : true, "dateCreate" : "2017-01-01 00:00:00", "userCreate" : "0", "dateUpdate" : "2017-01-01 00:00:00", "userUpdate" : "0"},
   { "_id" : "599223157f05fc0933b64400", "name" : "Equipo Electrónico", "codRamo": 20, "description" : "Equipo Electrónico", "Enable" : true, "dateCreate" : "2017-01-01 00:00:00", "userCreate" : "0", "dateUpdate" : "2017-01-01 00:00:00", "userUpdate" : "0"},
   { "_id" : "599223167f05fc0933b64401", "name" : "Cumplimiento del Contrato", "description" : "Cumplimiento del Contrato", "Enable" : true, "dateCreate" : "2017-01-01 00:00:00", "userCreate" : "0", "dateUpdate" : "2017-01-01 00:00:00", "userUpdate" : "0"},
   { "_id" : "599223167f05fc0933b64402", "name" : "Todo riesgo de construcción", "codRamo": 14, "description" : "Todo riesgo de construcción", "Enable" : true, "dateCreate" : "2017-01-01 00:00:00", "userCreate" : "0", "dateUpdate" : "2017-01-01 00:00:00", "userUpdate" : "0"},
   { "_id" : "599223167f05fc0933b64403", "name" : "Asistencia médica Internacional", "description" : "Asistencia médica Internacional", "Enable" : true, "dateCreate" : "2017-01-01 00:00:00", "userCreate" : "0", "dateUpdate" : "2017-01-01 00:00:00", "userUpdate" : "0"},
   { "_id" : "599223167f05fc0933b64404", "name" : "Buen Uso del Anticipo", "codRamo": 28, "description" : "Buen Uso del Anticipo", "Enable" : true, "dateCreate" : "2017-01-01 00:00:00", "userCreate" : "0", "dateUpdate" : "2017-01-01 00:00:00", "userUpdate" : "0"},
   { "_id" : "599223167f05fc0933b64405", "name" : "Transporte de Importaciones", "description" : "Transporte de Importaciones", "Enable" : true, "dateCreate" : "2017-01-01 00:00:00", "userCreate" : "0", "dateUpdate" : "2017-01-01 00:00:00", "userUpdate" : "0"},
   { "_id" : "599223167f05fc0933b64406", "name" : "Vida Individual", "codRamo": 1, "description" : "Vida Individual", "Enable" : true, "dateCreate" : "2017-01-01 00:00:00", "userCreate" : "0", "dateUpdate" : "2017-01-01 00:00:00", "userUpdate" : "0"},
   { "_id" : "599223167f05fc0933b64407", "name" : "Asistencia Medica Individual", "description" : "Asistencia Medica Individual", "Enable" : true, "dateCreate" : "2017-01-01 00:00:00", "userCreate" : "0", "dateUpdate" : "2017-01-01 00:00:00", "userUpdate" : "0"},
   { "_id" : "599223167f05fc0933b64408", "name" : "48 Horas", "description" : "48 Horas", "Enable" : true, "dateCreate" : "2017-01-01 00:00:00", "userCreate" : "0", "dateUpdate" : "2017-01-01 00:00:00", "userUpdate" : "0"}
];
Ramo.insertMany($ramoData, (err, docs) => {
   answer("ramo", $ramoData.length);
});
/********PLAN********/
let $planData = [
   { "_id" : "599222be7f05fc0933b643f3", "name" : "plan6000", "value" : 2.25, "dateCreate" : "2017-01-01 00:00:00", "userCreate" : "0", "dateUpdate" : "2017-01-01 00:00:00", "userUpdate" : "0"}
];
Plan.insertMany($planData, (err, docs) => {
   answer("plan", $planData.length);
});
/********ALTERNATIVE********/
let $alternativeData = [
   { "_id" : "599222be7f05fc0933b643f3", "name" : "Titular Solo", "dateCreate" : "2017-01-01 00:00:00", "userCreate" : "0", "dateUpdate" : "2017-01-01 00:00:00", "userUpdate" : "0"}
];
Alternative.insertMany($alternativeData, (err, docs) => {
   answer("alternative", $alternativeData.length);
});
/********FRECUENCYPAYMENT********/
let $frequencyPaymentData = [
   { "_id" : "599222be7f05fc0933b643f3", "name" : "Mensual", "dateCreate" : "2017-01-01 00:00:00", "userCreate" : "0", "dateUpdate" : "2017-01-01 00:00:00", "userUpdate" : "0"},
   { "_id" : "599222ce7f05fc0933b643f4", "name" : "Semestral", "dateCreate" : "2017-01-01 00:00:00", "userCreate" : "0", "dateUpdate" : "2017-01-01 00:00:00", "userUpdate" : "0"},
   { "_id" : "599222d07f05fc0933b643f5", "name" : "Trimestral", "dateCreate" : "2017-01-01 00:00:00", "userCreate" : "0", "dateUpdate" : "2017-01-01 00:00:00", "userUpdate" : "0"},
   { "_id" : "599222d77f05fc0933b643f6", "name" : "Anual", "dateCreate" : "2017-01-01 00:00:00", "userCreate" : "0", "dateUpdate" : "2017-01-01 00:00:00", "userUpdate" : "0"}
];
FrequencyPayment.insertMany($frequencyPaymentData, (err, docs) => {
   answer("frecuencyPaymentData", $frequencyPaymentData.length);
});








