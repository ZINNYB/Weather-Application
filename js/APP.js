
// /* **********************************************
// **
// ** frozen logo behaviour coding
// **
// ** 
// ** ******************************************** */

var frozen = document.querySelector(".frozen");

frozen.addEventListener("input", function() {
    this.setAttribute("data-heading", this.innerText);
});



// /* **********************************************
// **
// ** UI Elements Module
// **
// ** - this module will be responsible for controling UI Elements like 'menu'
// ** ******************************************** */

const UI = (function () {
    let menu = document.querySelector("#menu-container");

    // show the app and hide the loading screen
    const showApp = () => {
        document.querySelector("#app-loader").classList.add('display-none');
        document.querySelector("main").removeAttribute('hidden');
    };

    // hide the app and show the loading screen
    const loadApp = () => {
        document.querySelector("#app-loader").classList.remove('display-none');
        document.querySelector("main").setAttribute('hidden','true');
    };

    // show menu
    const _showMenu = () => menu.style.right = 0;

    // hide menu
    const _hideMenu = () => menu.style.right = '-65%';


    
    const _toggledailyWeather = () => {
        let dailyWeather = document.querySelector("#daily-forecast-case"),
            arrow = document.querySelector("#sections-navigation-icon").children[0],

            hourlyWeather = document.querySelector("#current-hourly-forecast"),
            
            visible = dailyWeather.getAttribute('visible');


        if( visible == 'false') { 
            dailyWeather.setAttribute('visible','true');
            dailyWeather.style.bottom = 0;
            arrow.style.transform = "rotate(180deg)";
            hourlyWeather.style.opacity = 1;
        } else if( visible == 'true') {
            dailyWeather.setAttribute('visible', 'false');
            dailyWeather.style.bottom = "-40%";
            arrow.style.transform = "rotate(0deg)";
            hourlyWeather.style.opacity = 1;
        } else console.error("Unknown state of the hourly weather panel and visible attribute");
    };

    const drawWeatherData = (data, location) => {


        let currentlyData = data.currently,
            dailyData = data.daily.data,
            hourlyData = data.hourly.data,
            //headers = data.headers.date;
            
            weekDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
            dailyForecastCase = document.querySelector("#daily-forecast-case"),
            dailyWeatherModel,
            day,
            maxMinTemp,
            dailyIcon,
            currentHourlyForecast = document.querySelector("#current-hourly-forecast"),
            hourlyWeatherModel,
            hourlyIcon;

        


        // set current weather
        // ===================
        // set current location
        
       
        document.querySelectorAll(".location-label").forEach((e) => {
            e.innerHTML = location;

        });
        // set the background
        document.querySelector('main').style.backgroundImage = `url("./assets/images/bg-images/${currentlyData.icon}.jpg")`;
        // set the icon
        document.querySelector("#currentlyIcon").setAttribute('src', `./assets/images/summary-icons/${currentlyData.icon}-white.png`);
        // set summary
        document.querySelector("#summary-label").innerHTML = currentlyData.summary;
        // set temperature from Fahrenheit -> Celcius
        document.querySelector("#degrees-label").innerHTML = Math.round((
            currentlyData.temperature - 32) * 5 / 9) + '&#176;' + 'c'

            // set UV index
        document.querySelector("#UV-label").innerHTML = (currentlyData.uvIndex);

       // set time **************************************************************//
          
        function startTime(data, location) {
			let today = new Date(),
			 h = today.getHours(),
			m = today.getMinutes(),
			 s = today.getSeconds();
			m = checkTime(m);
			s = checkTime(s);
			document.getElementById('time-label').innerHTML =
			h + ":" + m + ":" + s;
			var t = setTimeout(startTime, 500);
			}
			function checkTime(i) {
			if (i < 10) {i = "0" + i}; // add zero in front of numbers < 10
			return i;
		}
        
        // set humidty
        document.querySelector("#humidity-label").innerHTML = Math.round(currentlyData.humidity * 100) + '%';
        // set wind speed
        document.querySelector("#pressure-label").innerHTML = (currentlyData.pressure).toFixed(1) + ' pa';



        
        // set hourly weather
        // ===================
        while (currentHourlyForecast.children[1]) {
            currentHourlyForecast.removeChild(currentHourlyForecast.children[1])
        }

        for (let i = 0; i <= 24; i++) {
            // clone the node and remove display none close
            hourlyWeatherModel = currentHourlyForecast.children[0].cloneNode(true);
            hourlyWeatherModel.classList.remove('display-none');
            // set hour
            hourlyWeatherModel.children[0].children[0].innerHTML = new Date(hourlyData[i].time * 1000).getHours() + ":00";

            // set temperature
            hourlyWeatherModel.children[1].children[0].innerHTML = Math.round((hourlyData[i].temperature - 32) * 5 / 9) + '&#176;';
            // set the icon
            hourlyIcon = hourlyData[i].icon;
            hourlyWeatherModel.children[1].children[1].children[0].setAttribute('src', `./assets/images/summary-icons/${hourlyIcon}-grey.png`);

          
            // append model
            currentHourlyForecast.appendChild(hourlyWeatherModel);

        }
         // set daily weather
        // ===================
        // ===================
        while (dailyForecastCase.children[1]) {
            dailyForecastCase.removeChild(dailyForecastCase.children[1])
        }

        for (let i = 0; i <= 6; i++) {
            // clone the node and remove display none close
            dailyWeatherModel = dailyForecastCase.children[0].cloneNode(true);
            dailyWeatherModel.classList.remove('display-none');
            // set the day
            day = weekDays[new Date(dailyData[i].time * 1000).getDay()]
            dailyWeatherModel.children[0].children[0].innerHTML = day;
            // set min/max temperature for the next days in Celcius
            maxMinTemp = Math.round((dailyData[i].temperatureMax - 32) * 5 / 9) + '&#176;' + '/' + Math.round((dailyData[i].temperatureMin - 32) * 5 / 9) + '&#176;';
            dailyWeatherModel.children[1].children[0].innerHTML = maxMinTemp;
            // set daily icon
            dailyIcon = dailyData[i].icon;
            dailyWeatherModel.children[1].children[1].children[0].setAttribute('src', `./assets/images/summary-icons/${dailyIcon}-white.png`);
            // append the model
            dailyForecastCase.appendChild(dailyWeatherModel);
        }
        



        UI.showApp();
    }

   

   

    // menu events 
    document.querySelector("#open-menu-btn").addEventListener('click',_showMenu);
    document.querySelector("#close-menu-btn").addEventListener('click', _hideMenu);

    // hourly-weather wrapper event
    document.querySelector("#sections-navigation-icon").addEventListener('click',  _toggledailyWeather);
    

    // export
    return{
        showApp,
        loadApp,
        drawWeatherData
    }

})();


