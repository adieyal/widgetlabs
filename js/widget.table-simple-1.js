/* table-simple-1 */

(function() {
    var name = 'table-simple-1';
    
    if (typeof widget == 'undefined') {
	return;
    }
    
    widget.widgets[name] = function(node, data) {
	if (node === undefined){ throw Error('No node given.'); }	
	this.node = node;
	
	this.style = {
	    'text': 'fill:#595A5C;font-family:Calibri;font-size:7;'
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
	    me.style = data['style'] || me.style;
	    
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

            me.node
		.attr('class', 'table');
	    var rows = me.content.selectAll('g.table.row')
		.data(me.data);
	    rows.enter()
		.append('svg:g')
		.attr('class', function(d, i) { return 'table row row'+i; });
	    rows.exit()
		.remove();
	    
	    var cells = rows.selectAll('text.table.cell')
		.data(function(d, i) {
		    return d.map(function(d) {
			return { 'data': d, 'row': i };
		    });
		});
	    cells.enter()
		.append('svg:text')
		.attr('class', 'table cell')
		.attr('style', me.style['text'])
		.attr('text-anchor', 'middle');
	    cells.exit()
		.remove();
	    cells.text(function(d, i) { return d['data']; })
		.attr('x', function(d, i) { return x(i+0.5); })
		.attr('y', function(d, i) { return y(d['row']+0.5)+this.getBBox().height/4; });
	}
    }
})();
 
