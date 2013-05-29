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
	this.node = node;
	
	this.style = {
	    'slice0': 'fill:#cf3e96;stroke:#ffffff;stroke-width:0.5;stroke-miterlimit:1.414',
	    'slice1': 'fill:#62a73b;stroke:#ffffff;stroke-width:0.5;stroke-miterlimit:1.414',
	    'slice2': 'fill:#79317f;stroke:#ffffff;stroke-width:0.5;stroke-miterlimit:1.414',
	    'slice3': 'fill:#2393d9;stroke:#ffffff;stroke-width:0.5;stroke-miterlimit:1.414'
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

	    var tx = this.left+this.width/2;
	    var ty = this.top+this.height/2;
	    this.content.attr('transform', 'translate('+tx+','+ty+')');
	    
	    this.content.text('')
	    this.initialized = true;;
	},
	update: function(data) {
	    var me = this;
	    me.data = data['data'] || data || me.data;
	    me.style = data['style'] || eval('('+me.node.attr('data-style')+')') || me.style;
	    	
	    if (me.initialized != true) { throw Error('Attempt to update uninitialized widget.'); }
	    if (me.data === undefined){ return; }
            if (me.data.length === undefined || me.data.length === 0) { return; }
	    
            me.node
		.attr('class', 'piechart');
	    
            var arc = d3.svg.arc()
		.outerRadius(me.r);
	    
            var pie = d3.layout.pie()
		.value(function(d, i) {
		    if (typeof d === 'number') {
			return d;
		    } else {
			if ((d.value) && (typeof d.value === 'number')) {
			    return d.value;
			} else {
			    return 0;
			}
		    }});
	    
	    var arcs = me.content.selectAll('path.pie.slice')
		.data(pie(me.data));
	    arcs.enter()
		.append('svg:path')
		.attr('class', function(d, i) { return 'pie slice slice'+i; });
	    arcs.exit()
		.remove();
	    arcs.attr('d', arc)
	        .attr('style', function(d, i) { return me.style['slice'+i]; });
	}
    }
})();
 
