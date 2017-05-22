
let homeController = function (app, control={auth, passport, acl}){

   app.get('/', (req, res) => {

      res.render('home/index');
   });

   app.get('/*', (req, res) => {
      res.redirect('/')
   });
}

export default homeController
