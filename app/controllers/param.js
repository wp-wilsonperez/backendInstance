
import helper from "../configs/helper.json";

let paramController = function (app, control={auth, passport, acl}){

   function controller (req, res, next) {
      req.controller = "param";
      return next();
   }

   app.get('/param/list/:name', (req, res) => {
      let $name = req.params.name;
      if(helper[$name]){
         res.send({msg: "OK", params: helper[$name]});
      } else {
         res.send({
            msg : 'ERR',
            err : err.code
         });
      }
   });

}

export default paramController
