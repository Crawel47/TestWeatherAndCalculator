// ==== ВСТАВЬ СВОЙ API-КЛЮЧ ====
const API_KEY = '9cd4e22e549986927e4686022220bc11';

let tempC, tempF;

// 1) Получаем погоду
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

// 2) Строим NumPad
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
    const btn = document.createElement('button');
    btn.textContent = s;
    if (s === '=') btn.classList.add('equal');
    btn.addEventListener('click', () => onButton(s));
    btns.appendChild(btn);
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
      const result = Math.round(eval(expr));
      disp.value = result;
      if (result === tempC || result === tempF) {
        startAR(result);
      }
    } catch {
      disp.value = 'Ошибка';
    }
  }
}

// 3) Запуск задней камеры и показ цифры
function startAR(matchValue) {
  document.getElementById('calculator').style.display = 'none';
  const arC = document.getElementById('arContainer');
  arC.style.display = 'block';
  document.getElementById('arLabel').textContent = matchValue;

  navigator.mediaDevices
    .getUserMedia({ video: { facingMode: { ideal: 'environment' } } })
    .then(stream => {
      document.getElementById('camera').srcObject = stream;
    })
    .catch(() => closeAR());
}

// 4) Остановка камеры и возврат
function closeAR() {
  const vid = document.getElementById('camera');
  if (vid.srcObject) {
    vid.srcObject.getTracks().forEach(t => t.stop());
  }
  document.getElementById('arContainer').style.display = 'none';
  document.getElementById('calculator').style.display = 'flex';
}

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('arClose')
    .addEventListener('click', closeAR);
  window.addEventListener('load', () => {
    loadWeather();
    setupCalculator();
  });
});
