import "core-js/stable";
import "regenerator-runtime/runtime";

const IPIFY_API_KEY = "at_bAboxEsFH3P2YCnwmxg3Ox1zAz8gn";
const IPINFO_TOKEN = "eb225a03d2e44c";
const OPENCAGE_API_KEY = "e4a05588431f404ead916f9e74379771";

const ip = document.querySelector(".ip-address");
const state = document.querySelector(".state");
const country = document.querySelector(".country");
const asn = document.querySelector(".asn");
const timezone = document.querySelector(".timezone");
const isp = document.querySelector(".isp");
const btn = document.querySelector(".icon-container");
const input = document.querySelector(".input");

let map;

document.addEventListener("DOMContentLoaded", function () {
  loadLocationDetail();
});

// function WhereAmI(lat, lng) {
//   fetch(`https://geocode.xyz/${lat},${lng}?geoit=json`)
//     .then((response) => {
//       return response.json();
//     })
//     .then((data) => {
//       console.log("Whereami", data);
//       if (data.city && data.prov) {
//         state.textContent = toTitleCase(data.city);
//         country.textContent = data.prov;
//       } else {
//         alert(
//           "Problem getting location data, Reload the page or try again later"
//         );
//         return;
//       }
//     })
//     .catch((err) => {
//       alert(`Error: ${err}`);
//       console.error("💥Error:", err);
//     });
// }

// function reverseGeocode(lat, lng) {
//   const url = `https://api.opencagedata.com/geocode/v1/json?q=${lat}+${lng}&key=${OPENCAGE_API_KEY}`;

//   fetch(url)
//     .then((response) => response.json())
//     .then((data) => {
//       if (data.results && data.results.length > 0) {
//         console.log("Opencage", data);
//         const result = data.results[0];
//         state.textContent = result.components.state;
//         country.textContent = result.components.country_code.toUpperCase();
//         // timezone.textContent = result.annotations.timezone.offset_string;
//       } else {
//         console.log("No results found.");
//       }
//     })
//     .catch((error) => {
//       console.error("Error:", error);
//     });
// }

function loadLocationDetail(ip_addr = "") {
  fetch(
    `https://geo.ipify.org/api/v2/country?apiKey=${IPIFY_API_KEY}&ipAddress=${ip_addr}`
  )
    .then((response) => response.json())
    .then((data) => {
      if (data.code === 422) {
        alert("Wrong IP: Please input a valid IP address");
        return;
      }
      console.log(data);
      ip.textContent = data.ip;
      state.textContent = data.location.region;
      country.textContent = data.location.country;
      asn.textContent = data.as.asn;
      timezone.textContent = data.location.timezone;
      isp.textContent = data?.isp || "Network is unavailable.";

      ip_to_coords(data.ip);
    })
    .catch((err) => {
      console.log("Problems choke");
      console.error(err);
    });
}

const ip_to_coords = function (ip) {
  fetch(`https://ipinfo.io/${ip}?token=${IPINFO_TOKEN}`)
    .then((res) => res.json())
    .then((data) => {
      if (data.status === 404) {
        alert(`${data.error.title}: ${data.error.message}`);
        return;
      }
      const [lat, lng] = data.loc.split(",");
      initMap(parseFloat(lat), parseFloat(lng));
    })
    .catch((err) => {
      console.log("Problems choke");
      console.log(err);
    });
};

function initMap(lat, lng) {
  if (map) {
    map.setView([lat, lng], 13);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    L.marker([lat, lng]).addTo(map);
  } else {
    map = L.map("map").setView([lat, lng], 13);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    L.marker([lat, lng]).addTo(map);
  }
}

function toTitleCase(str) {
  return str.replace(/\w\S*/g, (word) => {
    return word.charAt(0).toUpperCase() + word.substr(1).toLowerCase();
  });
}

btn.addEventListener("click", function () {
  if (!input.value) return;
  loadLocationDetail(input.value);
});

input.addEventListener("keypress", function (e) {
  if (e.key === "Enter") {
    if (!input.value) return;
    loadLocationDetail(input.value);
  }
});
