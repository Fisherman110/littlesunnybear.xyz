marked.setOptions({
  highlight: function(code) {
    return hljs.highlightAuto(code).value;
  }
});

const image_viewer_dialog = new bootstrap.Modal(document.getElementById('image_viewer_dialog'));

markdown_renderer = new marked.Renderer();

markdown_renderer.heading = (text, level, raw, slugger) => {
  return `<h${level} style="border-bottom: solid 1px rgba(137,137,137,0.3);padding-bottom: 4px"><a href="javascript:void(0)">##</a> ${text}</h${level}>`;
}

markdown_renderer.link = (href, title, text) => {
  return `<a href="${href}" ${title===null||title===undefined||title===""?"":`title="${title}"`} style="text-decoration: underline">${text} <i class="fa fa-external-link"></i></a>`
}

marked.setOptions({
  renderer: markdown_renderer
})

baseurl = "";

String.prototype.hashCode = function() {
  let hash = 0,
    i, chr;
  if (this.length === 0) return hash;
  for (i = 0; i < this.length; i++) {
    chr = this.charCodeAt(i);
    hash = ((hash << 5) - hash) + chr;
    hash |= 0;
  }
  return hash;
}

function getTagColor(tagname) {
  let color_list = ["#000099", "#330099", "#660099", "#990099", "#cc0099", "#ff0099", "#0000cc", "#3300cc", "#6600cc", "#9900cc"];
  let color_id = parseInt(tagname.hashCode().toString().replace("-", "").slice(0, 1));
  return color_list[color_id];
}

window.onpopstate = function() {
  if (window.location.href.indexOf("#top") === -1 && window.location.href.indexOf("#reference") === -1) {
    window.location.reload();
  }
}

function openImageViewer(url) {
  document.querySelector("#image_viewer_dialog_body").innerHTML = `
      <button onclick="window.open('${url.indexOf("https://") === -1 && url.indexOf("http://") === -1?baseurl:""}${url}')" class="btn btn-success"><i class="fa fa-file-image-o"></i> 在新标签页打开此图像</button>
      <br />
      <br />
      <img src="${url.indexOf("https://") === -1 && url.indexOf("http://") === -1?baseurl:""}${url}" style="max-width: 100%" />
      <br />
      <br />
      <button onclick="window.open('${url.indexOf("https://") === -1 && url.indexOf("http://") === -1?baseurl:""}${url}')" class="btn btn-success"><i class="fa fa-file-image-o"></i> 在新标签页打开此图像</button>
      <button onclick="image_viewer_dialog.hide()" class="btn btn-primary"><i class="fa fa-times"></i> 关闭此对话框</button>

      `;
  image_viewer_dialog.toggle();
}

function content_decrypt(content, password, verify = null) {
  if (verify !== null)
    if (CryptoJS.SHA256(password).toString() != verify)
      return [false];
  var key = CryptoJS.enc.Utf8.parse(password).toString();
  var argument = {
    iv: CryptoJS.enc.Utf8.parse('1145141919810').toString(),
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7
  }
  var result = CryptoJS.AES.decrypt(content, key, argument).toString(CryptoJS.enc.Utf8);
  if (result == "") return [false];
  else return [true, result];
}

currentArticleListPageOrder = 1; //这个变量表示目前在显示文章列表中的第几页，是从1开始数的

success_locate_article_id = false;
success_locate_page_id = false;

if (localStorage.getItem("is_nightmode") === null || localStorage.getItem("is_nightmode") === undefined) {
  localStorage.setItem("is_nightmode", window.matchMedia('(prefers-color-scheme: dark)').matches ? "on" : "off");
}

if (localStorage.getItem("is_nightmode") === "on") {
  switch_to_night_mode();
}

function switch_to_night_mode() {
  document.getElementById("whether_nightmode").innerHTML = `
          body{
            background-color:#000000c7;
            
          }
          #blog_index_title,#blog_index_subtitle, .article-content h2,.page-content h2, #article-content-html p, #page-content-html p{
            color:white;
          }

          .article-item, .article-content, .page-content{
            background-color:#000000a8
          }
          .article-item p, .article-item-sub, .article-content-sub, #page_order_html, #bottom_info_html{
            color:lightgrey!important;
          }
          a{
            color:#67a5ff
          }
          .card, #tag-content{
            background-color:black;
            color:white
          }

          ul,ol,li,h1,h2,h3,h4,h5,h6,th,td,.vcontent *, #veditor{
            color:white
          }

          .vcontent p, .vnick, .vlink, .vmail, .vinput, .vsubmit{
            color:white!important
          }

          .vcontent *{
            background-color:black!important;
          }

          .expand::after{
            background:black!important;
            color:white!important;
          }
          .expand::before{
            background:rgba(0, 0, 0, 0.5)!important
          }
          
          pre,
    code,
    kbd,
    samp{
      border-radius: 4px;
      background-color: black!important;
      padding-top: 4px;
      padding-bottom: 4px;
      padding-left: 12px;
      padding-right: 12px;
      display: inline-block;
    }

    .bbg-comment-area{
      background-color:black;
      color:white
    }
          `;
  localStorage.setItem("is_nightmode", "on");
}

function switch_to_light_mode() {
  document.getElementById("whether_nightmode").innerHTML = "";
  localStorage.setItem("is_nightmode", "off");
}

function switch_night_mode() {
  if (localStorage.getItem("is_nightmode") === "off") {
    switch_to_night_mode();
  } else if (localStorage.getItem("is_nightmode") === "on") {
    switch_to_light_mode();
  }
}

function detect_whether_ui_load_finished() {
  if (bootstrap_css_import_finished === true && content_load_finished === true) {
    document.getElementById("root").setAttribute("style", "");
    document.getElementById("loading").setAttribute("style", "display:none");
  }
}

function copy_full_article_to_clipboard() {
  navigator.clipboard.writeText(document.querySelector("#article-content-html").innerText);
  document.getElementById("copy_to_clipboard_button").innerHTML = `<i class="fa fa-check"></i> 已复制！`;
}

bootstrap_css_import_finished = false;
content_load_finished = false;
highlight_css_import_finished = false;

const langdata = {
  "ARCHIVE_AND_TAGS": {
    "简体中文": "归档和标签",
    "English": "Archive and tags",
    "日本語": "アーカイブとタグ"
  },
  "ARTICLE_LIST": {
    "简体中文": "文章列表",
    "English": "Article List",
    "日本語": "記事一覧"
  },
  "ARTICLE_CREATEDAT": {
    "简体中文": "此文章编写于",
    "English": "This article is written at ",
    "日本語": "作成日"
  },
  "LASTMODIFIEDAT": {
    "简体中文": "最近修改于",
    "English": "Last modified at ",
    "日本語": "修正日"
  },
  "TAGS": {
    "简体中文": "标签",
    "English": "Tags: ",
    "日本語": "タグ"
  },
  "COMMENT_UNAVAILABLE_DUE_TO_PREVIEW": {
    "简体中文": "由于你目前正在预览环境之中，评论功能暂时被禁用了。当你的站点被从互联网访问时，评论系统会正常地显示在这里。",
    "English": "Comment function banned because you are now in the preview environment. When the site is visited from the Internet, the comment system will be available here.",
    "日本語": "現在プレビュー環境のため、コメント機能が禁止されています。インターネットからサイトにアクセスすると、ここにコメントシステムが表示されます。"
  },
  "FRIEND_BOOK": {
    "简体中文": "友人帐",
    "English": "Friend book",
    "日本語": "友人帳"
  },
  "COPYRIGHT_HINT": {
    "简体中文": "版权声明",
    "English": "About the copyright of the article",
    "日本語": "記事の著作権について"
  },
  "PREVIOUS_POST": {
    "简体中文": "上一篇文章",
    "English": "Previous post",
    "日本語": "前の記事へ"
  },
  "NEXT_POST": {
    "简体中文": "下一篇文章",
    "English": "Next post",
    "日本語": "次の記事へ"
  },
  "NOTHING": {
    "简体中文": "没有了",
    "English": "nothing",
    "日本語": "記事が存在しない"
  },
  "COPYRIGHT_RESERVED": {
    "简体中文": "除特别声明外，本博客上的内容由博主保留所有权利，进行转载前需先获得博主同意。",
    "English": "Unless otherwise stated, the content on this blog is reserved by the blogger, and the blogger's consent must be obtained before reprinting.",
    "日本語": "特別な記載がない限り、このブログ内の記事はブロガーの所有物であり、転載にはブロガーの同意が必要です。"
  },
  "COPYRIGHT_CC_BY_NC_SA_FOUR_DOT_ZERO": {
    "简体中文": "除特别声明外，本博客上的内容采用 <a href='https://creativecommons.org/licenses/by-nc-sa/4.0/deed.zh' target='_blank'>CC BY-NC-SA 4.0 许可协议</a> 授权。转载请注明出处！",
    "English": "Unless otherwise stated, the content on this blog is licensed under the <a href='https://creativecommons.org/licenses/by-nc-sa/4.0/deed.en' target='_blank'>CC BY-NC-SA 4.0 license</a>. Please indicate the source when reprinting!",
    "日本語": "特別な記載がない限り、このブログ内の記事は<a href='https://creativecommons.org/licenses/by-nc-sa/4.0/deed.ja' target='_blank'>CC BY-NC-SA 4.0ライセンス</a>を使用しています。転載の際は出典を明記してください！"
  },
  "COPYRIGHT_UNLICENSED": {
    "简体中文": "除特别声明外，本博客上的内容属于公有领域，这意味着你可以不受限制地使用和加工它们。",
    "English": "Unless otherwise stated, the content on this blog is in the public domain, which means you can use and process it without restriction.",
    "日本語": "特別な記載がない限り、このブログ内の記事はパブリックドメインであり、制限なく使用・加工できます。"
  },
  "SEARCH_SOMETHING": {
    "简体中文": "在站点内搜索",
    "English": "Search something...",
    "日本語": "検索..."
  },
  "START_SEARCH": {
    "简体中文": "开始搜索",
    "English": "Search",
    "日本語": "検索"
  },
  "KEYWORD": {
    "简体中文": "关键词",
    "English": "Keyword",
    "日本語": "キーワード"
  },
  "SEARCH_RESULT": {
    "简体中文": "搜索结果",
    "English": "Results",
    "日本語": "検索結果"
  },
  "REFERENCE": {
    "简体中文": "参考",
    "English": "References",
    "日本語": "References"
  },
  "INFO": {
    "简体中文": "提示",
    "English": "Hint",
    "日本語": "Hint"
  },
  "WARNING": {
    "简体中文": "注意",
    "English": "Warning",
    "日本語": "Warning"
  },
  "SUCCESS": {
    "简体中文": "成功",
    "English": "Success",
    "日本語": "Success"
  },
  "DANGER": {
    "简体中文": "危险",
    "English": "Danger",
    "日本語": "Danger"
  },
  "COULD_NOT_FIND_RESULT": {
    "简体中文": "未找到结果",
    "English": "Could not find a result",
    "日本語": "検索結果はありません"
  }
}

