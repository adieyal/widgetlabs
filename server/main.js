/* This script renders an SVG submitted in an HTTP POST and returns the
   resulting SVG as an HTTP response.
*/

var page = require('webpage').create();
var server = require('webserver').create();

page.settings.webSecurityEnabled = false;
page.onConsoleMessage = function(msg, lineNum, sourceId) {
    console.log('CONSOLE: ' + msg);
};

console.log('Starting server...');
var service = server.listen(8080, function(request, response) {
    console.log('Processing request...');

    if (request.method != 'POST') {
	console.log('Invalid request.');
	response.statusCode = 200;
	response.write('Bleh...');
	response.close();
	console.log('Done!');
    } else {
	page.content = request.postRaw;
	page.onLoadFinished = function(status) {
	    console.log('Loaded from POST.');
	    console.log('Status: ' + status);
	    
	    page.injectJs('js/d3.v2.js');
	    console.log('Loaded d3.js.');
	    
	    page.injectJs('pagefuncs.js');
	    
	    var widgets = page.evaluate(function() {
		return widget.getList();
	    });
	    for (i in widgets) {
		var ret = page.injectJs('js/widget.'+widgets[i]+'.js');
		console.log('Loading widget '+widgets[i]+': '+(ret?'Succeeded':'Failed'));
	    }
	    console.log('Rendering widgets...');
	    page.evaluate(function() {
		widget.attach();
	    });
	    
	    setTimeout(function() {
		console.log('Sending result...');
		var data = page.evaluate(function() {
		    return document.body.innerHTML
		});
		response.statusCode = 200;
		response.write(data);
		response.close();
		console.log('Done!');
	    }, 40000);
	};
    }
});
console.log('Ready.')
