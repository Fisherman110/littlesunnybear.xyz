const currentProgramVersion = require("./currentProgramVersion.js").toString();

module.exports = function(){
    fetch('https://gitee.com/api/v5/repos/baiyang-lzy/bbg/releases?page=1&per_page=20')
  .then(response => response.json())
  .then(function(data){
    if(currentProgramVersion !== data[0]["tag_name"]){
        window.alert(`当前版本不是最新版本。 \n \n 当前版本：${currentProgramVersion}\n 最新版本：${data[0]["tag_name"]} \n \n 请前往 https://gitee.com/baiyang-lzy/bbg/releases 获取最新更新。`)
    }else{
        window.alert(`当前已经是最新版本！`)
    }
  })
  .catch(function(err){
      window.alert("检查更新失败："+err);
  }); 
}