function render_ref_tags() {
  let ref_tags = [];
  let current_number = 1;
  for (let i = 0; i < document.getElementsByTagName("ref").length; i++) {
    let ref = document.getElementsByTagName("ref")[i];
    ref_tags.push({
      "ref_name": ref.innerText,
      "ref_id": current_number,
      "ref_has_target": ref.getAttribute("url") !== undefined && ref.getAttribute("url") !== null && ref.getAttribute("url") !== ""
    });
    document.getElementsByTagName("ref")[i].innerHTML = `<sup style="font-size: 14px;"><a href="#reference_list_id_${current_number}">[${current_number}]</a></sup>`;
    document.getElementsByTagName("ref")[i].setAttribute("style", "display:inline");
    document.getElementsByTagName("ref")[i].setAttribute("id", `reference_id_${current_number}`);
    if (ref_tags[ref_tags.length - 1].ref_has_target === true) {
      ref_tags[ref_tags.length - 1].ref_target = ref.getAttribute("url");
    }
    current_number += 1;
  }

  if (ref_tags.length !== 0) {
    ref_html = `<div id="content_reference_list"><h3>${langdata.REFERENCE[lang_name]}</h3><hr />`;
    for (const ref of ref_tags) {
      ref_html += `<div id="reference_list_id_${ref.ref_id}"><b>${ref.ref_id}.<a href="#reference_id_${ref.ref_id}">^</a></b>&nbsp;  ${ref.ref_has_target === false?ref.ref_name:`<a href="${ref.ref_target}" target="_blank">${ref.ref_name}</a>`} </div>`;
    }
    ref_html += `</div>`;
    document.getElementById("article-content-html").innerHTML += ref_html;
  }
}

function render_hint_tags() {
  for (let i = 0; i < document.getElementsByTagName("info-hint").length; i++) {
    document.getElementsByTagName("info-hint")[i].innerHTML = `<span class="hint-heading"><i class="fa fa-info-circle"></i> ${langdata["INFO"][lang_name]} </span><br />` + document.getElementsByTagName("info-hint")[i].innerHTML;
  }
  for (let i = 0; i < document.getElementsByTagName("warning-hint").length; i++) {
    document.getElementsByTagName("warning-hint")[i].innerHTML = `<span class="hint-heading"><i class="fa fa-exclamation-circle"></i> ${langdata["WARNING"][lang_name]} </span><br />` + document.getElementsByTagName("warning-hint")[i].innerHTML;
  }
  for (let i = 0; i < document.getElementsByTagName("danger-hint").length; i++) {
    document.getElementsByTagName("danger-hint")[i].innerHTML = `<span class="hint-heading"><i class="fa fa-exclamation-triangle"></i> ${langdata["DANGER"][lang_name]} </span><br />` + document.getElementsByTagName("danger-hint")[i].innerHTML;
  }
  for (let i = 0; i < document.getElementsByTagName("success-hint").length; i++) {
    document.getElementsByTagName("success-hint")[i].innerHTML = `<span class="hint-heading"><i class="fa fa-check-circle-o"></i> ${langdata["SUCCESS"][lang_name]} </span><br />` + document.getElementsByTagName("success-hint")[i].innerHTML;
  }
}



function preview_env_public_comment_fix() {
  if (window.location.href.indexOf("localhost") !== -1 || window.location.href.indexOf("127.0.0.1") !== -1) {
    if (blog["全局评论设置"]["valine设置"]["是否使用bbg公共评论服务"]) {
      document.getElementById("vcomments").innerHTML = `<p style="color:red;">${langdata["COMMENT_UNAVAILABLE_DUE_TO_PREVIEW"][lang_name]}</p>`;
    }
  }
}

function resetPage() {
  document.querySelector("#root").innerHTML = "";
  console.log("reset ok");
}

function start_search() {
  let keyword = document.getElementById("search_keyword").value.toLowerCase();
  let totalSearchResultNumber = 0;

  document.getElementById("search_dialog_results").innerHTML = `
      <br /><hr />
      `;

  if (history.state.type === "article" || history.state.type === "short_article") {
    // 在文章内检索
    let articleContent = document.querySelector("#article-content-html").innerText.toLowerCase();
    if (articleContent.indexOf(keyword) !== -1) {
      document.getElementById("search_dialog_results").innerHTML += `
          <h3>在当前文章中找到了一处结果</h3>
          <div class="card" style="padding:20px">
            <a href="javascript:void(0)" data-bs-dismiss="modal" onclick="return false;"><h5>${document.getElementById("current_article_title").innerText}</h5></a>
            <p class="search_result_detail">${articleContent.substring(articleContent.indexOf(keyword)-20, articleContent.indexOf(keyword)+20)}</p>
          </div>
          `;

      totalSearchResultNumber++;
    }

  }

  document.getElementById("search_dialog_results").innerHTML += `
      <br />
          <h3>全部搜索结果</h3>
      <br />
          `;

  for (let i = 0; i < blog["文章列表"].length; i++) {
    if (blog["文章列表"][i]["是否是短文章"]) {
      const articleTitle = blog["文章列表"][i]["文章标题"].toLowerCase();
      const articleContent = blog["文章列表"][i]["文章内容"].toLowerCase();
      if (articleTitle.indexOf(keyword) !== -1 || articleContent.indexOf(keyword) !== -1) {
        if (blog["文章列表"][i]["是否隐藏"] === false) {
          document.getElementById("search_dialog_results").innerHTML += `
          <div class="card" style="padding:20px">
            <a href="javascript:void(0)" data-bs-dismiss="modal" onclick="enter_article(${i});return false;"><h5>${blog["文章列表"][i]["文章标题"]}</h5></a>
            <p class="search_result_detail">${blog["文章列表"][i]["文章内容"]}</p>
            </div>

          `;
          totalSearchResultNumber++;
        }
      }
    } else {
      const articleTitle = blog["文章列表"][i]["文章标题"].toLowerCase();
      const articleAbstract = blog["文章列表"][i]["摘要"].toLowerCase();
      if (articleTitle.indexOf(keyword) !== -1 || articleAbstract.indexOf(keyword) !== -1) {
        if (blog["文章列表"][i]["是否隐藏"] === false) {
          document.getElementById("search_dialog_results").innerHTML += `
          <div class="card" style="padding:20px">
            <a href="javascript:void(0)" data-bs-dismiss="modal" onclick="enter_article(${i});return false;"><h5>${blog["文章列表"][i]["文章标题"]}</h5></a>
            <p class="search_result_detail">${blog["文章列表"][i]["摘要"]}</p>
            </div>

          `;
          totalSearchResultNumber++;
        }
      }
    }

  }
  if (totalSearchResultNumber === 0) {
    document.getElementById("search_dialog_results").innerHTML += `
          <br />
          <p>${langdata["COULD_NOT_FIND_RESULT"][lang_name]}</p>

          `;
  } else {
    for (let i = 0; i < document.getElementsByClassName("search_result_detail").length; i++) {
      document.getElementsByClassName("search_result_detail")[i].innerHTML = document.getElementsByClassName("search_result_detail")[i].innerHTML.replaceAll(keyword, `<span style="background-color:yellow">${keyword}</span>`)
    }
  }
}

function start_search_dialog() {
  const dialog = new bootstrap.Modal(document.getElementById('search_dialog'))
  dialog.toggle();

  document.getElementById("search_dialog_title").innerHTML = langdata["SEARCH_SOMETHING"][lang_name];
  document.getElementById("search_dialog_body").innerHTML = `

      <div class="row g-2">
  <div class="col-auto">
    <input class="form-control" id="search_keyword" placeholder="${langdata["KEYWORD"][lang_name]}" autocomplete="off" autocapitalize="off" spellcheck="false">
  </div>
  <div class="col-auto">
    <button class="btn btn-primary" onclick="start_search()"> ${langdata["START_SEARCH"][lang_name]}</button>
  </div>
</div>

<div id="search_dialog_results">
  
  </div>
      
      `;
  document.getElementById("search_keyword").focus();
  document.getElementById("search_keyword").addEventListener('input', start_search);
}

function render_nav(isIndexPage) {
  //todo: fix router
  let nav_base = `<nav class="navbar fixed-top navbar-expand-lg navbar-light bg-light" id="navbar">
  <div class="container-fluid">
    <a class="navbar-brand" id="navbar_title" href="./index.html" onclick="enter_indexPage();return false;">${blog["博客标题"]}</a>
    <button class="navbar-toggler" style="border:none;color:white;margin-left:2px" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
          <i class="fa fa-bars"></i>
    </button>
    <div class="collapse navbar-collapse" id="navbarSupportedContent">
      <ul class="navbar-nav me-auto mb-2 mb-lg-0" id="navbar_items">
        <li class="nav-item" id="navbar_article_list">
          <a class="nav-link" href="./index.html?type=internal&function=article_list" onclick="enter_indexPage();return false;">${langdata["ARTICLE_LIST"][lang_name]}</a>
        </li>
        <li class="nav-item" id="navbar_archive_and_tags">
          <a class="nav-link" href="./index.html?type=internal&function=archive_and_tags" onclick="enter_archive_and_tags();return false;">${langdata["ARCHIVE_AND_TAGS"][lang_name]}</a>
        </li>

      </ul>
      <div class="d-flex" role="search">
	  <button class="btn btn-outline-${blog["搜索按钮边框颜色设置为暗色"] ? "dark" : "light"}" onclick="start_search_dialog()" style="color: ${blog["全局主题设置"]["标题栏文字颜色"]}"><i class="fa fa-search"></i> ${langdata["SEARCH_SOMETHING"][lang_name]}</button>
      </div>
      <div class="d-flex">
         <div style="display:block;padding:2px"></div>
      </div>
    </div>
  </div>
</nav>`;
  document.querySelector("#root").innerHTML += nav_base;

  document
    .querySelector("#navbar_title")
    .setAttribute(
      "style",
      "color:" + blog["全局主题设置"]["标题栏文字颜色"] + "!important"
    );

  if (isIndexPage) {
    document.querySelector("#navbar_title").innerHTML = "";
  }

  if (blog["页面列表"].length === 0) {} else {
    for (let i = 0; i < blog["页面列表"].length; i++) {
      if (blog["页面列表"][i]["是否显示在菜单中"]) {
        document.querySelector("#navbar_items").innerHTML += `
                        <li class="nav-item" id="navbar_page_${i}">
                            <a class="nav-link" href="./index.html?type=page&filename=${blog["页面列表"][i]["文件名"]}" onclick="enter_page(${i});return false;">${blog["页面列表"][i]["若显示在菜单中，则在菜单中显示为"]}</a>
                        </li>
                        `;
      }
    }
  }

  if (blog["启用内建友人帐页面"] === true) {
    document.querySelector("#navbar_items").innerHTML += `
                        <li class="nav-item" id="navbar_friendbook">
                            <a class="nav-link" href="./index.html?type=internal&function=friendbook" onclick="enter_friend_book();return false;">${langdata.FRIEND_BOOK[lang_name]}</a>
                        </li>
            `;

  }

  if (blog["菜单中的外部链接"].length === 0) {} else {
    for (let i = 0; i < blog["菜单中的外部链接"].length; i++) {
      if (blog["菜单中的外部链接"][i]["是否在新标签页打开"]) {
        document.querySelector("#navbar_items").innerHTML += `
                        <li class="nav-item">
                            <a class="nav-link" target="_blank" href="${blog["菜单中的外部链接"][i]["url"]}">${blog["菜单中的外部链接"][i]["显示名称"]}</a>
                        </li>
                        `;
      } else {
        document.querySelector("#navbar_items").innerHTML += `
                        <li class="nav-item">
                            <a class="nav-link" href="${blog["菜单中的外部链接"][i]["url"]}">${blog["菜单中的外部链接"][i]["显示名称"]}</a>
                        </li>
                        `;
      }
    }
  }

  document
    .querySelector("#navbar")
    .setAttribute(
      "style",
      "background-color:" +
      blog["全局主题设置"]["标题栏背景颜色"] +
      "!important"
    );

  for (
    let i = 0; i < document.getElementsByClassName("nav-link").length; i++
  ) {
    document
      .getElementsByClassName("nav-link")[i].setAttribute(
        "style",
        "color:" + blog["全局主题设置"]["标题栏文字颜色"] + "!important"
      );
  }
}

function render_container() {
  document.querySelector(
    "#root"
  ).innerHTML += `<div id="container" class="container" style="animation: fade-in-right alternate 0.8s;"><br /><br /><br /></div>`;
}

