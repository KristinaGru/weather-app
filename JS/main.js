window.onload = async () => {
  const locationBtn = document.getElementById('user-location');
  const cityBtn = document.getElementById('city');
  const cityInput = document.querySelector('input');

  function getCoordinates() {
    return new Promise((resolve) => {
      navigator.geolocation.getCurrentPosition(resolve);
    });
  }

  async function fetchCoordsWeather(lat, lon) {
    return (
      await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${weatherKey}&units=metric`
      )
    ).json();
  }

  async function fetchCityWeather(city) {
    try {
      return (
        await fetch(
          `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${weatherKey}&units=metric`
        )
      ).json();
    } catch (err) {
      console.error('This message does not log in case of 404 error??'); //couldn't figure this out :(
      console.error(err);
    }
  }

  function convertTime(unix) {
    const date = new Date(unix * 1000);
    const options = { hour: '2-digit', minute: '2-digit' };
    return new Intl.DateTimeFormat('en-US', options).format(date);
  }

  function displayWeather(json) {
    const city = document.querySelector('h1');
    const typeIcon = document.getElementById('type-icon');
    const temp = document.getElementById('temp');
    const feel = document.getElementById('feel');
    const wind = document.getElementById('wind');
    const clouds = document.getElementById('clouds');
    const sunrise = document.getElementById('sunrise');
    const sunset = document.getElementById('sunset');
    const rightDiv = document.getElementById('right');

    rightDiv.hidden = false;
    city.innerText = json.name;
    typeIcon.src = `https://openweathermap.org/img/wn/${json.weather[0].icon}.png`;
    typeIcon.alt = `icon of a ${json.weather[0].description}`;
    temp.innerText = `${Math.round(json.main.temp)}°C`;
    feel.innerText = `Feels like ${Math.round(json.main.feels_like)}°C`;
    wind.innerText = `${json.wind.speed} m/s`;
    clouds.innerText = `${json.clouds.all}% cloudiness`;
    sunrise.innerText = `Sunrise: ${convertTime(json.sys.sunrise)}`;
    sunset.innerText = `Sunset: ${convertTime(json.sys.sunset)}`;
  }

  locationBtn.addEventListener('click', async () => {
    try {
      const location = await getCoordinates();
      const coordinates = location.coords;
      const coordsJson = await fetchCoordsWeather(
        coordinates.latitude,
        coordinates.longitude
      );
      displayWeather(coordsJson);
      let map;
      async function initMap() {
        const { Map } = await google.maps.importLibrary('maps');
        map = new Map(document.getElementById('map'), {
          center: { lat: coordinates.latitude, lng: coordinates.longitude },
          zoom: 12
        });
      }
      initMap();
    } catch (err) {
      console.error(err);
    }
  });

  cityBtn.addEventListener('click', async () => {
    try {
      const map = document.getElementById('map');
      map.innerText = '';
      const city = cityInput.value.toLowerCase();
      const cityJson = await fetchCityWeather(city);
      displayWeather(cityJson);
    } catch (err) {
      console.error(err);
    }
  });
};
