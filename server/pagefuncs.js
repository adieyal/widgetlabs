widget = window.widget || {};
widget.widgets = widget.widgets || {};
widget.datastore = widget.datastore || {};
widget.active = widget.active || [];

(function() {
    widget.getList = function() {
	var list = [];
	
	var widgets = d3.selectAll('[data-widget]');
	for (i=0; i<widgets[0].length; i++) {
	    var elem = widgets[0][i];
	    var type = elem.getAttribute('data-widget');
	    if (type) {
		if (list.indexOf(type) == -1) {
		    list.push(type);
		}
	    }
	}
	return list;
    }
    
    widget.svg = function() {
	var s = d3.select('div#svg');
	console.log(s);
	var out = s.html();
	return out;
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
	    var d = data;
	    if (sel) {
		var sels = sel.split('.');
		for (i=0; i<sels.length; i++) {
		    d = d[sels[i]];
		}
	    }
	    callback(d);
	}
	
	if (!widget.datastore['url']) {
	    console.log(url);
	    d3.json(url, function(data) {
		widget.datastore[url] = data;
		loaded(data);
	    });
	} else {
	    var data = widget.datastore['url'];
	    loaded(data);
	}
    }
    
    widget.attach = function() {
	d3.selectAll('[data-widget]').each( function() {
	    var node = d3.select(this);
	    var widget_type = node.attr('data-widget');
	    
	    if (widget.widgets[widget_type]) {
		loadData(node, function(data) {
		    var w = new widget.widgets[widget_type](node, data);
		    widget.active.push(w);
		});
	    }
	});
    }
})();