function render_index_title_info() {
  document.querySelector(
    "#container"
  ).innerHTML += `<br /><h1 id="blog_index_title">${blog["博客标题"]}</h1><p id="blog_index_subtitle">${blog["博客描述（副标题）"]}</p><hr />
        `;

  if (blog["启用网站公告"] === true) {
    document.querySelector("#container").innerHTML += `
          
          <div class="article-item">
          <h3><i class="fa fa-bullhorn" aria-hidden="true"></i> 网站公告</h3>
          ${blog["网站公告"]}
        
        </div>
          `
  }
}

function changeArticleListPageOrderTo(page_order) {
  currentArticleListPageOrder = page_order;
  enter_indexPage();
  scrollTo(0, 0);
}

function init_article_metadata() {
  let lst = blog["文章列表"],
    arc;
  for (let i = 0; i < lst.length; i++) {
    arc = lst[i];
    arc["是否是短文章"] = false;
  }
}

function render_article_list() {
  init_article_metadata();
  for (let i = 0; i < blog["文章列表"].length; i++) {
    if (blog["文章列表"][i]["是否置顶"] && currentArticleListPageOrder === 1 && blog["文章列表"][i]["是否是短文章"] === false) {
      document.querySelector("#container").innerHTML += `
                    <div class="article-item" id="article-item-${i}">
                        <div class="article-item-sub"><i class="fa fa-thumb-tack"></i> 置顶文章</div>
                        <h2><a href="./index.html?type=article&filename=${blog["文章列表"][i]["文件名"]}" onclick="enter_article(${i});return false;">${blog["文章列表"][i]["文章标题"]}</a></h2>
                       
                        
                    </div>
                        `;
    } else if (blog["文章列表"][i]["是否置顶"] && currentArticleListPageOrder === 1 && blog["文章列表"][i]["是否是短文章"] === true) {
      document.querySelector("#container").innerHTML += `
                    <div class="article-item" id="article-item-${i}">
                        <div class="article-item-sub"><i class="fa fa-thumb-tack"></i> 置顶文章</div>
                        <h2>${blog["文章列表"][i]["文章标题"]}</h2>
                       <div>
                        ${marked.parse(blog["文章列表"][i]["文章内容"])}
                        </div>
                        
                    </div>
                        `;
    }
  }

  // 注意：这里的两个 order 变量都是从1开始数的

  let currentArticleListFromOrder = (currentArticleListPageOrder - 1) * blog["文章列表中每页的文章数为"] + 1;
  let currentArticleListToOrder = currentArticleListPageOrder * blog["文章列表中每页的文章数为"];

  for (let i = currentArticleListFromOrder - 1; i < currentArticleListToOrder && i < blog["文章列表"].length; i++) {
    if (
      blog["文章列表"][i]["是否隐藏"] ||
      blog["文章列表"][i]["是否置顶"]
    ) {} else {

      if (blog["文章列表"][i]["是否是短文章"]) {
        document.querySelector("#container").innerHTML += `
                    <div class="article-item" id="article-item-${i}">
                        <h2>${blog["文章列表"][i]["文章标题"]} <span class="badge bg-primary" style="font-size:16px">短文章</span></h2>
                       
                        
                    </div>
                        `;

      } else {
        document.querySelector("#container").innerHTML += `
                    <div class="article-item" id="article-item-${i}">
                        <h2><a href="./index.html?type=article&filename=${blog["文章列表"][i]["文件名"]}" onclick="enter_article(${i});return false;">${blog["文章列表"][i]["文章标题"]}</a></h2>
                       
                        
                    </div>
                        `;
      }


      document.querySelector("#article-item-" + i).innerHTML += `
                            <div class="article-item-sub" id="article-item-sub-${i}"></div>
                            `;

      document.querySelector("#article-item-sub-" + i).innerHTML += `
                            <i class="fa fa-calendar"></i> ${langdata["ARTICLE_CREATEDAT"][lang_name]}${blog["文章列表"][i]["创建日期"]}，<i class="fa fa-clock-o"></i> ${langdata["LASTMODIFIEDAT"][lang_name]}${blog["文章列表"][i]["修改日期"]}<br />
                        `;

      if (blog["不使用全站内容授权协议"] !== true && blog["文章列表"][i]["是否是短文章"]) {
        document.querySelector("#article-item-sub-" + i).innerHTML += `
                    <i class="fa fa-copyright"></i> ${blogContentLicenseText}<br />
                            `;
      }


      if (blog["文章列表"][i]["标签"].length === 0) {} else {
        document.querySelector("#article-item-sub-" + i).innerHTML += `
                            <i class="fa fa-tags"></i> ${langdata["TAGS"][lang_name]}
                            `;

        for (let k = 0; k < blog["文章列表"][i]["标签"].length; k++) {
          document.querySelector("#article-item-sub-" + i).innerHTML += `
                                <a class="btn btn-dark btn-sm article_tag" style="background-color: ${getTagColor(blog["文章列表"][i]["标签"][k])}" href="./index.html?type=internal&function=tag&argument=${blog["文章列表"][i]["标签"][k]}" onclick="enter_tag('${blog["文章列表"][i]["标签"][k]}');return false;">${blog["文章列表"][i]["标签"][k]}</a>
                                `;
        }
      }


      if (blog["文章列表"][i]["是否是短文章"]) {
        document.querySelector("#article-item-" + i).innerHTML += `
                        <br /><div>${marked.parse(blog["文章列表"][i]["文章内容"])}</div>
                            `;
      } else {
        document.querySelector("#article-item-" + i).innerHTML += `
                        <br /><p>${blog["文章列表"][i]["摘要"]}</p>
                            `;
      }


      if (blog["文章列表"][i]["是否是短文章"] && blog["文章列表"][i]["启用评论"] && blog["全局评论设置"]["启用valine评论"] || blog["文章列表"][i]["是否是短文章"] && blog["文章列表"][i]["启用评论"] && blog["全局评论设置"]["启用disqus评论"]) {
        document.querySelector("#article-item-" + i).innerHTML += `
                    <br /><a class="btn btn-sm btn-outline-primary" href="./index.html?type=short_article&id=${blog["文章列表"][i]["标识符"]}" onclick="enter_article(${i});return false;"> <i class="fa fa-comments-o"></i> 在此文章下查看和添加评论</a>
                            `;
      }

    }
  }

  if (articleListPageLength !== 1) {

    for (let i = 0; i < articleListPageLength; i++) {
      if (i + 1 === currentArticleListPageOrder) {
        document.getElementById("container").innerHTML += `
          <button class="btn btn-primary btn-sm" onclick="changeArticleListPageOrderTo(${i + 1})">${i + 1}</button>
          
          `;
      } else {
        document.getElementById("container").innerHTML += `
            
            <button class="btn btn-secondary btn-sm" onclick="changeArticleListPageOrderTo(${i + 1})">${i + 1}</button>
            
            `;
      }
    }

    document.getElementById("container").innerHTML += `
        <br /><br />
        <p style="color:grey;" id="page_order_html">你当前正在浏览文章列表的第${currentArticleListPageOrder}页（共${articleListPageLength}页）。
</p>
        
        
        `;

  }
}

function render_friend_book_list() {
  for (let i = 0; i < blog["友人帐"].length; i++) {
    if ((i % 2) === 0) {
      render_friend_book_friend("friend_book_list1", blog["友人帐"][i]["名称"], blog["友人帐"][i]["链接"], blog["友人帐"][i]["图标"], blog["友人帐"][i]["简介"])
    } else {
      render_friend_book_friend("friend_book_list2", blog["友人帐"][i]["名称"], blog["友人帐"][i]["链接"], blog["友人帐"][i]["图标"], blog["友人帐"][i]["简介"])
    }
  }
}

