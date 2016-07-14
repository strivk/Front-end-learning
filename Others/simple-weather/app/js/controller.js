function Controller (cities, view) {
    this.init();
    this.cities = cities || new Cities();
    this.view = view || new View();
    this.cities.init();
}

Controller.prototype = function () {
    function _init () {
        $(document).on('newCity', _.bind(this.newCity, this));
        $(document).on('updateCity', _.bind(this.updateCity, this));
        $(document).on('removeCity', _.bind(this.removeCity, this));
        $(document).on('cityUpdated', _.bind(this.updateCitiesView, this));
        $(document).on('cityAdded', _.bind(this.updateCitiesView, this));
        $(document).on('cityRemoved', _.bind(this.updateCitiesView, this));
        $(document).on('cityDuplicated', _.bind(this.updateCitiesView, this));
        $(document).on('citiesLoaded', _.bind(this.revealCities, this));
    }

    // Show saved cities
    function _revealEachCity (cities) {
        var self = this;

        return new Promise(function (resolve) {
            cities.reduce(function (sequence, city) {
                self.view.addCityView(city.query);
                $(document).trigger('cityAdded', [city]);
            }, Promise.resolve());
            resolve(cities);
        });
    }

    // Reveal saved data, eventData is cities
    function _revealCities (event, eventData) {
        var self = this;
        var cities = eventData;
        _revealEachCity.call(this, cities).then(function (cities) {
            cities.reduce(function (sequence, city) {
                var aCity = city;
                return sequence.then(function () {
                    $(document).trigger('updateCity', [aCity.query]);
                });
            }, Promise.resolve());
        });
    }

    // Update city's weather, eventData is city query
    function _updateCity (event, eventData) {
        event.stopPropagation();

        var city = this.cities.getCityByQuery(eventData);
        var self = this;
        if (city) {
            var $cityView = this.view.getCityView(eventData);
            this.view.startRefreshing($cityView);

            _fetchData(city).then(function (response) {
                city.setData(response);
            }).catch(function (error) {
                self.view.alert('Cannot get the weather data, try again later.');
                console.error(error.stack);
            }).then(function () {
                self.view.stopRefreshing($cityView);
            });
        }
    }

    // Remove city, eventData is city query
    function _removeCity (event, eventData) {
        event.stopPropagation();
        this.cities.removeCityByQuery(eventData);
    }

    // newCity event listener, eventData is the city query
    function _newCity (event, eventData) {
        event.stopPropagation();

        this.view.hideResults();
        this.view.addTrailingEmptyCityView(eventData);

        var city = new City(eventData);
        var self = this;

        _fetchData(city).then(function (response) {
            city.setData(response);
            self.cities.addCity(city);
        }).then(function () {
            self.view.stopRefreshing(self.view.getCityView(city.query));
        }).catch(function (error) {
            self.view.alert('Error! Cannot add this city.');
            self.view.removeTrailingEmptyCityView();
            // debug
            console.error(error.stack);
        });
    }

    // Render the city data in the given city's view
    function _showData (cityView, city) {
        var data = city.getData();
        var icon = constants.icons(city.isDay())[data.current_observation.icon];
        var forecastIcons = constants.icons(true);
        var viewData = {
            data: city.getData(),
            icon: icon,
            forecastIcons: forecastIcons
        };
        this.view.renderCityView(cityView, viewData);
    }

    // append or remove city view block
    function _updateCitiesView (event, eventData) {
        event.stopPropagation();
        var $cityView = this.view.getCityView(eventData.query);
        var type = event.type;

        if (type === 'cityAdded' || type === 'cityUpdated') {
            _showData.call(this, $cityView, eventData);
        } else if (type === 'cityRemoved' || type === 'cityDuplicated') {
            this.view.removeCityView($cityView.last());
        }
    }

    return {
        init: _init,
        newCity: _newCity,
        updateCity: _updateCity,
        removeCity: _removeCity,
        updateCitiesView: _updateCitiesView,
        revealCities: _revealCities
    };
}();
