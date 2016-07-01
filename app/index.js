$(function () {
  var icons = {
    'clear-day': 'day-sunny',
    'clear-night': 'night-clear',
    'rain': 'rain',
    'snow': 'snow',
    'sleet': 'sleet',
    'wind': 'strong-wind',
    'fog': 'fog',
    'cloudy': 'cloudy',
    'partly-cloudy-day': 'day-cloudy',
    'partly-cloudy-night': 'night-alt-cloudy'
  };

  if (!navigator.geolocation) {
    setView('geolocation', {
      title: 'An Error, There Is!',
      message: 'Getting location, your browser does not support. Try a different one, you must.'
    });
  } else {
    navigator.geolocation.getCurrentPosition(function (position) {
      fetch('weather?lat=' + position.coords.latitude + '&long=' + position.coords.longitude).then(function (resp) {
        return resp.json();
      }).then(function (json) {
        var weather = json.weather,
          current = weather.currently,
          daily = weather.daily.data;

        daily.splice(0, 1);
        daily.splice(4);

        current.temperature = current.temperature.toFixed();
        current.windSpeed = current.windSpeed.toFixed();
        current.humidity = current.humidity.toFixed();
        current.humanTime = new moment(current.time * 1000).format('MMM Do YY');
        current.iconConverted = icons[current.icon || 'clear-day'];

        for (var i = 0; i < daily.length; i++) {
          daily[i].day = new moment(daily[i].time * 1000).format('dddd');
          daily[i].iconConverted = icons[daily[i].icon || 'clear-day'];
          daily[i].temperatureMax = daily[i].temperatureMax.toFixed();
          daily[i].temperatureMin = daily[i].temperatureMin.toFixed();
        }

        setView('weather', weather);
      });
    }, function () {
      setView('geolocation', {
        title: 'An Error, There Is!',
        message: 'While your location we are missing, get your weather: we cannot. Allow us to access it, then try again, you must.'
      });
    });
  }
});

function setView(view, data) {
  var $content = $('.content');

  $content.removeClass('show');
  setTimeout(function () {
    $content.addClass('show');
    $content.html(Mustache.render($('script[id="templates/' + view + '.html"]').html(), data));
  }, 500);
}
