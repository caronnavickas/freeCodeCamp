var sOpenWeatherMap = '35201b4ccf87ce35fa4d8efddf458083';
var sAPIXU_Key = 'key=1a4242edded941fcbca01549172608';
var sAPIXU_BaseURL = 'https://api.apixu.com/v1';
var sAPIXU_MethodWeather = '/current.json';
var nLat = 0;
var nLon = 0;
var isImperial = false;
var windSpeed;
var oCurrentWeather = {
    metric: {
        temp: 0,
        windSpeed: 0
    },
    imperial: {
        temp: 0,
        windSpeed: 0
    },
    icon: '',
    code: 0
};

function getWeather() {
    var sLat = nLat.toString();
    var sLon = nLon.toString();
    //    var api = "http://api.openweathermap.org/data/2.5/weather?" + sLat + "&" + sLon + "&appid=" + sKey;
    //  https://api.apixu.com/v1/current.json?key=1a4242edded941fcbca01549172608&q=152.7544522,-27.615179299999998
    var api =
        sAPIXU_BaseURL +
        sAPIXU_MethodWeather +
        '?' +
        sAPIXU_Key +
        '&q=' +
        sLat +
        ',' +
        sLon +
        '&lang=en';
    $.getJSON(api, function (data) {
        var weatherStation = data.location.name;
        var weatherType = data.current.condition.text;

        oCurrentWeather.imperial.temp = (data.current.temp_c * 9 / 5 + 32).toFixed(
            1
        );
        oCurrentWeather.metric.temp = data.current.temp_c.toFixed(1);
        oCurrentWeather.icon = data.current.condition.icon;
        oCurrentWeather.code = data.current.condition.code;
        oCurrentWeather.imperial.windSpeed = data.current.wind_mph;
        oCurrentWeather.metric.windSpeed = data.current.wind_kph;

        $('#weatherStation').html(weatherStation);
        $('#weatherType').html(weatherType);
        $('#windSpeed').html(oCurrentWeather.metric.windSpeed + ' km/h');
        $('#cTemp').html(oCurrentWeather.metric.temp + ' &#8451');
        $('#img-weather-icon').attr('src', 'https:' + oCurrentWeather.icon);

        $('#working').addClass('hide');
        $('#weather-display').removeClass('hide');
        showBackgroundImage(oCurrentWeather.metric.temp, oCurrentWeather.code);
    });
}

$(document).ready(function () {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
            nLat = position.coords.latitude;
            nLon = position.coords.longitude;

            $('#data').html('Latitude: ' + nLat + '<br>Longitude: ' + nLon);

            getWeather();
        });
    } else {
        $('#data').text(
            'Your browser does not support geolocation or you have not given permission to share your location.'
        );
    }

    $('#btn-control-unit').on('click', function () {
        if (isImperial === false) {
            $('#cTemp').html(oCurrentWeather.imperial.temp + ' &#8457');
            $('#windSpeed').html(oCurrentWeather.imperial.windSpeed + ' mph');
            $('#btn-control-unit').text('Metric');
            isImperial = true;
        } else {
            $('#cTemp').html(oCurrentWeather.metric.temp + ' &#8451');
            $('#windSpeed').html(oCurrentWeather.metric.windSpeed + ' km/h');
            $('#btn-control-unit').text('Imperial');
            isImperial = false;
        }
    });
});

