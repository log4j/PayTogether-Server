var userRoute = require('./routes/userRoute');
var commodityRoute = require('./routes/commodityRoute');
var imageRoute = require('./routes/imageRoute');
var initRoute = require('./routes/initRoute');
var cartRoute = require('./routes/cartRoute');
var orderRoute = require('./routes/orderRoute');

var passport = require('passport');

var multer  = require('multer');
var upload = multer({ dest: './public/upload' });



module.exports = function (app) {


    app.post('/login', userRoute.login);
    app.post('/user', userRoute.createUser);
    app.get('/user', userRoute.getUserList);
    app.get('/user/:id', userRoute.getUser);
    app.put('/user/:id', userRoute.updateUser);

    app.post('/avatar', upload.single('avatar'), userRoute.updateAvatar);


    app.get('/', function (req, res) {
        res.render('index');
    });

    app.get('/demo', function (req, res) {
        res.render('index_demo');
    });

    app.get('/init', initRoute.initBasicData);


    app.get('/commodity', commodityRoute.getList);
    app.get('/commodity/:id', commodityRoute.getItem);


    app.get('/cart', cartRoute.getList);
    app.post('/cart', cartRoute.createItem);
    app.put('/cart/:id', cartRoute.updateItem);
    app.delete('/cart/:id', cartRoute.deleteItem);


    app.get('/order', orderRoute.getList);
    app.post('/order', orderRoute.createItem);
    app.put('/order/:id', orderRoute.updateItem);
    app.get('/order/:id', orderRoute.getItem);
    app.delete('/order/:id', orderRoute.deleteItem);



};
