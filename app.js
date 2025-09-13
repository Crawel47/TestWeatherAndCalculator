// ====== Настройка ======
const API_KEY = 'ВАШ_API_КЛЮЧ'; // ← Вставь сюда свой ключ
let tempC, tempF;

// Загрузка погоды по геолокации
function loadWeather() {
  navigator.geolocation.getCurrentPosition(pos => {
    fetch(
      `https://api.openweathermap.org/data/2.5/weather` +
      `?lat=${pos.coords.latitude}&lon=${pos.coords.longitude}` +
      `&appid=${API_KEY}&units=metric`
    )
    .then(res => res.json())
    .then(data => {
      tempC = Math.round(data.main.temp);
      tempF = Math.round(tempC * 9/5 + 32);
      document.getElementById('weather')
        .textContent = `${tempC}°C / ${tempF}°F`;
    })
    .catch(() => {
      document.getElementById('weather')
        .textContent = 'Не удалось загрузить погоду';
    });
  }, () => {
    document.getElementById('weather')
      .textContent = 'Геолокация недоступна';
  });
}

// Создание кнопок и логики калькулятора
function setupCalculator() {
  const disp = document.getElementById('display');
  const btns = document.getElementById('buttons');
  const symbols = [
    'C','←','7','8','9','+',
    '4','5','6','-','1','2','3','×',
    '0','.','=','÷'
  ];

  symbols.forEach(s => {
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
        const expr = disp.value.replace(/×/g,'*').replace(/÷/g,'/');
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

// Запуск камеры и показ AR-контейнера
function startAR() {
  document.getElementById('calculator').style.display = 'none';
  const arC = document.getElementById('arContainer');
  arC.style.display = 'block';

  navigator.mediaDevices.getUserMedia({ video: true })
    .then(stream => {
      document.getElementById('camera').srcObject = stream;
    })
    .catch(err => {
      console.error('Ошибка доступа к камере', err);
      alert('Не удалось включить камеру');
      closeAR();
    });
}

// Остановка камеры и возврат к калькулятору
function closeAR() {
  const vid = document.getElementById('camera');
  if (vid.srcObject) {
    vid.srcObject.getTracks().forEach(t => t.stop());
  }
  document.getElementById('arContainer').style.display = 'none';
  document.getElementById('calculator').style.display = 'flex';
}

// Навешиваем обработчик на кнопку Ok
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('arClose').addEventListener('click', closeAR);
});

// Инициализация
window.addEventListener('load', () => {
  loadWeather();
  setupCalculator();
});