// windSpeed = (2.237*(windSpeed)).toFixed(1);
//     $("#windSpeed").html(windSpeed + " mph");
//     if(cTemp>0){
//
//     }
//     else if(cTemp<0){
//       $('body').css('background-image', 'url(https://unsplash.com/search/photos/weather?photo=AzXvM3IoYMI)');
//     }
function returnWeatherType(nWT) {
    if (nWT === 1000) {
        return 'Sunny';
    }
    if (nWT === 1003) {
        return 'Party Cloudy';
    }
    if (nWT === 1006) {
        return 'Cloudy';
    }
    if (nWT === 1009) {
        return 'Overcast';
    }
    if (nWT === 1030) {
        return 'Mist';
    }
    if (nWT === 1063) {
        return 'Patchy rain possible';
    }
    if (nWT === 1066) {
        return 'Patchy snow possible';
    }
    if (nWT === 1069) {
        return 'Patchy sleet possible';
    }
    if (nWT === 1072) {
        return 'Patchy freezing drizzle possible';
    }
    if (nWT === 1087) {
        return 'Thundery outbreaks possible';
    }
    if (nWT === 1114) {
        return 'Blowing snow';
    }
    if (nWT === 1117) {
        return 'Blizzard';
    }
    if (nWT === 1135) {
        return 'Fog';
    }
    if (nWT === 1147) {
        return 'Freezing fog';
    }
    if (nWT === 1153) {
        return 'Light drizzle';
    }
    if (nwt === 1168) {
        return 'Freezing drizzle';
    }
    if (nWT === 1171) {
        return 'Heavy freezing drizzle';
    }
    if (nwt === 1180) {
        return 'Patchy light rain';
    }
    if (nWT === 1183) {
        return 'Light rain';
    }
    if (nWT === 1186) {
        return 'Moderate rain at times';
    }
    if (nWT === 1189) {
        return 'Moderate rain';
    }
    if (nWT === 1192) {
        return 'Heavy rain at times';
    }
    if (nWT === 1195) {
        return 'Heavy rain';
    }
    if (nWT === 1198) {
        return 'Light freezing rain';
    }
    if (nWT === 1201) {
        return 'Moderate or heavy freezing rain';
    }
    if (nWT === 1204) {
        return 'Light sleet';
    }
    if (nWT === 1207) {
        return 'Moderate or heavy sleet';
    }
    if (nWT === 1210) {
        return 'Patchy light snow';
    }
    if (nWT === 1213) {
        return 'Light snow';
    }
    if (nWT === 1216) {
        return 'Patchy moderate snow';
    }
    if (nWT === 1219) {
        return 'Moderate snow';
    }
    if (nWT === 1222) {
        return 'Patchy heavy snow';
    }
    if (nWT === 1225) {
        return 'Heavy snow';
    }
    if (nWT === 1237) {
        return 'Ice pellets';
    }
    if (nWT === 1240) {
        return 'Light rain shower';
    }
    if (nWT === 1243) {
        return 'Moderate or heavy rain shower';
    }
    if (nWT === 1246) {
        return 'Torrential rain shower';
    }
    if (nWT === 1249) {
        return 'Light sleet showers';
    }
    if (nWT === 1252) {
        return 'Moderate or heavy sleet showers';
    }
    if (nWT === 1255) {
        return 'Light snow showers';
    }
    if (nWT === 1258) {
        return 'Moderate or heavy snow showers';
    }
    if (nWT === 1261) {
        return 'Light showers of ice pellets';
    }
    if (nWT === 1264) {
        return 'Moderate or heavy showers of ice pellets';
    }
    if (nWT === 1273) {
        return 'Patchy light rain with thunder';
    }
    if (nWT === 1276) {
        return 'Moderate or heavy rain with thunder';
    }
    if (nWT === 1279) {
        return 'Patchy light snow with thunder';
    }
    if (nWT === 1282) {
        return 'Moderate or heavy snow with thunder';
    } else if (nWT < 1282) {
        $('body').css(
            'background-image',
            'http://www.updatepedia.com/wp-content/uploads/2016/03/broken-link.jpg'
        );
    }
}

function showBackgroundImage(nC, nWT) {
    // nC is temperature in Celsius
    // sWT is Weather Type (eg. wet, misty, hot, dry...)
    // weather type is generated by the API and is available to view here:
    //   http://www.apixu.com/doc/Apixu_weather_conditions.json
    // (use the code!!!)
    sType = returnWeatherType(nWT);

    if (nC < 0) {
        // it's really cold
    } else if (nC < 10) {
        // it's very cold
    } else if (nC < 20) {
        // it's a bit cold
    } else {
        // it's stinking hot
    }

    console.log(nC, nWT, sType);
}