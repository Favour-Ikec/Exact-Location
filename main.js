document.addEventListener("DOMContentLoaded", function () {
  const findMyState = () => {
    const status = document.querySelector(".status");
    status.textContent = "Locating..."; // Display a loading message

    const success = (position) => {
      console.log(position);
      const { latitude, longitude } = position.coords;

      // Cache coordinates to minimize API requests
      const cachedCoords = localStorage.getItem("cachedCoords");
      const currentCoords = JSON.stringify({ latitude, longitude });
      if (cachedCoords === currentCoords) {
        status.textContent = localStorage.getItem("cachedLocation");
        return;
      }

      const geoApi = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`;

      fetch(geoApi)
        .then(res => res.json())
        .then(data => {
          if (data.locality) {
            status.textContent = `${data.locality}, ${data.principalSubdivision}, ${data.countryName}`;
            localStorage.setItem("cachedCoords", currentCoords);
            localStorage.setItem("cachedLocation", status.textContent);
          } else {
            status.textContent = "No detailed location found.";
          }
        })
        .catch(err => {
          status.textContent = 'Failed to retrieve data'; // Better error handling
          console.error(err);
        });

    };

    const error = (err) => {
      console.error(err);
      status.textContent = 'Unable to retrieve location.'; // Simplified error message
    };

    navigator.geolocation.getCurrentPosition(success, error, {timeout: 10000}); // Set a timeout for geolocation requests
  };

  document.querySelector(".find-state").addEventListener("click", findMyState);
});
