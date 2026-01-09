    const APIKEY = "e00ed73524249b76534a450a585950f6"


document.addEventListener('DOMContentLoaded', () => {

  // Get all "navbar-burger" elements
  const $navbarBurgers = Array.prototype.slice.call(document.querySelectorAll('.navbar-burger'), 0);

  // Add a click event on each of them
  $navbarBurgers.forEach( el => {
    el.addEventListener('click', () => {

      // Get the target from the "data-target" attribute
      const target = el.dataset.target;
      const $target = document.getElementById(target);

      // Toggle the "is-active" class on both the "navbar-burger" and the "navbar-menu"
      el.classList.toggle('is-active');
      $target.classList.toggle('is-active');

    });
  });

});


// Fetch -> API Weather

// Obter parámetros da URL
const params = new URLSearchParams(window.location.search);
const lat = params.get('lat');
const lon = params.get('lon');

if (lat && lon) {
  actualizarDatos(lat, lon);
  obtenerPronostico(lat, lon)
} else {
  // Usar valores por defecto para Vilagarcía de Arousa
  actualizarDatos(42.61, -8.79);
  obtenerPronostico(42.61, -8.79);
}


async function obtenerDatos(lat, lon) {

    const apiURL = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&lang=es&appid=${APIKEY}&units=metric`

    try {
        const response = await fetch(apiURL);
        return await response.json();

    } catch (error) {
        console.error("Non hai datos metereolóxicos", error)
    }

}

async function actualizarDatos(lat, lon) {
    
    const data = await obtenerDatos(lat, lon);
    console.log(data)
    if (data) {
    document.getElementById("weatherToday").textContent = data.weather[0].description;
    document.getElementById("iconWeather").src = `./assets/iconos/${data.weather[0].icon}.png`;
    document.getElementById("temperatureToday").textContent = `${Math.round(data.main.temp)}ºC`;
    document.getElementById("tempMax").textContent = `${Math.round(data.main.temp)}ºC`;
    document.getElementById("tempMin").textContent = `${Math.round(data.main.temp)}ºC`;
    document.getElementById("feelsLike").textContent = `${Math.round(data.main.temp)}ºC`;
    document.getElementById("humidity").textContent = `${data.main.humidity}%`;
    document.getElementById("pressure").textContent = `${data.main.pressure} hPa`;
document.getElementById("location").textContent = `${data.name}`;

// Data actual


const dataActualTimeStamp = data.dt * 1000;

const dataActual = new Date(dataActualTimeStamp);

console.log(dataActual)
 
const options = {
  weekday: "long",
  year: "numeric",
  month: "long",
  day: "numeric",
};

document.getElementById("data").textContent = dataActual.toLocaleDateString("es-ES", options);



// Aquí meter latitud y longitud

// actualizarDatos(42.59, -8.81) ;



// // Solpor:
const timestampSolpor = data.sys.sunset * 1000;

const dataSolpor = new Date(timestampSolpor);

const horaSolpor = dataSolpor.getHours();
const minutosSolpor = dataSolpor.getMinutes();

const horaSolporFormateada = `${horaSolpor}:${minutosSolpor} PM`

document.getElementById("solpor").textContent = horaSolporFormateada;


// Amanecer:

const timestampAmanecer = data.sys.sunrise * 1000;

const dataAmanecer = new Date(timestampAmanecer);

const horaAmanecer = dataAmanecer.getHours();
const minutosAmanecer = dataAmanecer.getMinutes();

const horaAmanecerFormateada = `${horaAmanecer}:${minutosAmanecer} AM`

document.getElementById("Amanecer").textContent = horaAmanecerFormateada;


// Cambiar fondo:

function cambiarColorDeFondo() {
  const agora = new Date();

  let claseFondo;
  if (agora >= dataAmanecer && agora < dataSolpor) {
    claseFondo = 'fondo-dia';
    
  }else{
    claseFondo = 'fondo-noite';
  }
  document.body.className = '';
document.body.classList.add(claseFondo);

}

cambiarColorDeFondo();

}



}


// Procesar datos pronóstico

async function obtenerPronostico(lat, lon) {
  
  const URL_API_FORECAST = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${APIKEY}&units=metric&lang=es`

  try {
  const response = await fetch(URL_API_FORECAST);
  const dataPronostico = await response.json();

    actualizarPronostico(dataPronostico);

    return dataPronostico;
  } catch (error) {
    console.error("Error al obtener datos del pronóstico del clima:", error);
  }

}


function actualizarPronostico(dataPronostico) {
  

  if (dataPronostico) {
    
    const template = document.getElementById("forecastTemplate");
    const containerForecast = document.getElementById("forecastContainer");

    containerForecast.innerHTML = "";


    dataPronostico.list.forEach(element => {

      const clone = template.content.cloneNode(true);

      clone.querySelector('#date').textContent = `${new Date(element.dt * 1000).getHours()}h`;
      clone.querySelector('#weatherIcon').src = `./assets/iconos/${element.weather[0].icon}.png`
      clone.querySelector('#weatherIcon').alt = element.weather[0].description;
      clone.querySelector('#temperature').textContent = `${Math.round(element.main.temp)}ºC`;
      
      containerForecast.appendChild(clone);

  });

    }
    
}
