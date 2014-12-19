
//var bcrypt = require('bcrypt');
var moment = require('moment');
moment.locale('us-en'); // 使用中文

// 格式化时间
exports.formatDate = function (date, friendly) {
  date = moment(date);

  if (friendly) {
    return date.fromNow();
  } else {
    return date.format('YYYY-MM-DD HH:mm');
  }

};

exports.validateId = function (str) {
  return (/^[a-zA-Z0-9\-_]+$/i).test(str);
};

//exports.bhash = function (str, callback) {
//  bcrypt.hash(str, 10, callback);
//};

//exports.bcompare = function (str, hash, callback) {
//  bcrypt.compare(str, hash, callback);
//};



Array.prototype.remove = function (item){
    if(item==null)
        return;
    
    var index= -1;
    for(var i=0;i<this.length;i++){
        if(this[i]==item){
            index = i;
            break;
        }
    }
    if(index>=0)
        this.splice(i,1);
};

Array.prototype.pushIfNotExist = function (item) {
    if(item == null)
        return;
    
    var exist = false;
    for(var i=0;i<this.length;i++){
        if(this[i]==item){
            exist = true;
            break;
        }
    }
    if(!exist)
        this.push(item);
};

Array.prototype.minus = function(list){
    var result = [];
    for(var i=0;i<this.length;i++){
        if(list.indexOf(this[i])<0)
            result.push(this[i]);
    }
    return result;
};

Array.prototype.minusAsString = function(list){
    var result = [];
    for(var i=0;i<this.length;i++){
        var notIn = true;
        for(var j=0;j<list.length;j++){
            if(list[j].toString()==this[i].toString()){
                notIn = false;
                break;
            }
        }
        if(notIn)
            result.push(this[i]);
    }
    return result;
};


