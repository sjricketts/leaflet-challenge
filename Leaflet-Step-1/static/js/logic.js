// Store API json for Earthquakes
var queryUrl =
  "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Use D3 to request Earthquake Info
d3.json(queryUrl, function(data) {
  createFeatures(data.geometry);
});

function createFeatures(earthquakeData) {
  // Create a function for to bind popups
  function onEachFeature(geometry, layer) {
    layer.bindPopup("<h3>" + geometry.coordinates[0] + geometry.coordinates[1] + "</h3><hr><p>" + geometry.coordinates[2] +"</p>"
    );
  }
  // Create a GeoJSON layer containing the features array on the earthquakeData object
  // Run the onEachFeature function once for each piece of data in the array
  var earthquakes = L.geoJSON(earthquakeData, {
    onEachFeature: onEachFeature,
  });

  // Sending our earthquakes layer to the createMap function
  createMap(earthquakes);
}

function createMap(earthquakes) {
  // Create tile layer for background
  var lightmap = L.tileLayer(
    "https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}",
    {
      attribution:
        "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
      tileSize: 512,
      maxZoom: 18,
      zoomOffset: -1,
      id: "mapbox/light-v10",
      accessToken: API_KEY,
    }
  );

  // Create a baseMaps object to hold the lightmap layer
  var baseMaps = {
    "Light Map": lightmap,
  };

  // Create overlay object to hold our overlay layer
  var overlayMaps = {
    Earthquakes: earthquakes,
  };

  // Create the map object with options
  var map = L.map("mapid", {
    center: [39.8283, -98.5795],
    zoom: 4,
    layers: [lightmap],
  });

  // Create a layer control and add to the map
  L.control
    .layers(baseMaps, overlayMaps, {
      collapsed: false,
    }).addTo(map);
}