// /* **********************************************
// **
// ** Local Storage Api
// **
// ** - this module will be responsible for saving, retriving and deleting the cities added by user
const LOCALSTORAGE = (function () {

    let savedCities = [];

    const save = (city) => {
        savedCities.push(city);
        localStorage.setItem('savedCities', JSON.stringify(savedCities));
    };

    const get = () => {
        if (localStorage.getItem('savedCities') != null)
            savedCities = JSON.parse(localStorage.getItem('savedCities'));
    }

    const remove = (index) => {
        if (index < savedCities.length) {
            savedCities.splice(index, 1);
            localStorage.setItem('savedCities', JSON.stringify(savedCities));
        }
    }

    const getSavedCities = () => savedCities;

    return {
        save,
        get,
        remove,
        getSavedCities
    }
})();


const SAVEDCITIES = (function () {
    let container = document.querySelector("#saved-cities-wrapper");

    // draw a saved city inside the menu
    const drawCity = (city) => {
        let cityBox = document.createElement('div'),
            cityWrapper = document.createElement('div'),
            deleteWrapper = document.createElement('div'),
            cityTextNode = document.createElement('h1'),
            deleteBtn = document.createElement('button');

        cityBox.classList.add('saved-city-box', 'flex-container');
        cityTextNode.innerHTML = city;
        cityTextNode.classList.add('set-city');
        cityWrapper.classList.add('ripple', 'set-city');
        cityWrapper.append(cityTextNode);
        cityBox.append(cityWrapper);

        deleteBtn.classList.add('ripple', 'remove-saved-city');
        deleteBtn.innerHTML = '-';
        deleteWrapper.append(deleteBtn);
        cityBox.append(deleteWrapper);

        container.append(cityBox);
    };

    // delete a city
    const _deleteCity = (cityHTMLBtn) => { // cityHTMLBtn -> the minus button on which the user clicked
        // create a real array with all the saved cities from the interface
        let nodes = Array.prototype.slice.call(container.children),
            // go up in DOM tree until you find the wrapper for the city
            cityWrapper = cityHTMLBtn.closest('.saved-city-box'),
            //get the index of that city inside the array
            cityIndex = nodes.indexOf(cityWrapper);
        // remove from local storage and interface
        LOCALSTORAGE.remove(cityIndex);
        cityWrapper.remove();
    }

    // click event on minus button
    // add an event on the document, because these elements will be created dinamically
    document.addEventListener('click', function (event) {
        if (event.target.classList.contains('remove-saved-city')) {
            _deleteCity(event.target);
        }
    });

    // click event on a city from menu 
    document.addEventListener('click', function (event) {
        if (event.target.classList.contains('set-city')) {
            let nodes = Array.prototype.slice.call(container.children),
                cityWrapper = event.target.closest('.saved-city-box'),
                cityIndex = nodes.indexOf(cityWrapper),
                savedCities = LOCALSTORAGE.getSavedCities();

            WEATHER.getWeather(savedCities[cityIndex], false);
        }
    });

    return {
        drawCity
    }
})();




