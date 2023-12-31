// import {L} from 'leaflet'
import L from "leaflet";

// DOM Elements
const searchBar = <HTMLInputElement>document.getElementById("searchBar");
const searchBtn = <HTMLButtonElement>document.getElementById("searchBtn");
const API_KEY: string = "at_belSPVglRs4FaR8mRJ3GMqX1kwU3E";
let API_URI: string = "https://geo.ipify.org/api/v2/country,city";
const searchResults = document.querySelectorAll(".header__search-result");
const loader = <HTMLDivElement>document.querySelector(".loader-container");
const loaderMap = <HTMLDivElement>(
  document.querySelector(".loader-container--map")
);
const dropdownBtn = document.getElementById("dropdownBtn");

let map = L.map("map", {
  zoom: 40,
  zoomControl: true,
  doubleClickZoom: true,
});

// Global Variables
let searchInput: string = "";
const ipAddressRegex = /[0-255].[0-255]./;
let mapCoor: number[];

// Utility functions
function init() {
  const requestType = ipAddressRegex.test(searchInput) ? "ipAddress" : "domain";
  // if (loaderMap.classList.contains('loader--map-exit'))

  // loaderMap.classList.add("loader--map-exit");
  async function getData() {
    try {
      const res = await fetch(
        `${API_URI}?apiKey=${API_KEY}&${requestType}=${searchInput}`
      );
      const data = await res.json();
      console.log(data);
      mapCoor = [data.location.lat, data.location.lng];
      getMap(mapCoor);
      displaySearchResults(data);
      loaderMap.classList.remove("loader--map-exit");
    } catch (error) {
      console.log(error);
    }
  }

  getData();
  searchBar.value = "";
  searchInput = "";
}

function getMap(coor: any) {
  map.setView(coor, 13);
  L.tileLayer(
    "https://api.maptiler.com/maps/streets-v2/{z}/{x}/{y}.png?key=MXsJ5e0B7SZOvcTRu5c3",
    {
      attribution: `<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a>
    <a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>`,
    }
  ).addTo(map);

  let icon = L.icon({
    iconUrl: "../images/icon-location.svg",
    iconSize: [30, 38],
    iconAnchor: [22, 94],
  });
  let marker: any = L.marker(coor, {
    icon: icon,
  });

  marker.addTo(map);
}

function displaySearchResults(data: any) {
  searchResults.forEach((result) => {
    const searchResultData = <HTMLParagraphElement>(
      result.querySelector(".search-result-data")
    );

    searchResultData.innerText =
      result.id === "city" || result.id === "timezone"
        ? data["location"][result.id]
        : data[result.id];
  });
}

//Attach Event Listeners
searchBar.addEventListener("keyup", (e: any): void => {
  searchInput = e?.target?.value;
});

window.addEventListener("load", init);
window.addEventListener("load", () => {});

map.addEventListener("load", () => {
  loader.classList.add("loader-exit");
});

searchBtn.addEventListener("click", init);

searchBar.addEventListener("keydown", (e) => {
  e.key === "Enter" && init();
});

dropdownBtn?.addEventListener("click", () => {
  document
    .querySelector(".header__search-results")
    ?.classList.toggle("slide-down");
});


