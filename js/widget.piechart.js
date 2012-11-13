/* Piechart widget.
   
   Data should be:
   {
       ctx: {
	   "colors": ["#F00", "#C00", "#900"]
       },
       data: [
	   {"label": "one", "value": 20}, 
           {"label": "two", "value": 50}, 
           {"label": "three", "value": 30}
       ]
   }
*/
	   

(function() {
    if (typeof widget == 'undefined') {
	return;
    }
    
    widget.widgets.piechart = function(node, data) {
	if (node === undefined){ throw Error('No node given.'); }	
	if (data.data === undefined){ throw Error('No data given.'); }
        if (data.data.length === undefined || data.data.length === 0) { throw Error('Data invalid.'); }
	
	this.node = node;
	this.ctx = data.ctx || {};
	this.data = data.data;
	
	this.initialize();
	this.update();
    }
    
    widget.widgets.piechart.prototype = {
	initialize: function() {
	    var ctx = this.ctx;
	    
	    this.r = 100;
	    this.color = ctx.colors || d3.scale.category20c();
	    
	    this.node.text('');
	},
	update: function() {
	    var node = this.node;
	    var me = this;
	    
            if (this.data.length === undefined || this.data.length === 0) { return; }
	    
            var vis = node
		.attr('class', 'piechart')
		.attr('viewBox', '-100 -100 200 200')
	    
            var arc = d3.svg.arc()
		.outerRadius(this.r);
	    
            var pie = d3.layout.pie()
		.value(function(d) { return d.value; });
	    
	    var data = pie(this.data);
	    var arcs = vis.selectAll('path.pie.slice')
		.data(data)
		.enter()
		.append('svg:path');
	    arcs.attr('class', 'pie slice')
		.attr('fill', function(d, i) { return me.color[i]; } )
		.attr('d', arc);
	    
	    var labels = vis.selectAll('text.pie.slice.label')
		.data(data)
		.enter()
		.append('svg:text');
	    labels.attr('class', 'pie slice label')
		.attr('transform', function(d) {
                    d.innerRadius = 0;
                    d.outerRadius = this.r;
                    return 'translate(' + arc.centroid(d) + ')';
		})
		.attr('text-anchor', 'middle')
		.text(function(d, i) { return d.data.label || ''; });
	}
    }
})();
 