function render_article_content(article_id) {

  if (blog["Markdown渲染配置"]["使用markdown文件所在目录作为baseurl"]) {
    baseurl = "/data/articles/"
  }

  if (blog["启用网站公告"] === true && blog["网站公告仅在首页显示"] === false) {
    document.querySelector("#container").innerHTML += `
          <div class="alert alert-primary">

            <i class="fa fa-bullhorn" aria-hidden="true"></i> 公告： ${blog["网站公告"]}
</div>
          `
  }

  document.querySelector("#container").innerHTML += `
        
        
            <div class="article-content" id="article-content">
                <h2 id="current_article_title"> ${blog["文章列表"][article_id]["文章标题"]}</h2>
                <div id="article-content-sub" class="article-content-sub">
                    <i class="fa fa-calendar"></i> ${langdata["ARTICLE_CREATEDAT"][lang_name]}${blog["文章列表"][article_id]["创建日期"]}，<i class="fa fa-clock-o"></i> ${langdata["LASTMODIFIEDAT"][lang_name]}${blog["文章列表"][article_id]["修改日期"]}
                </div>
            </div>
            `;

  if (blog["文章列表"][article_id]["标签"].length === 0) {} else {
    document.querySelector("#article-content-sub").innerHTML += `
        <br /><i class="fa fa-tags"></i> ${langdata["TAGS"][lang_name]}
        `;

    for (
      let k = 0; k < blog["文章列表"][article_id]["标签"].length; k++
    ) {
      //todo:fix router 2
      document.querySelector("#article-content-sub").innerHTML += `
            <a class="btn btn-dark btn-sm article_tag" style="background-color:${getTagColor(blog["文章列表"][article_id]["标签"][k])}" href="./index.html?type=internal&function=tag&argument=${blog["文章列表"][article_id]["标签"][k]}" onclick="enter_tag('${blog["文章列表"][article_id]["标签"][k]}');return false;">${blog["文章列表"][article_id]["标签"][k]}</a>
            `;
    }
  }

  document.querySelector(
    "#article-content-sub"
  ).innerHTML += `<br /><br />`;

  if (blog["文章列表"][article_id]["是否是短文章"]) {
    document.querySelector("#article-content").innerHTML += `
            <div id="article-content-html">${marked.parse(blog["文章列表"][article_id]["文章内容"])}</div>`;

    if (blog["提供文章文件下载"] || blog["提供复制全文到剪贴板的选项"]) {
      document.getElementById("article-content").innerHTML += `
            <br />
            <div style="float:right;font-size:18px" id="article-bottom-bar">
            
              </div><br />
            `
    }



    if (blog["提供文章文件下载"]) {
      document.getElementById("article-bottom-bar").innerHTML += `
              <a class="btn btn-primary" href="./data/articles/${blog["文章列表"][article_id]["文件名"]}" download="${blog["文章列表"][article_id]["文章标题"]}.md"><i class="fa fa-download"></i> 将该文章下载到你的计算机上</a>
            `;
    }

    if (blog["提供复制全文到剪贴板的选项"]) {
      document.getElementById("article-bottom-bar").innerHTML += `
              <a class="btn btn-primary" id="copy_to_clipboard_button" onclick="copy_full_article_to_clipboard();"><i class="fa fa-clipboard"></i> 复制全文到剪贴板</a>
            `;
    }

    if (blog["不使用全站内容授权协议"] === false) {
      document.querySelector(
        "#article-content"
      ).innerHTML += `<br />
            <div class="alert alert-info" role="alert">
              <h5 class="alert-heading">${langdata.COPYRIGHT_HINT[lang_name]}</h5>
            <p class="mb-0">${blogContentLicenseText}</p>
            </div>
            
            `;
    }

    if (blog["文章页面显示上一篇下一篇文章导航按钮"]) {


      if (article_id === 0 && blog["文章列表"][article_id + 1] != undefined && blog["文章列表"][article_id + 1]["是否隐藏"] !== true) {
        if (blog["文章列表"][article_id + 1]["是否是短文章"]) {
          document.getElementById("container").innerHTML += `
              <div class="row">
    <div class="col">
      <div class="card articlebottomnav" style="float:left;width:100%">
  <div class="card-body">
    <h6 class="card-subtitle mb-2 text-muted"><i class="fa fa-arrow-left"></i> ${langdata.PREVIOUS_POST[lang_name]}</h6>
    <h5 class="card-title"><a href="./index.html?type=short_article&id=${blog["文章列表"][article_id + 1]["标识符"]}" onclick="enter_article(${article_id + 1});return false;">${blog["文章列表"][article_id + 1]["文章标题"]}</a></h5>
  </div>
</div>
    </div>
    <div class="col">
      <div class="card articlebottomnav" style="float:right;text-align:right;width:100%">
  <div class="card-body">
    <h6 class="card-subtitle mb-2 text-muted">${langdata.NEXT_POST[lang_name]} <i class="fa fa-arrow-right"></i></h6>
    <h5 class="card-title">${langdata.NOTHING[lang_name]}</h5>
  </div>
</div>
    </div>
  </div>
     
            `
        } else {
          document.getElementById("container").innerHTML += `
              <div class="row">
    <div class="col">
      <div class="card articlebottomnav" style="float:left;width:100%">
  <div class="card-body">
    <h6 class="card-subtitle mb-2 text-muted"><i class="fa fa-arrow-left"></i> ${langdata.PREVIOUS_POST[lang_name]}</h6>
    <h5 class="card-title"><a href="./index.html?type=article&filename=${blog["文章列表"][article_id + 1]["文件名"]}" onclick="enter_article(${article_id + 1});return false;">${blog["文章列表"][article_id + 1]["文章标题"]}</a></h5>
  </div>
</div>
    </div>
    <div class="col">
      <div class="card articlebottomnav" style="float:right;text-align:right;width:100%">
  <div class="card-body">
    <h6 class="card-subtitle mb-2 text-muted">${langdata.NEXT_POST[lang_name]} <i class="fa fa-arrow-right"></i></h6>
    <h5 class="card-title">${langdata.NOTHING[lang_name]}</h5>
  </div>
</div>
    </div>
  </div>
     
            `
        }

      }

      if (article_id === 0 && blog["文章列表"][article_id + 1] == undefined) {
        document.getElementById("container").innerHTML += `
            <div class="row">
    <div class="col">
      <div class="card articlebottomnav" style="float:left;width:100%">
  <div class="card-body">
    <h6 class="card-subtitle mb-2 text-muted"><i class="fa fa-arrow-left"></i> ${langdata.PREVIOUS_POST[lang_name]}</h6>
    <h5 class="card-title">${langdata.NOTHING[lang_name]}</h5>
  </div>
</div>
    </div>
    <div class="col">
      <div class="card articlebottomnav" style="float:right;text-align:right;width:100%">
  <div class="card-body">
    <h6 class="card-subtitle mb-2 text-muted">${langdata.NEXT_POST[lang_name]} <i class="fa fa-arrow-right"></i></h6>
    <h5 class="card-title">${langdata.NOTHING[lang_name]}</h5>
  </div>
</div>
    </div>
  </div>
     
            `
      }

      if (article_id !== 0 && blog["文章列表"][article_id + 1] == undefined && blog["文章列表"][article_id - 1]["是否隐藏"] !== true) {
        if (blog["文章列表"][article_id - 1]["是否是短文章"]) {
          document.getElementById("container").innerHTML += `
              <div class="row">
    <div class="col">
      <div class="card articlebottomnav" style="float:left;width:100%">
  <div class="card-body">
    <h6 class="card-subtitle mb-2 text-muted"><i class="fa fa-arrow-left"></i> ${langdata.PREVIOUS_POST[lang_name]}</h6>
    <h5 class="card-title">${langdata.NOTHING[lang_name]}</h5>
  </div>
</div>
    </div>
    <div class="col">
      <div class="card articlebottomnav" style="float:right;text-align:right;width:100%">
  <div class="card-body">
    <h6 class="card-subtitle mb-2 text-muted">${langdata.NEXT_POST[lang_name]} <i class="fa fa-arrow-right"></i></h6>
    <h5 class="card-title"><a href="./index.html?type=short_article&id=${blog["文章列表"][article_id - 1]["标识符"]}" onclick="enter_article(${article_id - 1});return false;">${blog["文章列表"][article_id - 1]["文章标题"]}</a></h5>
  </div>
</div>
    </div>
  </div>
     
            `

        } else {
          document.getElementById("container").innerHTML += `
              <div class="row">
    <div class="col">
      <div class="card articlebottomnav" style="float:left;width:100%">
  <div class="card-body">
    <h6 class="card-subtitle mb-2 text-muted"><i class="fa fa-arrow-left"></i> ${langdata.PREVIOUS_POST[lang_name]}</h6>
    <h5 class="card-title">${langdata.NOTHING[lang_name]}</h5>
  </div>
</div>
    </div>
    <div class="col">
      <div class="card articlebottomnav" style="float:right;text-align:right;width:100%">
  <div class="card-body">
    <h6 class="card-subtitle mb-2 text-muted">${langdata.NEXT_POST[lang_name]} <i class="fa fa-arrow-right"></i></h6>
    <h5 class="card-title"><a href="./index.html?type=article&filename=${blog["文章列表"][article_id - 1]["文件名"]}" onclick="enter_article(${article_id - 1});return false;">${blog["文章列表"][article_id - 1]["文章标题"]}</a></h5>
  </div>
</div>
    </div>
  </div>
     
            `
        }

      }

      if (article_id !== 0 && blog["文章列表"][article_id + 1] != undefined && blog["文章列表"][article_id + 1]["是否隐藏"] !== true && blog["文章列表"][article_id - 1]["是否隐藏"] !== true) {
        if (blog["文章列表"][article_id + 1]["是否是短文章"] && blog["文章列表"][article_id - 1]["是否是短文章"]) {

          document.getElementById("container").innerHTML += `
              <div class="row">
    <div class="col">
      <div class="card articlebottomnav" style="float:left;width:100%">
  <div class="card-body">
    <h6 class="card-subtitle mb-2 text-muted"><i class="fa fa-arrow-left"></i> ${langdata.PREVIOUS_POST[lang_name]}</h6>
    <h5 class="card-title"><a href="./index.html?type=short_article&id=${blog["文章列表"][article_id + 1]["标识符"]}" onclick="enter_article(${article_id + 1});return false;">${blog["文章列表"][article_id + 1]["文章标题"]}</a></h5>
  </div>
</div>
    </div>
    <div class="col">
      <div class="card articlebottomnav" style="float:right;text-align:right;width:100%">
  <div class="card-body">
    <h6 class="card-subtitle mb-2 text-muted">${langdata.NEXT_POST[lang_name]} <i class="fa fa-arrow-right"></i></h6>
    <h5 class="card-title"><a href="./index.html?type=short_article&id=${blog["文章列表"][article_id - 1]["标识符"]}" onclick="enter_article(${article_id - 1});return false;">${blog["文章列表"][article_id - 1]["文章标题"]}</a></h5>
  </div>
</div>
    </div>
  </div>
     
            `
        } else if (blog["文章列表"][article_id + 1]["是否是短文章"] && blog["文章列表"][article_id - 1]["是否是短文章"] !== true) {
          document.getElementById("container").innerHTML += `
              <div class="row">
    <div class="col">
      <div class="card articlebottomnav" style="float:left;width:100%">
  <div class="card-body">
    <h6 class="card-subtitle mb-2 text-muted"><i class="fa fa-arrow-left"></i> ${langdata.PREVIOUS_POST[lang_name]}</h6>
    <h5 class="card-title"><a href="./index.html?type=short_article&id=${blog["文章列表"][article_id + 1]["标识符"]}" onclick="enter_article(${article_id + 1});return false;">${blog["文章列表"][article_id + 1]["文章标题"]}</a></h5>
  </div>
</div>
    </div>
    <div class="col">
      <div class="card articlebottomnav" style="float:right;text-align:right;width:100%">
  <div class="card-body">
    <h6 class="card-subtitle mb-2 text-muted">${langdata.NEXT_POST[lang_name]} <i class="fa fa-arrow-right"></i></h6>
    <h5 class="card-title"><a href="./index.html?type=article&filename=${blog["文章列表"][article_id - 1]["文件名"]}" onclick="enter_article(${article_id - 1});return false;">${blog["文章列表"][article_id - 1]["文章标题"]}</a></h5>
  </div>
</div>
    </div>
  </div>
     
            `
        } else if (blog["文章列表"][article_id + 1]["是否是短文章"] !== true && blog["文章列表"][article_id - 1]["是否是短文章"]) {
          document.getElementById("container").innerHTML += `
              <div class="row">
    <div class="col">
      <div class="card articlebottomnav" style="float:left;width:100%">
  <div class="card-body">
    <h6 class="card-subtitle mb-2 text-muted"><i class="fa fa-arrow-left"></i> ${langdata.PREVIOUS_POST[lang_name]}</h6>
    <h5 class="card-title"><a href="./index.html?type=article&filename=${blog["文章列表"][article_id + 1]["文件名"]}" onclick="enter_article(${article_id + 1});return false;">${blog["文章列表"][article_id + 1]["文章标题"]}</a></h5>
  </div>
</div>
    </div>
    <div class="col">
      <div class="card articlebottomnav" style="float:right;text-align:right;width:100%">
  <div class="card-body">
    <h6 class="card-subtitle mb-2 text-muted">${langdata.NEXT_POST[lang_name]} <i class="fa fa-arrow-right"></i></h6>
    <h5 class="card-title"><a href="./index.html?type=short_article&id=${blog["文章列表"][article_id - 1]["标识符"]}" onclick="enter_article(${article_id - 1});return false;">${blog["文章列表"][article_id - 1]["文章标题"]}</a></h5>
  </div>
</div>
    </div>
  </div>
     
            `
        } else if (blog["文章列表"][article_id + 1]["是否是短文章"] !== true && blog["文章列表"][article_id - 1]["是否是短文章"] !== true) {
          document.getElementById("container").innerHTML += `
              <div class="row">
    <div class="col">
      <div class="card articlebottomnav" style="float:left;width:100%">
  <div class="card-body">
    <h6 class="card-subtitle mb-2 text-muted"><i class="fa fa-arrow-left"></i> ${langdata.PREVIOUS_POST[lang_name]}</h6>
    <h5 class="card-title"><a href="./index.html?type=article&filename=${blog["文章列表"][article_id + 1]["文件名"]}" onclick="enter_article(${article_id + 1});return false;">${blog["文章列表"][article_id + 1]["文章标题"]}</a></h5>
  </div>
</div>
    </div>
    <div class="col">
      <div class="card articlebottomnav" style="float:right;text-align:right;width:100%">
  <div class="card-body">
    <h6 class="card-subtitle mb-2 text-muted">${langdata.NEXT_POST[lang_name]} <i class="fa fa-arrow-right"></i></h6>
    <h5 class="card-title"><a href="./index.html?type=article&filename=${blog["文章列表"][article_id - 1]["标识符"]}" onclick="enter_article(${article_id - 1});return false;">${blog["文章列表"][article_id - 1]["文章标题"]}</a></h5>
  </div>
</div>
    </div>
  </div>
     
            `
        }

      }

    }




    if (
      blog["全局评论设置"]["启用valine评论"] &&
      blog["文章列表"][article_id]["启用评论"] ||
      blog["全局评论设置"]["启用disqus评论"] &&
      blog["文章列表"][article_id]["启用评论"]
    ) {
      document.querySelector(
        "#container"
      ).innerHTML += `<div class="bbg-comment-area"><h3><i class="fa fa-comments-o"></i> 在此文章 《${blog["文章列表"][article_id]["文章标题"]}》 下评论：</h3><br /><div id="vcomments"></div><div id="disqus_thread"></div></div>`;
    }

    render_bottom_information();
    execute_custom_js();

    content_load_finished = true;
    detect_whether_ui_load_finished();

    if (
      blog["全局评论设置"]["启用valine评论"] &&
      blog["文章列表"][article_id]["启用评论"]
    ) {
      new Valine({
        el: "#vcomments",
        appId: blog["全局评论设置"]["valine设置"]["leancloud_appid"],
        appKey: blog["全局评论设置"]["valine设置"]["leancloud_appkey"],
        path: comment_authcode +
          "short_article=" +
          blog["文章列表"][article_id]["标识符"],
      });

      preview_env_public_comment_fix();
    }

    if (blog["全局评论设置"]["启用disqus评论"] &&
      blog["文章列表"][article_id]["启用评论"]) {
      let disqus_config = function() {
        this.page.identifier = "short_article=" + blog["文章列表"][article_id]["标识符"];
      };
      (function() {
        let d = document,
          s = d.createElement('script');
        s.src = `https://${blog["全局评论设置"]["disqus设置"]["shortname"]}.disqus.com/embed.js`;
        s.setAttribute('data-timestamp', +new Date());
        (d.head || d.body).appendChild(s);
      })();
    }
  } else {
    axios
      .get(
        "./data/articles/" +
        blog["文章列表"][article_id]["文件名"] +
        "?timestamp=" +
        Date.parse(new Date())
      )
      .then(function(response) {
        document.querySelector("#article-content").innerHTML += `
            <div id="article-content-html">${marked.parse(response.data)}</div>`;

        render_ref_tags();
        render_hint_tags();

        renderMathInElement(document.getElementById("article-content-html"), {
          delimiters: [{
              left: '$$$',
              right: '$$$',
              display: true
            },
            {
              left: '$$',
              right: '$$',
              display: true
            },
            {
              left: '$',
              right: '$',
              display: false
            },
          ],
          throwOnError: false
        });
        if (blog["提供文章文件下载"] || blog["提供复制全文到剪贴板的选项"]) {
          document.getElementById("article-content").innerHTML += `
            <br />
            <div style="float:right;font-size:18px" id="article-bottom-bar">
            
              </div><br />
            `
        }



        if (blog["提供文章文件下载"]) {
          document.getElementById("article-bottom-bar").innerHTML += `
              <a class="btn btn-primary" href="./data/articles/${blog["文章列表"][article_id]["文件名"]}" download="${blog["文章列表"][article_id]["文章标题"]}.md"><i class="fa fa-download"></i> 将该文章下载到你的计算机上</a>
            `;
        }

        if (blog["提供复制全文到剪贴板的选项"]) {
          document.getElementById("article-bottom-bar").innerHTML += `
              <a class="btn btn-primary" id="copy_to_clipboard_button" onclick="copy_full_article_to_clipboard();"><i class="fa fa-clipboard"></i> 复制全文到剪贴板</a>
            `;
        }

        if (blog["不使用全站内容授权协议"] === false) {
          document.querySelector(
            "#article-content"
          ).innerHTML += `<br />
            <div class="alert alert-info" role="alert">
              <h5 class="alert-heading">${langdata.COPYRIGHT_HINT[lang_name]}</h5>
            <p class="mb-0">${blogContentLicenseText}</p>
            </div>
            
            `;
        }

        if (blog["文章页面显示上一篇下一篇文章导航按钮"]) {


          if (article_id === 0 && blog["文章列表"][article_id + 1] != undefined && blog["文章列表"][article_id + 1]["是否隐藏"] !== true) {
            if (blog["文章列表"][article_id + 1]["是否是短文章"]) {
              document.getElementById("container").innerHTML += `
  <div class="row">
<div class="col">
<div class="card articlebottomnav" style="float:left;width:100%">
<div class="card-body">
<h6 class="card-subtitle mb-2 text-muted"><i class="fa fa-arrow-left"></i> ${langdata.PREVIOUS_POST[lang_name]}</h6>
<h5 class="card-title"><a href="./index.html?type=short_article&id=${blog["文章列表"][article_id + 1]["标识符"]}" onclick="enter_article(${article_id + 1});return false;">${blog["文章列表"][article_id + 1]["文章标题"]}</a></h5>
</div>
</div>
</div>
<div class="col">
<div class="card articlebottomnav" style="float:right;text-align:right;width:100%">
<div class="card-body">
<h6 class="card-subtitle mb-2 text-muted">${langdata.NEXT_POST[lang_name]} <i class="fa fa-arrow-right"></i></h6>
<h5 class="card-title">${langdata.NOTHING[lang_name]}</h5>
</div>
</div>
</div>
</div>

`
            } else {
              document.getElementById("container").innerHTML += `
  <div class="row">
<div class="col">
<div class="card articlebottomnav" style="float:left;width:100%">
<div class="card-body">
<h6 class="card-subtitle mb-2 text-muted"><i class="fa fa-arrow-left"></i> ${langdata.PREVIOUS_POST[lang_name]}</h6>
<h5 class="card-title"><a href="./index.html?type=article&filename=${blog["文章列表"][article_id + 1]["文件名"]}" onclick="enter_article(${article_id + 1});return false;">${blog["文章列表"][article_id + 1]["文章标题"]}</a></h5>
</div>
</div>
</div>
<div class="col">
<div class="card articlebottomnav" style="float:right;text-align:right;width:100%">
<div class="card-body">
<h6 class="card-subtitle mb-2 text-muted">${langdata.NEXT_POST[lang_name]} <i class="fa fa-arrow-right"></i></h6>
<h5 class="card-title">${langdata.NOTHING[lang_name]}</h5>
</div>
</div>
</div>
</div>

`
            }

          }

          if (article_id === 0 && blog["文章列表"][article_id + 1] == undefined) {
            document.getElementById("container").innerHTML += `
<div class="row">
<div class="col">
<div class="card articlebottomnav" style="float:left;width:100%">
<div class="card-body">
<h6 class="card-subtitle mb-2 text-muted"><i class="fa fa-arrow-left"></i> ${langdata.PREVIOUS_POST[lang_name]}</h6>
<h5 class="card-title">${langdata.NOTHING[lang_name]}</h5>
</div>
</div>
</div>
<div class="col">
<div class="card articlebottomnav" style="float:right;text-align:right;width:100%">
<div class="card-body">
<h6 class="card-subtitle mb-2 text-muted">${langdata.NEXT_POST[lang_name]} <i class="fa fa-arrow-right"></i></h6>
<h5 class="card-title">${langdata.NOTHING[lang_name]}</h5>
</div>
</div>
</div>
</div>

`
          }

          if (article_id !== 0 && blog["文章列表"][article_id + 1] == undefined && blog["文章列表"][article_id - 1]["是否隐藏"] !== true) {
            if (blog["文章列表"][article_id - 1]["是否是短文章"]) {
              document.getElementById("container").innerHTML += `
  <div class="row">
<div class="col">
<div class="card articlebottomnav" style="float:left;width:100%">
<div class="card-body">
<h6 class="card-subtitle mb-2 text-muted"><i class="fa fa-arrow-left"></i> ${langdata.PREVIOUS_POST[lang_name]}</h6>
<h5 class="card-title">${langdata.NOTHING[lang_name]}</h5>
</div>
</div>
</div>
<div class="col">
<div class="card articlebottomnav" style="float:right;text-align:right;width:100%">
<div class="card-body">
<h6 class="card-subtitle mb-2 text-muted">${langdata.NEXT_POST[lang_name]} <i class="fa fa-arrow-right"></i></h6>
<h5 class="card-title"><a href="./index.html?type=short_article&id=${blog["文章列表"][article_id - 1]["标识符"]}" onclick="enter_article(${article_id - 1});return false;">${blog["文章列表"][article_id - 1]["文章标题"]}</a></h5>
</div>
</div>
</div>
</div>

`

            } else {
              document.getElementById("container").innerHTML += `
  <div class="row">
<div class="col">
<div class="card articlebottomnav" style="float:left;width:100%">
<div class="card-body">
<h6 class="card-subtitle mb-2 text-muted"><i class="fa fa-arrow-left"></i> ${langdata.PREVIOUS_POST[lang_name]}</h6>
<h5 class="card-title">${langdata.NOTHING[lang_name]}</h5>
</div>
</div>
</div>
<div class="col">
<div class="card articlebottomnav" style="float:right;text-align:right;width:100%">
<div class="card-body">
<h6 class="card-subtitle mb-2 text-muted">${langdata.NEXT_POST[lang_name]} <i class="fa fa-arrow-right"></i></h6>
<h5 class="card-title"><a href="./index.html?type=article&filename=${blog["文章列表"][article_id - 1]["文件名"]}" onclick="enter_article(${article_id - 1});return false;">${blog["文章列表"][article_id - 1]["文章标题"]}</a></h5>
</div>
</div>
</div>
</div>

`
            }

          }

          if (article_id !== 0 && blog["文章列表"][article_id + 1] != undefined && blog["文章列表"][article_id + 1]["是否隐藏"] !== true && blog["文章列表"][article_id - 1]["是否隐藏"] !== true) {
            if (blog["文章列表"][article_id + 1]["是否是短文章"] && blog["文章列表"][article_id - 1]["是否是短文章"]) {

              document.getElementById("container").innerHTML += `
  <div class="row">
<div class="col">
<div class="card articlebottomnav" style="float:left;width:100%">
<div class="card-body">
<h6 class="card-subtitle mb-2 text-muted"><i class="fa fa-arrow-left"></i> ${langdata.PREVIOUS_POST[lang_name]}</h6>
<h5 class="card-title"><a href="./index.html?type=short_article&id=${blog["文章列表"][article_id + 1]["标识符"]}" onclick="enter_article(${article_id + 1});return false;">${blog["文章列表"][article_id + 1]["文章标题"]}</a></h5>
</div>
</div>
</div>
<div class="col">
<div class="card articlebottomnav" style="float:right;text-align:right;width:100%">
<div class="card-body">
<h6 class="card-subtitle mb-2 text-muted">${langdata.NEXT_POST[lang_name]} <i class="fa fa-arrow-right"></i></h6>
<h5 class="card-title"><a href="./index.html?type=short_article&id=${blog["文章列表"][article_id - 1]["标识符"]}" onclick="enter_article(${article_id - 1});return false;">${blog["文章列表"][article_id - 1]["文章标题"]}</a></h5>
</div>
</div>
</div>
</div>

`
            } else if (blog["文章列表"][article_id + 1]["是否是短文章"] && blog["文章列表"][article_id - 1]["是否是短文章"] !== true) {
              document.getElementById("container").innerHTML += `
  <div class="row">
<div class="col">
<div class="card articlebottomnav" style="float:left;width:100%">
<div class="card-body">
<h6 class="card-subtitle mb-2 text-muted"><i class="fa fa-arrow-left"></i> ${langdata.PREVIOUS_POST[lang_name]}</h6>
<h5 class="card-title"><a href="./index.html?type=short_article&id=${blog["文章列表"][article_id + 1]["标识符"]}" onclick="enter_article(${article_id + 1});return false;">${blog["文章列表"][article_id + 1]["文章标题"]}</a></h5>
</div>
</div>
</div>
<div class="col">
<div class="card articlebottomnav" style="float:right;text-align:right;width:100%">
<div class="card-body">
<h6 class="card-subtitle mb-2 text-muted">${langdata.NEXT_POST[lang_name]} <i class="fa fa-arrow-right"></i></h6>
<h5 class="card-title"><a href="./index.html?type=article&filename=${blog["文章列表"][article_id - 1]["文件名"]}" onclick="enter_article(${article_id - 1});return false;">${blog["文章列表"][article_id - 1]["文章标题"]}</a></h5>
</div>
</div>
</div>
</div>

`
            } else if (blog["文章列表"][article_id + 1]["是否是短文章"] !== true && blog["文章列表"][article_id - 1]["是否是短文章"]) {
              document.getElementById("container").innerHTML += `
  <div class="row">
<div class="col">
<div class="card articlebottomnav" style="float:left;width:100%">
<div class="card-body">
<h6 class="card-subtitle mb-2 text-muted"><i class="fa fa-arrow-left"></i> ${langdata.PREVIOUS_POST[lang_name]}</h6>
<h5 class="card-title"><a href="./index.html?type=article&filename=${blog["文章列表"][article_id + 1]["文件名"]}" onclick="enter_article(${article_id + 1});return false;">${blog["文章列表"][article_id + 1]["文章标题"]}</a></h5>
</div>
</div>
</div>
<div class="col">
<div class="card articlebottomnav" style="float:right;text-align:right;width:100%">
<div class="card-body">
<h6 class="card-subtitle mb-2 text-muted">${langdata.NEXT_POST[lang_name]} <i class="fa fa-arrow-right"></i></h6>
<h5 class="card-title"><a href="./index.html?type=short_article&id=${blog["文章列表"][article_id - 1]["标识符"]}" onclick="enter_article(${article_id - 1});return false;">${blog["文章列表"][article_id - 1]["文章标题"]}</a></h5>
</div>
</div>
</div>
</div>

`
            } else if (blog["文章列表"][article_id + 1]["是否是短文章"] !== true && blog["文章列表"][article_id - 1]["是否是短文章"] !== true) {
              document.getElementById("container").innerHTML += `
  <div class="row">
<div class="col">
<div class="card articlebottomnav" style="float:left;width:100%">
<div class="card-body">
<h6 class="card-subtitle mb-2 text-muted"><i class="fa fa-arrow-left"></i> ${langdata.PREVIOUS_POST[lang_name]}</h6>
<h5 class="card-title"><a href="./index.html?type=article&filename=${blog["文章列表"][article_id + 1]["文件名"]}" onclick="enter_article(${article_id + 1});return false;">${blog["文章列表"][article_id + 1]["文章标题"]}</a></h5>
</div>
</div>
</div>
<div class="col">
<div class="card articlebottomnav" style="float:right;text-align:right;width:100%">
<div class="card-body">
<h6 class="card-subtitle mb-2 text-muted">${langdata.NEXT_POST[lang_name]} <i class="fa fa-arrow-right"></i></h6>
<h5 class="card-title"><a href="./index.html?type=article&filename=${blog["文章列表"][article_id - 1]["标识符"]}" onclick="enter_article(${article_id - 1});return false;">${blog["文章列表"][article_id - 1]["文章标题"]}</a></h5>
</div>
</div>
</div>
</div>

`
            }

          }

        }




        if (
          blog["全局评论设置"]["启用valine评论"] &&
          blog["文章列表"][article_id]["启用评论"] ||
          blog["全局评论设置"]["启用disqus评论"] &&
          blog["文章列表"][article_id]["启用评论"]
        ) {
          document.querySelector(
            "#container"
          ).innerHTML += `<div class="bbg-comment-area"><h3><i class="fa fa-comments-o"></i> 在此文章 《${blog["文章列表"][article_id]["文章标题"]}》 下评论：</h3><br /><div id="vcomments"></div><div id="disqus_thread"></div></div>`;
        }

        render_bottom_information();
        execute_custom_js();

        content_load_finished = true;
        detect_whether_ui_load_finished();

        if (
          blog["全局评论设置"]["启用valine评论"] &&
          blog["文章列表"][article_id]["启用评论"]
        ) {
          new Valine({
            el: "#vcomments",
            appId: blog["全局评论设置"]["valine设置"]["leancloud_appid"],
            appKey: blog["全局评论设置"]["valine设置"]["leancloud_appkey"],
            path: comment_authcode +
              "article=" +
              blog["文章列表"][article_id]["文件名"],
          });

          preview_env_public_comment_fix();

        }

        if (blog["全局评论设置"]["启用disqus评论"] &&
          blog["文章列表"][article_id]["启用评论"]) {
          let disqus_config = function() {
            this.page.identifier = "article=" + blog["文章列表"][article_id]["文件名"];
          };
          (function() {
            let d = document,
              s = d.createElement('script');
            s.src = `https://${blog["全局评论设置"]["disqus设置"]["shortname"]}.disqus.com/embed.js`;
            s.setAttribute('data-timestamp', +new Date());
            (d.head || d.body).appendChild(s);
          })();
        }


      })
  }
}

