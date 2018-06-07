// ROUTES
const router = require('express').Router();              // get an instance of the express Router

// Apply Middlewares
const middlewares = require('../middlewares');
middlewares.forEach( middleware => router.use(middleware) );

// ping route
router.get('/ping', function(req, res) {
    res.json({ message: 'pong' });
});

const controllers = require('../controllers');
controllers.forEach(controller=>{
  if(!!controller.list)
    router.route('/'+controller.name).get(controller.list);
  if(!!controller.find)
    router.route('/'+controller.name+'/:id').get(controller.find);
});

module.exports = router;
