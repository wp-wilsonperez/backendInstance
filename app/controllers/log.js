
import Log from "../models/log";

let logController = function (app, control={auth, passport, acl}){

   function controller (req, res, next) {
      req.controller = "log";
      return next();
   }

   app.get('/log/list', [control.auth, controller, control.acl], (req, res) => {
      let $filter =  global.filter(null);
      Log.find($filter, function (err, docs) {
         if (typeof docs !== 'undefined') {
            res.send({msg: "OK", logs: docs});
         } else {
            let error=global.error(err, 0, req.controller);
            res.send({msg: 'ERROR', err: error});
         }
      });
   });

}

export default logController
