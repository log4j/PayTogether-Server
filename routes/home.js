var express = require('express');
var router = express.Router();
var config = require('../config');



exports.dashboard = function (req, res, next) {

	console.log('in exports.dashboard');

	res.render('dashboard', { title: 'Express' });
};