/* The story feed infohub widget. */

(function() {
    if (typeof widget == 'undefined') {
        return;
    }
    
    widget.widgets.text = function(node, data) {
        this.node = node;
        
        this.initialize();
        
        if (data) {
            this.update(data);
        }
    }
    
    widget.widgets.text.prototype = {
        initialize: function() {
            this.style = null;
        },
        update: function(data) {
            var me = this;
            me.data = data['value'] || data || me.data;
            me.style = data['style'] || me.style;
            
            me.node.text(me.data);
            if (me.style) {
                me.node.attr('style', me.style);
            }
        }	    
    };
})();
