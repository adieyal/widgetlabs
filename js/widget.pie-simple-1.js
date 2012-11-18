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
    var name = 'pie-simple-1';
    
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
	    'slice0': 'fill:#cf3e96;stroke:#ffffff;stroke-width:0.5;stroke-miterlimit:1.414',
	    'slice1': 'fill:#62a73b;stroke:#ffffff;stroke-width:0.5;stroke-miterlimit:1.414',
	    'slice2': 'fill:#79317f;stroke:#ffffff;stroke-width:0.5;stroke-miterlimit:1.414',
	    'slice3': 'fill:#009983;stroke:#ffffff;stroke-width:0.5;stroke-miterlimit:1.414'
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

	    var tx = this.left+this.width/2;
	    var ty = this.top+this.height/2;
	    this.content.attr('transform', 'translate('+tx+','+ty+')');

	    this.color = ctx.colors || d3.scale.category20c();
	    
	    this.content.text('');
	},
	update: function() {
	    var me = this;
	    
            if (me.data.length === undefined || me.data.length === 0) { return; }
	    
            me.node
		.attr('class', 'piechart');
	    
            var arc = d3.svg.arc()
		.outerRadius(me.r);
	    
            var pie = d3.layout.pie()
		.value(function(d) {
		    if (typeof d === 'number') {
			return d;
		    } else {
			return d.value;
		    }
		    });
	    
	    var data = pie(this.data);
	    var arcs = me.content.selectAll('path.pie.slice')
		.data(data)
		.enter()
		.append('svg:path');
	    arcs.attr('class', function(d, i) { return 'pie slice slice'+i; })
		.attr('d', arc)
	        .attr('style', function(d, i) { return me.style['slice'+i]; });
	}
    }
})();
 
