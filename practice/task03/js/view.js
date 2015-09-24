(function(window, _u) {
	'use strict';

	function CategoryListView(template) {
		this.template = template;
		this.listWrapper = qs('.app-list[data-list-level="1"]');
		this.categorylist = qs('.li[data-list-type="category]', this.listWrapper);
		this.list = qs('.app-list[data-list-level="2"]', this.categorylist);
		this.addCategoryBtn = qs('.app-add-category-btn');
	};

	CategoryListView.prototype.render = function(renderCmd, parameter) {
		var self = this;
		var renderCommands = {
			toggleList: function() {
				self.toggleList(parameter.list, parameter.icon);
			},
            
            removeItem: function() {
                self.removeCategoryItem(parameter.listItem);
            }, 
            addItem: function() {
            	self.addCategoryItem(parameter.title);
            }
		}

		renderCommands[renderCmd]();
	};

	CategoryListView.prototype.bind = function(event, handler) {
		var self = this;
		if (event === 'toggleList') {
			_u.delegateEvent(self.listWrapper, 'h2', 'click', function() {
				var iconSelector = '[class^="fa"]',

					// click event source
					src = this,

					// in case user click on icon (<i> tag) instead of the 
					// actual menu item, so, we check the click source type 
					// in order to get the correct list and icon object
					list = src.tagName === 'I' ? 
								 src.parentNode.nextElementSibling : src.nextElementSibling,

					titleIcon = src.tagName === 'I' ? 
								 qs(iconSelector, src.parentNode) : 
								 qs(iconSelector, src);
							

				handler({
					list: list,
					icon: titleIcon
				});
			});			

		}
		else if (event === 'removeItem') {
       		delegate(self.listWrapper, 'i.app-remove-btn', 'click', function() {
       			
       			var elem = this;

				while(!(elem.tagName === 'LI')) {
					elem = elem.parentNode;
				}  

				handler({ listItem: elem });			
       		});  
		}
		else if (event === 'addItem') {
			_u.addEvent(self.addCategoryBtn, 'click', function() {
				var categoryName = prompt('Please enter the category name:', '');
				categoryName === '' ? 
					alert('Category name cannot be empty.') : 
					handler({ title: categoryName });
			});
		}
	};

	CategoryListView.prototype.toggleList = function(list, icon) {
		if (_u.hasClass(list, 'app-list-collapse')) {
			_u.removeClass(list, 'app-list-collapse');
			icon ? icon.className = 'fa fa-folder-open' : null;
		}
		else {
			_u.addClass(list, 'app-list-collapse');
			icon ? icon.className = 'fa fa-folder' : null;
		}
	};
    
    CategoryListView.prototype.removeCategoryItem = function(listItem) {
    	var opt = confirm('Do you want to remove this category?');
    	var list = listItem.parentNode;
        opt ? listItem.parentNode.removeChild(listItem) : null;   
    };

    CategoryListView.prototype.addCategoryItem = function(itemName) {  
    	var self = this;  	
    	self.list.innerHTML += self.template.add(itemName);
    };

	// Export to window
	window.app = window.app || {};
	window.app.CategoryListView = CategoryListView;

}(window, _util));