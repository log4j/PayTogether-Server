var flash = require('connect-flash'),
    express = require('express'),
    passport = require('passport'),
    util = require('util'),
    LocalStrategy = require('passport-local').Strategy;
var validator = require('validator');
var EventProxy = require('eventproxy');
var tools = require('../common/tools');
var Results = require('./commonResult');

var User = require('../models').User;
var Tip = require('../models').Tip;
var Commodity = require('../models').Commodity;


var fs = require('fs');

var md5 = require('MD5');

var createSimpleEntity = function(item) {
    var obj = {};
    obj.id = item.id;
    obj.title = item.title;
    obj.image = item.feature_image;
    obj.view = item.view_amount;
    obj.fav = item.fav_amount;
    obj.type = item.type;
    obj.l = item.language;
    obj.c = item.create_at;
    obj.u = item.update_at;
    return obj;
};


exports.getList = function(req, res, next){
    var data = {};
    if (req.query.date)
        data.date = req.query.date;
    if (req.query.type)
        data.type = req.query.type;
    //if (req.query.language)
    //    data.language = req.query.language;

    Tip.find(data, function (err, list) {
        var result = [];
        if (!err) {
            for (var i = 0; i < list.length; i++) {
                result.push(createSimpleEntity(list[i]));
            }
        }
        res.json(result);
    });
};

exports.getOne = function(req, res, next){
    var id = req.param('id');
    Tip.findById(id, function(err, item){

        item.view_amount ++;
        item.update_at = new Date();
        item.save(function(){
            var obj = createSimpleEntity(item);
            obj.paras = [];
            for(var i=0;i<item.paragraph.length;i++)
                obj.paras.push(item.paragraph[i]);

            res.json(obj);
        });


    });
};

exports.create = function(req, res, next){

};

exports.update = function(req, res, next){
    res.json({result:true});
};

exports.delete = function(req, res, next){

};

