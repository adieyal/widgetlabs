/* table-totals-1 */

(function() {
    var name = 'table-totals-1';
    
    if (typeof widget == 'undefined') {
	return;
    }
    
    widget.widgets[name] = function(node, data) {
	if (node === undefined){ throw Error('No node given.'); }	
	this.node = node;
	
	this.style = {
	    'text': 'fill:#000000;font-family:Calibri;font-size:7;font-weight:bold;'
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
            if (me.data.length === undefined || me.data.length === 0) { return; }
            if (me.data[0].length === undefined || me.data[0].length === 0) { return; }
	    
	    var maxcols = d3.max(me.data.map(function(d) { return d.length; }));
	    var x = d3.scale.linear()
		.domain([0, maxcols])
		.range([me.left, me.left+me.width]);
	    var y = d3.scale.linear()
		.domain([0, me.data.length])
		.range([me.top, me.top+me.height]);
	    
	    var totals = []
	    for (i=0; i<maxcols; i++) {
		var sum = 0;
		for (j=0; j<me.data.length; j++) {
		    var item = me.data[j][i];
		    if (typeof item === 'number') {
			sum += me.data[j][i];
		    } else {
			var num = parseFloat(item);
			if (!isNaN(num)) {
			    sum += num;
			}
		    }
		}
		totals.push(sum.toFixed(2));
	    }
	    
            me.node
		.attr('class', 'table');
	    var row = me.content.selectAll('g.table.totals')
		.data([totals]);
	    row.enter()
		.append('svg:g')
		.attr('class', function(d, i) { return 'table totals row row'+i; });
	    row.exit()
		.remove();

	    var cells = row.selectAll('text.table.totals.cell')
		.data(totals);
	    cells.enter()
		.append('svg:text')
		.attr('class', 'table totals cell')
		.attr('style', me.style['text'])
		.attr('text-anchor', 'middle');
	    cells.exit()
		.remove();
	    cells.text(function(d, i) { return d; })
		.attr('x', function(d, i) { return x(i+0.5); })
		.attr('y', function(d, i) { return me.top+me.height/2+this.getBBox().height/4; });
	}
    }
})();
 
