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

    