exports.initBasicData = function(req, res, next){
    var commodityData = [
        {
            name: 'iPhone 6S (Golden 64GB)',
            price: 749,
            images:['the_iphone_plan_large_2x.png','the_iphone_plan_large_2x.png'],
            description:[
                {type:'text',value:'The only thing that’s changed is everything.'},
                {type:'text',value:'The moment you use iPhone 6s, you know you’ve never felt anything like it. With a single press, 3D Touch lets you do more than ever before. Live Photos bring your memories to life in a powerfully vivid way. And that’s just the beginning. Take a deeper look at iPhone 6s, and you’ll find innovation on every level.'},
                {type:'image',value:'design_opt_back_large_2x.jpg'},
                {type:'text',value:'The original iPhone introduced the world to Multi-Touch, forever changing the way people experience technology. With 3D Touch, you can do things that were never possible before. It senses how deeply you press the display, letting you do all kinds of essential things more quickly and simply. And it gives you real-time feedback in the form of subtle taps from the all-new Taptic Engine.'},
                {type:'image',value:'technology_front_large_2x.png'}
            ]
        },
        {
            name: 'iPhone 6S (Golden 128GB)',
            price: 849,
            images:['the_iphone_plan_large_2x.png'],
            description:[
                {type:'text',value:'The only thing that’s changed is everything.'},
                {type:'text',value:'The moment you use iPhone 6s, you know you’ve never felt anything like it. With a single press, 3D Touch lets you do more than ever before. Live Photos bring your memories to life in a powerfully vivid way. And that’s just the beginning. Take a deeper look at iPhone 6s, and you’ll find innovation on every level.'},
                {type:'image',value:'design_opt_back_large_2x.jpg'},
                {type:'text',value:'The original iPhone introduced the world to Multi-Touch, forever changing the way people experience technology. With 3D Touch, you can do things that were never possible before. It senses how deeply you press the display, letting you do all kinds of essential things more quickly and simply. And it gives you real-time feedback in the form of subtle taps from the all-new Taptic Engine.'},
                {type:'image',value:'technology_front_large_2x.png'}
            ]
        },

        {
            name: 'Microsoft Designer Bluetooth Desktop Keyboard and Mice',
            price: 59.95,
            images:['71pEdEtzyCL._SL1500_.jpg'],
            description:[
                {type:'text',value:'Microsoft Designer Bluetooth Desktop Keyboard and Mice'},
                {type:'image',value:'71pEdEtzyCL._SL1500_.jpg'},
                {type:'text',value:'Features: Ultra-thin and modern design complements your desktop. Wireless Bluetooth Smart technology. The keyboard is full-sized with a built-in number pad. Blue Track Technology provides remarkable tracking on virtually any surface. Ambidextrous design allows you to control your mouse in either hand.'}
            ]
        },

        {
            name: 'Dell XPS 15 9550 Series Laptop',
            price: 1079.99,
            images:['laptop-xps-15-9550-pdp-polaris-04.jpg'],
            description:[
                {type:'text',value:'The world’s only 15-inch  InfinityEdge display: The virtually borderless display  maximizes screen space by accommodating a 15-inch  display inside a laptop closer to the size of a 14-inch , thanks to a bezel measuring just 5.7mm  , 59% thinner than the Macbook Pro. '},
                {type:'image',value:'laptop-xps-15-9550-pdp-polaris-01.jpg'},
                {type:'text',value:'Features: The world’s smallest 15-inch laptop packs powerhouse performance and a stunning InfinityEdge display! Core i5-6300HQ, 8GB 2133Mhz DDR4, Geforce 960M 2GB GDDR5, 1TB HDD + 32GB SSD, 15.6" FHD, Windows 10 Home.'},

                {type:'text',value:'Dazzling UltraSharp™ 4K Ultra HD detail: Choose phenomenal display technology with the optional UltraSharp™ 4K Ultra HD (3840x2160) touch display. With over 8 million pixels – 3 million more than the MacBook Pro and four times that of Full HD – high resolution allows you to see everything you do in incredibly fine detail. '},
                {type:'image',value:'laptop-xps-15-9550-pdp-polaris-03.jpg'}
            ]
        },

        {
            name: 'Zojirushi™ 5½-Cup Micom Rice Cooker and Warmer',
            price: 169.99,
            images:['DP1124201417012044M.jpeg'],
            description:[
                {type:'text',value:'The Micom rice cooker and warmer not only cooks flawless rice but it also can double as a steamer and even bake cakes.'},
                //{type:'image',value:'DP1124201417012044M.jpeg'},
                {type:'text',value:'micro-computerized technology allows the rice cooker to "think" for itself and make fine adjustments to temperature and heating time to cook perfect rice every time'},

                {type:'text',value:'doubles as a steamer with its versatile steam menu setting and steaming basket'}
            ]
        },

        {
            name: 'The Creme de la Mer & The Eye Concentrate',
            price: 195.00,
            images:['BG-23QX_mz.jpg'],
            description:[
                {type:'text',value:'The Eye Concentrate, 0.5 oz.'},
                //{type:'image',value:'DP1124201417012044M.jpeg'},
                {type:'text',value:'The Eye Concentrate: This concentrated, ultraluxe eye treatment quenches and conditions impressionable skin. The Eye Concentrate significantly reduces the appearance of dark circles and puffiness, lines and wrinkles, encouraging the eye area to look and feel healthy, supple and luminous as never before.'},
                {type:'image',value:'BGC0B3B_mk.jpg'},
                {type:'text',value:"Creme de la Mer: At the heart of Crème de la Mer is a nutrient-rich, highly potent Miracle Broth™. There is nothing unusual about its ingredients—a blend of sea kelp, vitamins and minerals. It's the way Huber distilled them that made the difference between a good moisturizer and a small miracle, borrowing from the ancient science of fermentation. This intensive, 3 to 4 month process released vital energies, transforming the ingredients into a whole far greater than the sum of its parts. Available in 1 ounce or 2 ounces."}
            ]
        },


        {
            name: 'The Moisturizing Soft Cream',
            price: 310.00,
            images:['BG-422G_ak.jpg'],
            description:[
                {type:'text',value:'The Micom rice cooker and warmer not only cooks flawless rice but it also can double as a steamer and even bake cakes.'},
                {type:'image',value:'BGC13M5_mk.jpg'},
                {type:'text',value:'The new Moisturizing Soft Cream delivers miraculous benefits. Its luxurious formula penetrates deeply to replenish moisture and strengthen skin.Renewed and energized, skin looks youthfully radiant.'},

                {type:'text',value:'doubles as a steamer with its versatile steam menu setting and steaming basket'}
            ]
        },


        {
            name: 'Cat Ear Headphones',
            price: 149.99,
            images:['990635p_alt6.jpg'],
            description:[
                {type:'text',value:'Premium headphones for private listening'},
                {type:'image',value:'990635p_alt4.jpg'},
                {type:'text',value:'External cat ear speakers for sharing music'},
                {type:'image',value:'990635p_alt5.jpg'},
                {type:'text',value:'Independently controlled LED accent lights'}
            ]
        },

        {
            name: 'GoPro HERO4 Session',
            price: 199.99,
            images:['28.jpg_600_0_15_9665.jpg'],
            description:[
                {type:'text',value:'GoPro HERO4 Session'},
                {type:'image',value:'41SyiQ7dYnL.jpg'},
                {type:'text',value:'AmazonBasics Head Strap Camera Mount for GoPro'},
                {type:'image',value:'28.jpg_600_0_15_9666.jpg'},
                {type:'text',value:'Lexar High-Performance MicroSDHC 633x 32GB UHS-I/U3 (Up to 95MB/s Read) w/USB 3.0 Reader Flash Memory Card'}
            ]
        },

        {
            name: 'Sennheiser Urbanite XL Galaxy Over-Ear Headphones - Denim',
            price: 149.99,
            images:['55c3d249d32d5.jpg_148_148_2_2223.jpg'],
            description:[
                {type:'text',value:'Take the club with you - Legendary Sennheiser sound featuring massive bass, smooth midrange and extended treble.'},
                {type:'image',value:'71jwT+C6TCL._SL1434_.jpg'},
                {type:'text',value:'Tough companion - Constructed using premium extra rugged parts like stainless steel hinges and aluminum sliders for reliability and durability.'},
                {type:'image',value:'71UvFDyd5xL._SL1500_.jpg'},
                {type:'text',value:'Stay connected - control your music and calls (includes detachable cable with 3-button remote control and integrated microphone for Android devices, such as Samsung Galaxy)'}
            ]
        },





        {
            name: 'Samsung - 48" Class (47.6" Diag.) ',
            price: 499.99,
            images:['9481052_sd.jpg'],
            description:[
                {type:'text',value:'LED - 2160p - Smart - 4K Ultra HD TV - Black'},
                {type:'image',value:'9481052_rd.jpg'},
                {type:'text',value:"This TV's 4K Ultra HD resolution displays movies, TV shows and more with 4x the picture quality of Full HD. Plus, Smart TV lets you stream content from popular services like YouTube and Netflix, surf the Internet and check your social networks."},

                //{type:'text',value:'doubles as a steamer with its versatile steam menu setting and steaming basket'}
            ]
        },





    ];

    var commodityPromises = [];
    for(var i=0;i<commodityData.length;i++){
        var item = commodityData[i];
        var commodity = new Commodity();
        for(var key in item){
            commodity[key] = item[key];
        }
        commodityPromises.push(new Promise(function(resolve,reject){
            commodity.save(function(err,createdItem){
                if(err)
                    reject({result:false});
                else
                    resolve({result:true,data:createdItem});
            });
        }));
    }

    Promise.all(commodityPromises)
        .then(function(resData){
            console.log(resData);
            res.json({result:true,data:resData});
        },function(resData){
            res.json({result:false,data:resData});
        });
};
