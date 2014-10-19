var express = require('express');
var router = express.Router();
var config = require('../config');

exports.example = function (req, res, next) {

	console.log('in exports.dashboard');

	res.render('example', { title: 'Express' });
};