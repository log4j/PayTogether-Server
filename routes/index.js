var express = require('express');
var router = express.Router();
var config = require('../config');

var Group = require('../proxy').Group;

var User = require('../proxy').User;

/* GET home page. */
router.get('/test', function(req, res) {
  res.render('dashboard', { title: 'Express' });
});


router.get('/', function(req, res){
    
    User.getUserByLoginName('yangmang',function(err,user){
        
       res.send(user.name); 
    });
    
    
    
});

module.exports = router;
