/**
 *	config
 */





var config = {
	website_name: 'Pay Together',
	description: 'Make our life easier!',
	site_static_host: '',
	port: 80,

	session_secret: 'pay_together_secret',
	db: 'mongodb://127.0.0.1/pay_together_dev',
    
    
    labelColor: ['primary','success','info','warning','danger','cyan','red','green','orange','amethyst','greensea','dutch','hotpink','drank','blue','slategray','redbrown'],
    randomLabelColor : function(){
        return this.labelColor[parseInt(Math.random()*this.labelColor.length)];
    },
    typeIconList:['fa-shopping-cart', 'fa-car', 'fa-cutlery'],
    typeNameList:['Shopping', 'Travel', 'Eating'],


    cardColor: ['cyan','green','orange', 'amethyst','greensea','drank','dutch','hotpink','redbrown','slategray'],
    randomCardColor : function(){
        return this.cardColor[parseInt(Math.random()*this.cardColor.length)];
    }

};


module.exports = config;



