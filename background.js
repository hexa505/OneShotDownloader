// process download
whale.runtime.onMessage.addListener(function(request, sender, sendResponse) {
	if(request.message == "startDownload") {
		var list = request.downList;
		while (list.length > 0) {
			var url = list.pop();
			whale.downloads.download({ "url": url });
		}
    }
});