function render_friend_book_friend(listid, name, url, icon, description) {
  document.getElementById(listid).innerHTML += `
                <div class="card friend-card mb-3">
                
                <div class="row">
    <div class="col-md-4" >
      <img src="${icon}" class="friend-card-img">
    </div>
    <div class="col-md-8" >
      <div class="card-body">
        <h5 class="card-title"><a target="_blank" href="${url}">${name}</a></h5>
        <p class="card-text">${description}</p>
      </div>
    </div>
    
  </div>
<br />
                
                `;
}

function render_friend_book() {
  document.querySelector("#container").innerHTML += `
            <div class="page-content">
                <h2>${langdata.FRIEND_BOOK[lang_name]}</h2>
                <hr />
                <p>${blog["友人帐页面附加信息"]}</p>
                
                  <div class="row">
    <div class="col" id="friend_book_list1">
      
    </div>
    <div class="col" id="friend_book_list2">
      
    </div>

  </div>
  </div>
            `;

  if (blog["友人帐来自json文件"] === true) {
    axios.get(blog["若友人帐来自json文件，则地址为"]).then(
      function(response) {
        blog["友人帐"] = response.data["友人帐"];
        render_friend_book_list();
      })
  } else {
    render_friend_book_list();
  }

  if (
    blog["全局评论设置"]["启用valine评论"] &&
    blog["友人帐页面允许评论"] ||
    blog["全局评论设置"]["启用disqus评论"] &&
    blog["友人帐页面允许评论"]
  ) {
    document.querySelector(
      "#container"
    ).innerHTML += `<div class="bbg-comment-area"><h3><i class="fa fa-comments-o"></i> 在友人帐中评论：</h3><br /><div id="vcomments"></div><div id="disqus_thread"></div></div>`;
  }
  render_bottom_information();
  execute_custom_js();
  if (
    blog["全局评论设置"]["启用valine评论"] &&
    blog["友人帐页面允许评论"]
  ) {
    new Valine({
      el: "#vcomments",
      appId: blog["全局评论设置"]["valine设置"]["leancloud_appid"],
      appKey: blog["全局评论设置"]["valine设置"]["leancloud_appkey"],
      path: comment_authcode +
        "internal=friendbook"
    });

    preview_env_public_comment_fix();
  }

  if (blog["全局评论设置"]["启用disqus评论"] &&
    blog["友人帐页面允许评论"]) {
    let disqus_config = function() {
      this.page.identifier = "friend_book";
    };
    (function() {
      let d = document,
        s = d.createElement('script');
      s.src = `https://${blog["全局评论设置"]["disqus设置"]["shortname"]}.disqus.com/embed.js`;
      s.setAttribute('data-timestamp', +new Date());
      (d.head || d.body).appendChild(s);
    })();
  }
}

