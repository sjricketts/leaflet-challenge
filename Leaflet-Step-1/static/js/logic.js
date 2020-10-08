// Create the map

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

// Create Markers for Map
function createMarkers(response) {
  // Get info
  var earthquakes = response.features;

  // Initialize array
  var quakeMarkers = [];
  
  // Loop through earthquakes array
  for (var index = 0; index < earthquakes.length; index++) {
    var earthquake = earthquakes[index];

    // Create circle marker and bind popup for each earthquake
    var quakeMarker = L.circleMarker([
      earthquake.geometry.coordinates[1],
      earthquake.geometry.coordinates[0],
      ]).bindPopUp("<h3>Magnitude: " + earthquake.properties.mag +
        "</h3><br><h3>Depth: " + earthquake.geometry.coordinates[2] + "</h3>"
    );

    // Add marker to the array
    quakeMarkers.push(quakeMarker);
  }
  // Create layer group and add to createMap function
  createMap(L.layerGroup(quakeMarkers));
}

d3.json(
  "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson", createMarkers
);