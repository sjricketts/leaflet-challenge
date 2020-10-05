
// Create tile layer for background
var lightmap = L.tileLayer(
  "https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}",
  {
    attribution:
      'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: "light-v10",
    accessToken: API_KEY,
  }
);

// Create a baseMaps object to hold the lightmap layer
var baseMaps = {
    "Light Map": lightmap
};

// Create the map object with options
var map = L.map("mapid", {
  center: [40.73, -74.0059],
  zoom: 12,
  layers: [lightmap],
});

// Create a layer control and add to the map
L.control.layers(baseMaps, {
    collapsed: false,
  })
  .addTo(map);