function getTagTree() {
  let tagtree = new Object();

  //todo:考虑隐藏文章不应该纳入到标签树中

  for (let i = 0; i < blog["文章列表"].length; i++) {
    if (blog["文章列表"][i]["标签"].length === 0) {} else {
      for (let k = 0; k < blog["文章列表"][i]["标签"].length; k++) {
        if (
          typeof tagtree[blog["文章列表"][i]["标签"][k]] === "undefined"
        ) {
          tagtree[blog["文章列表"][i]["标签"][k]] = new Array();
        } else {}
        tagtree[blog["文章列表"][i]["标签"][k]].push(blog["文章列表"][i]);
      }
    }
  }

  return tagtree;
}

function getTagTreeLength() {
  return Object.keys(getTagTree()).length;
}

function render_tag_tree() {
  //todo：考虑没有任何标签的情况

  totalTagTreeArticleLength = 0;

  let tagtree = getTagTree();

  document.getElementById("container").innerHTML += `<div class="tag-content" id="tag-content"></div>`;
  //分析标签树

  for (let i = 0; i < getTagTreeLength(); i++) {
    // 遍历所有标签

    // 渲染标签名字
    document.querySelector(
      "#tag-content"
    ).innerHTML += `<h2 id="tag-content-of-tag-${Object.keys(tagtree)[i]}"><i class="fa fa-tags"></i> <span style="color:${getTagColor(Object.keys(tagtree)[i])}">#${Object.keys(tagtree)[i]
        }</span></h2>`;
    for (let k = 0; k < tagtree[Object.keys(tagtree)[i]].length; k++) {
      // 遍历某个标签中的所有文章
      currentTagTreeArticleNumber = 0;
      for (let j = 0; j < blog["文章列表"].length; j++) {
        // 遍历index.json中的所有文章object，与标签中的文章object相比较，
        // 这是为了取得标签中的文章object在index.json中的文章列表array中对应的下标。
        // 因为 enter_article函数的参数是index.json中的文章列表array的下标，因此必须要获取到。
        if (tagtree[Object.keys(tagtree)[i]][k] === blog["文章列表"][j] && blog["文章列表"][j]["是否隐藏"] === false) {
          if (blog["文章列表"][j]["是否是短文章"]) {
            document.querySelector(
              "#tag-content"
            ).innerHTML += `<p><i class="fa fa-file-text-o"></i> <a href="./index.html?type=short_article&id=${blog["文章列表"][j]["标识符"]}" onclick="enter_article(${j});return false;">${tagtree[Object.keys(tagtree)[i]][k]["文章标题"]
              }</a>（<i class="fa fa-calendar"></i> ${langdata["ARTICLE_CREATEDAT"][lang_name]}${tagtree[Object.keys(tagtree)[i]][k]["创建日期"]
                }，<i class="fa fa-clock-o"></i> ${langdata["LASTMODIFIEDAT"][lang_name]}${tagtree[Object.keys(tagtree)[i]][k]["修改日期"]
                }）</p>`;
          } else {
            document.querySelector(
              "#tag-content"
            ).innerHTML += `<p><i class="fa fa-file-text-o"></i> <a href="./index.html?type=article&filename=${blog["文章列表"][j]["文件名"]}" onclick="enter_article(${j});return false;">${tagtree[Object.keys(tagtree)[i]][k]["文章标题"]
              }</a>（<i class="fa fa-calendar"></i> ${langdata["ARTICLE_CREATEDAT"][lang_name]}${tagtree[Object.keys(tagtree)[i]][k]["创建日期"]
                }，<i class="fa fa-clock-o"></i> ${langdata["LASTMODIFIEDAT"][lang_name]}${tagtree[Object.keys(tagtree)[i]][k]["修改日期"]
                }）</p>`;
          }


          currentTagTreeArticleNumber++;


        }
        totalTagTreeArticleLength = totalTagTreeArticleLength + 1;
      }
      if (currentTagTreeArticleNumber === 0) {
        document.getElementById(`tag-content-of-tag-${Object.keys(tagtree)[i]}`).setAttribute("style", "display:none");
      }
    }
  }

  if (getTagTreeLength() === 0) {
    document.querySelector("#tag-content").innerHTML += `
          <h3><i class="fa fa-tags"></i> 未分类文章</h3>

          `;

    for (let i = 0; i < blog["文章列表"].length; i++) {
      if (blog["文章列表"][i]["是否隐藏"] === false) {
        if (blog["文章列表"][i]["是否是短文章"]) {
          document.querySelector("#tag-content").innerHTML += `
            <p><i class="fa fa-file-text-o"></i> <a href="./index.html?type=short_article&filename=${blog["文章列表"][i]["标识符"]}">${blog["文章列表"][i]["文章标题"]}</a>
              
              （
              <i class="fa fa-calendar"></i> ${langdata["ARTICLE_CREATEDAT"][lang_name]}
              ${blog["文章列表"][i]["创建日期"]}，
              <i class="fa fa-clock-o"></i> ${langdata["LASTMODIFIEDAT"][lang_name]}
              ${blog["文章列表"][i]["修改日期"]}
              
              ）
              
              </p>

          `;
        } else {
          document.querySelector("#tag-content").innerHTML += `
            <p><i class="fa fa-file-text-o"></i> <a href="./index.html?type=article&filename=${blog["文章列表"][i]["文件名"]}">${blog["文章列表"][i]["文章标题"]}</a>
              
              （
              <i class="fa fa-calendar"></i> ${langdata["ARTICLE_CREATEDAT"][lang_name]}
              ${blog["文章列表"][i]["创建日期"]}，
              <i class="fa fa-clock-o"></i> ${langdata["LASTMODIFIEDAT"][lang_name]}
              ${blog["文章列表"][i]["修改日期"]}
              
              ）
              
              </p>

          `;
        }

      }
    }
  } else {
    if (totalTagTreeArticleLength < blog["文章列表"].length) {
      document.getElementById("tag-content").innerHTML += `
            <h3><i class="fa fa-tags"></i> 未分类文章</h3>
            `;

      for (let i = 0; i < blog["文章列表"].length; i++) {
        if (blog["文章列表"][i]["是否隐藏"] === false) {
          if (blog["文章列表"][i]["是否是短文章"]) {
            if (blog["文章列表"][i]["标签"].length === 0 || blog["文章列表"][i]["标签"] === false || blog["文章列表"][i]["标签"] === "" || blog["文章列表"][i]["标签"] === undefined || blog["文章列表"][i]["标签"] === null) {
              document.querySelector("#tag-content").innerHTML += `
            <p><i class="fa fa-file-text-o"></i> <a href="./index.html?type=short_article&id=${blog["文章列表"][i]["标识符"]}">${blog["文章列表"][i]["文章标题"]}</a>
              
              （
              <i class="fa fa-calendar"></i> ${langdata["ARTICLE_CREATEDAT"][lang_name]}
              ${blog["文章列表"][i]["创建日期"]}，
              <i class="fa fa-clock-o"></i> ${langdata["LASTMODIFIEDAT"][lang_name]}
              ${blog["文章列表"][i]["修改日期"]}
              
              ）
              
              </p>

          `;
            }

          } else {
            if (blog["文章列表"][i]["标签"].length === 0 || blog["文章列表"][i]["标签"] === false || blog["文章列表"][i]["标签"] === "" || blog["文章列表"][i]["标签"] === undefined || blog["文章列表"][i]["标签"] === null) {
              document.querySelector("#tag-content").innerHTML += `
            <p><i class="fa fa-file-text-o"></i> <a href="./index.html?type=article&filename=${blog["文章列表"][i]["文件名"]}">${blog["文章列表"][i]["文章标题"]}</a>
              
              （
              <i class="fa fa-calendar"></i> ${langdata["ARTICLE_CREATEDAT"][lang_name]}
              ${blog["文章列表"][i]["创建日期"]}，
              <i class="fa fa-clock-o"></i> ${langdata["LASTMODIFIEDAT"][lang_name]}
              ${blog["文章列表"][i]["修改日期"]}
              
              ）
              
              </p>

          `;
            }
          }

        }
      }
    }

  }
}

