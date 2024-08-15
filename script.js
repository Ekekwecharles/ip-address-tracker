import "core-js/stable";
import "regenerator-runtime/runtime";

const IPIFY_API_KEY = "at_bAboxEsFH3P2YCnwmxg3Ox1zAz8gn";
const IPINFO_TOKEN = "eb225a03d2e44c";

const ip = document.querySelector(".ip-address");
const state = document.querySelector(".state");
const country = document.querySelector(".country");
const asn = document.querySelector(".asn");
const timezone = document.querySelector(".timezone");
const isp = document.querySelector(".isp");
const btn = document.querySelector(".icon-container");
const input = document.querySelector(".input");

let map;
let load_initial_detail = true;

document.addEventListener("DOMContentLoaded", function () {
  loadLocationDetail();
});

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

function loadLocationDetail(ip = "") {
  fetch(
    `https://geo.ipify.org/api/v2/country?apiKey=${IPIFY_API_KEY}&ipAddress=${ip}`
  )
    .then((response) => response.json())
    .then((data) => {
      if (data.code === 422) {
        alert("Wrong IP: Please input a valid IP address");
      }
      ip.textContent = data.ip;
      state.textContent = data.location.region;
      country.textContent = data.location.country;
      asn.textContent = data.as.asn;
      timezone.textContent = data.location.timezone;
      isp.textContent = data.isp;

      ip_to_coords(data.ip);
    })
    .catch((err) => {
      console.log("Problems choke");
      console.error(err);
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
