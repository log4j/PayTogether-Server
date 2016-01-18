
var fs = require('fs');

exports.uploadImage = function (file,prefix,callback) {
    var imageName = prefix+"_"+file.filename
        + (file.originalname.substring(file.originalname.lastIndexOf('.')));
    console.log('new image name',imageName);
    // 获得文件的临时路径
    var tmp_path = file.path;
    // 指定文件上传后的目录 - 示例为"images"目录。
    var target_path = './public/images/' + prefix +'/'+ imageName;
    // 移动文件
    fs.rename(tmp_path, target_path, function(err) {
        if(err)
            return callback(err);
        // 删除临时文件夹文件,
        //fs.unlink(tmp_path, function(unlinkErr){
            return callback(null,imageName);
        //});
    });
};
