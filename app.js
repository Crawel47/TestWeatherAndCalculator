// — вставьте свой API-ключ OpenWeatherMap —
const API_KEY = '9cd4e22e549986927e4686022220bc11';

let tempC, tempF;

// 1) загрузка погоды
function loadWeather() {
  if (!navigator.geolocation) {
    return showWeatherError('Геолокация не поддерживается');
  }
  navigator.geolocation.getCurrentPosition(
    pos => {
      const url =
        `https://api.openweathermap.org/data/2.5/weather` +
        `?lat=${pos.coords.latitude}` +
        `&lon=${pos.coords.longitude}` +
        `&appid=${API_KEY}&units=metric`;
      fetch(url)
        .then(res => {
          if (!res.ok) throw new Error(res.status);
          return res.json();
        })
        .then(data => {
          tempC = Math.round(data.main.temp);
          tempF = Math.round(tempC * 9/5 + 32);
          document.getElementById('weather')
            .textContent = `${tempC}°C / ${tempF}°F`;
        })
        .catch(() => showWeatherError('Не удалось загрузить погоду'));
    },
    () => showWeatherError('Геолокация недоступна')
  );
}
function showWeatherError(msg) {
  document.getElementById('weather').textContent = msg;
}

// 2) собираем NumPad
function setupCalculator() {
  const disp = document.getElementById('display');
  const btns = document.getElementById('buttons');
  const symbols = [
    'C','←','','',
    '7','8','9','÷',
    '4','5','6','×',
    '1','2','3','-',
    '0','.','=','+'
  ];

  symbols.forEach(s => {
    if (!s) {
      const sp = document.createElement('div');
      sp.className = 'spacer';
      btns.appendChild(sp);
      return;
    }
    const b = document.createElement('button');
    b.textContent = s;
    if (s === '=') b.classList.add('equal');
    b.addEventListener('click', () => onButton(s));
    btns.appendChild(b);
  });

  function onButton(s) {
    if (s === 'C') disp.value = '';
    else if (s === '←') disp.value = disp.value.slice(0, -1);
    else if (s === '=') calculate();
    else disp.value += s;
  }

  function calculate() {
    try {
      const expr = disp.value.replace(/×/g, '*').replace(/÷/g, '/');
      const res = Math.round(eval(expr));
      disp.value = res;
      if (res === tempC || res === tempF) {
        startAR(res);
      }
    } catch {
      disp.value = 'Ошибка';
    }
  }
}

// 3) запуск AR и «приклеивание» цифры к реальному квадратику
function startAR(value) {
  document.getElementById('calculator').style.display = 'none';
  document.getElementById('markerTip').style.display = 'none';
  document.getElementById('arContainer').style.display = 'block';
  document.getElementById('arLabel').setAttribute('value', value);
}

// 4) выход из AR
function closeAR() {
  document.getElementById('arContainer').style.display = 'none';
  document.getElementById('calculator').style.display = 'flex';
  document.getElementById('markerTip').style.display = 'block';
}

window.onload = () => {
  loadWeather();
  setupCalculator();
  document.getElementById('arClose').onclick = closeAR;
};
