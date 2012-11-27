/* bar-rounded-1 */

(function() {
    var name = 'bar-rounded-1';
    
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
	    this.r = d3.min([this.width, this.height])/2;
	    bbox.attr('visibility', 'hidden');
	    bbox.attr('opacity', '0');
	    
	    this.content.text('');
	},
	update: function(data) {
	    var me = this;
	    me.data = data['data'] || data;
	    me.style = data['style'] || eval('('+me.node.attr('data-style')+')') || me.style;
	    
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
		.attr('class', 'barchart');
	    
	    var bars = me.content.selectAll('path.bargraph.bar')
		.data(me.data)
		.enter()
		.append('svg:path');
	    bars.attr('class', function(d, i) { return 'bargraph bar bar'+i; })
	        .attr('style', function(d, i) { return me.style['bar']; })
		.attr('d', function(d, i) {
		    var path;
		    path = 'M '+(x(i)+bar.width*0.05)+' '+y(0)+' ';
		    path = path+'V '+y(d)+' ';
		    path = path+'h '+(bar.width-bar.r)+' ';
		    if ((y(0)-y(d)) >= bar.r) {
			path = path+'a '+bar.r+','+bar.r+' 90 0,1 '+bar.r+','+bar.r+' ';
			path = path+'V '+y(0)+' ';
		    } else {
			path = path+'a '+(y(0)-y(d))+','+bar.r+' 90 0,1 '+bar.r+','+(y(0)-y(d))+' ';
		    }
		    path = path+'z';
		    return path;
		});
	    
	    var labels = me.content.selectAll('text.bargraph.bar.label')
		.data(me.data)
		.enter()
		.append('svg:text');
	    labels.attr('class', function(d, i) { return 'bargraph bar label label'+i; })
	        .attr('style', function(d, i) { return me.style['label']; })
	        .attr('x', function(d, i) { return x(i)+bar.width/2; })
	        .attr('y', function(d, i) { return y(d)-(bar.width/8); })
	        .attr('text-anchor', 'middle')
	        .attr('font-size', bar.width/3)
		.text( function(d, i) { return d; });
	}
    }
})();
 
