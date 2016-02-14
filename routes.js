var userRoute = require('./routes/userRoute');
var commodityRoute = require('./routes/commodityRoute');
var imageRoute = require('./routes/imageRoute');
var initRoute = require('./routes/initRoute');
var cartRoute = require('./routes/cartRoute');
var orderRoute = require('./routes/orderRoute');
var activityRoute = require('./routes/activityRoute');
var groupRoute = require('./routes/groupRoute');


var passport = require('passport');

var multer = require('multer');
var upload = multer({ dest: './public/upload' });
var noCache = require('connect-nocache')();



module.exports = function (app) {


    app.post('/login', noCache,userRoute.login);
    app.post('/user', noCache,userRoute.createUser);
    app.get('/user', noCache,userRoute.getUserList);
    app.get('/user/:id', noCache,userRoute.getUser);
    app.put('/user/:id', noCache,userRoute.updateUser);

    app.post('/avatar', noCache,upload.single('avatar'), userRoute.updateAvatar);


    app.get('/', function (req, res) {
        res.render('index');
    });

    app.get('/demo', function (req, res) {
        res.render('index_demo');
    });

    app.get('/init', initRoute.initBasicData);


    app.get('/commodity', noCache, commodityRoute.getList);
    app.get('/commodity/:id', noCache, commodityRoute.getItem);


    app.get('/cart', cartRoute.getList);
    app.post('/cart', cartRoute.createItem);
    app.put('/cart/:id', cartRoute.updateItem);
    app.delete('/cart/:id', cartRoute.deleteItem);

    app.get('/activity', activityRoute.getList);
    app.post('/activity', activityRoute.createItem);
    app.put('/activity/:id', activityRoute.updateItem);
    app.delete('/activity/:id', activityRoute.deleteItem);
    
    app.get('/group', noCache,groupRoute.getList);
    app.get('/group/:id', noCache,groupRoute.getItem);
    app.post('/group', noCache,groupRoute.createItem);
    app.put('/group/:id', noCache,groupRoute.updateItem);
    app.delete('/group/:id', noCache,groupRoute.deleteItem);


    app.get('/order', noCache,orderRoute.getList);
    app.post('/order', noCache,orderRoute.createItem);
    app.put('/order/:id', noCache,orderRoute.updateItem);
    app.get('/order/:id', noCache,orderRoute.getItem);
    app.delete('/order/:id', noCache,orderRoute.deleteItem);



};
