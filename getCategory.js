// request from cafe
if(document.URL.match("cafe.naver.com")) {
  var URL = document.querySelectorAll(".aaa .m-tcol-c");
  Array.prototype.forEach.call(URL, function(el) {
    getCafeLinks(el.href, el.textContent);
  });
}
// request from blog
else {
  var fileLayer = document.getElementsByClassName("pcol2 _showFileLayer _returnFalse _param(1|false}|false)");
  if(fileLayer.length != 0) {
    whale.runtime.sendMessage({
      action: "oldPost"
    });
  }
  else {
    var URL = document.getElementsByClassName("pcol2 _setTop _setTopListUrl");
    console.log(document.getElementsByClassName("pcol2 _setTop _setTopListUrl"));
    Array.prototype.forEach.call(URL, function(el) {
      getBlogLinks(el.href, el.textContent);
    });
  }
}

function makeHttpObject() {
  try {
    return new XMLHttpRequest();
  } catch (error) {}
  throw new Error("Could not create HTTP request object.");
}

function getCafeLinks(url, title) {
  var request = makeHttpObject();
  request.open("GET", url, true);
  request.responseType = 'document';
  request.send();
  request.onreadystatechange = function() {
    if (request.readyState == 4 && request.status == 200) {
      var linkList = request.responseXML.querySelectorAll(".download_opt >a");
      if(linkList.length == 0) return;
      var downloadURLs = [];
      Array.prototype.forEach.call(linkList, function(el) {
        if(el.href.match(/https?:\/\/cafeattach/)) {
          downloadURLs.push(el.href);
        }
      });

      downloadURLs = downloadURLs.filter(function(item, pos, self) {
        return self.indexOf(item) == pos;
      });

      var finalList = [];
      var name;
      downloadURLs.forEach(function(el, i) {
        name = request.responseXML.getElementsByClassName("file_name")[i].textContent;
        finalList.push({"url": el, "name": name});
      });
      
      whale.runtime.sendMessage({
        action: "getPostList",
        data: finalList,
        title: title
      });
    }
  };
}

function getBlogLinks(url, title) {
  var request = makeHttpObject();
  request.open("GET", url, true);
  request.responseType = 'document';
  request.send();
  request.onreadystatechange = function() {
    if (request.readyState == 4 && request.status == 200) { 
      var linkList = request.responseXML.links;
      var downloadURLs = [];
      Array.prototype.forEach.call(linkList, function(el) {
        if(el.href.match(/https?:\/\/blogattach/)) {
          downloadURLs.push(el.href);
        }
      });
      if(downloadURLs.length == 0) return;

      downloadURLs = downloadURLs.filter(function(item, pos, self) {
        return self.indexOf(item) == pos;
      });

      var finalList = [];
      downloadURLs.forEach(function(el) {
        finalList.push({"url": el, "name": decodeURIComponent(el).substring(decodeURIComponent(el).lastIndexOf('/')+1)});
      });
      
      whale.runtime.sendMessage({
        action: "getPostList",
        data: finalList,
        title: title
      });
    }
  };
}