function Moveit(el, options) {
    this.el = el;
    this.length = this.getLength();
    this.setupPath(options);
}
Moveit.prototype.getLength = function() {
    if (this.el.nodeName) {
        var tagName = this.el.nodeName.toLowerCase(),
            d;
        if (tagName === 'path') {
            d = this.el.getTotalLength();
        } else if (tagName === 'circle') {
            d = 2 * Math.PI * parseFloat(this.el.getAttribute('r'));
        } else if (tagName === 'rect') {
            d = 2 * this.el.getAttribute('width') + 2 * this.el.getAttribute('height');
        } else if (tagName === 'line') {
            var x1 = this.el.getAttribute('x1');
            var x2 = this.el.getAttribute('x2');
            var y1 = this.el.getAttribute('y1');
            var y2 = this.el.getAttribute('y2');
            d = Math.sqrt(Math.pow((x2 - x1), 2) + Math.pow((y2 - y1), 2));
        }
        return d;
    }
}
Moveit.prototype.clear = function() {
    this.el.style.transition = this.el.style.WebkitTransition = 'none';
}
Moveit.prototype.set = function(options) {
    this.clear();
    if (options.duration === 'undefined') {
        this.setupPath(options);
    } else {
        var timing = (options.timing) ? options.timing : 'linear';
        this.el.style.transition = this.el.style.WebkitTransition =
            'stroke-dashoffset ' + options.duration + 's ' + timing +
            ', stroke-dasharray ' + options.duration + 's ' + timing;
        var delay = (options.delay) ? options.delay : 0;  
        var context = this;
            this.el.addEventListener('transitionend', function(e) {
        				if (options.callback || options.follow) { 
                if (e.propertyName === 'stroke-dashoffset') {
                  if(options.follow) {
                  	context.el.style.transition = context.el.style.WebkitTransition = 'none';
                    context.setupPath({
                      start: -(100 - context.getValue(options.start)),
                      end: (context.getValue(options.end) - 100)
                    });
                    delete options.follow;
                  }
                  if(options.callback) {
                  	setTimeout(function() {
                      options.callback();
                      delete options.callback;
                    })  
                  }
                  
                  
                  
                  if(options.callback) {
                    //options.callback();
                  }
                  	
                }
              }
            }); 
        setTimeout(function() {
            context.setupPath(options);
        }, delay * 1000);
    }
}

Moveit.prototype.getValue = function(val) {
  	if(val.toString().indexOf('%') === -1) {
    	return val;
    }
    return parseFloat(val.substring(0, val.indexOf('%')));
}
Moveit.prototype.getPercentage = function(val) {
    return (val / 100) * this.length;
}
Moveit.prototype.setupPath = function(options) {
    var start = this.getValue(options.start);
    var end = this.getValue(options.end);
    var dash = (end - start);
    var gap = (100 - (end - start));
    var offset = (100 - start);
    this.el.style.strokeDasharray = this.getPercentage(dash) +
        ' ' + this.getPercentage(gap);
    this.el.style.strokeDashoffset = this.getPercentage(offset);
}