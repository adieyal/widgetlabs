/* bar-rounded-1 */

(function() {
    var name = 'bar-simple-1';
    
    if (typeof widget == 'undefined') {
	return;
    }
    
    widget.widgets[name] = function(node, data) {
	if (node === undefined){ throw Error('No node given.'); }	
	this.node = node;
	
	this.style = {
	    'bar': 'fill:#cf3e96;',
	    'label': 'font-family:Myriad Roman;fill:#cf3e96;'
	}
	
	this.initialize();
	
	if (data) {
	    this.update(data);
	}
    }
    
    widget.widgets[name].prototype = {
	initialize: function() {
	    this.content = this.node.selectAll('g.widget-content').data([0]);
	    this.content.enter().append('svg:g').attr('class', 'widget-content');
	    this.content.exit().remove();
	    
	    var bbox = this.node.select('rect.widget-boundingbox')
	    var bounds = bbox[0][0].getBBox()
	    this.top = bounds.y;
	    this.left = bounds.x;
	    this.width = bounds.width;
	    this.height = bounds.height;
	    bbox.attr('visibility', 'hidden');
	    bbox.attr('opacity', '0');
	    
	    this.content.text('');
	    this.initialized = true;
	},
	update: function(data) {
	    var me = this;
	    me.data = data['data'] || data;
	    me.labels = data['data-labels'] || me.data;
	    me.style = data['style'] || eval('('+me.node.attr('data-style')+')') || me.style;
	    me.domainx = data['domain-x'] || [0, me.data.length];
	    me.domainy = data['domain-y'] || [0, d3.max(me.data)];

	    if (me.initialized != true) { throw Error('Attempt to update uninitialized widget.'); }
            if (me.data.length === undefined || me.data.length === 0) { return; }

	    var bar = {};
	    bar.width = me.width/me.data.length;
	    bar.r = bar.width/4;
	    
	    var x = d3.scale.linear()
		.domain(me.domainx)
		.range([me.left, me.left+me.width]);
	    var y = d3.scale.linear()
		.domain(me.domainy)
		.range([me.top+me.height, me.top]);
            me.node
		.attr('class', 'barchart');
	    
	    var bars = me.content.selectAll('path.bargraph.bar')
		.data(me.data);
	    bars.enter()
		.append('svg:rect');
	    bars.exit()
		.remove();
	    bars.attr('class', function(d, i) { return 'bargraph bar bar'+i; })
	        .attr('style', function(d, i) { return me.style['bar']; })
		.attr('x', function(d, i) { return x(i)+bar.width*0.05; })
		.attr('y', function(d, i) { return y(d); })
		.attr('height', function(d, i) { return y(0)-y(d); })
		.attr('width', function(d, i) { return bar.width*0.9; });
	    
	    var labels = me.content.selectAll('text.bargraph.bar.label')
		.data(me.data);
	    labels.enter()
		.append('svg:text')
		.attr('class', function(d, i) { return 'bargraph bar label label'+i; });
	    labels.exit()
		.remove();
	    labels.attr('style', function(d, i) { return me.style['label']; })
	        .attr('x', function(d, i) { return x(i)+bar.width/2; })
	        .attr('y', function(d, i) { return y(d)-(bar.width/8); })
	        .attr('text-anchor', 'middle')
	        .attr('font-size', bar.width/3)
		.text( function(d, i) { return me.labels[i] || ''; });
	}
    }
})();
 
