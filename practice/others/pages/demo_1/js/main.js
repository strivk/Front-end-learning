// simple helper
var qs = function(selector) {
    return document.querySelector(selector);
};

var qsa = function(selector) {
    return document.querySelectorAll(selector);
};

var hasClass = function hasClass(elem, className) {

    var classes = elem.className;
    className = className.trim();
    if (!classes) return false;
    
    classes = classes.trim().split(/\s+/);
    for (var i = 0, len = classes.length; i < len; i++) {
        if (classes[i] === className) return true;
    }
    
    return false;
};

var removeClass = function(elem, className) {
    if (className && hasClass(elem, className)) {
        className = className.trim();
        var classes = elem.className.trim().split(/\s+/);
        
        for (var i = 0, len = classes.length; i < len; i++) {
            if (classes[i] === className) {
                classes.splice(i, 1);
                break;
            }
        }
        
        elem.className = classes.join(' ');
    }
};

var addClass = function(elem, className) {

    if (className && !hasClass(elem, className)) {
        elem.className = [elem.className, className].join(' ');
    }
};

var findClassByPrefix = function(elems, prefix) {
    if (!elems) return [];
    
    var results = [];
    var regexp = new RegExp(prefix + '\\-\\w+(\\-\\w+)*', 'g');
    
    for (var i = 0, len = elems.length; i < len; i++) {
        var classes = elems[i].className.trim();
        results = results.concat(classes.match(regexp));
    }
    
    return results;
}


// Slider class
var Slider = function() {
    this.slider = qs('#slider');
    this.container = qs('.container');
    this.sheets = qsa('.sheet');
    this.spot = qs('.spot');
    this.spots = qsa('.spot li');
    this.viewBoxes = qsa('.view-box ul');

    this.index = 0;
    this.pre = -1;
    
    // private variables
    this._count = this.sheets.length;
    this._running = false;
    this._transitionCounter = 0;
    this._allTransitions = 0;
    
    this.hideClasses = findClassByPrefix(this.viewBoxes, 'hide');
    
    this._bindStop = this._stop.bind(this);

    self = this;

    // scroll the sheets 
    this.slider.addEventListener('wheel', function(event) {
        event = event || window.event;
        event.stopPropagation();

        self.scroll(event.deltaY);

    }, false);

    // callback exexutes once scroll to current sheet completely
    this.container.addEventListener('transitionend', function(event) {
        event = event || window.event;
        event.stopPropagation();

        self.doAfterScroll();

    }, false);

    this._showCurrSheet();
};


Slider.prototype.scroll = function(delta) {

    if (delta && !this._running) {
        var nextIndex = delta < 0 ? this.getIndex(this.index - 1) : this.getIndex(this.index + 1);
        if (this.index !== nextIndex) {
            this.goTo(nextIndex);
        }
    }
};


Slider.prototype.doAfterScroll = function() {

    this._showCurrSheet()
        ._hidePreSheet()
        ._setActiveSpot();
};


Slider.prototype.getIndex = function(newIndex) {
    if (newIndex < 0) return 0;
    if (newIndex >= this._count) return this._count - 1;

    return newIndex;
};


Slider.prototype.goTo = function(index) {
    this.pre = this.index;
    this.index = index;
    this._scrollToCurrent();
};

// private methods
Slider.prototype._scrollToCurrent = function() {
    this._running = true;
    this.container.style.top = (this.sheets[0].offsetHeight * this.index * -1) + 'px';
};


Slider.prototype._setActiveSpot = function() {
    var activeSpots = qsa('.spot li.active');

    for (var i = 0, len = activeSpots.length; i < len; i++) {
        removeClass(activeSpots[i], 'active');
    }

    addClass(this.spots[this.index], 'active');

    return this;
};


Slider.prototype._showCurrSheet = function() {
    var self = this;

    var preViewBox = this.viewBoxes[this.pre];

    if (preViewBox) {
        this.viewBoxes[this.pre].removeEventListener('transitionend', self._bindStop, false);
    }
    
    this.viewBoxes[this.index].addEventListener('transitionend', self._bindStop, false);
    
    removeClass(this.viewBoxes[this.index], this.hideClasses[this.index]);
    this._allTransitions = this._countChildrenTransition(this.viewBoxes[this.index]);

    return this;
};

Slider.prototype._getTransitionCount = function(elem) {
    if (!elem) return 0;
    var tr = window.getComputedStyle(elem, null).getPropertyValue('transition');
    return tr.split(',').length;
}

Slider.prototype._countChildrenTransition = function(elem) {
    var children = elem.children;
    var count = 0;
    for (var i = 0, len = children.length; i < len; i++) {
        count += this._getTransitionCount(children[i]);
    }
    
    return count;
}


Slider.prototype._hidePreSheet = function() {
    var preViewBox = this.viewBoxes[this.pre];

    if (preViewBox) {
        addClass(this.viewBoxes[this.pre], this.hideClasses[this.pre]);
    }

    return this;
};


Slider.prototype._stop = function(event) {
    event = event || window.event;
    event.stopPropagation();
    
    if (++this._transitionCounter >= this._allTransitions 
        && this.viewBoxes[this.index].contains(event.target)) {
        this._running = false;
        this._transitionCounter = 0;
        this._allTransitions = 0;
    }        
};


window.onload = function() {
    var aSlider = new Slider();
}