module.exports = function(){

  document.getElementById("container").innerHTML += `
  <h1>博客设置</h1>
  <br />
  <h2>基本信息与主题配置</h2>
  <hr />
  <div class="mb-3">
<label class="form-label">博客标题</label>
<input class="form-control" value="${blog["博客标题"]}" id="blog_settings_title">
</div>

<div class="mb-3">
<label class="form-label">博客描述（副标题）</label>
<input class="form-control" value="${blog["博客描述（副标题）"]}"  id="blog_settings_description">
</div>

<div class="mb-3">
<label class="form-label">底部信息（格式为markdown，不支持html）</label>
<input class="form-control"  value="${blog["底部信息（格式为markdown）"]}" id="blog_settings_bottom_information">
</div>

<hr />
<p style="color:grey">颜色格式：可以填写HTML颜色名或十六进制颜色，如#66CCFF、cyan都是可选的颜色</p>

<div class="mb-3">
<label class="form-label">博客标题栏背景颜色</label>
<input class="form-control" value="${blog["全局主题设置"]["标题栏背景颜色"]}"  id="blog_settings_titlebar_bgcolor">
</div>

<div class="mb-3">
<label class="form-label">博客标题栏文字颜色</label>
<input class="form-control"  value="${blog["全局主题设置"]["标题栏文字颜色"]}" id="blog_settings_titlebar_textcolor">
</div>


  <h2>为此站点使用第三方主题</h2>
  <hr />
  <p>你可以选择使用第三方主题以获得更加丰富和美观的体验。当你改变主意的时候，你也可以随时切换回官方主题。</p>

  <p>目前此站点正在使用：<b><span id="isUsingThirdPartyTheme"></span> </b></p>
  <button class="btn btn-outline-primary" onclick="reset_official_theme();">将此站点的主题重置为官方主题</button>

  <br /><br />
  <button class="btn btn-link" onclick="open_online_theme_dialog()">从主题商店获取第三方主题</button>
  <br />
  <button class="btn btn-link" onclick="apply_thirdparty_theme();">为此站点使用来自文件的第三方主题（不建议）</button>

  <br /><br />


<h2>评论设置</h2>
<hr />
<p style="color:grey">valine评论需要leancloud账号，如果勾选启用valine评论，请填入可在leancloud
获取到的appid和appkey。如不勾选启用valine评论，所填写的appid和appkey都不会生效。</p>
<div class="form-check">
<input class="form-check-input" type="checkbox" id="blog_settings_is_valine_enabled">
<label class="form-check-label" for="blog_settings_is_valine_enabled">
  启用valine评论
</label>
</div>
<br />
<div class="mb-3">
<label class="form-label">AppID（不启用valine评论则可不填）</label>
<input class="form-control"  value="${blog["全局评论设置"]["valine设置"]["leancloud_appid"]}"  id="blog_settings_valine_appid">
</div>

<div class="mb-3">
<label class="form-label">AppKey（不启用valine评论则可不填）</label>
<input class="form-control" value="${blog["全局评论设置"]["valine设置"]["leancloud_appkey"]}" id="blog_settings_valine_appkey">
</div>

<hr />

<button class="btn btn-primary" onclick="save_blog_settings();">保存配置</button>
  
  
  
  `

if (blog["全局评论设置"]["启用valine评论"] === true) {
  document.getElementById("blog_settings_is_valine_enabled").checked = true;
}

if(blog["全局主题设置"]["是否使用第三方主题"] === true){
  document.getElementById("isUsingThirdPartyTheme").innerHTML = "第三方主题";
}else{
  document.getElementById("isUsingThirdPartyTheme").innerHTML = "官方主题";
}

}