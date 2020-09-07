// request to get a download list from a current page
document.getElementById("loadHTML").addEventListener("click", function() {
  document.getElementById("listTable").innerHTML = '<tr><td class="checkbox"></td><td class="url" style="display:none"></td><td class="filename"></td></tr>';
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    var title = tabs[0].title;
    if(title.match(/네이버\s?블로그|카페/)) {
      whale.tabs.executeScript(
        null,
        {
          file: "getPagesSource.js",
          allFrames: true,
        }
      );
    }
    else document.getElementById("listTable").innerHTML += '<div class="incorrectPage">네이버 블로그나 카페에서 실행해주세요</div>';
  });
});

// receive a download list from a current page
whale.runtime.onMessage.addListener(function(request, sender) {
  if (request.action == "getSource") {
    if(request.data.length ==0){

      document.getElementById("listTable").innerHTML += '<div class="incorrectPage"><p>          첨부파일이 존재하지 않습니다.</p></div>';
    }

    createTable(null, request.data);
  }
});

// request to get a download list from a post list
document.getElementById("loadCategory").addEventListener("click", function() {
  document.getElementById("listTable").innerHTML = '<tr><td class="checkbox"></td><td class="url" style="display:none"></td><td class="filename"></td></tr>';
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    var title = tabs[0].title;
    if(title.match(/네이버\s?블로그|카페/)) {
      whale.tabs.executeScript(
        null,
        {
          file: "getCategory.js",
          allFrames: true
        },
      );
    }
    else document.getElementById("listTable").innerHTML += '<div class="incorrectPage">네이버 블로그나 카페에서 실행해주세요</div>';
  });
});

// receive a download list from a post list
whale.runtime.onMessage.addListener(function(request, sender) {
  if (request.action == "getPostList") {
    createTable(request.title, request.data);
  }
});

whale.runtime.onMessage.addListener(function(request, sender) {
  if (request.action == "oldPost") {
    document.getElementById("listTable").innerHTML = '<tr><td class="checkbox"></td><td class="url" style="display:none"></td><td class="filename"></td></tr>';
    document.getElementById("listTable").innerHTML += '<div class="incorrectPage">목록에서 불러오기 사용 불가<br>스마트에디터2.0에서는 목록에서 불러올 수 없습니다<br></div>';
  }
});

// select/deselect all 
document.getElementsByName("sellectAll")[0].addEventListener("change", function() {
  if(event.target.checked) {
    Array.prototype.forEach.call(document.getElementsByClassName("check"), function(el) {
      el.checked = true;
    })
  }
  else {
    Array.prototype.forEach.call(document.getElementsByClassName("check"), function(el) {
      el.checked = false;
    })    
  }
})

// request for Download
document.getElementById("startDownload").addEventListener("click", function(){
  var downList = [];
  var checkList = document.getElementsByClassName("check");
  Array.prototype.forEach.call(checkList, function(el) {
    if(el.checked == true) {
      downList.push(el.parentElement.parentElement.getElementsByClassName("url")[0].textContent);
    }
  });
  console.log(downList);
  whale.runtime.sendMessage({ "message": "startDownload", "downList": downList });
});

// add a download list to the table
function createTable(title, list) {
  if(list.length > 0) {
    if(title != null) {
      document.getElementById("listTable").innerHTML += '<div class="post_title">' +title+ '</div>';
    }
    list.forEach(function(el) {
      document.getElementById("listTable").innerHTML += ' <div class="checkbox link"><label class="checklabel"><input type="checkbox" class="check"/><i class="input-helper"></i>          <span class="url" style="display:none">'+el.url+'</span><span class="filename">'+el.name+'</span></label></div>';
    })
  }
  else console.log("there is no file");
}