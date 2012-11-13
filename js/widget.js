/* Main infohub widget file. This file is required in addition
   to all individual widget files. */

widget = window.widget || {};
widget.widgets = widget.widgets || {};
widget.datastore = widget.datastore || {};
widget.active = widget.active || [];

(function() {
    function requires_html(obj, url, callback) {
	if (typeof(window[obj]) == 'undefined') {
	    var head = document.getElementsByTagName('head')[0];
	    var script = document.createElement('script');
	    script.type = 'text/javascript';
	    script.src = url;
	    /* Most browsers. */
	    script.onload = callback;
	    /* IE 6 & 7 */
	    if (script.readyState) {
		script.onreadystatechange = function() {
		    if (this.readyState == 'loaded' || this.readyState == 'complete') {
			script.onreadystatechange = null;
			callback();
		    }
		}
	    }
	    head.appendChild(script);
	}
    }
    
    function requires_svg(obj, url, callback) {
	if (typeof(window[obj]) == 'undefined') {
	    var svg = document.documentElement;
	    var script = document.createElement('script');
	    script.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', url);
	    script.setAttribute('type', 'text/javascript');
	    /* Most browsers. */
	    script.onload = callback;
	    /* IE 6 & 7 */
	    if (script.readyState) {
		script.onreadystatechange = function() {
		    if (this.readyState == 'loaded' || this.readyState == 'complete') {
			script.onreadystatechange = null;
			callback();
		    }
		}
	    }
	    svg.appendChild(script);
	}
    }
    
    var requires;
    if (document.documentElement.nodeName === "HTML") {
	console.log('HTML Document type.');
	requires = requires_html;
    } else if (document.documentElement.nodeName === "svg") {
	console.log('SVG Document type.');
	requires = requires_svg;
    } else {
	requires = function(obj, url, callback) {
	    throw Error('Unable to determine document type.');
	}
    }
    
    function loadData(node, callback) {
	var src = node.attr('data-src');
	if (!src) {
	    callback(null);
	}

	var url, sel;
	src = src.split('#');
	if (src.length == 1) {
	    url = src;
	    sel = null;
	} else {
	    url = src[0];
	    sel = src[1];
	}
	
	function loaded(data) {
	    if (sel) {
		callback(data[sel]);
	    } else {
		callback(data);
	    }    
	}
	
	if (!widget.datastore['url']) {
	    d3.json(url, function(data) {
		widget.datastore[url] = data;
		loaded(data);
	    });
	} else {
	    var data = widget.datastore['url'];
	    loaded(data);
	}
    }

    function attach() {
	var node = d3.select(this);
	var widget_type = node.attr('data-widget');
	
	var url = 'js/widget.'+widget_type+'.js';
	requires(widget.widgets[widget_type], url, function() {
	    if (widget.widgets[widget_type]) {
		/* Load widget data and put in the store. */
		loadData(node, function(data) {
		    var w = new widget.widgets[widget_type](node, data);
		    widget.active.push(w);
		});
	    }
	});
    }
    
    widget.update = function() {
	var active = widget.active;
	for (var i=0; i<active.length; i++) {
	    var w = active[i];
	    if (w.update) {
		w.update();
	    }
	}
    }
    
    window.onload = function() {
	/* Check for and load d3 if not loaded. */
	/* TODO: Load from a better URL. */
	/* TODO: Check for crap browser and call PNG
	   loader instead of proper widget code. */
	requires('d3', 'js/d3.v2.js', function() {
	    /* Attach widgets. */
	    var widgets = d3.selectAll('[data-widget]')
		.each(attach);
	});
    }
})();
