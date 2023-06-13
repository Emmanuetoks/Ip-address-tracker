import { ipifyRequestOptions } from "./vite-env";

// let map:any = L.map('map').setView([51.505, -0.09], 13);
// DOM Elements
const searchBar = <HTMLInputElement>document.getElementById("searchBar");
const searchBtn = <HTMLButtonElement>document.getElementById("searchBtn");
const API_KEY: string = "at_belSPVglRs4FaR8mRJ3GMqX1kwU3E";
let API_URI: string = "https://geo.ipify.org/api/v2/country,city";
const searchResults = document.querySelectorAll('.header__search-result')

// Global Variables
let searchInput: string = "";
const ipAddressRegex = /[0-255].[0-255]./;
let mapCoor: number[];


// Utility functions
function getMap(coor: number[]) {
  var map = L.map("map");
  map.setView(coor, 13);
}

function displaySearchResults() {
    
}

//Attach Event Listeners
searchBar.addEventListener("keyup", (e): void => {
  searchInput = e.target?.value;
});

searchBtn.addEventListener("click", () => {
  const requestType = ipAddressRegex.test(searchInput) ? "ipAddress" : "domain";

  console.log(requestType);

  console.log(`${API_URI}?apiKey=${API_KEY}&${requestType}=${searchInput}`);

  async function getData() {
    try {
      const res = await fetch(
        `${API_URI}?apiKey=${API_KEY}&${requestType}=${searchInput}`
      );
      const data = await res.json();
      console.log(data);
      mapCoor = [data.location.lat, data.location.lng];
      getMap(mapCoor)
    } catch (error) {
      console.log(error);
    }
  }
  getData();
});
