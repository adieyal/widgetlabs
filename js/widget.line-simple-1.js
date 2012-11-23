/* line-simple-1 */

(function() {
    var name = 'line-simple-1';
    
    if (typeof widget == 'undefined') {
	return;
    }
    
    widget.widgets[name] = function(node, data) {
	if (node === undefined){ throw Error('No node given.'); }	
	if (data.data === undefined){ throw Error('No data given.'); }
        if (data.data.length === undefined || data.data.length === 0) { throw Error('Data invalid.'); }
	
	this.node = node;
	this.content = node.select('g.widget-content');
	this.ctx = data.ctx || {};
	this.data = data.data;
	
	this.style = {
	    //'bar': 'fill:#cf3e96;stroke:#ffffff;stroke-width:0.5;stroke-miterlimit:1.414'
	    'line': 'stroke:#cf3e96;stroke-width:1;fill-opacity:0;',
	    'label': 'font-family:Myriad Roman;fill:#cf3e96;'
	}
	
	this.initialize();
	this.update();
    }
    
    widget.widgets[name].prototype = {
	initialize: function() {
	    var ctx = this.ctx;
	    
	    var bbox = this.node.select('rect.widget-boundingbox')
	    var bounds = bbox[0][0].getBBox()
	    this.top = bounds.y;
	    this.left = bounds.x;
	    this.width = bounds.width;
	    this.height = bounds.height;
	    this.r = d3.min([this.width, this.height])/2;
	    bbox.attr('visibility', 'hidden');
	    bbox.attr('opacity', '0');
	    
	    this.content.text('');
	},
	update: function() {
	    var me = this;
	    
            if (me.data.length === undefined || me.data.length === 0) { return; }

	    var bar = {};
	    console.log(me.data[0].length);
	    bar.width = me.width/me.data[0].length;
	    
	    var x = d3.scale.linear()
		.domain([0, me.data[0].length])
		.range([me.left, me.left+me.width]);
	    var y = d3.scale.linear()
		.domain([0, d3.max(me.data[0])])
		.range([me.top+me.height, me.top]);
	    var line = d3.svg.line()
		.x(function(d, i) { console.log(d, i); return x(i)+bar.width/2 })
		.y(function(d, i) { return y(d) });

            me.node
		.attr('class', 'linechart');
	    var lines = me.content.selectAll('path.linegraph.line')
		.data(me.data)
		.enter()
		.append('svg:path');
	    lines.attr('class', function(d, i) { return 'linegraph line line'+i; })
		.attr('style', function(d, i) { return me.style['line']; })
		.attr('d', function(d, i) { console.log(d); return line(d) });
	}
    }
})();
 
