
import helper from "../configs/helper.json";

let paramController = function (app, control={auth, passport, acl}){

   function controller (req, res, next) {
      req.controller = "param";
      return next();
   }

   app.get('/param/list', (req, res) => {
      let $name = req.params.name;
      if(helper){
         res.send({msg: "OK", params: helper});
      } else {
         res.send({
            msg : 'ERR',
            err : "incorrect"
         });
      }
   });

}

export default paramController
