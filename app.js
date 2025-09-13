// ====== Настройка ======
// ====== Настройка ======
const API_KEY = '9cd4e22e549986927e4686022220bc11'; // ← вставь свой ключ
let tempC, tempF;

// Загружаем погоду
function loadWeather() {
  navigator.geolocation.getCurrentPosition(
    pos => {
      fetch(
        `https://api.openweathermap.org/data/2.5/weather` +
        `?lat=${pos.coords.latitude}&lon=${pos.coords.longitude}` +
        `&appid=${API_KEY}&units=metric`
      )
      .then(r => r.json())
      .then(data => {
        tempC = Math.round(data.main.temp);
        tempF = Math.round(tempC * 9/5 + 32);
        document.getElementById('weather')
          .textContent = `${tempC}°C / ${tempF}°F`;
      })
      .catch(() => {
        document.getElementById('weather')
          .textContent = 'Ошибка погоды';
      });
    },
    () => {
      document.getElementById('weather')
        .textContent = 'Геолокация недоступна';
    }
  );
}

// Создаём клавиатуру
function setupCalculator() {
  const disp = document.getElementById('display');
  const btns = document.getElementById('buttons');

  // NumPad-раскладка: 5 строк по 4 ячейки
  const symbols = [
    'C','←','','',
    '7','8','9','÷',
    '4','5','6','×',
    '1','2','3','-',
    '0','.','=','+'
  ];

  symbols.forEach(s => {
    if (s === '') {
      const spacer = document.createElement('div');
      spacer.className = 'spacer';
      btns.appendChild(spacer);
      return;
    }
    const btn = document.createElement('button');
    btn.textContent = s;
    if (s === '=') btn.classList.add('equal');
    btn.addEventListener('click', () => onButton(s));
    btns.appendChild(btn);
  });

  function onButton(s) {
    if (s === 'C') {
      disp.value = '';
    }
    else if (s === '←') {
      disp.value = disp.value.slice(0, -1);
    }
    else if (s === '=') {
      try {
        const expr = disp.value
          .replace(/×/g, '*')
          .replace(/÷/g, '/');
        const result = Math.round(eval(expr));
        disp.value = result;
        if (result === tempC || result === tempF) {
          startAR();
        }
      } catch {
        disp.value = 'Ошибка';
      }
    }
    else {
      disp.value += s;
    }
  }
}

// Запуск камеры
function startAR() {
  document.getElementById('calculator').style.display = 'none';
  const arC = document.getElementById('arContainer');
  arC.style.display = 'block';

  navigator.mediaDevices.getUserMedia({ video: true })
    .then(stream => {
      document.getElementById('camera').srcObject = stream;
    })
    .catch(err => {
      console.error('Камера недоступна', err);
      closeAR();
    });
}

// Остановка камеры и возврат
function closeAR() {
  const vid = document.getElementById('camera');
  if (vid.srcObject) {
    vid.srcObject.getTracks().forEach(t => t.stop());
  }
  document.getElementById('arContainer').style.display = 'none';
  document.getElementById('calculator').style.display = 'flex';
}

// Навешиваем кнопку Ok
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('arClose')
    .addEventListener('click', closeAR);
});

// Инициализация
window.addEventListener('load', () => {
  loadWeather();
  setupCalculator();
});
