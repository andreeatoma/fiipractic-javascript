var pizza = (function (window) {
    var startPricePizza = 5;
    var totalPricePizza = startPricePizza;

    var ingredientsPrices = {
            salami: 1,
            prosciutto: 2,
            ham: 3,
            pollo: 4,
            mozzarella: 1,
            parmesan: 2,
            gorgonzola: 2,
            tomatoes: 2,
            onions: 1,
            olives: 3,
            corn: 3
    }
    var configuration = {
        size: null,
        crust: null,
        ingredients: {
            salami: false,
            prosciutto: false,
            ham: false,
            pollo: false,
            mozzarella: false,
            parmesan: false,
            gorgonzola: false,
            tomatoes: false,
            onions: false,
            olives: false,
            corn: false
        },
        orderDate: null,
        price: null
    };

    var timeFormat = "YYYY-MM-DD HH:mm:ss";

    function toggleSize(name) {
        var sizes = window.document.querySelectorAll('.pizza-size');

        sizes.forEach(function (sizeElement) {
            sizeElement.classList.remove('selected');
        });

        var sizeToSelect = window.document.querySelector('.pizza-size[data-pizza-size="' + name + '"]');
        sizeToSelect.classList.toggle('selected');

        if (sizeToSelect.classList.contains('selected')) {
            configuration.size = name;
        }
        storeConfiguration();
    }

    function toggleCrust(name) {
        var crusts = window.document.querySelectorAll('.pizza-crust');

        crusts.forEach(function (crustElement) {
            crustElement.classList.remove('selected');
        });

        var crustToSelect = window.document.querySelector('.pizza-crust[data-pizza-crust="' + name + '"]');
        crustToSelect.classList.toggle('selected');

        if (crustToSelect.classList.contains('selected')) {
            configuration.crust = name;
        }
        storeConfiguration();
    }

    function toggleIngredient(name) {
        var ingredientToSelect = window.document.querySelector('.pizza-ingredient[data-pizza-ingredient="' + name + '"]');
        ingredientToSelect.classList.toggle('selected');
        
        var isSelected = ingredientToSelect.classList.contains('selected');
        configuration.ingredients[name] = isSelected;

        if (isSelected) {
           totalPricePizza += ingredientsPrices[name];
       } else {
            totalPricePizza -= ingredientsPrices[name];
       }
        
        storeConfiguration();
    }

    function reset() {
        var sizes = window.document.querySelectorAll('.pizza-size');

        sizes.forEach(function (sizeElement) {
            sizeElement.classList.remove('selected');
        });

        var crusts = window.document.querySelectorAll('.pizza-crust');

        crusts.forEach(function (crustElement) {
            crustElement.classList.remove('selected');
        });

        var ingredients = window.document.querySelectorAll('.pizza-ingredient');

        ingredients.forEach(function (ingredientElement) {
            ingredientElement.classList.remove('selected');
        });

        configuration.size = null;
        configuration.crust = null;
        configuration.orderDate = null;
        for (var i in configuration.ingredients) {
            configuration.ingredients[i] = false;
        }

        totalPricePizza = startPricePizza;
        localStorage.removeItem('configuration');
    }

    function isValid() {
        var ingredientsLength = 0;
        for (var i in configuration.ingredients) {
            if (configuration.ingredients[i]) {
                ingredientsLength++;
            }
        }
        return configuration.size != null && configuration.crust != null && ingredientsLength >= 3;
    };

    function storeConfiguration() {
        localStorage['configuration'] = JSON.stringify(configuration);
    }

    function loadConfigurationIfExists() {
        if (typeof localStorage['configuration'] != 'undefined') {
            configuration = JSON.parse(localStorage['configuration']);

            if (configuration.size != null) {
                toggleSize(configuration.size);
            }

            if (configuration.crust != null) {
                toggleCrust(configuration.crust);
            }

            for(var i in configuration.ingredients) {
                if (configuration.ingredients[i]) {
                    toggleIngredient(i);
                }
            }
        }
    }

    function save() {
        // load pre-saved history or create a new array
        var existingHistory = typeof localStorage['history'] != 'undefined' ? JSON.parse(localStorage['history']) : [];

        configuration.orderDate = moment().format(timeFormat);
        configuration.price = totalPricePizza;

        // add the current configuration to the in-memory list
        existingHistory.push(configuration);

        // add the current configuration to the page
        showOrder(configuration);

        // save the list of orders in localStorage
        localStorage['history'] = JSON.stringify(existingHistory);
    }

    function showOrder(order) {
        // compute comma-separated ingredient list
        var ingredientsList = '';
        for (var i in order.ingredients) {
            if (order.ingredients[i]) {
                ingredientsList += i + ', ';
            }
        }
        ingredientsList = ingredientsList.substr(0, ingredientsList.length - 2);

        // create a new element for the order
        var element = window.document.createElement('span');
        // set the inner HTML of the element
        element.innerHTML = order.size + ' pizza with a ' + order.crust + ' crust and a topping of: ' + ingredientsList + '. ' + ' total price of pizza ' + order.price + ' lei ' +  moment(order.orderDate, timeFormat).fromNow();
        // timeElement.innerHTML = order.orderDate + " " + order.size + ' pizza with a ' + order.crust + ' crust and a topping of: ' + ingredientsList + '.';
        // add the order element to the list
        window.document.querySelector('#history').appendChild(element);

         // create a new element for the live label 
        // var label = window.document.createElement('label');
        // set the inner HTML of the element 
        
        //add the label element to the list
        // window.document.querySelector('#menu').appendChild(label);
    }
    

    function loadHistoryIfExists() {
        if (typeof localStorage['history'] != 'undefined') {
            var history = JSON.parse(localStorage['history']);
            for (var i = 0; i < history.length; i++) {
                showOrder(history[i]);
            }
        }
    }

    function getPrice() {
        return totalPricePizza;
    }

    return {
        toggleSize: toggleSize,
        toggleCrust: toggleCrust,
        toggleIngredient: toggleIngredient,
        reset: reset,
        isValid: isValid,
        loadConfigurationIfExists: loadConfigurationIfExists,
        loadHistoryIfExists: loadHistoryIfExists,
        save: save,
        getPrice: getPrice
    }
})(window);