/* bar-rounded-1 */

(function() {
    var name = 'axis-horizontal-grid-1';
    
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
	this.labels = data.labels;
	
	this.style = {
	    'axis': 'stroke:#000000;stroke-width:0.25;stroke-linecap:round;stroke-dasharray:0, 0.5',
	    'grid': 'stroke:#000000;stroke-width:0.25;stroke-linecap:round;stroke-dasharray:0, 0.5',
	    'text': 'fill:#595a5c;font-family:Myriad Roman'
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
	    bbox.attr('visibility', 'hidden');
	    bbox.attr('opacity', '0');
	    
	    this.content.text('');
	},
	update: function() {
	    var me = this;
	    
            if (me.data.length === undefined || me.data.length === 0) { return; }

	    var bar = {};
	    bar.width = (me.width/me.data.length)*0.9;
	    bar.r = bar.width/4;
	    
	    var x = d3.scale.linear()
		.domain([0, me.data.length])
		.range([me.left, me.left+me.width]);
	    var y = d3.scale.linear()
		.domain([0, d3.max(me.data)])
		.range([me.top+me.height, me.top]);
            me.node
		.attr('class', 'axis');
	    
	    me.content.append('svg:line')
		.attr('x1', me.left)
		.attr('x2', me.left)
		.attr('y1', me.top)
		.attr('y2', me.top+me.height)
		.attr('style', me.style['axis']);
	    me.content.append('svg:line')
		.attr('x1', me.left)
		.attr('x2', me.left+me.width)
		.attr('y1', me.top+me.height)
		.attr('y2', me.top+me.height)
		.attr('style', me.style['axis']);
	    
	    var ticks = y.ticks(5);
	    var hgrid = me.content.selectAll('line.axis.grid.hgrid')
		.data(ticks)
		.enter()
		.append('svg:line');
	    hgrid.attr('x1', me.left)
		.attr('x2', me.left+me.width)
		.attr('y1', function(d, i) { return y(d); })
		.attr('y2', function(d, i) { return y(d); })
		.attr('style', me.style['grid']);

	    var xlabels = me.content.selectAll('text.axis.label.ylabel')
		.data(me.labels)
		.enter()
		.append('svg:text');
	    xlabels.attr('y', me.top+me.height+me.height/12+1)
		.attr('x', function(d, i) { return x(i)+(me.width/me.data.length)/2; })
		.attr('style', me.style['text'])
	        .attr('text-anchor', 'middle')
	        //.attr('dominant-baseline', 'middle')
	        .attr('font-size', me.height/12)
		.text(function (d, i) { return d; });

	    var ylabels = me.content.selectAll('text.axis.label.ylabel')
		.data(ticks)
		.enter()
		.append('svg:text');
	    ylabels.attr('x', me.left-2)
		.attr('y', function(d, i) { return y(d); })
		.attr('style', me.style['text'])
	        .attr('text-anchor', 'end')
	        .attr('dominant-baseline', 'middle')
	        .attr('font-size', me.height/12)
		.text(function (d, i) { return d; });
	}
    }
})();
 