// ** Get location Module
// **
// ** - this module will be responsible for getting the data about the location to search for weather
// ** ******************************************** */

const GETLOCATION = (function () {

    let location;

    const locationInput = document.querySelector("#location-input"),
        addCityBtn = document.querySelector("#add-city-btn");


    const _addCity = () => {
        location = locationInput.value;
        locationInput.value = "";
        addCityBtn.setAttribute('disabled', 'true');
        addCityBtn.classList.add('disabled');

        // get weather data
        WEATHER.getWeather(location, true)
    }

    locationInput.addEventListener('input', function () {
        let inputText = this.value.trim();

        if (inputText != '') {
            addCityBtn.removeAttribute('disabled');
            addCityBtn.classList.remove('disabled');
        } else {
            addCityBtn.setAttribute('disabled', 'true');
            addCityBtn.classList.add('disabled');
        }
    })

    addCityBtn.addEventListener('click', _addCity);
})();



/* geolocation module  Get Weather data*/

const WEATHER = (function(){
    const darkSkyKey = '51349a7e6237d153390f2719bdf9e4eb' ,


    geocoderKey = 'f389e29e051d4552aa5e4b37d575ff3f';



    const _getGeocodeURL = (location) => `https://api.opencagedata.com/geocode/v1/json?q=${location}&key=${geocoderKey}`;

    const _getDarkSkyURL = (lat, lng) => `https://cors-anywhere.herokuapp.com/https://api.darksky.net/forecast/${darkSkyKey}/${lat},${lng}`;

    const _getDarkSkyData = (url,location) => {
        axios.get(url)
            .then( (res) => {
                console.log(res);
                UI.drawWeatherData(res.data, location)
           
            })
            .catch( (err) => {
                console.error(err);
            })
    };

    const getWeather = (location, save) => {

        UI.loadApp();

        let geocodeURL = _getGeocodeURL(location);

        axios.get(geocodeURL)
            .then( (res) => {
                console.log(res);


                if (res.data.results.length == 0) {
                    console.error("Invalid Location");
                    UI.showApp();
                    return;
                }

                if (save) {
                    LOCALSTORAGE.save(location);
                }

                let lat = res.data.results[0].geometry.lat,
                    lng = res.data.results[0].geometry.lng;

                let darkskyURL = _getDarkSkyURL(lat,lng);

                _getDarkSkyData(darkskyURL, location);
            })
            .catch( (err) => {
                console.log(err)
            })
    };

    return{
        getWeather
    }
})();

    





// /* **********************************************
// **
// ** Init
// **
// ** 
// ** ******************************************** */

window.onload = function () {
    LOCALSTORAGE.get();
    let cities = LOCALSTORAGE.getSavedCities();
    if(cities.length != 0){
        WEATHER.getWeather(cities[cities.length - 1], false)
    }
    else UI.showApp();

}
