// request from cafe
if(document.URL.match("cafe.naver.com")) {
  if(window.name.toString().match("cafe_main")) {
    getCafeLinks(document);
  }
}
//request from blog
else {
  if(window.name.toString().match("mainFrame") || document.URL.match("PostView")) {
    getBlogLinks(document);
  }
}

function makeHttpObject() {
  try {
    return new XMLHttpRequest();
  } catch (error) {}
  throw new Error("Could not create HTTP request object.");
}

function getCafeLinks(myDom) {
  var linkList = myDom.querySelectorAll(".download_opt >a");
  var downloadURLs = [];
  Array.prototype.forEach.call(linkList, function(el) {
    if(el.href.match(/https?:\/\/cafeattach/)) {
      downloadURLs.push(el.href);
    }
  });
  downloadURLs = downloadURLs.filter(function(item, pos, self) {
    return self.indexOf(item) === pos;
  });

  var finalList = [];
  var name;
  downloadURLs.forEach(function(el, i) {
    name = myDom.getElementsByClassName("file_name")[i].textContent;
    finalList.push({"url": el, "name": name});
  });
  
  whale.runtime.sendMessage({
    action: "getSource",
    data: finalList
  });
}

function getBlogLinks(myDom) {
  var linkList = [];
  var finalList = [];
  var fileLayer = myDom.getElementsByClassName("pcol2 _showFileLayer _returnFalse _param(1|false}|false)");
  
  // 스마트 에디터 2.0
  if(fileLayer.length != 0) {
    var url;
    var name;
    fileLayer[0].click();
    linkList = myDom.getElementsByClassName("downFile  _checkAttachFileAlive _saveAttachFile ");
    var nameList = myDom.querySelectorAll(".addfile_layer li");
    var j = 0;
    for(let i = 0; i < linkList.length; i++) {
      url = linkList[i].href;
      if(linkList[i].title=="") {
        name = nameList[j].textContent.split("내PC 저장")[0];
        j++;
      }
      else name = linkList[i].title;
      finalList.push({"url": url, "name": name});
    }
  }

  // 스마트 에디터 ONE
  else {
    linkList = myDom.links;
    var downloadURLs = [];
    var name;
    Array.prototype.forEach.call(linkList, function(el) {
      if(el.href.match(/https?:\/\/blogattach/)) {
        downloadURLs.push(el.href);
      }
    });
    downloadURLs = downloadURLs.filter(function(item, pos, self) {
      return self.indexOf(item) === pos;
    });
  
    downloadURLs.forEach(function(el, i) {
      name = decodeURIComponent(el).substring(decodeURIComponent(el).lastIndexOf('/')+1);
      finalList.push({"url": el, "name": name});
    });
  }
  
  whale.runtime.sendMessage({
    action: "getSource",
    data: finalList
  });
}