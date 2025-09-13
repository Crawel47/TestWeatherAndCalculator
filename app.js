const API_KEY = 'ВАШ_API_КЛЮЧ';
let tempC, tempF;

function loadWeather() {
  navigator.geolocation.getCurrentPosition(pos => {
    fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${pos.coords.latitude}` +
      `&lon=${pos.coords.longitude}&appid=${API_KEY}&units=metric`
    )
    .then(res => res.json())
    .then(data => {
      tempC = Math.round(data.main.temp);
      tempF = Math.round(tempC * 9/5 + 32);
      document.getElementById('weather')
        .textContent = `${tempC}°C / ${tempF}°F`;
    });
  });
}

function setupCalculator() {
  const disp = document.getElementById('display');
  const btns = document.getElementById('buttons');
  const symbols = ['7','8','9','+','4','5','6','-','1','2','3','×','0','.','=','÷'];
  symbols.forEach(s => {
    const b = document.createElement('button');
    b.textContent = s;
    if (s === '=') b.classList.add('equal');
    b.onclick = () => onButton(s);
    btns.append(b);
  });

  function onButton(s) {
    if (s === '=') {
      const expr = disp.value.replace(/×/g,'*').replace(/÷/g,'/');
      const result = Math.round(eval(expr));
      disp.value = result;
      if (result === tempC || result === tempF) startAR();
    }
    else disp.value += s;
  }
}

function startAR() {
  // здесь подключаем AR.js или MindAR
  // и показываем кнопку #arClose
}

window.onload = () => {
  loadWeather();
  setupCalculator();
};
