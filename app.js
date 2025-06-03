let userTab = document.querySelector("[data-userWeather]");
let searchTab = document.querySelector("[data-searchWeather]");
let userContainer = document.querySelector(".weather-container");

let grantAccessContainer = document.querySelector(".grant-location-container");
let searchForm = document.querySelector("[data-searchForm]");
let loadingScreen = document.querySelector(".loading-container");
let userInfoContainer = document.querySelector(".user-info-container");

// initially variables needed ?

let oldTab = userTab;
const API_KEY = "d1845658f92b31c64bd94f06f7188c9c";
oldTab.classList.add("current-tab"); 
getfromSessionStorage();

// ek kaam pending hai //

function switchTab(newTab){
    if(newTab != oldTab){
        oldTab.classList.remove("current-tab");
        oldTab = newTab;
        oldTab.classList.add("current-tab");

        if(!searchForm.classList.contains("active")){
            // kya search form wala container is invisible ,if yes then make it visible
            userInfoContainer.classList.remove("active");
            grantAccessContainer.classList.remove("active");
            searchForm.classList.add("active");
        }
        else{
            // pahle mai search wale tab pr tha ,ab weather tab visible karna h
            searchForm.classList.remove("active");
            userInfoContainer.classList.remove("active");
            // ab mai your weather tab me aa gya hu to weather bhi display karna hoga,so let's check 
            // local storage first for cordinates,if we have saved them there
            getfromSessionStorage();
        }
    }
}

userTab.addEventListener("click",()=>{
    // pass clicked tab as input parameter //
    switchTab(userTab);
});

searchTab.addEventListener("click",()=>{
    // pass clicked tab as input parameter //
    switchTab(searchTab);
});

// check if cordinates are already present in session storage //
function getfromSessionStorage(){
    const localCoordinates = sessionStorage.getItem("user-cordinates");
    if(!localCoordinates){
        //agar local cordinates nhi mile//
        grantAccessContainer.classList.add("active");
    } else{
        const cordinates = JSON.parse(localCoordinates);
        fetchUserWeatherInfo(cordinates);
    }
}

async function  fetchUserWeatherInfo(cordinates){
const {lat,lon} = cordinates;
//make grant container invisible//
grantAccessContainer.classList.remove("active");
//make loading visible //
loadingScreen.classList.add("active");
// API CALL //
try {
const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric
    `);
    const data =await response.json();
    loadingScreen.classList.remove("active");
    userInfoContainer.classList.add("active")
    renderWeatherInfo(data);
} catch(err){
  loadingScreen.classList.remove("active");
}
}

function renderWeatherInfo(weatherInfo) {
    //firstly,we have to fetch the element //

    let cityName = document.querySelector("[data-cityName]");
    let countryIcon = document.querySelector("[data-countryIcon]")
    let desc = document.querySelector("[data-weatherDesc]");
    let weatherIcon = document.querySelector("[data-weatherIcon]");
    let temp = document.querySelector("[data-temp]");
    let windspeed= document.querySelector("[data-windspeed]");
    let humidity = document.querySelector("[data-humidity]");
    let cloudiness = document.querySelector("[data-cloudiness]");

    // fetch values from weatherInfo object and put it Ui elements //
    cityName.innerText = weatherInfo?.name;

    countryIcon.src = `https://flagcdn.com/144x108/${weatherInfo?.weather?.sys?.country?.toLowerCase()}.png`;
    desc.innerText = weatherInfo?.weather?.[0]?.description; 
    weatherIcon.src = `http://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
    temp.innerText =`${weatherInfo?.main?.temp}°C`;
    cloudiness.innerText = `${weatherInfo?.clouds?.all}%`;
    windspeed.innerText = `${weatherInfo?.wind?.speed}m/s`;
    humidity.innerText = `${weatherInfo?.main?.humidity}%`;


}  

function getLocation() {
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(showPosition);

    } else{
        alert("No geolocation available")
    }
}

function showPosition(position) {
    let userCoordinates = {
       lat: position.coords.latitude,
        lon: position.coords.longitude,
    }
 
    sessionStorage.setItem("user-cordinates",JSON.stringify(userCoordinates) );
    fetchUserWeatherInfo(userCoordinates);
}

const grantAccessButton = document.querySelector("[data-grantAccess]");
grantAccessButton.addEventListener("click",getLocation()) 
const searchInput = document.querySelector("[data-searchInput]");


searchForm.addEventListener("submit", (e)=>{
    e.preventDefault();
    let cityName = searchInput.value;
    if(cityName =="") {
        return;
    } else {
        fetchSearchWeatherInfo(cityName);
    }
})

async function fetchSearchWeatherInfo(city) {
  loadingScreen.classList.add("active");
  userInfoContainer.classList.remove("active");
  grantAccessButton.classList.remove("active")

  try {
    const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
    );
    const data = await response.json();
  loadingScreen.classList.remove("active");
  userInfoContainer.classList.add("active");
  renderWeatherInfo(data);
  } catch(err){
      
  }
}