(function(window, _u) {
	'use strict';


	/**
     * Controller in MVC, controling view of category list
     *
	 * @param {object} Category list model object
	 * @param {object} view object	
	 */
	function CategoryListController(model, view) {
		var self = this;
		self.model = model;
		self.view = view;

		self.view.bind('toggleList', function(item) {
			self.toggleCategoryList(item);
		});
        
        self.view.bind('removeItem', function(item) {
            self.removeCategoryItem(item);
        });

        self.view.bind('addItem', function(item) {
        	self.addCategoryItem(item);
        });
	};

    CategoryListController.prototype.buildView = function(local) {

    };

	CategoryListController.prototype.toggleCategoryList = function(item) {
		var self = this;
		self.view.render('toggleList', item);
	};
    
    CategoryListController.prototype.removeCategoryItem = function(item) {
        var self = this;
        self.view.render('removeItem', item);
    };

    CategoryListController.prototype.addCategoryItem = function(item) {
        var self = this;
        self.model.create(item.title, function(newItem) {
        	// the argument is undefined if the new category name
        	// already exists
            if (!newItem) {
                var msg = 'The category name already exists, please enter another one.';
                self.view.render('alert', msg);
            }
            else if (!newItem.title) {
                var msg = 'Category name cannot be empty.';
                self.view.render('alert', msg);
            }	
        	else {
        		self.view.render('addItem', newItem);
        	}
        });
    };

    CategoryListController.prototype.alert = function(msg) {
    	var self = this;
    	self.view.render('alert', msg);
    }

	// Export to window
	window.app = window.app || {};
	window.app.CategoryListController = CategoryListController;

}(window, _util));