function render_tag(tagname) {

  document.getElementById("container").innerHTML += `<div class="tag-content" id="tag-content"></div>`;
  document.querySelector(
    "#tag-content"
  ).innerHTML += `<h2><i class="fa fa-tags"></i> 标签为  <span style="color:${getTagColor(tagname)}">#${tagname}</span> 下的文章</h2>`;
  let tagtree = getTagTree();
  for (let i = 0; i < tagtree[tagname].length; i++) {
    for (let j = 0; j < blog["文章列表"].length; j++) {
      if (tagtree[tagname][i] === blog["文章列表"][j] && blog["文章列表"][j]["是否隐藏"] === false) {
        if (blog["文章列表"][j]["是否是短文章"]) {
          document.querySelector(
            "#tag-content"
          ).innerHTML += `<p><i class="fa fa-file-text-o"></i> <a href="/index.html?type=short_article&id=${blog["文章列表"][j]["标识符"]}" onclick="enter_article(${j});return false;">${tagtree[tagname][i]["文章标题"]}</a>（<i class="fa fa-calendar"></i> ${langdata["ARTICLE_CREATEDAT"][lang_name]}${tagtree[tagname][i]["创建日期"]}，<i class="fa fa-clock-o"></i> ${langdata["LASTMODIFIEDAT"][lang_name]}${tagtree[tagname][i]["修改日期"]}）</p>`;

        } else {
          document.querySelector(
            "#tag-content"
          ).innerHTML += `<p><i class="fa fa-file-text-o"></i> <a href="/index.html?type=article&filename=${blog["文章列表"][j]["文件名"]}" onclick="enter_article(${j});return false;">${tagtree[tagname][i]["文章标题"]}</a>（<i class="fa fa-calendar"></i> ${langdata["ARTICLE_CREATEDAT"][lang_name]}${tagtree[tagname][i]["创建日期"]}，<i class="fa fa-clock-o"></i> ${langdata["LASTMODIFIEDAT"][lang_name]}${tagtree[tagname][i]["修改日期"]}）</p>`;

        }
      }
    }
  }
}

function render_page(page_id) {

  if (blog["Markdown渲染配置"]["使用markdown文件所在目录作为baseurl"]) {
    baseurl = "/data/pages/"
  }

  if (blog["启用网站公告"] === true && blog["网站公告仅在首页显示"] === false) {
    document.querySelector("#container").innerHTML += `
          <div class="alert alert-primary">

            <i class="fa fa-bullhorn" aria-hidden="true"></i> 公告： ${blog["网站公告"]}
</div>
          `
  }

  document.querySelector(
    "#container"
  ).innerHTML += `<div class="page-content" id="page-content"></div>`

  document.querySelector(
    "#page-content"
  ).innerHTML += `<h2>${blog["页面列表"][page_id]["页面标题"]}</h2><hr />`;

  axios
    .get(
      "./data/pages/" +
      blog["页面列表"][page_id]["文件名"] +
      "?timestamp=" +
      Date.parse(new Date())
    )
    .then(function(response) {
      document.querySelector("#page-content").innerHTML += `<div id="page-content-html">${marked.parse(response.data)}</div>`;
      if (blog["不使用全站内容授权协议"] === false) {
        document.getElementById("page-content").innerHTML += `<br />
            <div class="alert alert-info" role="alert">
              <h5 class="alert-heading">${langdata.COPYRIGHT_HINT[lang_name]}</h5>
              <p class="mb-0">${blogContentLicenseText}</p>
            </div>
            
            `;
      }

      // 评论

      if (
        blog["全局评论设置"]["启用valine评论"] &&
        blog["页面列表"][page_id]["启用评论"] ||
        blog["全局评论设置"]["启用disqus评论"] &&
        blog["页面列表"][page_id]["启用评论"]
      ) {
        document.querySelector(
          "#container"
        ).innerHTML += `<div class="bbg-comment-area"><h3><i class="fa fa-comments-o"></i> 在此页面 《${blog["页面列表"][page_id]["页面标题"]}》 下评论：</h3><br /><div id="vcomments"></div><div id="disqus_thread"></div></div>`;
      }
      render_bottom_information();
      execute_custom_js();

      content_load_finished = true;
      detect_whether_ui_load_finished();

      if (
        blog["全局评论设置"]["启用valine评论"] &&
        blog["页面列表"][page_id]["启用评论"]
      ) {
        new Valine({
          el: "#vcomments",
          appId: blog["全局评论设置"]["valine设置"]["leancloud_appid"],
          appKey: blog["全局评论设置"]["valine设置"]["leancloud_appkey"],
          path: comment_authcode +
            "page=" +
            blog["页面列表"][page_id]["文件名"],
        });

        preview_env_public_comment_fix();
      }

      if (blog["全局评论设置"]["启用disqus评论"] &&
        blog["页面列表"][page_id]["启用评论"]) {
        let disqus_config = function() {
          this.page.identifier = "page=" + blog["页面列表"][page_id]["文件名"];
        };
        (function() {
          let d = document,
            s = d.createElement('script');
          s.src = `https://${blog["全局评论设置"]["disqus设置"]["shortname"]}.disqus.com/embed.js`;
          s.setAttribute('data-timestamp', +new Date());
          (d.head || d.body).appendChild(s);
        })();
      }
    });
}

function enter_page(page_id) {
  history.pushState({
    type: "page",
    filename: blog["页面列表"][page_id]["文件名"]
  }, "", `./index.html?type=page&filename=${blog["页面列表"][page_id]["文件名"]}`);
  if (blog["页面列表"][page_id]["是否在新标签页打开"]) {
    if (blog["页面列表"][page_id]["这是一个完整的html"]) {
      // 在新标签页打开，是完整的html

      window.open("./data/pages/" + blog["页面列表"][page_id]["文件名"]);
    } else {
      //在新标签页打开，是markdown

      window.open("./index.html?page_id=" + page_id);
    }
  } else {
    if (blog["页面列表"][page_id]["这是一个完整的html"]) {
      // 当前标签页打开，是完整的html

      window.location.href =
        "./data/pages/" + blog["页面列表"][page_id]["文件名"];
    } else {
      // 当前标签页打开，是markdown
      document.getElementsByTagName("title")[0].innerHTML = `${blog["页面列表"][page_id]["页面标题"]} - ${blog["博客标题"]} `;
      resetPage();
      render_nav(false);
      render_container();
      render_page(page_id);
      document.getElementById(`navbar_page_${page_id}`).classList.add("nav-item-active");
    }
  }
}


function render_hitokoto() {
  if (blog["一言设置"]["启用一言"]) {
    //todo:一言
    document.querySelector("#container").innerHTML += ``;
    fetch("https://v1.hitokoto.cn")
      .then((response) => response.json())
      .then((data) => {
        const hitokoto = document.getElementById("hitokoto_text");
        hitokoto.href = "https://hitokoto.cn/?uuid=" + data.uuid;
        hitokoto.innerText = data.hitokoto;
      });
  }
}

function render_bottom_information() {
  document.getElementById("container").innerHTML += `
            <hr />
            <div style="color:grey" id="bottom_info_html">
                ${marked.parse(blog["底部信息（格式为markdown）"])}
            </div>
            
            `;
}

function execute_custom_js() {
  if (blog["启用自定义JS"] === true) {
    eval(blog["自定义JS"]);
  }
  if (blog["是否启用插件功能"] === true) {
    for (const pluginObj of blog["插件列表"]) {
      if (pluginObj["是否启用此插件"] === true) {
        console.log(`[插件加载开始] 开始加载插件${pluginObj["插件名称"]}, 插件版本${pluginObj["插件版本"]}, 插件作者${pluginObj["插件作者名"]} <${pluginObj["插件作者url"]}>`)
        eval(pluginObj["插件内容"]);
        console.log(`[插件加载结束] 已加载插件${pluginObj["插件名称"]}`);
      }
    }
  }
}

function enter_tag(tagname) {
  history.pushState({
    type: "internal",
    function: "tag",
    argument: decodeURIComponent(tagname)
  }, "", `./index.html?type=internal&function=tag&argument=${tagname}`);
  document.getElementsByTagName("title")[0].innerHTML = `标签为 ${decodeURIComponent(tagname)} 下的文章 - ${blog["博客标题"]} `;
  resetPage();
  render_nav(false);
  render_container();
  render_tag(decodeURIComponent(tagname));
  render_bottom_information();
  document.getElementById("navbar_archive_and_tags").classList.add("nav-item-active");
  execute_custom_js();

  content_load_finished = true;
  detect_whether_ui_load_finished();
}

