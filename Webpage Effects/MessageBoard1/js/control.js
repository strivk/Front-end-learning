/* get DOM elements by id, class or tagname*/
var getMan = {
    byId: function(id) {
        return typeof id === 'string' ? document.getElementById(id) : id;
    },
    
    byClass: function(className) {
        return typeof className === 'string' ? document.getElementsByClassName(className) : className;
    },
    
    byTagName: function(tagName) {
        return typeof tagName === 'string' ? document.getElementsByTagName(tagName) : tagName;
    }
};

/* manipulate css */
var cssMan = {

};

/* main */
// get real style value
var styleValue = function(element, prop) {
    var cStyle = window.getComputedStyle(element);
    var propName = typeof prop === 'string' ? prop : '' + prop;
    
    return window.parseInt(cStyle[propName], 10);
}

// change li background color
var toggleLiBg = function(event) {
    switch (event.type) {
        case 'mouseover':
            this.style.backgroundColor = '#dee4ea';
            this.numHeight = this.clientHeight;
            this.elOpacity = styleValue(this, 'opacity');
            
            // for "no message" LI, this.delBtn is undefined
            if (this.delBtn) {
                
                this.delBtn.style.display = 'inline';
                this.delBtn.parentLi = this;
                this.delBtn.addEventListener('click', deleteMsg, false);
            }
            
            break;
        case 'mouseout':
            this.style.backgroundColor = '#fff';
            
            if (this.delBtn) {
                this.delBtn.style.display = 'none';
            }
            
            break;
    }
};

// delete msg when click on delete button
var deleteMsg = function(event) {
    
    var pLi = this.parentLi;
    var parentUl = pLi.parentElement;
    
    timer = setInterval(function() {
        var step = .1;
        //change opaciy
        pLi.elOpacity -= step;
        
        pLi.style.opacity = pLi.elOpacity + '';
        
        if (pLi.style.opacity <= 0) {
            clearInterval(timer);
            
            var cHeight = styleValue(pLi, 'height');
            
            timer = setInterval(function() {
                var stepH = 8;
                cHeight -= stepH;
                
                pLi.style.height = cHeight + 'px';
                
                if (cHeight <= 0) {
                    parentUl.removeChild(pLi);
                    

                    // if all message LIs have been deleted
                    if (!parentUl.lastElementChild) {
                        // show this "no message block"
                        var empty = document.getElementsByClassName('empty')[0];
                        
                        empty.style.display = 'block';
                    }
                    
                    clearInterval(timer);
                }
                
            }, 30);
        }
        
    }, 30);
    
};

// add a new message
var sendFcn = function() {


};

// active the selected icon, disable other icons
var activeIcon = function() {
    var group = this.group;
    
    for (var i = 0, len = group.length; i < len; i++) {
        var img = group[i].getElementsByTagName('img')[0];
        img.className = '';
    }
    
    var activeImg = this.getElementsByTagName('img')[0];
    activeImg.className = 'active';
};

// user's msg
var msgItems = getMan.byClass('msg-item');
var timer    = null;

for (var i = 0, len = msgItems.length; i < len; i++) {
    var aLi    = msgItems[i];
    var delBtn = aLi.getElementsByClassName('del')[0];
    
    aLi.addEventListener('mouseover', toggleLiBg, false);
    aLi.addEventListener('mouseout', toggleLiBg, false);

    aLi.delBtn = delBtn;
}

// icons
var headIcons = getMan.byClass('icon');

for (var i = 0, len = headIcons.length; i < len; i++) {
    var aIcon = headIcons[i];
    
    aIcon.group = headIcons;    
    aIcon.addEventListener('click', activeIcon, false);
}