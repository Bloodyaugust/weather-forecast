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

  fetch('res/weather.json').then(function (resp) {
    return resp.json();
  }).then(function (json) {
    var current = json.currently,
      daily = json.daily.data;

    daily.splice(4);

    current.humanTime = new moment(current.time * 1000).format('MMM Do YY');
    current.iconConverted = icons[current.icon || 'clear-day'];

    for (var i = 0; i < daily.length; i++) {
      daily[i].day = new moment(daily[i].time * 1000).format('dddd');
      daily[i].iconConverted = icons[daily[i].icon || 'clear-day'];
    }

    setView('weather', json);
  });
});

function setView(view, data) {
  var $content = $('.content');

  $content.removeClass('show');
  setTimeout(function () {
    $content.addClass('show');
    $content.html(Mustache.render($('script[id="templates/' + view + '.html"]').html(), data));
  }, 500);
}
