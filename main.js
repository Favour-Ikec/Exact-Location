document.addEventListener("DOMContentLoaded", function () {
  const map = document.getElementById("map");
  const status = document.querySelector(".status");

  const findMyState = () => {
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

      const geoApi = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`;

      fetch(geoApi)
        .then(res => res.json())
        .then(data => {
          if (data.display_name) {
            status.textContent = data.display_name;
            localStorage.setItem("cachedCoords", currentCoords);
            localStorage.setItem("cachedLocation", status.textContent);
            // Embed OpenStreetMap
            map.innerHTML = `<iframe width="700" height="300" frameborder="0" style="border:0"
              src="https://www.openstreetmap.org/export/embed.html?bbox=${longitude-0.1},${latitude-0.1},${longitude+0.1},${latitude+0.1}&layer=mapnik" allowfullscreen></iframe>`;
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
