import { ipifyRequestOptions } from "./vite-env";

// let map:any = L.map('map').setView([51.505, -0.09], 13);
// DOM Elements
const searchBar = <HTMLInputElement>document.getElementById("searchBar");
const searchBtn = <HTMLButtonElement>document.getElementById("searchBtn");
const API_KEY: string = "at_belSPVglRs4FaR8mRJ3GMqX1kwU3E";
let API_URI: string = "https://geo.ipify.org/api/v2/country,city";
const searchResults = document.querySelectorAll(".header__search-result");

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
    } catch (error) {
      console.log(error);
    }
  }

  getData();
  searchBar.value = "";
}

function getMap(coor: number[]) {
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

  //   map.setView(coor, 13);
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
searchBar.addEventListener("keyup", (e): void => {
  searchInput = e.target?.value;
});

window.addEventListener("load", init);

searchBtn.addEventListener("click", init);

searchBar.addEventListener("keydown", (e) => {
  e.key === "Enter" && init();
});
