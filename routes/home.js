var express = require('express');
var router = express.Router();
var config = require('../config');

var cvWebnames = ['lindalin.me','localhost'];


exports.dashboard = function (req, res, next) {

	console.log('in exports.dashboard');

	res.render('dashboard', { title: 'Express' });
};

exports.home = function (req, res, next) {
	

	res.render('dashboard', { title: 'Express' });
};


exports.websiteFilter = function (req, res, next) {

	var host = req.headers.host;

	for(var i=0;i<cvWebnames.length;i++){
		if(host.indexOf(cvWebnames[i])>=0){
			res.render(cvWebnames[i]);
			return;
		}
	}

	next();

};