// ==================== 1. DARK MODE TOGGLE SYSTEM ====================
const themeBtn = document.getElementById("themeBtn");
themeBtn.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
});


// ==================== 2. API LIVE WEATHER SYSTEM ====================
const weatherBtn = document.getElementById("weatherBtn");
const weatherDisplay = document.getElementById("weatherDisplay");

async function fetchDashboardWeather() {
    weatherDisplay.innerText = "Connecting to Satellite...";
    try {
        let response = await fetch("https://api.open-meteo.com/v1/forecast?latitude=26.8467&longitude=80.9462&current_weather=true");
        let data = await response.json();
        let temp = data.current_weather.temperature;
        weatherDisplay.innerHTML = `System Temp: <span style="color:red;">${temp}°C</span>`;
    } catch (err) {
        weatherDisplay.innerText = "Link Offline!";
    }
}
weatherBtn.addEventListener("click", fetchDashboardWeather);


// ==================== 3. NUMBER GUESSING GAME MECHANICS ====================
const secretNum = Math.floor(Math.random() * 10) + 1;
const gameBtn = document.getElementById("gameBtn");
const gameResult = document.getElementById("gameResult");

gameBtn.addEventListener("click", () => {
    let guess = Number(document.getElementById("userGuess").value);
    if(guess === secretNum) {
        gameResult.innerText = "🎯 Core Hit! Correct Guess.";
        gameResult.style.color = "green";
    } else {
        gameResult.innerText = guess > secretNum ? "Too High!" : "Too Low!";
        gameResult.style.color = "red";
    }
});


// ==================== 4. FORM DATA INQUIRY VALIDATION ====================
const form = document.getElementById("dashboardForm");
form.addEventListener("submit", (event) => {
    event.preventDefault(); // Stop auto refresh
    
    let nameVal = document.getElementById("name").value.trim();
    let emailVal = document.getElementById("email").value.trim();

    if(nameVal === "" || emailVal === "") {
        alert("Alert: Fields cannot be null!");
    } else {
        alert(`Deployment Successful! Data sent for: ${nameVal}`);
        form.reset(); // Clear fields
    }
});