function enter_friend_book() {
  history.pushState({
    type: "internal",
    function: "friendbook"
  }, "", `./index.html?type=internal&function=friendbook`);
  document.getElementsByTagName("title")[0].innerHTML = `友人帐 - ${blog["博客标题"]} `;
  resetPage();
  render_nav(false);
  render_container();
  render_friend_book();
  document.getElementById("navbar_friendbook").classList.add("nav-item-active");

  content_load_finished = true;
  detect_whether_ui_load_finished();

}

function enter_archive_and_tags() {
  history.pushState({
    type: "internal",
    function: "archive_and_tags"
  }, "", `./index.html?type=internal&function=archive_and_tags`);
  document.getElementsByTagName("title")[0].innerHTML = `归档与标签 - ${blog["博客标题"]} `;
  resetPage();
  render_nav(false);
  render_container();
  render_tag_tree();
  render_bottom_information();
  document.getElementById("navbar_archive_and_tags").classList.add("nav-item-active");
  execute_custom_js();

  content_load_finished = true;
  detect_whether_ui_load_finished();
}

function enter_indexPage() {
  history.pushState({
    type: "internal",
    function: "article_list"
  }, "", `./index.html?type=internal&function=article_list`);
  document.getElementsByTagName("title")[0].innerHTML = blog["博客标题"];
  resetPage();
  render_nav(true);
  render_container();
  render_index_title_info();
  render_article_list();
  render_bottom_information();
  document.getElementById("navbar_article_list").classList.add("nav-item-active");

  execute_custom_js();

  content_load_finished = true;
  detect_whether_ui_load_finished();
}

function enter_article(article_id) {
  if (blog["文章列表"][article_id]["是否是短文章"]) {
    history.pushState({
      type: "short_article",
      id: blog["文章列表"][article_id]["文章内容"]
    }, "", `./index.html?type=short_article&id=${blog["文章列表"][article_id]["标识符"]}`);

  } else {
    history.pushState({
      type: "article",
      filename: blog["文章列表"][article_id]["文件名"]
    }, "", `./index.html?type=article&filename=${blog["文章列表"][article_id]["文件名"]}`);
  }
  document.getElementsByTagName("title")[0].innerHTML = `${blog["文章列表"][article_id]["文章标题"]} - ${blog["博客标题"]} `;
  resetPage();
  render_nav(false);
  render_container();
  render_article_content(article_id);
}

function getUrlArgs(variable) {
  var query = window.location.search.substring(1);
  var vars = query.split("&");
  for (var i = 0; i < vars.length; i++) {
    var pair = vars[i].split("=");
    if (pair[0] == variable) {
      return pair[1];
    }
  }
  return false;
}

function importBootstrapCSSFile(uri) {
  axios
    .get(uri)
    .then(function(response) {
      document.getElementById("bootstrap_css").innerHTML += response.data;
      bootstrap_css_import_finished = true;
      detect_whether_ui_load_finished();
    })
}


function importHighlightCSSFile(uri) {
  axios
    .get(uri)
    .then(function(response) {
      document.getElementById("highlight_css").innerHTML += response.data;
    })
}

axios
  .get("./data/index.json?timestamp=" + Date.parse(new Date()))
  .then(function(response) {
    blog = response.data;
    lang_name = blog["网站语言"];

    switch (blog["全站内容授权协议"]) {
      case "reserved":
        blogContentLicenseText = `${langdata.COPYRIGHT_RESERVED[lang_name]}`
        break;
      case "unlicensed":
        blogContentLicenseText = `${langdata.COPYRIGHT_UNLICENSED[lang_name]}`
        break;
      case "cc-by-nc-sa-4.0":
        blogContentLicenseText = `${langdata.COPYRIGHT_CC_BY_NC_SA_FOUR_DOT_ZERO[lang_name]}`
        break;
      default:
        blogContentLicenseText = `${blog["全站内容授权协议"]}`;
    }

    if (blog["Markdown渲染配置"]["根据用户屏幕尺寸渲染图片尺寸"] && blog["Markdown渲染配置"]["在用户点击图片时显示图片查看器"]) {

      markdown_renderer.image = function(src, title, alt) {
        return `<img style="max-width:100%;max-height:400px; border-style:solid; border-width: 2px; border-color: #66ccff; border-radius: 6px" onclick="openImageViewer('${src}')" src="${src.indexOf("https://") === -1 && src.indexOf("http://") === -1?baseurl:""}${src}" alt="${alt}" title="${title ? title : ''}" />
            `
      }

      marked.setOptions({
        renderer: markdown_renderer
      });
    } else if (blog["Markdown渲染配置"]["根据用户屏幕尺寸渲染图片尺寸"] === true && blog["Markdown渲染配置"]["在用户点击图片时显示图片查看器"] === false) {

      markdown_renderer.image = function(src, title, alt) {
        return `<img style="max-width:100%;max-height:400px; border-style:solid; border-width: 2px; border-color: #66ccff; border-radius: 6px" src="${src.indexOf("https://") === -1 && src.indexOf("http://") === -1?baseurl:""}${src}" alt="${alt}" title="${title ? title : ''}" />
            `
      }

      marked.setOptions({
        renderer: markdown_renderer
      });
    } else if (blog["Markdown渲染配置"]["根据用户屏幕尺寸渲染图片尺寸"] === false && blog["Markdown渲染配置"]["在用户点击图片时显示图片查看器"] === true) {
      markdown_renderer.image = function(src, title, alt) {
        return `<img onclick="openImageViewer('${src}')" src="${src.indexOf("https://") === -1 && src.indexOf("http://") === -1?baseurl:""}${src}" alt="${alt}" title="${title ? title : ''}" />
            `
      }

      marked.setOptions({
        renderer: markdown_renderer
      });
    } else if (blog["Markdown渲染配置"]["使用markdown文件所在目录作为baseurl"]) {
      markdown_renderer.image = function(src, title, alt) {
        return `<img src="${src.indexOf("https://") === -1 && src.indexOf("http://") === -1?baseurl:""}${src}" alt="${alt}" title="${title ? title : ''}" />
            `
      }

      marked.setOptions({
        renderer: markdown_renderer
      });
    }

    if (blog["使版心宽度更窄（提高左右页边距）"]) {
      document.getElementById("theme_settings").innerHTML += `
          @media(min-width: 1000px){
          .container{
            padding-left: 12%;
            padding-right: 12%;
            padding-top: 0;
            padding-bottom: 0
          }
        }
          `;
    }

    if (blog["优先使用衬线字体"]) {
      document.getElementById("theme_settings").innerHTML += `
          * {
            font-family: 'Noto Serif SC','Source Han Serif SC','Source Han Serif',source-han-serif-sc,'PT Serif','SongTi SC',serif;
          }
          `;
    }

    if (blog["全局主题设置"]["禁用导航栏的阴影效果"]) {
      document.getElementById("theme_settings").innerHTML += `
          nav {
      opacity: 0.9;
      box-shadow: none;
      padding: 0 !important;
    }
          `;
    }



    let cdn_path = blog["CDN路径"];

    // js importing disabled due to execution order is inevitable, while css importing can safely operate.

    importBootstrapCSSFile(cdn_path + "/bootstrap@5.0.2/dist/css/bootstrap.min.css");

    importHighlightCSSFile(cdn_path + "/highlight.js@9.12.0/styles/tomorrow.css");



    articleListPageLength = Math.ceil(blog["文章列表"].length / blog["文章列表中每页的文章数为"]); // 从1开始数

    if (blog["全局评论设置"]["valine设置"]["是否使用bbg公共评论服务"]) {
      if (window.location.href.indexOf("?") === -1) {
        comment_authcode = `domain=${window.location.href
              .replaceAll("#top", "")
              .replaceAll("index.html", "")
              .replaceAll("#", "")};`;
      }

      if (window.location.href.indexOf("?") !== -1) {
        comment_authcode = `domain=${window.location.href
              .replaceAll("#top", "")
              .replaceAll("index.html", "")
              .replaceAll("#", "")
              .replaceAll("type=article", "")
              .replaceAll("type=page", "")
              .replaceAll("?", "")
              .replaceAll("&", "")
              .replaceAll("filename=", "")
              .replaceAll(getUrlArgs("filename"), "")};`;
      }
    } else {
      comment_authcode = "";
    }

    // 网页背景载入

    if (blog["全局主题设置"]["是否使用纯色背景（优先级高于背景图像）"]) {
      document.querySelector("#blogcss").innerHTML += `body:before{
            background: ${blog["全局主题设置"]["若使用纯色背景，颜色为"]};
          }`;
    } else if (blog["全局主题设置"]["是否使用背景图像"]) {

      if (blog["全局主题设置"]["若使用背景图像，设置为"]["将网站根目录下的background.webp作为背景图像"]) {
        document.querySelector("#blogcss").innerHTML += `body:before{
              background: url(./background.webp) center/cover;
            }`;
      } else if (
        blog["全局主题设置"]["若使用背景图像，设置为"][
          "将某个url作为背景图像"
        ]
      ) {
        document.querySelector("#blogcss").innerHTML += `body:before{
              background: url(${blog["全局主题设置"]["若使用背景图像，设置为"]["若将某个url作为背景图像，这个url是"]}) center/cover;
            }`;
      }
    }

    // 自定义css载入

    if (blog["启用自定义CSS"] === true) {
      document.getElementById("custom_css").innerHTML = blog["自定义CSS"];
    }


    if (getUrlArgs("type") === "article") {
      let article_filename = getUrlArgs("filename");
      for (let i = 0; i < blog["文章列表"].length; i++) {
        if (blog["文章列表"][i]["文件名"] === article_filename) {
          success_locate_article_id = true;
          enter_article(i);
        }
      }
      if (success_locate_article_id !== true) {
        document.getElementById("root").setAttribute("style", "");
        document.getElementById("loading").setAttribute("style", "display:none;");
        document.getElementById("root").innerHTML = `
            <div style="text-align:center">
              <br />
            <h3>此文章不存在或已被删除</h3>
            <p>This article does not exist or has already been deleted.</p>
            </div>
            `;
      }
    }

    if (getUrlArgs("type") === "short_article") {
      let article_id = getUrlArgs("id");
      for (let i = 0; i < blog["文章列表"].length; i++) {
        if (blog["文章列表"][i]["标识符"] === article_id) {
          success_locate_article_id = true;
          enter_article(i);
        }
      }
      if (success_locate_article_id !== true) {
        document.getElementById("root").setAttribute("style", "");
        document.getElementById("loading").setAttribute("style", "display:none;");
        document.getElementById("root").innerHTML = `
            <div style="text-align:center">
              <br />
            <h3>此文章不存在或已被删除</h3>
            <p>This article does not exist or has already been deleted.</p>
            </div>
            `;
      }
    }

    if (getUrlArgs("type") === "page") {
      let page_filename = getUrlArgs("filename");
      for (let i = 0; i < blog["页面列表"].length; i++) {
        if (blog["页面列表"][i]["文件名"] === page_filename) {
          success_locate_page_id = true;
          enter_page(i);
        }
      }
      if (success_locate_page_id !== true) {
        document.getElementById("root").setAttribute("style", "");
        document.getElementById("loading").setAttribute("style", "display:none;");
        document.getElementById("root").innerHTML = `
            <div style="text-align:center">
              <br />
            <h3>此页面不存在或已被删除</h3>
            <p>This page does not exist or has already been deleted.</p>
            </div>
            `;
      }
    }

    if (getUrlArgs("type") === "internal") {
      let internal_function = getUrlArgs("function");
      let internal_function_argument = getUrlArgs("argument");

      if (internal_function === "article_list") {
        enter_indexPage();
      }
      if (internal_function === "archive_and_tags") {
        enter_archive_and_tags();
      }

      if (internal_function === "tag") {
        enter_tag(internal_function_argument);
      }

      if (internal_function === "friendbook") {
        enter_friend_book();
      }
    }

    if (getUrlArgs("type") === false) {
      enter_indexPage();
    }

  });