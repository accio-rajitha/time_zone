const currentTimezoneElement = document.getElementById("current-timezone");
const fetchTimezoneBtn = document.getElementById("fetch-timezone-btn");
const addressInput = document.getElementById("address-input");
const timezoneDisplay = document.getElementById("timezone-display");
const errorMessage = document.getElementById("error-message");

function getCurrentTimezone() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showCurrentTimezone, showError);
  } else {
    currentTimezoneElement.innerHTML = "Geolocation is not supported by this browser.";
  }
}

function showCurrentTimezone(position) {
  const lat = position.coords.latitude;
  const lon = position.coords.longitude;

  fetch(`https://api.geoapify.com/v1/geocode/reverse?lat=${lat}&lon=${lon}&apiKey=e76e1c6e83f84fc8ae1c4dd2b8839da2`)
    .then(response => response.json())
    .then(data => {
      const timezone = data.features[0].properties.timezone;
      currentTimezoneElement.innerHTML = `
        Name Of Timezone: ${timezone.name}<br>
        Latitude: ${lat}<br>
        Longitude: ${lon}<br>
        Offset STD: ${timezone.offset_STD}<br>
        Offset STD Seconds: ${timezone.offset_STD_seconds}<br>
        Offset DST: ${timezone.offset_DST}<br>
        Offset DST Seconds: ${timezone.offset_DST_seconds}<br>
        Country: ${data.features[0].properties.country}<br>
        Postcode: ${data.features[0].properties.postcode}<br>
        City: ${data.features[0].properties.city}
      `;
    })
    .catch(() => {
      currentTimezoneElement.innerHTML = "Error fetching timezone.";
    });
}

function showError() {
  currentTimezoneElement.innerHTML = "Unable to retrieve your location.";
}


fetchTimezoneBtn.addEventListener("click", () => {
  const address = addressInput.value.trim();
  errorMessage.style.display = "none"; 

  if (!address) {
    errorMessage.style.display = "block"; 
    timezoneDisplay.style.display = "none"; 
    return;
  }

  fetch(`https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(address)}&apiKey=e76e1c6e83f84fc8ae1c4dd2b8839da2`)
    .then(response => response.json())
    .then(data => {
      if (data.features && data.features.length > 0) {
        const lat = data.features[0].geometry.coordinates[1];
        const lon = data.features[0].geometry.coordinates[0];
        const timezone = data.features[0].properties.timezone;

        fetch(`https://api.geoapify.com/v1/geocode/reverse?lat=${lat}&lon=${lon}&apiKey=e76e1c6e83f84fc8ae1c4dd2b8839da2`)
          .then(response => response.json())
          .then(data => {
            timezoneDisplay.style.display = "block";
            timezoneDisplay.innerHTML = `
              Name Of Timezone: ${timezone.name}<br>
              Latitude: ${lat}<br>
              Longitude: ${lon}<br>
              Offset STD: ${timezone.offset_STD}<br>
              Offset STD Seconds: ${timezone.offset_STD_seconds}<br>
              Offset DST: ${timezone.offset_DST}<br>
              Offset DST Seconds: ${timezone.offset_DST_seconds}<br>
              Country: ${data.features[0].properties.country}<br>
              Postcode: ${data.features[0].properties.postcode}<br>
              City: ${data.features[0].properties.city}
            `;
          })
          .catch(() => {
            timezoneDisplay.innerHTML = "Error fetching timezone.";
          });
      } else {
        timezoneDisplay.style.display = "block";
        timezoneDisplay.innerHTML = "No results found for this address.";
      }
    })
    .catch(() => {
      timezoneDisplay.style.display = "block";
      timezoneDisplay.innerHTML = "Error fetching timezone.";
    });
});


getCurrentTimezone();
