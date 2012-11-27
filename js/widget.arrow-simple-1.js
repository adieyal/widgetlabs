/* arrow-simple-1 */

(function() {
    var name = 'arrow-simple-1';
    
    if (typeof widget == 'undefined') {
	return;
    }
    
    widget.widgets[name] = function(node, data) {
	if (node === undefined){ throw Error('No node given.'); }	
	this.node = node;
	
	this.style = {
	    'up': 'fill:#62a73b',
	    'down' : 'fill:#bf202e;'
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
	    me.style = data['style'] || eval('('+me.node.attr('data-style')+')') || me.style;
	    
	    if (me.initialized != true) { throw Error('Attempt to update uninitialized widget.'); }

	    if ((me.data == 'up') || (me.data > 0)) { me.data = true; }
	    if ((me.data == 'down') || (me.data < 0)) { me.data = false; }
	    if ((me.data != true) && (me.data != false)) { throw Error('Widget does not know what to do with data.'); }

	    var x = d3.scale.linear()
		.domain([0, 4])
		.range([me.left, me.left+me.width]);
	    var y = d3.scale.linear()
		.domain([0, 4])
		.range([me.top, me.top+me.height]);
	    
	    var arrow = me.content.selectAll('path.arrow')
		.data([me.data]);
	    arrow.enter()
		.append('svg:path')
		.attr('class', 'arrow');
	    arrow.exit()
		.remove();
	    
	    arrow.classed('up', function(d, i) { return d; })
		.classed('down', function(d, i) { return !d; });
	    arrow.attr('d', function(d, i) {
		if (d) {
		    path = 'M '+x(1)+','+y(4)+' ';
		    path += 'H '+x(3)+' ';
		    path += 'V '+y(2)+' ';
		    path += 'H '+x(4)+' ';
		    path += 'L '+x(2)+','+y(0)+' ';
		    path += 'L '+x(0)+','+y(2)+' ';
		    path += 'H '+x(1)+' ';
		    path += 'z';
		    return path
		} else {
		    path = 'M '+x(1)+','+y(0)+' ';
		    path += 'H '+x(3)+' ';
		    path += 'V '+y(2)+' ';
		    path += 'H '+x(4)+' ';
		    path += 'L '+x(2)+','+y(4)+' ';
		    path += 'L '+x(0)+','+y(2)+' ';
		    path += 'H '+x(1)+' ';
		    path += 'z';
		    return path
		}
	    });
	    arrow.attr('style', function(d, i) { return d ? me.style['up'] : me.style['down']; });
	    
	}
    }
})();
 
