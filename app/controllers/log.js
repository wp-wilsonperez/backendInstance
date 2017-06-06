
import Log from "../models/log";

let logController = function (app, control={auth, passport, acl}){

   function controller (req, res, next) {
      req.controller = "log";
      return next();
   }

   app.get('/log/list', [control.auth, controller, control.acl], (req, res) => {

      Log.find({}, function (err, docs) {
         if (typeof docs !== 'undefined') {
            res.send({msg: "OK", logs: docs});
         } else {
            res.send({
               msg : 'ERR',
               err : err.code
            });
         }
      });
   });

}

export default logController
