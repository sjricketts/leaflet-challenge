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
// var overlayMaps = {
//   Earthquakes: earthquakes,
// };

// Create the map object with options
var map = L.map("mapid", {
  center: [39.8283, -98.5795],
  zoom: 4,
  layers: [lightmap],
});

// Create a layer control and add to the map
// L.control
//   .layers(baseMaps, overlayMaps, {
//     collapsed: false,
//   })
//   .addTo(map);

lightmap.addTo(map);

d3.json(
  "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson", function(data) {
      function styleInfo(feature) {
        return {
          radius: getRadius(feature.properties.mag),
          fillColor: getColor(feature.properties.mag),
          color: "#000000",
          weight: 1,
          opacity: 1,
          fillOpacity: 0.8,
        };
      };

      function getRadius(magnitude) {
        return magnitude * 4;
      };

      function getColor(magnitude) {
        switch (true) {
            case magnitude > 5:
                return "red";
            case magnitude > 4:
                return "yellow";
            case magnitude > 3:
                return "green";
            case magnitude > 2:
                return "blue";
            case magnitude > 1:
                return "brown";
            default:
                return "white";
        }
      };

      L.geoJson(data, {
          pointToLayer: function(feature, latlng) {
            return L.circleMarker(latlng)
          },
          style: styleInfo, 
          onEachLayer: function(feature, layer) {
              layer.bindPopup("Magnitude: " + feature.properties.mag + "<br> Location: " + feature.properties.place);
          }
      }).addTo(map);

    var legend = L.control({ position: "bottomright" });

    legend.onAdd = function (map) {
    var div = L.DomUtil.create("div", "info legend"),
        mags = [0, 1, 2, 3, 4, 5]

    // loop through our density intervals and generate a label with a colored square for each interval
    for (var i = 0; i < mags.length; i++) {
        div.innerHTML +=
        '<i style="background:' +
        getColor(mags[i] + 1) +
        '"></i> ' +
        mags[i] +
        (mags[i + 1] ? "&ndash;" + mags[i + 1] + "<br>" : "+");
    }

    return div;
    };

    legend.addTo(map);
});

