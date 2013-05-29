/* line-simple-1 */

(function() {
    var name = 'line-simple-1';
    
    if (typeof widget == 'undefined') {
	return;
    }
    
    widget.widgets[name] = function(node, data) {
	if (node === undefined){ throw Error('No node given.'); }
	this.node = node;
	
	this.style = {
	    'line': 'stroke:#cf3e96;stroke-width:1;fill-opacity:0;',
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
	    
            this.node
		.attr('class', 'linechart');

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
	    me.style = data['style'] || eval('('+me.node.attr('data-style')+')') || me.style;
	    me.domainx = data['domain-x'] || [0, me.data.length];
	    me.domainy = data['domain-y'] || [0, d3.max(me.data)];

	    if (me.initialized != true) { throw Error('Attempt to update uninitialized widget.'); }
            if (me.data.length === undefined || me.data.length === 0) { return; }
	    
	    var x = d3.scale.linear()
		.domain(me.domainx)
		.range([me.left, me.left+me.width]);
	    var y = d3.scale.linear()
		.domain(me.domainy)
		.range([me.top+me.height, me.top]);
	    var line = d3.svg.line()
		.x(function(d, i) { return x(i+0.5) })
		.y(function(d, i) { return y(d) });
	    
	    var lines = me.content.selectAll('path.linegraph.line')
		.data([me.data]);
	    lines.enter()
		.append('svg:path');
	    lines.exit()
		.remove();
	    lines.attr('class', function(d, i) { return 'linegraph line line'+i; })
		.attr('style', function(d, i) { return me.style['line']; })
		.attr('d', function(d, i) { return line(d); });
	    /*
	    var lines = me.content.selectAll('g.linegraph.line')
		.data([me.data]);
	    lines.enter()
		.append('svg:g');
	    lines.exit()
		.remove();
	    lines.each(function(d, i) {
		d3.select(this).selectAll('line').remove();
		for (j=0; j<d.length; j++) {
		    item1 = d[j];
		    item2 = d[j+1];
		    if ((typeof(item1) === 'number') && (typeof(item2) === 'number')) {
			d3.select(this)
			    .append('svg:line')
			    .attr('x1', x(j+0.5))
			    .attr('x2', x(j+1.5))
			    .attr('y1', y(item1))
			    .attr('y2', y(item2))
			    .attr('style', me.style['line']);
		    }
		}
	    });
	    */
	}
    }
})();
 
