/* The story feed infohub widget. */

(function() {
    if (typeof widget == 'undefined') {
	return;
    }
    
    widget.widgets.text = function(node, data) {
	this.node = node;
	this.data = data;
	this.initialize();
	this.update();
    }
    
    widget.widgets.text.prototype = {
	initialize: function() {
	    return;
	},
	update: function() {
	    var node = this.node;
	    node.text(this.data['value']);
	}	    
    };
})();
